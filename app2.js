
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
    let pendingCategory = 'animals';
    let currentQuizPool = [];
    let currentIndex = 0;
    let currentMode = 'typing'; // 'typing' or 'multiple'
    let userAnswers = []; // stores { question, userInput, selectedOption, isCorrect, mode }
    let currentFilter = 'all'; 

    const categoryNamesMap = { 
      animals: "動物",
      animals2: "動物II",
      jobs: "職業",
      buildings: "建物・場所",
      pronouns: "代名詞・人称", 
      verbs: "基本動詞", 
      nouns: "基本名詞", 
      adjectives: "形容詞・状態",
      connectors: "接続詞・副詞・疑問詞",
      bodyparts: "体の部位"
    };

    // --- PERSISTENCE: PROGRESS ---
    const PROGRESS_STORAGE_KEY = 'vnVocab_progress_v1';

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

    let progressData = loadProgress();
    let currentCategoryKey = 'animals';
    let currentMistakesOnly = false;

    // --- PERSISTENCE: CUSTOM FOLDERS ---
    const FOLDERS_STORAGE_KEY = 'vnVocab_customFolders_v1';

    function loadFolders() {
      try {
        return JSON.parse(localStorage.getItem(FOLDERS_STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    }

    function saveFolders() {
      try {
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(customFolders));
      } catch (e) { /* storage unavailable, fail silently */ }
    }

    let customFolders = loadFolders();

    // --- SHARED HELPERS: labels & word pools across built-in categories and folders ---
    function getCategoryLabel(key) {
      if (categoryNamesMap[key]) return categoryNamesMap[key];
      if (key && key.indexOf('folder_') === 0) {
        const f = customFolders.find(x => ('folder_' + x.id) === key);
        if (f) return f.name;
      }
      return key || 'カテゴリー';
    }

    function getPoolForKey(key) {
      if (key && key.indexOf('folder_') === 0) {
        const fid = key.slice('folder_'.length);
        const f = customFolders.find(x => x.id === fid);
        return f ? f.words : [];
      }
      return rawQuestions.filter(q => q.category === key);
    }

    function getDistractorPool(q) {
      let pool = getPoolForKey(q.category).filter(item => item.answer !== q.answer);
      if (pool.length < 3) {
        const extra = rawQuestions.filter(item => item.answer !== q.answer);
        pool = pool.concat(extra);
      }
      return pool;
    }

    function clearAllGeneratedChoices() {
      rawQuestions.forEach(q => delete q._generatedChoices);
      customFolders.forEach(f => f.words.forEach(q => delete q._generatedChoices));
    }

    function parseBulkWords(text) {
      if (!text) return [];
      const cleaned = text.replace(/[【】]/g, '').replace(/\n+/g, ';');
      return cleaned.split(';')
        .map(e => e.trim())
        .filter(Boolean)
        .map(entry => {
          const idx = entry.indexOf(',');
          if (idx === -1) return null;
          const vn = entry.slice(0, idx).trim();
          const jp = entry.slice(idx + 1).trim();
          if (!vn || !jp) return null;
          return { vn, jp };
        })
        .filter(Boolean);
    }

    // --- PERSISTENCE: IN-PROGRESS QUIZ (RESUME) ---
    const INPROGRESS_STORAGE_KEY = 'vnVocab_inProgress_v1';

    function loadInProgressMap() {
      try {
        return JSON.parse(localStorage.getItem(INPROGRESS_STORAGE_KEY)) || {};
      } catch (e) {
        return {};
      }
    }

    function saveInProgressMap(map) {
      try {
        localStorage.setItem(INPROGRESS_STORAGE_KEY, JSON.stringify(map));
      } catch (e) { /* storage unavailable, fail silently */ }
    }

    function inProgressKey(categoryKey, mistakesOnly) {
      return `${categoryKey}::${mistakesOnly ? 'mistakes' : 'full'}`;
    }

    function getInProgressSnapshot(categoryKey, mistakesOnly) {
      const map = loadInProgressMap();
      return map[inProgressKey(categoryKey, mistakesOnly)] || null;
    }

    function clearInProgressSnapshot(categoryKey, mistakesOnly) {
      const map = loadInProgressMap();
      const key = inProgressKey(categoryKey, mistakesOnly);
      if (map[key]) {
        delete map[key];
        saveInProgressMap(map);
      }
    }

    function saveCurrentProgressSnapshot() {
      if (!currentQuizPool || !currentQuizPool.length) return;
      // Don't save a snapshot for a quiz that's already fully answered (nothing to resume)
      if (userAnswers.every(a => a !== null)) return;

      const map = loadInProgressMap();
      map[inProgressKey(currentCategoryKey, currentMistakesOnly)] = {
        categoryKey: currentCategoryKey,
        mistakesOnly: currentMistakesOnly,
        mode: currentMode,
        poolIds: currentQuizPool.map(q => q.id),
        currentIndex,
        answers: userAnswers.map(a => a ? {
          userInput: a.userInput,
          selectedOption: a.selectedOption,
          isCorrect: a.isCorrect,
          mode: a.mode
        } : null),
        generatedChoices: currentQuizPool.map(q => q._generatedChoices || null)
      };
      saveInProgressMap(map);
    }

    function findWordById(id) {
      let found = rawQuestions.find(q => q.id === id);
      if (!found) {
        for (const f of customFolders) {
          found = f.words.find(w => w.id === id);
          if (found) break;
        }
      }
      return found;
    }

    function resumeQuiz(snapshot) {
      const pool = snapshot.poolIds.map(id => findWordById(id)).filter(Boolean);
      if (!pool.length) {
        clearInProgressSnapshot(snapshot.categoryKey, snapshot.mistakesOnly);
        showHomeView();
        return;
      }

      pool.forEach((q, i) => {
        const choices = snapshot.generatedChoices && snapshot.generatedChoices[i];
        if (choices) {
          q._generatedChoices = choices;
        } else {
          delete q._generatedChoices;
        }
      });

      currentQuizPool = pool;
      currentCategoryKey = snapshot.categoryKey;
      currentMistakesOnly = !!snapshot.mistakesOnly;
      currentMode = snapshot.mode;
      currentIndex = Math.min(snapshot.currentIndex || 0, pool.length - 1);
      userAnswers = pool.map((q, i) => {
        const a = snapshot.answers && snapshot.answers[i];
        return a ? { question: q, userInput: a.userInput, selectedOption: a.selectedOption, isCorrect: a.isCorrect, mode: a.mode } : null;
      });

      const catText = getCategoryLabel(currentCategoryKey);
      const modeText = currentMode === 'typing' ? 'タイピング' : '4択選択';
      const mistakesTag = currentMistakesOnly ? ' ・間違えた単語のみ' : '';
      document.getElementById('categorySubtitle').textContent = `${catText}${mistakesTag} [${modeText}] (${currentQuizPool.length}問)`;

      document.getElementById('homeScreen').classList.add('hidden');
      document.getElementById('resultScreen').classList.add('hidden');
      document.getElementById('quizScreen').classList.remove('hidden');

      renderQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // --- RESUME CHOICE MODAL ---
    let pendingResumeSnapshot = null;
    let pendingResumeStartFreshAction = null;

    function openResumeChoiceModal(snapshot, startFreshAction) {
      playSound('click');
      pendingResumeSnapshot = snapshot;
      pendingResumeStartFreshAction = startFreshAction;
      const catName = getCategoryLabel(snapshot.categoryKey);
      document.getElementById('resumeCategoryName').textContent = catName;
      document.getElementById('resumeModalOverlay').classList.remove('hidden');
    }

    function closeResumeChoiceModal() {
      playSound('click');
      document.getElementById('resumeModalOverlay').classList.add('hidden');
      pendingResumeSnapshot = null;
      pendingResumeStartFreshAction = null;
    }

    function chooseResumeContinue() {
      playSound('click');
      const snap = pendingResumeSnapshot;
      document.getElementById('resumeModalOverlay').classList.add('hidden');
      pendingResumeSnapshot = null;
      pendingResumeStartFreshAction = null;
      if (snap) resumeQuiz(snap);
    }

    function chooseResumeFresh() {
      playSound('click');
      const snap = pendingResumeSnapshot;
      const startFreshAction = pendingResumeStartFreshAction;
      document.getElementById('resumeModalOverlay').classList.add('hidden');
      pendingResumeSnapshot = null;
      pendingResumeStartFreshAction = null;
      if (snap) clearInProgressSnapshot(snap.categoryKey, snap.mistakesOnly);
      if (startFreshAction) startFreshAction();
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // --- DUPLICATE CHECK: search & detect repeated words within the user's custom folders ---
    // Only checks words the user has added to "マイフォルダ" - built-in categories are excluded.
    // Matching keeps Vietnamese accent marks intact (case-insensitive, trimmed only).

    function normalizeExact(str) {
      return str ? str.trim().toLowerCase().replace(/\s+/g, ' ') : '';
    }

    function getAllFolderWordsFlat() {
      const all = [];
      customFolders.forEach(f => {
        f.words.forEach(w => {
          all.push({ id: w.id, jp: w.jp, answer: w.answer, folderId: f.id, folderName: f.name });
        });
      });
      return all;
    }

    function buildDuplicateGroups() {
      const all = getAllFolderWordsFlat();
      const map = {};
      all.forEach(w => {
        const key = normalizeExact(w.answer);
        if (!key) return;
        if (!map[key]) map[key] = [];
        map[key].push(w);
      });
      return map;
    }

    function renderDupTab() {
      const searchInput = document.getElementById('dupSearchInput');
      const listEl = document.getElementById('dupResultsList');
      const countEl = document.getElementById('dupCount');
      if (!listEl) return;

      const query = searchInput ? searchInput.value.trim() : '';
      const map = buildDuplicateGroups();
      const dupKeys = Object.keys(map).filter(k => map[k].length > 1);
      if (countEl) countEl.textContent = dupKeys.length;

      let keysToShow;
      let emptyMessage;

      if (query) {
        const normQuery = normalizeExact(query);
        const lowerQuery = query.toLowerCase();
        keysToShow = Object.keys(map).filter(k =>
          k.includes(normQuery) || map[k].some(w => w.jp.toLowerCase().includes(lowerQuery))
        );
        emptyMessage = '該当する単語が見つかりません。';
      } else {
        keysToShow = dupKeys;
        emptyMessage = 'マイフォルダ内に重複している単語は見つかりませんでした。';
      }

      if (!keysToShow.length) {
        listEl.innerHTML = `<p class="text-xs text-zinc-400 font-bold text-center py-8">${emptyMessage}</p>`;
        return;
      }

      keysToShow.sort((a, b) => map[b].length - map[a].length);

      listEl.innerHTML = keysToShow.map(k => {
        const items = map[k];
        const isDup = items.length > 1;
        const rows = items.map(w => `
          <div class="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-white border border-zinc-200">
            <span class="text-xs font-bold text-zinc-700 truncate">${escapeHtml(w.jp)} <span class="text-zinc-300 mx-1">→</span> ${escapeHtml(w.answer)}</span>
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">${escapeHtml(w.folderName)}</span>
              <button onclick="deleteDupWord('${w.folderId}', '${w.id}')" class="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-rose-700 transition-colors" title="削除">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
        `).join('');
        return `
          <div class="rounded-xl border ${isDup ? 'border-rose-300 bg-rose-50/50' : 'border-zinc-200 bg-zinc-50'} p-2.5 space-y-1.5 animate-fade-in">
            ${isDup ? `<div class="text-[10px] font-black text-rose-700 uppercase tracking-wide px-0.5">重複 &times; ${items.length}</div>` : ''}
            ${rows}
          </div>
        `;
      }).join('');
    }

    function deleteDupWord(folderId, wordId) {
      deleteFolderWord(folderId, wordId);
      renderDupTab();
    }

    // --- CATEGORY WORD LIST MODAL (preview all words before practicing) ---
    // Also reused, in "folder" mode, as the folder word editor (bulk add + delete).
    let currentWordListCategory = null;
    let currentWordListMode = 'builtin'; // 'builtin' | 'folder'
    let currentWordListFolderId = null;

    function wordListRowHtml(q, editable) {
      return `
        <div class="flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-colors animate-fade-in">
          <div class="text-sm min-w-0 truncate">
            <span class="font-extrabold text-zinc-700">${escapeHtml(q.jp)}</span>
            <span class="text-zinc-400 mx-1.5">→</span>
            <span class="font-bold text-zinc-600">${escapeHtml(q.answer)}</span>
          </div>
          ${editable ? `
          <button onclick="deleteFolderWord('${currentWordListFolderId}', '${q.id}')" class="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0" title="削除">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>` : ''}
        </div>
      `;
    }

    function openWordListModal(categoryFilter) {
      playSound('click');
      currentWordListMode = 'builtin';
      currentWordListFolderId = null;
      currentWordListCategory = categoryFilter;
      const overlay = document.getElementById('wordListModalOverlay');
      if (!overlay) return;
      const catName = getCategoryLabel(categoryFilter);
      document.getElementById('wordListModalTitle').textContent = catName + ' 一覧';
      const bulkSection = document.getElementById('wordListBulkAddSection');
      if (bulkSection) bulkSection.classList.add('hidden');
      const editBtn = document.getElementById('wordListEditFolderBtn');
      if (editBtn) editBtn.classList.add('hidden');
      const searchInput = document.getElementById('wordListModalSearch');
      if (searchInput) searchInput.value = '';
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      renderWordListModal();
      if (searchInput) searchInput.focus();
    }

    function openFolderWordsModal(folderId) {
      playSound('click');
      const folder = customFolders.find(f => f.id === folderId);
      if (!folder) return;
      currentWordListMode = 'folder';
      currentWordListFolderId = folderId;
      currentWordListCategory = 'folder_' + folderId;
      const overlay = document.getElementById('wordListModalOverlay');
      if (!overlay) return;
      document.getElementById('wordListModalTitle').textContent = folder.name + ' 一覧';
      const bulkSection = document.getElementById('wordListBulkAddSection');
      if (bulkSection) bulkSection.classList.remove('hidden');
      const editBtn = document.getElementById('wordListEditFolderBtn');
      if (editBtn) editBtn.classList.remove('hidden');
      const bulkInput = document.getElementById('wordListBulkInput');
      if (bulkInput) bulkInput.value = '';
      const bulkError = document.getElementById('wordListBulkError');
      if (bulkError) bulkError.classList.add('hidden');
      const searchInput = document.getElementById('wordListModalSearch');
      if (searchInput) searchInput.value = '';
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      renderWordListModal();
      if (searchInput) searchInput.focus();
    }

    function closeWordListModal() {
      playSound('click');
      const overlay = document.getElementById('wordListModalOverlay');
      if (!overlay) return;
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }

    function renderWordListModal() {
      const listEl = document.getElementById('wordListModalList');
      if (!listEl || !currentWordListCategory) return;

      const isFolder = currentWordListMode === 'folder';
      const words = isFolder ? getPoolForKey(currentWordListCategory) : rawQuestions.filter(q => q.category === currentWordListCategory);
      const searchInput = document.getElementById('wordListModalSearch');
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const filtered = query
        ? words.filter(q => q.jp.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query))
        : words;

      const countEl = document.getElementById('wordListModalCount');
      if (countEl) countEl.textContent = filtered.length;

      if (!filtered.length) {
        listEl.innerHTML = `<p class="text-sm text-zinc-400 font-bold text-center py-12">${isFolder ? 'まだ単語が登録されていません。上のフォームから追加してください。' : '該当する単語が見つかりません。'}</p>`;
      } else {
        listEl.innerHTML = filtered.map(q => wordListRowHtml(q, isFolder)).join('');
      }
    }

    function addBulkWordsToCurrentFolder() {
      if (currentWordListMode !== 'folder' || !currentWordListFolderId) return;
      playSound('click');
      const folder = customFolders.find(f => f.id === currentWordListFolderId);
      const textarea = document.getElementById('wordListBulkInput');
      const errorEl = document.getElementById('wordListBulkError');
      if (!folder || !textarea) return;

      const parsed = parseBulkWords(textarea.value);
      if (!parsed.length) {
        if (errorEl) {
          errorEl.textContent = '正しい形式で入力してください。例: con chó,犬;con mèo,猫';
          errorEl.classList.remove('hidden');
        }
        return;
      }
      if (errorEl) errorEl.classList.add('hidden');

      parsed.forEach(p => {
        folder.words.push({
          id: 'folder_' + folder.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000000),
          category: 'folder_' + folder.id,
          categoryLabel: folder.name,
          jp: p.jp,
          answer: p.vn,
          altAnswers: []
        });
      });

      saveFolders();
      textarea.value = '';
      renderWordListModal();
      renderFolders();
    }

    function deleteFolderWord(folderId, wordId) {
      playSound('click');
      const folder = customFolders.find(f => f.id === folderId);
      if (!folder) return;
      folder.words = folder.words.filter(w => w.id !== wordId);
      saveFolders();

      const key = 'folder_' + folderId;
      if (progressData[key] && progressData[key].mistakeIds) {
        progressData[key].mistakeIds = progressData[key].mistakeIds.filter(id => id !== wordId);
        saveProgress();
      }

      renderWordListModal();
      renderFolders();
    }

    function startPracticeFromWordList() {
      if (!currentWordListCategory) return;
      const cat = currentWordListCategory;
      closeWordListModal();
      openModeModal(cat);
    }

    // --- MY FOLDERS (CUSTOM USER FOLDERS) ---
    let editingFolderId = null;

    function renderFolders() {
      const grid = document.getElementById('foldersGrid');
      if (!grid) return;

      let html = customFolders.map(f => {
        const key = 'folder_' + f.id;
        return `
        <div class="group rounded-2xl bg-white border border-zinc-300 hover:border-zinc-700 hover:shadow-md transition-all overflow-hidden flex flex-col">
          <button onclick="openModeModal('${key}')" class="p-5 text-left w-full flex flex-col gap-2 flex-grow relative">
            <div class="flex items-center justify-between gap-2">
              <span class="font-extrabold text-base text-zinc-700 hover:underline hover:text-zinc-900 cursor-pointer decoration-2 underline-offset-2 truncate" onclick="event.stopPropagation(); openFolderWordsModal('${f.id}')" title="単語リストを見る">${escapeHtml(f.name)}</span>
              <span class="text-xs font-black px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-300 shrink-0">${f.words.length}語</span>
            </div>
            <p class="text-xs text-zinc-500 font-medium">${f.description ? escapeHtml(f.description) : 'フォルダの説明はまだありません。'}</p>
          </button>
        </div>`;
      }).join('');

      html += `
        <button onclick="openFolderCreateModal()" class="p-5 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-300 hover:border-zinc-700 hover:bg-white transition-all flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-zinc-700 min-h-[104px]">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
          <span class="text-xs font-extrabold">新しいフォルダを作成</span>
        </button>
      `;

      grid.innerHTML = html;

      customFolders.forEach(f => {
        updateMistakesButton('folder_' + f.id);
        updateStamp('folder_' + f.id);
      });
    }

    function openFolderCreateModal() {
      playSound('click');
      editingFolderId = null;
      document.getElementById('folderEditModalTitle').textContent = '新しいフォルダを作成';
      document.getElementById('folderNameInput').value = '';
      document.getElementById('folderDescInput').value = '';
      document.getElementById('folderDeleteBtn').classList.add('hidden');
      document.getElementById('folderEditError').classList.add('hidden');
      const overlay = document.getElementById('folderEditModalOverlay');
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }

    function openFolderEditModal(folderId) {
      playSound('click');
      const folder = customFolders.find(f => f.id === folderId);
      if (!folder) return;
      editingFolderId = folderId;
      document.getElementById('folderEditModalTitle').textContent = 'フォルダを編集';
      document.getElementById('folderNameInput').value = folder.name;
      document.getElementById('folderDescInput').value = folder.description || '';
      document.getElementById('folderDeleteBtn').classList.remove('hidden');
      document.getElementById('folderEditError').classList.add('hidden');
      const overlay = document.getElementById('folderEditModalOverlay');
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }

    function closeFolderEditModal() {
      playSound('click');
      const overlay = document.getElementById('folderEditModalOverlay');
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      editingFolderId = null;
    }

    function saveFolderModal() {
      playSound('click');
      const name = document.getElementById('folderNameInput').value.trim();
      const desc = document.getElementById('folderDescInput').value.trim();
      const errorEl = document.getElementById('folderEditError');

      if (!name) {
        errorEl.textContent = 'フォルダ名を入力してください。';
        errorEl.classList.remove('hidden');
        return;
      }
      errorEl.classList.add('hidden');

      if (editingFolderId) {
        const folder = customFolders.find(f => f.id === editingFolderId);
        if (folder) {
          folder.name = name;
          folder.description = desc;
          folder.words.forEach(w => { w.categoryLabel = name; });
        }
      } else {
        customFolders.push({
          id: 'f' + Date.now() + '_' + Math.floor(Math.random() * 100000),
          name,
          description: desc,
          words: []
        });
      }

      saveFolders();
      closeFolderEditModal();
      renderFolders();
    }

    function deleteFolderConfirm() {
      if (!editingFolderId) return;
      if (!confirm('このフォルダを削除しますか？中の単語もすべて削除されます。')) return;
      playSound('click');

      const key = 'folder_' + editingFolderId;
      customFolders = customFolders.filter(f => f.id !== editingFolderId);
      delete progressData[key];
      clearInProgressSnapshot(key, false);
      clearInProgressSnapshot(key, true);
      saveFolders();
      saveProgress();
      closeFolderEditModal();
      renderFolders();
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

    function updateStamp(categoryKey) {
      const btn = document.querySelector(`button[onclick="openModeModal('${categoryKey}')"]`);
      if (!btn) return;
      btn.classList.add('relative');

      const prog = progressData[categoryKey];

      // "perfect" = fully completed in ONE go with zero mistakes (typing) -> red complete stamp.
      // "mastered" = every word has eventually been answered correctly (list fully
      // cleared through resumed / mistakes-only practice, i.e. NOT in one go) ->
      // the semi-completed stamp, until a true one-go run upgrades it to complete.
      const isPerfect = !!(prog && prog.perfect);
      const typingMistakes = (prog && prog.byMode && prog.byMode.typing) ? prog.byMode.typing.mistakeIds : null;
      const isMastered = !isPerfect && !!(typingMistakes && typingMistakes.length === 0);
      const hasTypingStamp = isPerfect || isMastered;

      // Typing / mastered stamp (red or blue), always right-aligned.
      let typingImg = btn.querySelector('img.js-typing-stamp');
      if (hasTypingStamp) {
        const stampSrc = isPerfect ? 'images/complete_stamp.png' : 'images/stamp_semicompleted.png';
        const stampAlt = isPerfect ? 'コンプリート' : '一部達成';
        if (!typingImg) {
          typingImg = document.createElement('img');
          typingImg.className = 'complete-stamp js-typing-stamp';
          btn.appendChild(typingImg);
        }
        if (typingImg.getAttribute('src') !== stampSrc) {
          typingImg.src = stampSrc;
          typingImg.alt = stampAlt;
        }
      } else if (typingImg) {
        typingImg.remove();
      }

      // Multiple-choice ("4択コンプリート", green) stamp. If the typing stamp is
      // ALSO showing, shift this one to the left so they don't overlap. If it's
      // the only stamp earned, let it sit flush right in the typing stamp's spot.
      let multiImg = btn.querySelector('img.js-multi-stamp');
      const isPerfectMultiple = !!(prog && prog.perfectMultiple);
      if (isPerfectMultiple) {
        if (!multiImg) {
          multiImg = document.createElement('img');
          multiImg.src = 'images/multiple_complete.png';
          multiImg.alt = '4択コンプリート';
          multiImg.className = 'complete-stamp js-multi-stamp';
          btn.appendChild(multiImg);
        }
        multiImg.classList.toggle('complete-stamp-multiple', hasTypingStamp);
      } else if (multiImg) {
        multiImg.remove();
      }
    }

    function updateAllCategoryButtons() {
      Object.keys(categoryNamesMap).forEach(key => {
        updateMistakesButton(key);
        updateStamp(key);
      });
      customFolders.forEach(f => {
        updateMistakesButton('folder_' + f.id);
        updateStamp('folder_' + f.id);
      });
    }

    function startMistakesPractice(categoryKey) {
      const prog = progressData[categoryKey];
      if (!prog || !prog.mistakeIds || !prog.mistakeIds.length) return;

      openModeModal(categoryKey, true);
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
      mistakesOnly = !!mistakesOnly;
      const snapshot = getInProgressSnapshot(categoryFilter, mistakesOnly);
      if (snapshot) {
        openResumeChoiceModal(snapshot, () => openModeModalDirect(categoryFilter, mistakesOnly));
        return;
      }
      openModeModalDirect(categoryFilter, mistakesOnly);
    }

    function openModeModalDirect(categoryFilter, mistakesOnly) {
      playSound('click');
      pendingCategory = categoryFilter;
      pendingMistakesOnly = !!mistakesOnly;
      updateModeScopeUI();
      document.getElementById('modeModalOverlay').classList.remove('hidden');
    }

    function getMistakeCount(categoryKey) {
      const prog = progressData[categoryKey];
      if (!prog || !prog.completed || !prog.mistakeIds) return 0;
      const ids = new Set(getPoolForKey(categoryKey).map(q => q.id));
      return prog.mistakeIds.filter(id => ids.has(id)).length;
    }

    function updateModeScopeUI() {
      const catName = getCategoryLabel(pendingCategory);
      const mistakeCount = getMistakeCount(pendingCategory);
      if (mistakeCount === 0) pendingMistakesOnly = false;

      document.getElementById('modalCategoryName').textContent = pendingMistakesOnly
        ? `対象: ${catName}（間違えた単語のみ）`
        : `対象: ${catName}`;

      const section = document.getElementById('modeScopeSection');
      section.classList.toggle('hidden', mistakeCount === 0);
      document.getElementById('scopeAllCount').textContent = getPoolForKey(pendingCategory).length;
      document.getElementById('scopeMistakesCount').textContent = mistakeCount;

      const active = 'px-3 py-2.5 rounded-xl transition-all bg-white text-zinc-900 shadow-sm';
      const inactive = 'px-3 py-2.5 rounded-xl transition-all text-zinc-500 hover:text-zinc-800';
      document.getElementById('scopeAllBtn').className = pendingMistakesOnly ? inactive : active;
      document.getElementById('scopeMistakesBtn').className = (pendingMistakesOnly ? active : inactive) + ' flex items-center justify-center gap-1.5';
    }

    function setModeScope(mistakesOnly) {
      playSound('click');
      pendingMistakesOnly = !!mistakesOnly;
      updateModeScopeUI();
    }

    function closeModeModal() {
      playSound('click');
      document.getElementById('modeModalOverlay').classList.add('hidden');
    }

    function confirmStartQuiz(mode) {
      playSound('click');
      currentMode = mode;
      document.getElementById('modeModalOverlay').classList.add('hidden');
      const cat = pendingCategory, mo = pendingMistakesOnly;
      // A saved in-progress run may exist for the "mistakes only" scope chosen inside this modal
      const snap = mo ? getInProgressSnapshot(cat, true) : null;
      if (snap) {
        openResumeChoiceModal(snap, () => startQuiz(cat, mo));
        return;
      }
      startQuiz(cat, mo);
    }

    // --- NAVIGATION & VIEWS ---
    function showHomeView() {
      const quizScreenEl = document.getElementById('quizScreen');
      if (quizScreenEl && !quizScreenEl.classList.contains('hidden')) {
        saveCurrentProgressSnapshot();
      }
      playSound('click');
      document.getElementById('homeScreen').classList.remove('hidden');
      document.getElementById('quizScreen').classList.add('hidden');
      document.getElementById('resultScreen').classList.add('hidden');
      document.getElementById('modeModalOverlay').classList.add('hidden');
      document.getElementById('categorySubtitle').textContent = "全語彙マスター";
      updateAllCategoryButtons();
      renderFolders();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function startQuiz(categoryFilter, mistakesOnly) {
      clearInProgressSnapshot(categoryFilter, !!mistakesOnly);
      const shuffleQuestions = document.getElementById('shuffleQuestionsToggle').checked;

      // Reset dynamic multiple choice properties so they get regenerated freshly
      clearAllGeneratedChoices();

      let filtered = getPoolForKey(categoryFilter).slice();

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

      const catText = getCategoryLabel(categoryFilter);
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
      clearAllGeneratedChoices();
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

      document.getElementById('questionCategoryTag').textContent = getCategoryLabel(q.category) || q.categoryLabel;
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
          const distinctAnswersPool = Array.from(new Set(getDistractorPool(q).map(item => item.answer)));
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

          const labels = keybinds.map(k => keyDisplayLabel(k));
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

        // No feedback bar in multiple choice mode
        feedbackBox.classList.add('hidden');
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
  if (capturingKeybindSlot !== null) return; // settings modal is capturing a new key right now

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

    // Custom key handler for selecting a multiple-choice answer directly
    if (currentMode === 'multiple' && userAnswers[currentIndex] === null) {
      const pressed = normalizeKeyName(e.key);
      const idx = keybinds.findIndex(k => normalizeKeyName(k) === pressed);
      if (idx !== -1) {
        const q = currentQuizPool[currentIndex];
        if (q && q._generatedChoices && q._generatedChoices[idx] !== undefined) {
          e.preventDefault();
          submitMultipleChoiceAnswer(q._generatedChoices[idx]);
        }
      }
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

      if (!progressData[currentCategoryKey]) {
        progressData[currentCategoryKey] = { completed: false, mistakeIds: [], byMode: {} };
      }
      const prog = progressData[currentCategoryKey];
      if (!prog.byMode) prog.byMode = {};

      // Update this mode's own mistake list (typing / multiple are tracked independently)
      if (currentMistakesOnly) {
        // Only the previously-missed subset (for this mode) was tested: keep untouched
        // mistakes, drop ones now answered correctly, keep ones still missed.
        const prevIds = (prog.byMode[currentMode] && prog.byMode[currentMode].mistakeIds) || [];
        const testedIds = currentQuizPool.map(q => q.id);
        const untouched = prevIds.filter(id => !testedIds.includes(id));
        prog.byMode[currentMode] = { mistakeIds: [...untouched, ...missedIds] };
      } else {
        prog.byMode[currentMode] = { mistakeIds: missedIds };
      }

      // Whichever mode (typing / multiple choice) currently has MORE mistakes wins,
      // and that list is what "間違えた単語のみ練習" uses for both modes going forward.
      const typingList = prog.byMode.typing ? prog.byMode.typing.mistakeIds : null;
      const multipleList = prog.byMode.multiple ? prog.byMode.multiple.mistakeIds : null;

      let chosenIds;
      if (typingList && multipleList) {
        chosenIds = typingList.length >= multipleList.length ? typingList : multipleList;
      } else {
        chosenIds = typingList || multipleList || [];
      }

      // Stamps are earned only by a FULL run (not mistakes-only) with zero mistakes,
      // tracked independently per mode (typing vs multiple choice).
      if (!currentMistakesOnly && missedIds.length === 0) {
        if (currentMode === 'typing') {
          prog.perfect = true;
        } else if (currentMode === 'multiple') {
          prog.perfectMultiple = true;
        }
      }

      prog.completed = true;
      prog.mistakeIds = chosenIds;
      saveProgress();

      // This attempt is finished, so any saved "resume" snapshot for it is stale.
      clearInProgressSnapshot(currentCategoryKey, currentMistakesOnly);

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
            <span class="text-zinc-400">Q${i + 1} &bull; ${getCategoryLabel(q.category) || q.categoryLabel}</span>
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

    window.addEventListener('beforeunload', function () {
      const quizScreenEl = document.getElementById('quizScreen');
      if (quizScreenEl && !quizScreenEl.classList.contains('hidden')) {
        saveCurrentProgressSnapshot();
      }
    });

    // --- TUTORIAL / HOW-TO MODAL ---
    function openTutorialModal() {
      playSound('click');
      const overlay = document.getElementById('tutorialModalOverlay');
      if (!overlay) return;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }

    function closeTutorialModal() {
      playSound('click');
      const overlay = document.getElementById('tutorialModalOverlay');
      if (!overlay) return;
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }

    // --- CUSTOM KEY BINDINGS FOR MULTIPLE-CHOICE MODE ---
    const KEYBINDS_STORAGE_KEY = 'vnVocab_keybinds_v1';
    const DEFAULT_KEYBINDS = ['a', 'b', 'c', 'd'];
    // Keys reserved for other controls (Enter = submit/next, Space = next in multiple mode)
    const RESERVED_KEYS = ['Enter', ' '];

    function loadKeybinds() {
      try {
        const saved = JSON.parse(localStorage.getItem(KEYBINDS_STORAGE_KEY));
        if (Array.isArray(saved) && saved.length === 4 && saved.every(k => typeof k === 'string' && k.length > 0)) {
          return saved;
        }
      } catch (e) { /* ignore, fall back to default */ }
      return [...DEFAULT_KEYBINDS];
    }

    function saveKeybinds(arr) {
      try {
        localStorage.setItem(KEYBINDS_STORAGE_KEY, JSON.stringify(arr));
      } catch (e) { /* storage unavailable, fail silently */ }
    }

    let keybinds = loadKeybinds();

    function normalizeKeyName(key) {
      if (!key) return '';
      return key.length === 1 ? key.toLowerCase() : key;
    }

    function keyDisplayLabel(key) {
      const specialLabels = {
        ' ': 'Space', 'Enter': 'Enter', 'Escape': 'Esc', 'Tab': 'Tab',
        'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→'
      };
      if (specialLabels[key]) return specialLabels[key];
      return key.length === 1 ? key.toUpperCase() : key;
    }

    // --- SETTINGS MODAL (data backup tab + key bindings tab) ---
    let capturingKeybindSlot = null;

    function openSettingsModal() {
      playSound('click');
      const overlay = document.getElementById('settingsModalOverlay');
      if (!overlay) return;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      switchSettingsTab('data');
    }

    function closeSettingsModal() {
      playSound('click');
      cancelKeybindCapture();
      const overlay = document.getElementById('settingsModalOverlay');
      if (!overlay) return;
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }

    function switchSettingsTab(tab) {
      playSound('click');
      const dataTab = document.getElementById('settingsTabData');
      const keysTab = document.getElementById('settingsTabKeys');
      const dupTab = document.getElementById('settingsTabDup');
      const dataBtn = document.getElementById('settingsTabDataBtn');
      const keysBtn = document.getElementById('settingsTabKeysBtn');
      const dupBtn = document.getElementById('settingsTabDupBtn');
      if (!dataTab || !keysTab || !dupTab || !dataBtn || !keysBtn || !dupBtn) return;

      const activeClass = 'px-3.5 py-1.5 rounded-lg transition-all bg-white text-zinc-900 shadow-sm';
      const inactiveClass = 'px-3.5 py-1.5 rounded-lg transition-all text-zinc-500 hover:text-zinc-800';

      dataTab.classList.add('hidden');
      keysTab.classList.add('hidden');
      dupTab.classList.add('hidden');
      dataBtn.className = inactiveClass;
      keysBtn.className = inactiveClass;
      dupBtn.className = inactiveClass;

      if (tab === 'keys') {
        keysTab.classList.remove('hidden');
        keysBtn.className = activeClass;
        renderKeybindGrid();
      } else if (tab === 'dup') {
        dupTab.classList.remove('hidden');
        dupBtn.className = activeClass;
        renderDupTab();
      } else {
        dataTab.classList.remove('hidden');
        dataBtn.className = activeClass;
      }
    }

    function renderKeybindGrid() {
      const grid = document.getElementById('keybindGrid');
      if (!grid) return;
      grid.innerHTML = keybinds.map((k, i) => `
        <button type="button" onclick="startKeybindCapture(${i})" data-slot="${i}" class="keybind-slot-btn p-4 rounded-2xl border-2 border-zinc-300 bg-zinc-50 hover:border-zinc-700 hover:bg-white transition-all flex flex-col items-center justify-center gap-1 text-center">
          <span class="text-xs font-bold text-zinc-400">選択肢 ${i + 1}</span>
          <span class="keybind-slot-value text-xl font-black text-zinc-700 min-h-[1.75rem] leading-tight">${escapeHtml(keyDisplayLabel(k))}</span>
          <span class="text-[10px] font-bold text-zinc-400">タップして変更</span>
        </button>
      `).join('');
    }

    function startKeybindCapture(slot) {
      if (capturingKeybindSlot !== null) return; // already capturing another slot
      playSound('click');
      capturingKeybindSlot = slot;
      const errorEl = document.getElementById('keybindError');
      if (errorEl) errorEl.classList.add('hidden');

      const btn = document.querySelector(`.keybind-slot-btn[data-slot="${slot}"]`);
      if (btn) {
        btn.classList.add('border-zinc-700', 'bg-white');
        const valueEl = btn.querySelector('.keybind-slot-value');
        if (valueEl) valueEl.textContent = '入力待ち…';
      }
      document.addEventListener('keydown', captureKeybindListener, true);
    }

    function captureKeybindListener(e) {
      if (capturingKeybindSlot === null) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        cancelKeybindCapture();
        return;
      }

      const newKey = e.key;
      const errorEl = document.getElementById('keybindError');

      if (RESERVED_KEYS.includes(newKey)) {
        if (errorEl) {
          errorEl.textContent = 'このキーは「次へ進む」操作にすでに使われているため設定できません。';
          errorEl.classList.remove('hidden');
        }
        cancelKeybindCapture();
        return;
      }

      const normalizedNew = normalizeKeyName(newKey);
      const dupIndex = keybinds.findIndex((k, idx) => idx !== capturingKeybindSlot && normalizeKeyName(k) === normalizedNew);
      if (dupIndex !== -1) {
        if (errorEl) {
          errorEl.textContent = `そのキーはすでに選択肢 ${dupIndex + 1} に割り当てられています。別のキーを押してください。`;
          errorEl.classList.remove('hidden');
        }
        cancelKeybindCapture();
        return;
      }

      if (errorEl) errorEl.classList.add('hidden');
      keybinds[capturingKeybindSlot] = newKey;
      saveKeybinds(keybinds);
      finishKeybindCapture();
    }

    function finishKeybindCapture() {
      document.removeEventListener('keydown', captureKeybindListener, true);
      capturingKeybindSlot = null;
      renderKeybindGrid();
    }

    function cancelKeybindCapture() {
      if (capturingKeybindSlot === null) return;
      document.removeEventListener('keydown', captureKeybindListener, true);
      capturingKeybindSlot = null;
      renderKeybindGrid();
    }

    function resetKeybinds() {
      playSound('click');
      cancelKeybindCapture();
      keybinds = [...DEFAULT_KEYBINDS];
      saveKeybinds(keybinds);
      renderKeybindGrid();
      const errorEl = document.getElementById('keybindError');
      if (errorEl) errorEl.classList.add('hidden');
    }

    // --- BACKUP: EXPORT / IMPORT ALL SAVED DATA ---
    function exportProgressData() {
      playSound('click');
      try {
        const backup = {
          type: 'vnVocab-backup',
          version: 1,
          exportedAt: new Date().toISOString(),
          progressData: loadProgress(),
          customFolders: loadFolders(),
          inProgress: loadInProgressMap()
        };
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const dateStr = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `vn-vocab-backup-${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        alert('バックアップの保存に失敗しました。');
      }
    }

    function importProgressData(event) {
      const input = event.target;
      const file = input.files && input.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = JSON.parse(e.target.result);
          if (!data || typeof data !== 'object') throw new Error('invalid backup file');

          const ok = confirm('現在のデータを上書きしてバックアップから復元しますか？この操作は取り消せません。');
          if (!ok) {
            input.value = '';
            return;
          }

          if (data.progressData) localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data.progressData));
          if (data.customFolders) localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(data.customFolders));
          if (data.inProgress) localStorage.setItem(INPROGRESS_STORAGE_KEY, JSON.stringify(data.inProgress));

          alert('復元が完了しました。ページを再読み込みします。');
          location.reload();
        } catch (err) {
          alert('ファイルの読み込みに失敗しました。正しいバックアップファイルか確認してください。');
        } finally {
          input.value = '';
        }
      };
      reader.readAsText(file);
    }

    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', function () {
      updateAllCategoryButtons();
      renderFolders();
    });
