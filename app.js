// --- VIETNAMESE VOCABULARY DATASET ---
    const rawQuestions = [
      // === CATEGORY: ANIMALS (50 Words) ===
      { id: "a_01", category: "animals", categoryLabel: "動物", jp: "犬", answer: "con chó", altAnswers: ["con cho"] },
      { id: "a_02", category: "animals", categoryLabel: "動物", jp: "猫", answer: "con mèo", altAnswers: ["con meo"] },
      { id: "a_03", category: "animals", categoryLabel: "動物", jp: "鳥", answer: "con chim", altAnswers: ["con chim"] },
      { id: "a_04", category: "animals", categoryLabel: "動物", jp: "魚", answer: "con cá", altAnswers: ["con ca"] },
      { id: "a_05", category: "animals", categoryLabel: "動物", jp: "牛", answer: "con bò", altAnswers: ["con bo"] },
      { id: "a_06", category: "animals", categoryLabel: "動物", jp: "豚", answer: "con heo", altAnswers: ["con lon", "con lợn"] },
      { id: "a_07", category: "animals", categoryLabel: "動物", jp: "ニワトリ", answer: "con gà", altAnswers: ["con ga"] },
      { id: "a_08", category: "animals", categoryLabel: "動物", jp: "アヒル / カモ", answer: "con vịt", altAnswers: ["con vit"] },
      { id: "a_09", category: "animals", categoryLabel: "動物", jp: "馬", answer: "con ngựa", altAnswers: ["con ngua"] },
      { id: "a_10", category: "animals", categoryLabel: "動物", jp: "虎 (トラ)", answer: "con hổ", altAnswers: ["con ho", "con cọp", "con cop"] },
      { id: "a_11", category: "animals", categoryLabel: "動物", jp: "ライオン", answer: "con sư tử", altAnswers: ["con su tu"] },
      { id: "a_12", category: "animals", categoryLabel: "動物", jp: "象 (ゾウ)", answer: "con voi", altAnswers: ["con voi"] },
      { id: "a_13", category: "animals", categoryLabel: "動物", jp: "猿 (サル)", answer: "con khỉ", altAnswers: ["con khi"] },
      { id: "a_14", category: "animals", categoryLabel: "動物", jp: "ネズミ", answer: "con chuột", altAnswers: ["con chuot"] },
      { id: "a_15", category: "animals", categoryLabel: "動物", jp: "ウサギ", answer: "con thỏ", altAnswers: ["con tho"] },
      { id: "a_16", category: "animals", categoryLabel: "動物", jp: "熊 (クマ)", answer: "con gấu", altAnswers: ["con gau"] },
      { id: "a_17", category: "animals", categoryLabel: "動物", jp: "蛇 (ヘビ)", answer: "con rắn", altAnswers: ["con ran"] },
      { id: "a_18", category: "animals", categoryLabel: "動物", jp: "羊 (ヒツジ)", answer: "con cừu", altAnswers: ["con cuu"] },
      { id: "a_19", category: "animals", categoryLabel: "動物", jp: "ヤギ", answer: "con dê", altAnswers: ["con de"] },
      { id: "a_20", category: "animals", categoryLabel: "動物", jp: "キリン", answer: "con hươu cao cổ", altAnswers: ["con huou cao co"] },
      { id: "a_21", category: "animals", categoryLabel: "動物", jp: "シマウマ", answer: "con ngựa vằn", altAnswers: ["con ngua van"] },
      { id: "a_22", category: "animals", categoryLabel: "動物", jp: "ラクダ", answer: "con lạc đà", altAnswers: ["con lac da"] },
      { id: "a_23", category: "animals", categoryLabel: "動物", jp: "カンガルー", answer: "con chuột túi", altAnswers: ["con chuot tui"] },
      { id: "a_24", category: "animals", categoryLabel: "動物", jp: "ワニ", answer: "con cá sấu", altAnswers: ["con ca sau"] },
      { id: "a_25", category: "animals", categoryLabel: "動物", jp: "カメ", answer: "con rùa", altAnswers: ["con rua"] },
      { id: "a_26", category: "animals", categoryLabel: "動物", jp: "カエル", answer: "con ếch", altAnswers: ["con ech"] },
      { id: "a_27", category: "animals", categoryLabel: "動物", jp: "サメ", answer: "con cá mập", altAnswers: ["con ca map"] },
      { id: "a_28", category: "animals", categoryLabel: "動物", jp: "クジラ", answer: "con cá voi", altAnswers: ["con ca voi"] },
      { id: "a_29", category: "animals", categoryLabel: "動物", jp: "イルカ", answer: "con cá heo", altAnswers: ["con ca heo"] },
      { id: "a_30", category: "animals", categoryLabel: "動物", jp: "タコ", answer: "con bạch tuộc", altAnswers: ["con bach tuoc"] },
      { id: "a_31", category: "animals", categoryLabel: "動物", jp: "エビ", answer: "con tôm", altAnswers: ["con tom"] },
      { id: "a_32", category: "animals", categoryLabel: "動物", jp: "カニ", answer: "con cua", altAnswers: ["con cua"] },
      { id: "a_33", category: "animals", categoryLabel: "動物", jp: "イカ", answer: "con mực", altAnswers: ["con muc"] },
      { id: "a_34", category: "animals", categoryLabel: "動物", jp: "ミツバチ", answer: "con ong", altAnswers: ["con ong"] },
      { id: "a_35", category: "animals", categoryLabel: "動物", jp: "チョウ (蝶)", answer: "con bướm", altAnswers: ["con buom"] },
      { id: "a_36", category: "animals", categoryLabel: "動物", jp: "アリ (蟻)", answer: "con kiến", altAnswers: ["con kien"] },
      { id: "a_37", category: "animals", categoryLabel: "動物", jp: "カ (蚊)", answer: "con muỗi", altAnswers: ["con muoi"] },
      { id: "a_38", category: "animals", categoryLabel: "動物", jp: "ハエ", answer: "con ruồi", altAnswers: ["con ruoi"] },
      { id: "a_39", category: "animals", categoryLabel: "動物", jp: "クモ (蜘蛛)", answer: "con nhện", altAnswers: ["con nhen"] },
      { id: "a_40", category: "animals", categoryLabel: "動物", jp: "ゴキブリ", answer: "con gián", altAnswers: ["con gian"] },
      { id: "a_41", category: "animals", categoryLabel: "動物", jp: "キツネ", answer: "con cáo", altAnswers: ["con cao"] },
      { id: "a_42", category: "animals", categoryLabel: "動物", jp: "オオカミ", answer: "con sói", altAnswers: ["con soi"] },
      { id: "a_43", category: "animals", categoryLabel: "動物", jp: "ワシ (鷲)", answer: "con đại bàng", altAnswers: ["con dai bang"] },
      { id: "a_44", category: "animals", categoryLabel: "動物", jp: "ハト (鳩)", answer: "con chim bồ câu", altAnswers: ["con chim bo cau"] },
      { id: "a_45", category: "animals", categoryLabel: "動物", jp: "フクロウ", answer: "con chim cú", altAnswers: ["con chim cu"] },
      { id: "a_46", category: "animals", categoryLabel: "動物", jp: "ペンギン", answer: "con chim cánh cụt", altAnswers: ["con chim canh cut"] },
      { id: "a_47", category: "animals", categoryLabel: "動物", jp: "パンダ", answer: "con gấu trúc", altAnswers: ["con gau truc"] },
      { id: "a_48", category: "animals", categoryLabel: "動物", jp: "サイ", answer: "con tê giác", altAnswers: ["con te giac"] },
      { id: "a_49", category: "animals", categoryLabel: "動物", jp: "カバ", answer: "con hà mã", altAnswers: ["con ha ma"] },
      { id: "a_50", category: "animals", categoryLabel: "動物", jp: "カタツムリ / 貝", answer: "con ốc", altAnswers: ["con oc"] },

      // === CATEGORY: JOBS (50 Words) ===
      { id: "j_01", category: "jobs", categoryLabel: "職業", jp: "医師 / ドクター", answer: "bác sĩ", altAnswers: ["bac si"] },
      { id: "j_02", category: "jobs", categoryLabel: "職業", jp: "看護師", answer: "y tá", altAnswers: ["y ta"] },
      { id: "j_03", category: "jobs", categoryLabel: "職業", jp: "教師 / 先生", answer: "giáo viên", altAnswers: ["giao vien", "thầy giáo", "cô giáo"] },
      { id: "j_04", category: "jobs", categoryLabel: "職業", jp: "生徒 / 児童", answer: "học sinh", altAnswers: ["hoc sinh"] },
      { id: "j_05", category: "jobs", categoryLabel: "職業", jp: "大学生", answer: "sinh viên", altAnswers: ["sinh vien"] },
      { id: "j_06", category: "jobs", categoryLabel: "職業", jp: "エンジニア", answer: "kỹ sư", altAnswers: ["ky su"] },
      { id: "j_07", category: "jobs", categoryLabel: "職業", jp: "プログラマー", answer: "lập trình viên", altAnswers: ["lap trinh vien"] },
      { id: "j_08", category: "jobs", categoryLabel: "職業", jp: "警察官", answer: "cảnh sát", altAnswers: ["canh sat", "công an"] },
      { id: "j_09", category: "jobs", categoryLabel: "職業", jp: "消防士", answer: "lính cứu hỏa", altAnswers: ["linh cuu hoa"] },
      { id: "j_10", category: "jobs", categoryLabel: "職業", jp: "軍人", answer: "bộ đội", altAnswers: ["bo doi", "quân nhân"] },
      { id: "j_11", category: "jobs", categoryLabel: "職業", jp: "弁護士", answer: "luật sư", altAnswers: ["luat su"] },
      { id: "j_12", category: "jobs", categoryLabel: "職業", jp: "裁判官", answer: "thẩm phán", altAnswers: ["tham phan"] },
      { id: "j_13", category: "jobs", categoryLabel: "職業", jp: "料理人 / シェフ", answer: "đầu bếp", altAnswers: ["dau bep"] },
      { id: "j_14", category: "jobs", categoryLabel: "職業", jp: "会社員 / オフィスワーカー", answer: "nhân viên văn phòng", altAnswers: ["nhan vien van phong"] },
      { id: "j_15", category: "jobs", categoryLabel: "職業", jp: "社長 / 支配人", answer: "giám đốc", altAnswers: ["giam doc"] },
      { id: "j_16", category: "jobs", categoryLabel: "職業", jp: "歌手", answer: "ca sĩ", altAnswers: ["ca si"] },
      { id: "j_17", category: "jobs", categoryLabel: "職業", jp: "俳優 / 女優", answer: "diễn viên", altAnswers: ["dien vien"] },
      { id: "j_18", category: "jobs", categoryLabel: "職業", jp: "画家 / イラストレーター", answer: "họa sĩ", altAnswers: ["hoa si"] },
      { id: "j_19", category: "jobs", categoryLabel: "職業", jp: "記者 / ジャーナリスト", answer: "nhà báo", altAnswers: ["nha bao"] },
      { id: "j_20", category: "jobs", categoryLabel: "職業", jp: "写真家 / カメラマン", answer: "nhiếp ảnh gia", altAnswers: ["nhiep anh gia"] },
      { id: "j_21", category: "jobs", categoryLabel: "職業", jp: "パイロット", answer: "phi công", altAnswers: ["phi cong"] },
      { id: "j_22", category: "jobs", categoryLabel: "職業", jp: "客室乗務員 (CA)", answer: "tiếp viên hàng không", altAnswers: ["tiep vien hang khong"] },
      { id: "j_23", category: "jobs", categoryLabel: "職業", jp: "運転手 / ドライバー", answer: "tài xế", altAnswers: ["tai xe"] },
      { id: "j_24", category: "jobs", categoryLabel: "職業", jp: "理容師 / 美容師", answer: "thợ cắt tóc", altAnswers: ["tho cat toc"] },
      { id: "j_25", category: "jobs", categoryLabel: "職業", jp: "仕立て屋 / 裁縫師", answer: "thợ may", altAnswers: ["tho may"] },
      { id: "j_26", category: "jobs", categoryLabel: "職業", jp: "電気技師", answer: "thợ điện", altAnswers: ["tho dien"] },
      { id: "j_27", category: "jobs", categoryLabel: "職業", jp: "大工", answer: "thợ mộc", altAnswers: ["tho moc"] },
      { id: "j_28", category: "jobs", categoryLabel: "職業", jp: "農家 / 農業従事者", answer: "nông dân", altAnswers: ["nong dan"] },
      { id: "j_29", category: "jobs", categoryLabel: "職業", jp: "漁師", answer: "ngư dân", altAnswers: ["ngu dan"] },
      { id: "j_30", category: "jobs", categoryLabel: "職業", jp: "警備員 / セキュリティ", answer: "bảo vệ", altAnswers: ["bao ve"] },
      { id: "j_31", category: "jobs", categoryLabel: "職業", jp: "ウェイター / 給仕", answer: "phục vụ", altAnswers: ["phuc vu"] },
      { id: "j_32", category: "jobs", categoryLabel: "職業", jp: "ツアーガイド", answer: "hướng dẫn viên", altAnswers: ["huong dan vien"] },
      { id: "j_33", category: "jobs", categoryLabel: "職業", jp: "建築家", answer: "kiến trúc sư", altAnswers: ["kien truc su"] },
      { id: "j_34", category: "jobs", categoryLabel: "職業", jp: "会計士", answer: "kế toán", altAnswers: ["ke toan"] },
      { id: "j_35", category: "jobs", categoryLabel: "職業", jp: "薬剤師", answer: "dược sĩ", altAnswers: ["duoc si"] },
      { id: "j_36", category: "jobs", categoryLabel: "職業", jp: "歯科医 (歯医者)", answer: "nha sĩ", altAnswers: ["nha si"] },
      { id: "j_37", category: "jobs", categoryLabel: "職業", jp: "通訳者", answer: "phiên dịch viên", altAnswers: ["phien dich vien"] },
      { id: "j_38", category: "jobs", categoryLabel: "職業", jp: "翻訳家", answer: "dịch giả", altAnswers: ["dich gia"] },
      { id: "j_39", category: "jobs", categoryLabel: "職業", jp: "科学者", answer: "nhà khoa học", altAnswers: ["nha khoa hoc"] },
      { id: "j_40", category: "jobs", categoryLabel: "職業", jp: "アスリート / 運動選手", answer: "vận động viên", altAnswers: ["van dong vien"] },
      { id: "j_41", category: "jobs", categoryLabel: "職業", jp: "実業家 / 起業家", answer: "doanh nhân", altAnswers: ["doanh nhan"] },
      { id: "j_42", category: "jobs", categoryLabel: "職業", jp: "販売員 / 店員", answer: "nhân viên bán hàng", altAnswers: ["nhan vien ban hang"] },
      { id: "j_43", category: "jobs", categoryLabel: "職業", jp: "自動車整備士", answer: "thợ sửa xe", altAnswers: ["tho sua xe"] },
      { id: "j_44", category: "jobs", categoryLabel: "職業", jp: "モデル", answer: "người mẫu", altAnswers: ["nguoi mau"] },
      { id: "j_45", category: "jobs", categoryLabel: "職業", jp: "デザイナー", answer: "nhà thiết kế", altAnswers: ["nha thiet ke"] },
      { id: "j_46", category: "jobs", categoryLabel: "職業", jp: "秘書", answer: "thư ký", altAnswers: ["thu ky"] },
      { id: "j_47", category: "jobs", categoryLabel: "職業", jp: "司書 (図書館員)", answer: "thủ thư", altAnswers: ["thu thu"] },
      { id: "j_48", category: "jobs", categoryLabel: "職業", jp: "政治家", answer: "chính trị gia", altAnswers: ["chinh tri gia"] },
      { id: "j_49", category: "jobs", categoryLabel: "職業", jp: "宇宙飛行士", answer: "phi hành gia", altAnswers: ["phi hanh gia"] },
      { id: "j_50", category: "jobs", categoryLabel: "職業", jp: "アシスタント / 助手", answer: "trợ lý", altAnswers: ["tro ly"] },

      // === CATEGORY: BUILDINGS & PLACES (50 Words) ===
      { id: "b_01", category: "buildings", categoryLabel: "建物・場所", jp: "学校", answer: "trường học", altAnswers: ["truong hoc"] },
      { id: "b_02", category: "buildings", categoryLabel: "建物・場所", jp: "病院", answer: "bệnh viện", altAnswers: ["benh vien"] },
      { id: "b_03", category: "buildings", categoryLabel: "建物・場所", jp: "銀行", answer: "ngân hàng", altAnswers: ["ngan hang"] },
      { id: "b_04", category: "buildings", categoryLabel: "建物・場所", jp: "会社 / 企業", answer: "công ty", altAnswers: ["cong ty"] },
      { id: "b_05", category: "buildings", categoryLabel: "建物・場所", jp: "郵便局", answer: "bưu điện", altAnswers: ["buu dien"] },
      { id: "b_06", category: "buildings", categoryLabel: "建物・場所", jp: "スーパーマーケット", answer: "siêu thị", altAnswers: ["sieu thi"] },
      { id: "b_07", category: "buildings", categoryLabel: "建物・場所", jp: "市場 (マーケット)", answer: "chợ", altAnswers: ["cho"] },
      { id: "b_08", category: "buildings", categoryLabel: "建物・場所", jp: "レストラン", answer: "nhà hàng", altAnswers: ["nha hang"] },
      { id: "b_09", category: "buildings", categoryLabel: "建物・場所", jp: "カフェ / 喫茶店", answer: "quán cà phê", altAnswers: ["quan ca phe"] },
      { id: "b_10", category: "buildings", categoryLabel: "建物・場所", jp: "ホテル", answer: "khách sạn", altAnswers: ["khach san"] },
      { id: "b_11", category: "buildings", categoryLabel: "建物・場所", jp: "空港", answer: "sân bay", altAnswers: ["san bay"] },
      { id: "b_12", category: "buildings", categoryLabel: "建物・場所", jp: "駅 (鉄道)", answer: "nhà ga", altAnswers: ["nha ga"] },
      { id: "b_13", category: "buildings", categoryLabel: "建物・場所", jp: "バスターミナル / バス停", answer: "bến xe", altAnswers: ["ben xe"] },
      { id: "b_14", category: "buildings", categoryLabel: "建物・場所", jp: "公園", answer: "công viên", altAnswers: ["cong vien"] },
      { id: "b_15", category: "buildings", categoryLabel: "建物・場所", jp: "博物館 / 美術館", answer: "bảo tàng", altAnswers: ["bao tang"] },
      { id: "b_16", category: "buildings", categoryLabel: "建物・場所", jp: "図書館", answer: "thư viện", altAnswers: ["thu vien"] },
      { id: "b_17", category: "buildings", categoryLabel: "建物・場所", jp: "映画館", answer: "rạp chiếu phim", altAnswers: ["rap chieu phim"] },
      { id: "b_18", category: "buildings", categoryLabel: "建物・場所", jp: "ショッピングモール", answer: "trung tâm thương mại", altAnswers: ["trung tam thuong mai"] },
      { id: "b_19", category: "buildings", categoryLabel: "建物・場所", jp: "書店 / 本屋", answer: "nhà sách", altAnswers: ["nha sach", "tiệm sách"] },
      { id: "b_20", category: "buildings", categoryLabel: "建物・場所", jp: "薬局 / ドラッグストア", answer: "nhà thuốc", altAnswers: ["nha thuoc", "tiệm thuốc"] },
      { id: "b_21", category: "buildings", categoryLabel: "建物・場所", jp: "コンビニ", answer: "cửa hàng tiện lợi", altAnswers: ["cua hang tien loi"] },
      { id: "b_22", category: "buildings", categoryLabel: "建物・場所", jp: "警察署", answer: "đồn cảnh sát", altAnswers: ["don canh sat"] },
      { id: "b_23", category: "buildings", categoryLabel: "建物・場所", jp: "消防署", answer: "trạm chữa cháy", altAnswers: ["tram chua chay"] },
      { id: "b_24", category: "buildings", categoryLabel: "建物・場所", jp: "ビル / 建築物", answer: "tòa nhà", altAnswers: ["toa nha"] },
      { id: "b_25", category: "buildings", categoryLabel: "建物・場所", jp: "マンション / アパート", answer: "chung cư", altAnswers: ["chung cu"] },
      { id: "b_26", category: "buildings", categoryLabel: "建物・場所", jp: "教会", answer: "nhà thờ", altAnswers: ["nha tho"] },
      { id: "b_27", category: "buildings", categoryLabel: "建物・場所", jp: "寺院 / お寺", answer: "chùa", altAnswers: ["chua"] },
      { id: "b_28", category: "buildings", categoryLabel: "建物・場所", jp: "大使館", answer: "đại sứ quán", altAnswers: ["dai su quan"] },
      { id: "b_29", category: "buildings", categoryLabel: "建物・場所", jp: "市役所 / 区役所", answer: "ủy ban nhân dân", altAnswers: ["uy ban nhan dan"] },
      { id: "b_30", category: "buildings", categoryLabel: "建物・場所", jp: "倉庫 / 納屋", answer: "nhà kho", altAnswers: ["nha kho"] },
      { id: "b_31", category: "buildings", categoryLabel: "建物・場所", jp: "工場", answer: "nhà máy", altAnswers: ["nha may"] },
      { id: "b_32", category: "buildings", categoryLabel: "建物・場所", jp: "オフィス / 事務所", answer: "văn phòng", altAnswers: ["van phong"] },
      { id: "b_33", category: "buildings", categoryLabel: "建物・場所", jp: "スポーツジム", answer: "phòng tập gym", altAnswers: ["phong tap gym"] },
      { id: "b_34", category: "buildings", categoryLabel: "建物・場所", jp: "スイミングプール", answer: "hồ bơi", altAnswers: ["ho boi"] },
      { id: "b_35", category: "buildings", categoryLabel: "建物・場所", jp: "競技場 / スタジアム", answer: "sân vận động", altAnswers: ["san van dong"] },
      { id: "b_36", category: "buildings", categoryLabel: "建物・場所", jp: "パン屋", answer: "tiệm bánh", altAnswers: ["tiem banh"] },
      { id: "b_37", category: "buildings", categoryLabel: "建物・場所", jp: "床屋 / 美容室", answer: "tiệm cắt tóc", altAnswers: ["tiem cat toc"] },
      { id: "b_38", category: "buildings", categoryLabel: "建物・場所", jp: "クリーニング店", answer: "tiệm giặt ủi", altAnswers: ["tiem giat ui"] },
      { id: "b_39", category: "buildings", categoryLabel: "建物・場所", jp: "食堂 / 大衆食堂", answer: "quán ăn", altAnswers: ["quan an"] },
      { id: "b_40", category: "buildings", categoryLabel: "建物・場所", jp: "駐車場", answer: "bãi đỗ xe", altAnswers: ["bai do xe"] },
      { id: "b_41", category: "buildings", categoryLabel: "建物・場所", jp: "ガソリンスタンド", answer: "cây xăng", altAnswers: ["cay xang"] },
      { id: "b_42", category: "buildings", categoryLabel: "建物・場所", jp: "テレビ局", answer: "đài truyền hình", altAnswers: ["dai truyen hinh"] },
      { id: "b_43", category: "buildings", categoryLabel: "建物・場所", jp: "農場 / 牧場", answer: "trang trại", altAnswers: ["trang trai"] },
      { id: "b_44", category: "buildings", categoryLabel: "建物・場所", jp: "動物園", answer: "vườn thú", altAnswers: ["vuon thu"] },
      { id: "b_45", category: "buildings", categoryLabel: "建物・場所", jp: "水族館", answer: "thủy cung", altAnswers: ["thuy cung"] },
      { id: "b_46", category: "buildings", categoryLabel: "建物・場所", jp: "遊園地 / テーマパーク", answer: "khu vui chơi", altAnswers: ["khu vui choi"] },
      { id: "b_47", category: "buildings", categoryLabel: "建物・場所", jp: "港 / 埠頭", answer: "cảng", altAnswers: ["cang"] },
      { id: "b_48", category: "buildings", categoryLabel: "建物・場所", jp: "ラジオ局", answer: "đài phát thanh", altAnswers: ["dai phat thanh"] },
      { id: "b_49", category: "buildings", categoryLabel: "建物・場所", jp: "研究所", answer: "viện nghiên cứu", altAnswers: ["vien nghien cuu"] },
      { id: "b_50", category: "buildings", categoryLabel: "建物・場所", jp: "裁判所", answer: "tòa án", altAnswers: ["toa an"] },

      // === OTHER CATEGORIES ===
      { id: "p1", category: "pronouns", categoryLabel: "代名詞", jp: "私 (フォーマル)", answer: "tôi", altAnswers: ["toi"] },
      { id: "p2", category: "pronouns", categoryLabel: "代名詞", jp: "あなた (同世代・友人)", answer: "bạn", altAnswers: ["ban"] },
      { id: "p3", category: "pronouns", categoryLabel: "代名詞", jp: "あなた / 彼 (年上の男性)", answer: "anh", altAnswers: [] },
      { id: "p4", category: "pronouns", categoryLabel: "代名詞", jp: "あなた / 彼女 (年上の女性)", answer: "chị", altAnswers: ["chi"] },
      { id: "p5", category: "pronouns", categoryLabel: "代名詞", jp: "私 / あなた (年下の相手)", answer: "em", altAnswers: [] },
      { id: "p6", category: "pronouns", categoryLabel: "代名詞", jp: "誰", answer: "ai", altAnswers: [] },
      { id: "p7", category: "pronouns", categoryLabel: "代名詞", jp: "何", answer: "gì", altAnswers: ["gi"] },
      { id: "p8", category: "pronouns", categoryLabel: "代名詞", jp: "どこ", answer: "đâu", altAnswers: ["dau"] },
      { id: "p9", category: "pronouns", categoryLabel: "代名詞", jp: "なぜ / どうして", answer: "tại sao", altAnswers: ["tai sao"] },

      { id: "v1", category: "verbs", categoryLabel: "動詞", jp: "行く", answer: "đi", altAnswers: ["di"] },
      { id: "v2", category: "verbs", categoryLabel: "動詞", jp: "来る / 到着する", answer: "đến", altAnswers: ["den"] },
      { id: "v3", category: "verbs", categoryLabel: "動詞", jp: "帰る / 戻る", answer: "về", altAnswers: ["ve"] },
      { id: "v4", category: "verbs", categoryLabel: "動詞", jp: "食べる", answer: "ăn", altAnswers: ["an"] },
      { id: "v5", category: "verbs", categoryLabel: "動詞", jp: "飲む", answer: "uống", altAnswers: ["uong"] },
      { id: "v6", category: "verbs", categoryLabel: "動詞", jp: "話す / 言う", answer: "nói", altAnswers: ["noi"] },
      { id: "v7", category: "verbs", categoryLabel: "動詞", jp: "聞く", answer: "nghe", altAnswers: [] },
      { id: "v8", category: "verbs", categoryLabel: "動詞", jp: "見る / 観る", answer: "xem", altAnswers: ["nhìn", "nhin"] },
      { id: "v9", category: "verbs", categoryLabel: "動詞", jp: "知っている", answer: "biết", altAnswers: ["biet"] },
      { id: "v10", category: "verbs", categoryLabel: "動詞", jp: "理解する / 分かる", answer: "hiểu", altAnswers: ["hieu"] },
      { id: "v11", category: "verbs", categoryLabel: "動詞", jp: "買う", answer: "mua", altAnswers: [] },
      { id: "v12", category: "verbs", categoryLabel: "動詞", jp: "欲しい / 〜したい", answer: "muốn", altAnswers: ["muon"] },
      { id: "v13", category: "verbs", categoryLabel: "動詞", jp: "する / 作る / 働く", answer: "làm", altAnswers: ["lam"] },

      { id: "n1", category: "nouns", categoryLabel: "名詞", jp: "水", answer: "nước", altAnswers: ["nuoc"] },
      { id: "n2", category: "nouns", categoryLabel: "名詞", jp: "ご飯 / ごちそう", answer: "cơm", altAnswers: ["com"] },
      { id: "n3", category: "nouns", categoryLabel: "名詞", jp: "家 / 住宅", answer: "nhà", altAnswers: ["nha"] },
      { id: "n4", category: "nouns", categoryLabel: "名詞", jp: "お金", answer: "tiền", altAnswers: ["tien"] },
      { id: "n5", category: "nouns", categoryLabel: "名詞", jp: "車 / 乗り物", answer: "xe", altAnswers: [] },
      { id: "n6", category: "nouns", categoryLabel: "名詞", jp: "時間", answer: "thời gian", altAnswers: ["thoi gian"] },
      { id: "n7", category: "nouns", categoryLabel: "名詞", jp: "今日", answer: "hôm nay", altAnswers: ["hom nay"] },
      { id: "n8", category: "nouns", categoryLabel: "名詞", jp: "明日", answer: "ngày mai", altAnswers: ["ngay mai"] },
      { id: "n9", category: "nouns", categoryLabel: "名詞", jp: "昨日", answer: "hôm qua", altAnswers: ["hom qua"] },
      { id: "n10", category: "nouns", categoryLabel: "名詞", jp: "友達", answer: "bạn", altAnswers: ["ban"] },

      { id: "a1", category: "adjectives", categoryLabel: "形容詞", jp: "美味しい", answer: "ngon", altAnswers: [] },
      { id: "a2", category: "adjectives", categoryLabel: "形容詞", jp: "良い / 上級の", answer: "tốt", altAnswers: ["tot"] },
      { id: "a3", category: "adjectives", categoryLabel: "形容詞", jp: "美しい / 綺麗な", answer: "đẹp", altAnswers: ["dep"] },
      { id: "a4", category: "adjectives", categoryLabel: "形容詞", jp: "多い / たくさん", answer: "nhiều", altAnswers: ["nhieu"] },
      { id: "a5", category: "adjectives", categoryLabel: "形容詞", jp: "少ない", answer: "ít", altAnswers: ["it"] },
      { id: "a6", category: "adjectives", categoryLabel: "形容詞", jp: "高い (価格)", answer: "đắt", altAnswers: ["mắc", "dat", "mac"] },
      { id: "a7", category: "adjectives", categoryLabel: "形容詞", jp: "安い", answer: "rẻ", altAnswers: ["re"] },
      { id: "a8", category: "adjectives", categoryLabel: "形容詞", jp: "忙しい", answer: "bận", altAnswers: ["ban"] },
      { id: "a9", category: "adjectives", categoryLabel: "形容詞", jp: "疲れた", answer: "mệt", altAnswers: ["met"] },
      { id: "a10", category: "adjectives", categoryLabel: "形容詞", jp: "暑い", answer: "nóng", altAnswers: ["nong"] },
      { id: "a11", category: "adjectives", categoryLabel: "形容詞", jp: "寒い / 冷たい", answer: "lạnh", altAnswers: ["lanh"] }
    ];

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
            ${answerState.userInput ? `<div class="text-xs text-rose-700 mt-1">あなたの入力: "${answerState.userInput}"</div>` : ''}
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
