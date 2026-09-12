
    // --- SOUND SYNTHESIS ---
    let soundEnabled = true;
    let audioCtx = null;

    function initAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    function toggleSound() {
      soundEnabled = !soundEnabled;
      document.getElementById('soundIconOn').classList.toggle('hidden', !soundEnabled);
      document.getElementById('soundIconOff').classList.toggle('hidden', soundEnabled);
    }

    function playSound(type) {
      if (!soundEnabled) return;
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      if (type === 'correct') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'incorrect') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(180, now + 0.09);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    }

    // --- APP STATE ---
    let pendingCategory = 'all';
    let currentQuizPool = [];
    let currentIndex = 0;
    let currentMode = 'typing'; // 'typing' or 'multiple'
    let userAnswers = []; // stores { question, userInput, selectedOption, isCorrect, mode }
    let currentFilter = 'all'; 

    const categoryNamesMap = { 
      all: "すべての単語", 
      animals: "動物",
      jobs: "職業",
      buildings: "建物・場所",
      pronouns: "代名詞・人称", 
      verbs: "基本動詞", 
      nouns: "基本名詞", 
      adjectives: "形容詞・状態",
      mybook: "マイ単語帳"
    };

    // --- PERSISTENCE: PROGRESS & PERSONAL WORD BOOK ---
    const PROGRESS_STORAGE_KEY = 'vnVocab_progress_v1';
    const MYWORDS_STORAGE_KEY = 'vnVocab_myWords_v1';

    function loadProgress() {
      try {
        return JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY)) || {};
      } catch (e) {
        return {};
      }
    }

    function saveProgress() {
      try {
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
      } catch (e) { /* storage unavailable, fail silently */ }
    }

    function loadMyWords() {
      try {
        return JSON.parse(localStorage.getItem(MYWORDS_STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    }

    function saveMyWords() {
      try {
        localStorage.setItem(MYWORDS_STORAGE_KEY, JSON.stringify(myWords));
      } catch (e) { /* storage unavailable, fail silently */ }
    }

    let progressData = loadProgress();
    let myWords = loadMyWords();
    let currentCategoryKey = 'all';
    let currentMistakesOnly = false;

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // --- MY WORD BOOK UI ---
    function renderMyWordsList() {
      const container = document.getElementById('myWordsList');
      if (!myWords.length) {
        container.innerHTML = '<p class="text-xs text-zinc-400 font-bold text-center py-3">まだ単語が登録されていません。</p>';
        return;
      }
      container.innerHTML = myWords.map(w => `
        <div class="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
          <div class="text-xs sm:text-sm min-w-0 truncate">
            <span class="font-extrabold text-zinc-700">${escapeHtml(w.jp)}</span>
            <span class="text-zinc-400 mx-1.5">→</span>
            <span class="font-bold text-zinc-600">${escapeHtml(w.answer)}</span>
          </div>
          <button onclick="deleteMyWord('${w.id}')" class="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0" title="削除">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      `).join('');
    }

    function updateMyBookCard() {
      document.getElementById('myWordsCount').textContent = myWords.length;
      const practiceBtn = document.getElementById('myBookPracticeBtn');
      practiceBtn.disabled = myWords.length === 0;
      updateMistakesButton('mybook');
    }

    function addMyWord() {
      playSound('click');
      const jpInput = document.getElementById('myWordJp');
      const vnInput = document.getElementById('myWordVn');
      const errorEl = document.getElementById('myWordError');

      const jp = jpInput.value.trim();
      const vn = vnInput.value.trim();

      if (!jp || !vn) {
        errorEl.classList.remove('hidden');
        return;
      }
      errorEl.classList.add('hidden');

      const id = 'my_' + Date.now() + '_' + Math.floor(Math.random() * 10000);

      myWords.push({
        id,
        category: 'mybook',
        categoryLabel: 'マイ単語帳',
        jp,
        answer: vn,
        altAnswers: []
      });

      saveMyWords();
      jpInput.value = '';
      vnInput.value = '';
      renderMyWordsList();
      updateMyBookCard();
      jpInput.focus();
    }

    function deleteMyWord(id) {
      playSound('click');
      myWords = myWords.filter(w => w.id !== id);
      saveMyWords();

      if (progressData.mybook && progressData.mybook.mistakeIds) {
        progressData.mybook.mistakeIds = progressData.mybook.mistakeIds.filter(mid => mid !== id);
        saveProgress();
      }

      renderMyWordsList();
      updateMyBookCard();
    }

    function startMyBookQuiz() {
      if (!myWords.length) return;
      playSound('click');
      currentMode = 'typing';
      startQuiz('mybook', false);
    }

    // --- PROGRESS-BASED "MISTAKES ONLY" PRACTICE ---
    function updateMistakesButton(categoryKey) {
      const btn = document.getElementById(`mistakesBtn-${categoryKey}`);
      if (!btn) return;
      const countEl = document.getElementById(`mistakesCount-${categoryKey}`);
      const prog = progressData[categoryKey];
      const mistakeCount = prog && prog.mistakeIds ? prog.mistakeIds.length : 0;

      if (prog && prog.completed && mistakeCount > 0) {
        btn.classList.remove('hidden');
        btn.classList.add('flex');
        if (countEl) countEl.textContent = mistakeCount;
      } else {
        btn.classList.add('hidden');
        btn.classList.remove('flex');
      }
    }

    function updateAllCategoryButtons() {
      Object.keys(categoryNamesMap).forEach(key => updateMistakesButton(key));
    }

    function startMistakesPractice(categoryKey) {
      const prog = progressData[categoryKey];
      if (!prog || !prog.mistakeIds || !prog.mistakeIds.length) return;

      if (categoryKey === 'mybook') {
        playSound('click');
        currentMode = 'typing';
        startQuiz('mybook', true);
      } else {
        openModeModal(categoryKey, true);
      }
    }

    function shuffleArray(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // --- MODAL CONTROLS ---
    let pendingMistakesOnly = false;

    function openModeModal(categoryFilter, mistakesOnly) {
      playSound('click');
      pendingCategory = categoryFilter;
      pendingMistakesOnly = !!mistakesOnly;
      const catName = categoryNamesMap[categoryFilter] || "カテゴリー";
      document.getElementById('modalCategoryName').textContent = pendingMistakesOnly
        ? `対象: ${catName}（間違えた単語のみ）`
        : `対象: ${catName}`;
      document.getElementById('modeModalOverlay').classList.remove('hidden');
    }

    function closeModeModal() {
      playSound('click');
      document.getElementById('modeModalOverlay').classList.add('hidden');
    }

    function confirmStartQuiz(mode) {
      playSound('click');
      currentMode = mode;
      document.getElementById('modeModalOverlay').classList.add('hidden');
      startQuiz(pendingCategory, pendingMistakesOnly);
    }

    // --- NAVIGATION & VIEWS ---
    function showHomeView() {
      playSound('click');
      document.getElementById('homeScreen').classList.remove('hidden');
      document.getElementById('quizScreen').classList.add('hidden');
      document.getElementById('resultScreen').classList.add('hidden');
      document.getElementById('modeModalOverlay').classList.add('hidden');
      document.getElementById('categorySubtitle').textContent = "全語彙マスター";
      updateAllCategoryButtons();
      updateMyBookCard();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function startQuiz(categoryFilter, mistakesOnly) {
      const shuffleQuestions = document.getElementById('shuffleQuestionsToggle').checked;

      // Reset dynamic multiple choice properties so they get regenerated freshly
      rawQuestions.forEach(q => delete q._generatedChoices);

      let filtered = [];
      if (categoryFilter === 'mybook') {
        filtered = [...myWords];
      } else if (categoryFilter === 'all') {
        filtered = [...rawQuestions];
      } else {
        filtered = rawQuestions.filter(q => q.category === categoryFilter);
      }

      if (mistakesOnly) {
        const prog = progressData[categoryFilter];
        const mistakeIds = (prog && prog.mistakeIds) || [];
        filtered = filtered.filter(q => mistakeIds.includes(q.id));
      }

      if (!filtered.length) {
        // Nothing to practice (e.g. mistakes list emptied elsewhere) - just go home.
        showHomeView();
        return;
      }

      if (shuffleQuestions) {
        filtered = shuffleArray(filtered);
      }

      currentQuizPool = filtered;
      currentCategoryKey = categoryFilter;
      currentMistakesOnly = !!mistakesOnly;
      currentIndex = 0;
      userAnswers = new Array(currentQuizPool.length).fill(null);

      const catText = categoryNamesMap[categoryFilter] || "単語";
      const modeText = currentMode === 'typing' ? 'タイピング' : '4択選択';
      const mistakesTag = currentMistakesOnly ? ' ・間違えた単語のみ' : '';
      document.getElementById('categorySubtitle').textContent = `${catText}${mistakesTag} [${modeText}] (${currentQuizPool.length}問)`;

      document.getElementById('homeScreen').classList.add('hidden');
      document.getElementById('resultScreen').classList.add('hidden');
      document.getElementById('quizScreen').classList.remove('hidden');

      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function retryCurrentQuiz() {
      playSound('click');
      rawQuestions.forEach(q => delete q._generatedChoices);
      currentIndex = 0;
      userAnswers = new Array(currentQuizPool.length).fill(null);
      document.getElementById('resultScreen').classList.add('hidden');
      document.getElementById('quizScreen').classList.remove('hidden');
      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- RENDER QUESTION ---
    function renderQuestion() {
      const q = currentQuizPool[currentIndex];
      const answerState = userAnswers[currentIndex];

      document.getElementById('questionCategoryTag').textContent = q.categoryLabel;
      document.getElementById('questionModeBadge').textContent = currentMode === 'typing' ? 'タイピング' : '4択選択';
      document.getElementById('questionTypeBadge').textContent = currentMode === 'typing' ? '文字入力' : '選択肢タップ';
      document.getElementById('questionCounter').textContent = `Q ${currentIndex + 1} / ${currentQuizPool.length}`;
      
      const progressPercent = ((currentIndex + 1) / currentQuizPool.length) * 100;
      document.getElementById('progressBar').style.width = `${progressPercent}%`;

      document.getElementById('questionText').innerHTML = `ベトナム語で <span class="monochrome-highlight">${q.jp}</span>`;

      const typingContainer = document.getElementById('typingContainer');
      const multipleChoiceContainer = document.getElementById('multipleChoiceContainer');
      const feedbackBox = document.getElementById('feedbackBox');

      if (currentMode === 'typing') {
        typingContainer.classList.remove('hidden');
        multipleChoiceContainer.classList.add('hidden');

        const inputEl = document.getElementById('vietnameseInput');
        const checkBtn = document.getElementById('checkBtn');

        if (answerState === null) {
          inputEl.value = '';
          inputEl.disabled = false;
          checkBtn.disabled = false;
          checkBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          feedbackBox.classList.add('hidden');
          setTimeout(() => inputEl.focus(), 50);
        } else {
          inputEl.value = answerState.userInput || '';
          inputEl.disabled = true;
          checkBtn.disabled = true;
          checkBtn.classList.add('opacity-50', 'cursor-not-allowed');
          renderFeedbackBox(q, answerState);
        }

      } else {
        // MULTIPLE CHOICE MODE
        typingContainer.classList.add('hidden');
        multipleChoiceContainer.classList.remove('hidden');
        multipleChoiceContainer.innerHTML = '';

        // Generate 4 options (1 correct answer + 3 distinct distractors)
        if (!q._generatedChoices) {
          const distinctAnswersPool = Array.from(new Set(rawQuestions.filter(item => item.answer !== q.answer).map(item => item.answer)));
          const shuffledOthers = shuffleArray(distinctAnswersPool);
          const distractors = shuffledOthers.slice(0, 3);
          q._generatedChoices = shuffleArray([q.answer, ...distractors]);
        }

        q._generatedChoices.forEach((choice, idx) => {
          const btn = document.createElement('button');
          btn.className = `w-full p-4 rounded-2xl border-2 font-extrabold text-left transition-all flex items-center justify-between text-base ${
            answerState === null 
              ? 'border-zinc-200 bg-zinc-50 hover:bg-white hover:border-zinc-900 text-zinc-900 shadow-sm' 
              : 'border-zinc-200 bg-zinc-50 text-zinc-400 opacity-60 cursor-not-allowed'
          }`;

          const labels = ['A', 'B', 'C', 'D'];
          btn.innerHTML = `
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-800 flex items-center justify-center font-black text-xs shrink-0">${labels[idx]}</span>
              <span>${choice}</span>
            </div>
          `;

            if (answerState !== null) {
            if (choice === q.answer) {
              btn.className = "w-full p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-600 text-white font-extrabold text-left flex items-center justify-between shadow-md";
              btn.innerHTML += `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>`;
            } else if (answerState.selectedOption === choice && !answerState.isCorrect) {
              btn.className = "w-full p-4 rounded-2xl border-2 border-rose-700 bg-rose-50 text-rose-800 font-extrabold text-left flex items-center justify-between";
              btn.innerHTML += `<svg class="w-5 h-5 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>`;
            }
          } else {
            btn.onclick = () => submitMultipleChoiceAnswer(choice);
          }

          multipleChoiceContainer.appendChild(btn);
        });

        if (answerState === null) {
          feedbackBox.classList.add('hidden');
        } else {
          renderFeedbackBox(q, answerState);
        }
      }

      document.getElementById('prevBtn').disabled = currentIndex === 0;
      
      const nextBtn = document.getElementById('nextBtn');
      nextBtn.disabled = answerState === null;
      if (currentIndex === currentQuizPool.length - 1) {
        nextBtn.innerHTML = `結果を見る <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;
      } else {
        nextBtn.innerHTML = `次へ <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>`;
      }
    }

    // Keydown Listener
document.addEventListener('keydown', function (e) {
  const quizScreen = document.getElementById('quizScreen');
  if (!quizScreen.classList.contains('hidden')) {
    
    // Enter key handler
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentMode === 'typing') {
        if (userAnswers[currentIndex] === null) {
          submitTypingAnswer();
        } else {
          nextQuestion();
        }
      } else if (currentMode === 'multiple') {
        if (userAnswers[currentIndex] !== null) {
          nextQuestion();
        }
      }
    }

    // Space key handler (Only active in 選択肢 mode after an answer is selected)
    if ((e.key === ' ' || e.code === 'Space') && currentMode === 'multiple' && userAnswers[currentIndex] !== null) {
      e.preventDefault();
      nextQuestion();
    }
  }
});

    function normalizeText(text) {
      return text ? text.trim().toLowerCase() : '';
    }

    function submitTypingAnswer() {
      if (userAnswers[currentIndex] !== null) return;

      const q = currentQuizPool[currentIndex];
      const inputEl = document.getElementById('vietnameseInput');
      const userVal = inputEl.value;

      const normUser = normalizeText(userVal);
      const normCorrect = normalizeText(q.answer);
      const normAlts = (q.altAnswers || []).map(a => normalizeText(a));

      const isCorrect = normUser === normCorrect || normAlts.includes(normUser);

      userAnswers[currentIndex] = {
        question: q,
        userInput: userVal,
        selectedOption: null,
        isCorrect: isCorrect,
        mode: 'typing'
      };

      if (isCorrect) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }

      renderQuestion();
    }

    function submitMultipleChoiceAnswer(selectedChoice) {
      if (userAnswers[currentIndex] !== null) return;

      const q = currentQuizPool[currentIndex];
      const isCorrect = selectedChoice === q.answer;

      userAnswers[currentIndex] = {
        question: q,
        userInput: null,
        selectedOption: selectedChoice,
        isCorrect: isCorrect,
        mode: 'multiple'
      };

      if (isCorrect) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }

      renderQuestion();
    }

        function renderFeedbackBox(q, answerState) {
      const feedbackBox = document.getElementById('feedbackBox');
      feedbackBox.classList.remove('hidden');

      if (answerState.isCorrect) {
        feedbackBox.className = "p-4 sm:p-5 rounded-2xl text-sm leading-relaxed bg-emerald-50 border border-emerald-600 text-emerald-900 animate-fade-in flex items-start gap-3";
        feedbackBox.innerHTML = `
          <div class="p-1 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div>
            <div class="font-black text-emerald-900 text-base mb-0.5">正解！</div>
            <div class="text-xs sm:text-sm font-bold">正解のベトナム語: ${q.answer}</div>
          </div>
        `;
      } else {
        feedbackBox.className = "p-4 sm:p-5 rounded-2xl text-sm leading-relaxed bg-rose-50 border border-rose-700 text-rose-900 animate-fade-in flex items-start gap-3";
        feedbackBox.innerHTML = `
          <div class="p-1 rounded-lg bg-rose-700 text-white shrink-0 mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <div>
            <div class="font-black text-rose-900 text-base mb-0.5">不正解</div>
            <div class="text-xs sm:text-sm font-bold">模範解答: ${q.answer}</div>
            ${answerState.selectedOption ? `<div class="text-xs text-rose-700 mt-1">選択した解答: "${answerState.selectedOption}"</div>` : ''}
          </div>
        `;
      }
    }

    function prevQuestion() {
      if (currentIndex > 0) {
        playSound('click');
        currentIndex--;
        renderQuestion();
      }
    }

    function nextQuestion() {
      playSound('click');
      if (currentIndex < currentQuizPool.length - 1) {
        currentIndex++;
        renderQuestion();
      } else {
        showResults();
      }
    }

    // --- RESULTS & FILTERING ---
    function showResults() {
      document.getElementById('quizScreen').classList.add('hidden');
      document.getElementById('resultScreen').classList.remove('hidden');

      const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
      const totalCount = currentQuizPool.length;
      const mistakeCount = totalCount - correctCount;
      const accuracy = Math.round((correctCount / totalCount) * 100);

      document.getElementById('scoreText').textContent = correctCount;
      document.getElementById('totalScoreText').textContent = totalCount;
      document.getElementById('accuracyText').textContent = `正解率 ${accuracy}%`;
      document.getElementById('mistakeBadgeCount').textContent = mistakeCount;

      // --- SAVE PROGRESS ---
      const missedIds = [];
      currentQuizPool.forEach((q, i) => {
        const a = userAnswers[i];
        if (!a || !a.isCorrect) missedIds.push(q.id);
      });

      if (currentMistakesOnly) {
        // Only the previously-missed subset was tested: keep untouched mistakes,
        // drop ones now answered correctly, keep ones still missed.
        const prevIds = (progressData[currentCategoryKey] && progressData[currentCategoryKey].mistakeIds) || [];
        const testedIds = currentQuizPool.map(q => q.id);
        const untouched = prevIds.filter(id => !testedIds.includes(id));
        progressData[currentCategoryKey] = {
          completed: true,
          mistakeIds: [...untouched, ...missedIds]
        };
      } else {
        progressData[currentCategoryKey] = {
          completed: true,
          mistakeIds: missedIds
        };
      }
      saveProgress();

      currentFilter = 'all';
      renderReviews();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function filterReviews(filterType) {
      playSound('click');
      currentFilter = filterType;
      
      const allBtn = document.getElementById('filterBtnAll');
      const mistakesBtn = document.getElementById('filterBtnMistakes');
      const correctBtn = document.getElementById('filterBtnCorrect');

      const activeClass = "bg-white text-zinc-900 shadow-sm font-extrabold";
      const inactiveClass = "text-zinc-300 hover:text-white font-bold";

      allBtn.className = `px-3 py-1.5 rounded-lg transition-all ${filterType === 'all' ? activeClass : inactiveClass}`;
      mistakesBtn.className = `px-3 py-1.5 rounded-lg transition-all ${filterType === 'mistakes' ? activeClass : inactiveClass}`;
      correctBtn.className = `px-3 py-1.5 rounded-lg transition-all ${filterType === 'correct' ? activeClass : inactiveClass}`;

      renderReviews();
    }

    function renderReviews() {
      const reviewContainer = document.getElementById('reviewContainer');
      reviewContainer.innerHTML = '';

      let itemsToDisplay = [];

      currentQuizPool.forEach((q, i) => {
        const uAns = userAnswers[i];
        const isRight = uAns && uAns.isCorrect;

        if (currentFilter === 'all') {
          itemsToDisplay.push({ q, i, uAns, isRight });
        } else if (currentFilter === 'mistakes' && !isRight) {
          itemsToDisplay.push({ q, i, uAns, isRight });
        } else if (currentFilter === 'correct' && isRight) {
          itemsToDisplay.push({ q, i, uAns, isRight });
        }
      });

      if (itemsToDisplay.length === 0) {
        if (currentFilter === 'mistakes') {
          reviewContainer.innerHTML = `
            <div class="p-8 rounded-2xl bg-zinc-100 border border-zinc-300 text-center space-y-2">
              <div class="w-12 h-12 rounded-full bg-zinc-200 text-zinc-800 inline-flex items-center justify-center font-black text-xl mb-1">
                ✓
              </div>
              <h4 class="text-base font-extrabold text-zinc-900">間違えた問題はありません！</h4>
              <p class="text-xs text-zinc-600 font-bold">素晴らしい！全問正解を達成しました。</p>
            </div>
          `;
        } else {
          reviewContainer.innerHTML = `
            <div class="p-8 rounded-2xl bg-zinc-100 border border-zinc-300 text-center text-zinc-500 font-bold text-sm">
              該当する問題はありません。
            </div>
          `;
        }
        return;
      }

      itemsToDisplay.forEach(({ q, i, uAns, isRight }) => {
        const card = document.createElement('div');
        card.className = `p-5 rounded-2xl border ${isRight ? 'border-zinc-300 bg-white' : 'border-zinc-400 bg-zinc-100'} shadow-sm text-sm space-y-3 animate-fade-in`;

        let userValDisplay = '未入力';
        if (uAns) {
          if (uAns.mode === 'typing') {
            userValDisplay = uAns.userInput || '未入力';
          } else {
            userValDisplay = uAns.selectedOption || '未選択';
          }
        }

        card.innerHTML = `
          <div class="flex items-center justify-between text-xs font-extrabold">
            <span class="text-zinc-400">Q${i + 1} &bull; ${q.categoryLabel}</span>
            <span class="${isRight ? 'text-zinc-900 bg-zinc-200 border border-zinc-300' : 'text-zinc-800 bg-zinc-300 border border-zinc-400'} px-2.5 py-0.5 rounded-full font-black">
              ${isRight ? '正解' : '不正解'}
            </span>
          </div>

          <div class="font-extrabold text-zinc-900 leading-relaxed text-base">
            ベトナム語で 「${q.jp}」
          </div>

          <div class="pt-2 border-t border-zinc-200 text-xs sm:text-sm space-y-1.5 font-bold">
            ${!isRight ? `<div class="text-zinc-700">あなたの回答: <span class="font-extrabold underline">${userValDisplay}</span></div>` : ''}
            <div class="text-zinc-900">模範解答: ${q.answer}</div>
          </div>
        `;

        reviewContainer.appendChild(card);
      });
    }

    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', function () {
      renderMyWordsList();
      updateMyBookCard();
      updateAllCategoryButtons();
    });
