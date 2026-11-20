/* The Wine Goat · home quiz: a fixed 20-question level check per theme (wine, beer, spirits, sake, mix).
   Added to every home by tools/home_quiz_themes.py. The hero "quick quiz" button opens a dialog:
   pick a theme → its 20 multiple-choice questions, always the same ones in the same order (a curated set spread over the
   topics of the theme, chosen in tools/homequiz/set.txt; mix = a fixed 8 wine, 5 spirits, 4 beer, 3 sake), with the
   progress n/20. Only the order of the answer options changes. Nothing is revealed on the home: no right/wrong, no
   correct option, no explanation, no score; each answer is only recorded (index of the chosen option). The run is saved
   in localStorage (twg-hq-run2): closing the dialog and coming back resumes it.
   At the end the result (theme, score, per-topic breakdown, answers, time) is saved in localStorage
   (twg-hq-result, same origin as /app) and the visitor is sent to the app sign-up; the app shows the result screen
   (app/hqresult.js). Questions: /assets/homequiz/<lang>.json, built by tools/homequiz/build.py, one file per home language.
   Without JavaScript the button keeps its normal link to the app. */
(function () {
  'use strict';
  if (window.TWG_HQ) return; window.TWG_HQ = 3;
  var THEMES = [['wine', '🍷'], ['beer', '🍺'], ['spirits', '🥃'], ['sake', '🍶'], ['mix', '🎲']];
  var N = 20 /* questions per theme, as announced in the texts; the questions themselves come from set.txt via the JSON */, KEY = 'twg-hq-theme', RUN = 'twg-hq-run2' /* answers = index of the chosen option (0 = the correct one) */, RES = 'twg-hq-result', QV = 3;
  var L = {
    en: ['Pick your quiz', '10 quick questions. Choose a theme:', 'Wine', 'Beer', 'Spirits', 'Sake', 'Mix', 'Grapes, regions, styles', 'Ales, lagers, hops', 'Whisky, gin, rum, agave', 'Rice, koji, styles', 'A bit of everything', 'Last time', 'Close', 'Change theme', 'Play again', 'See my score', 'Keep learning about wine in the app', 'Try the Spirits course', 'Open the app', 'The quiz could not load. Please try again.'],
    it: ['Scegli il tuo quiz', '10 domande veloci. Scegli un tema:', 'Vino', 'Birra', 'Distillati', 'Sake', 'Mix', 'Vitigni, regioni, stili', 'Ale, lager, luppolo', 'Whisky, gin, rum, agave', 'Riso, koji, stili', 'Un po’ di tutto', 'L’ultima volta', 'Chiudi', 'Cambia tema', 'Gioca ancora', 'Vedi il punteggio', 'Continua con il vino nell’app', 'Prova il corso Distillati', 'Apri l’app', 'Il quiz non si è caricato. Riprova.'],
    fr: ['Choisissez votre quiz', '10 questions rapides. Choisissez un thème :', 'Vin', 'Bière', 'Spiritueux', 'Saké', 'Mix', 'Cépages, régions, styles', 'Ales, lagers, houblon', 'Whisky, gin, rhum, agave', 'Riz, koji, styles', 'Un peu de tout', 'La dernière fois', 'Fermer', 'Changer de thème', 'Rejouer', 'Voir mon score', 'Continuez le vin dans l’appli', 'Essayez le cours Spiritueux', 'Ouvrir l’appli', 'Le quiz n’a pas pu se charger. Réessayez.'],
    es: ['Elige tu quiz', '10 preguntas rápidas. Elige un tema:', 'Vino', 'Cerveza', 'Destilados', 'Sake', 'Mix', 'Uvas, regiones, estilos', 'Ales, lagers, lúpulo', 'Whisky, ginebra, ron, agave', 'Arroz, koji, estilos', 'Un poco de todo', 'La última vez', 'Cerrar', 'Cambiar de tema', 'Jugar otra vez', 'Ver mi resultado', 'Sigue con el vino en la app', 'Prueba el curso de destilados', 'Abrir la app', 'No se pudo cargar el quiz. Inténtalo de nuevo.'],
    'es-ar': ['Elegí tu quiz', '10 preguntas rápidas. Elegí un tema:', 'Vino', 'Cerveza', 'Destilados', 'Sake', 'Mix', 'Uvas, regiones, estilos', 'Ales, lagers, lúpulo', 'Whisky, gin, ron, agave', 'Arroz, koji, estilos', 'Un poco de todo', 'La última vez', 'Cerrar', 'Cambiar de tema', 'Jugar de nuevo', 'Ver mi resultado', 'Seguí con el vino en la app', 'Probá el curso de destilados', 'Abrir la app', 'No se pudo cargar el quiz. Probá de nuevo.'],
    de: ['Wähle dein Quiz', '10 schnelle Fragen. Wähle ein Thema:', 'Wein', 'Bier', 'Spirituosen', 'Sake', 'Mix', 'Rebsorten, Regionen, Stile', 'Ale, Lager, Hopfen', 'Whisky, Gin, Rum, Agave', 'Reis, Koji, Stile', 'Von allem etwas', 'Letztes Mal', 'Schließen', 'Thema wechseln', 'Nochmal spielen', 'Ergebnis ansehen', 'Mit Wein in der App weiterlernen', 'Spirituosen-Kurs ausprobieren', 'App öffnen', 'Das Quiz konnte nicht geladen werden. Bitte versuche es erneut.'],
    nl: ['Kies je quiz', '10 snelle vragen. Kies een thema:', 'Wijn', 'Bier', 'Gedistilleerd', 'Sake', 'Mix', 'Druiven, regio’s, stijlen', 'Ales, lagers, hop', 'Whisky, gin, rum, agave', 'Rijst, koji, stijlen', 'Van alles wat', 'Vorige keer', 'Sluiten', 'Ander thema', 'Opnieuw spelen', 'Bekijk mijn score', 'Verder met wijn in de app', 'Probeer de cursus gedistilleerd', 'Open de app', 'De quiz kon niet laden. Probeer het opnieuw.'],
    pl: ['Wybierz quiz', '10 szybkich pytań. Wybierz temat:', 'Wino', 'Piwo', 'Alkohole mocne', 'Sake', 'Mix', 'Szczepy, regiony, style', 'Ale, lagery, chmiel', 'Whisky, gin, rum, agawa', 'Ryż, koji, style', 'Wszystkiego po trochu', 'Ostatnio', 'Zamknij', 'Zmień temat', 'Zagraj ponownie', 'Zobacz wynik', 'Ucz się dalej o winie w aplikacji', 'Wypróbuj kurs alkoholi mocnych', 'Otwórz aplikację', 'Nie udało się wczytać quizu. Spróbuj ponownie.'],
    pt: ['Escolha o seu quiz', '10 perguntas rápidas. Escolha um tema:', 'Vinho', 'Cerveja', 'Destilados', 'Saké', 'Mix', 'Castas, regiões, estilos', 'Ales, lagers, lúpulo', 'Whisky, gin, rum, agave', 'Arroz, koji, estilos', 'Um pouco de tudo', 'Da última vez', 'Fechar', 'Mudar de tema', 'Jogar outra vez', 'Ver a minha pontuação', 'Continue com o vinho na app', 'Experimente o curso de destilados', 'Abrir a app', 'Não foi possível carregar o quiz. Tente novamente.'],
    'pt-br': ['Escolha seu quiz', '10 perguntas rápidas. Escolha um tema:', 'Vinho', 'Cerveja', 'Destilados', 'Saquê', 'Mix', 'Uvas, regiões, estilos', 'Ales, lagers, lúpulo', 'Uísque, gim, rum, agave', 'Arroz, koji, estilos', 'Um pouco de tudo', 'Da última vez', 'Fechar', 'Trocar de tema', 'Jogar de novo', 'Ver minha pontuação', 'Continue com vinho no app', 'Experimente o curso de destilados', 'Abrir o app', 'Não foi possível carregar o quiz. Tente de novo.'],
    ru: ['Выберите квиз', '10 быстрых вопросов. Выберите тему:', 'Вино', 'Пиво', 'Крепкие напитки', 'Саке', 'Микс', 'Сорта, регионы, стили', 'Эли, лагеры, хмель', 'Виски, джин, ром, агава', 'Рис, кодзи, стили', 'Всего понемногу', 'В прошлый раз', 'Закрыть', 'Сменить тему', 'Сыграть ещё', 'Мой результат', 'Изучать вино дальше в приложении', 'Попробовать курс по крепким напиткам', 'Открыть приложение', 'Не удалось загрузить квиз. Попробуйте ещё раз.'],
    el: ['Διάλεξε κουίζ', '10 γρήγορες ερωτήσεις. Διάλεξε θέμα:', 'Κρασί', 'Μπίρα', 'Αποστάγματα', 'Σάκε', 'Μιξ', 'Ποικιλίες, περιοχές, στιλ', 'Ale, lager, λυκίσκος', 'Ουίσκι, τζιν, ρούμι, αγαύη', 'Ρύζι, κότζι, στιλ', 'Λίγο απ’ όλα', 'Την προηγούμενη φορά', 'Κλείσιμο', 'Αλλαγή θέματος', 'Παίξε ξανά', 'Δες το σκορ σου', 'Συνέχισε με το κρασί στην εφαρμογή', 'Δοκίμασε το μάθημα αποσταγμάτων', 'Άνοιξε την εφαρμογή', 'Το κουίζ δεν φορτώθηκε. Δοκίμασε ξανά.'],
    ja: ['クイズを選ぼう', 'サクッと10問。テーマを選んでください：', 'ワイン', 'ビール', 'スピリッツ', '日本酒', 'ミックス', '品種・産地・スタイル', 'エール・ラガー・ホップ', 'ウイスキー・ジン・ラム・アガベ', '米・麹・スタイル', '全部から少しずつ', '前回', '閉じる', 'テーマを変える', 'もう一度', '結果を見る', 'アプリでワインの学習を続ける', 'スピリッツ講座を試す', 'アプリを開く', 'クイズを読み込めませんでした。もう一度お試しください。'],
    ko: ['퀴즈 고르기', '빠른 10문제. 테마를 고르세요:', '와인', '맥주', '증류주', '사케', '믹스', '품종, 산지, 스타일', '에일, 라거, 홉', '위스키, 진, 럼, 아가베', '쌀, 누룩(코지), 스타일', '조금씩 전부', '지난번 선택', '닫기', '테마 바꾸기', '다시 하기', '점수 보기', '앱에서 와인 공부 계속하기', '증류주 과정 체험하기', '앱 열기', '퀴즈를 불러오지 못했어요. 다시 시도해 주세요.'],
    'zh-hans': ['选择你的测验', '10 道快速题。选择一个主题：', '葡萄酒', '啤酒', '烈酒', '清酒', '混合', '品种、产区、风格', '艾尔、拉格、啤酒花', '威士忌、金酒、朗姆、龙舌兰', '大米、曲、风格', '样样都来一点', '上次选择', '关闭', '换个主题', '再玩一次', '查看得分', '在应用中继续学习葡萄酒', '试试烈酒课程', '打开应用', '测验加载失败，请重试。'],
    'zh-hant': ['選擇你的測驗', '10 道快速題。選擇一個主題：', '葡萄酒', '啤酒', '烈酒', '清酒', '混合', '品種、產區、風格', '艾爾、拉格、啤酒花', '威士忌、琴酒、蘭姆、龍舌蘭', '米、麴、風格', '每樣都來一點', '上次選擇', '關閉', '換個主題', '再玩一次', '查看分數', '在應用程式中繼續學習葡萄酒', '試試烈酒課程', '開啟應用程式', '測驗載入失敗，請再試一次。'],
    ar: ['اختر اختبارك', '10 أسئلة سريعة. اختر موضوعًا:', 'النبيذ', 'البيرة', 'المشروبات الروحية', 'الساكي', 'مزيج', 'العنب والمناطق والأنماط', 'إيل ولاغر وحشيشة الدينار', 'ويسكي وجن ورم وأغاف', 'الأرز والكوجي والأنماط', 'قليل من كل شيء', 'آخر مرة', 'إغلاق', 'تغيير الموضوع', 'العب مجددًا', 'اعرض نتيجتي', 'تابع تعلّم النبيذ في التطبيق', 'جرّب دورة المشروبات الروحية', 'افتح التطبيق', 'تعذّر تحميل الاختبار. حاول مرة أخرى.'],
    th: ['เลือกควิซของคุณ', '10 ข้อสั้นๆ เลือกหัวข้อ:', 'ไวน์', 'เบียร์', 'สุรา', 'สาเก', 'รวมมิตร', 'พันธุ์องุ่น แหล่งผลิต สไตล์', 'เอล ลาเกอร์ ฮอปส์', 'วิสกี้ จิน รัม อากาเว', 'ข้าว โคจิ สไตล์', 'มีทุกอย่างนิดหน่อย', 'ครั้งที่แล้ว', 'ปิด', 'เปลี่ยนหัวข้อ', 'เล่นอีกครั้ง', 'ดูคะแนน', 'เรียนเรื่องไวน์ต่อในแอป', 'ลองคอร์สสุรา', 'เปิดแอป', 'โหลดควิซไม่สำเร็จ กรุณาลองอีกครั้ง'],
    tr: ['Quizini seç', '10 kısa soru. Bir tema seç:', 'Şarap', 'Bira', 'Distile içkiler', 'Sake', 'Karışık', 'Üzümler, bölgeler, stiller', 'Ale, lager, şerbetçiotu', 'Viski, cin, rom, agav', 'Pirinç, koji, stiller', 'Her şeyden biraz', 'Geçen sefer', 'Kapat', 'Temayı değiştir', 'Tekrar oyna', 'Puanımı gör', 'Uygulamada şarapla devam et', 'Distile içkiler kursunu dene', 'Uygulamayı aç', 'Quiz yüklenemedi. Lütfen tekrar dene.']
  };
  /* sub, fin, saved, g_t, g_p, g_b, g_l, g_n, ans */
  var L2 = {
    en: ['{n} exam-style questions. Choose a theme:', 'Finish', 'Your progress is saved: you can close this and pick it up later.', 'All {n} questions done!', 'Create your free account to see your score and your personalised plan.', 'Create my free account', 'I already have an account', 'Your result is saved on this device and is waiting for you in the app.', 'Answer saved.'],
    it: ['{n} domande in stile esame. Scegli un tema:', 'Termina', 'I progressi sono salvati: puoi chiudere e riprendere più tardi.', '{n} domande completate!', 'Crea il tuo account gratuito per vedere il punteggio e il tuo piano personalizzato.', 'Crea il mio account gratuito', 'Ho già un account', 'Il risultato è salvato su questo dispositivo e ti aspetta nell’app.', 'Risposta salvata.'],
    fr: ['{n} questions façon examen. Choisissez un thème :', 'Terminer', 'Votre progression est enregistrée : vous pouvez fermer et reprendre plus tard.', 'Les {n} questions sont terminées !', 'Créez votre compte gratuit pour voir votre score et votre plan personnalisé.', 'Créer mon compte gratuit', 'J’ai déjà un compte', 'Votre résultat est enregistré sur cet appareil et vous attend dans l’appli.', 'Réponse enregistrée.'],
    es: ['{n} preguntas tipo examen. Elige un tema:', 'Terminar', 'Tu progreso se guarda: puedes cerrar y seguir más tarde.', '¡{n} preguntas completadas!', 'Crea tu cuenta gratuita para ver tu puntuación y tu plan personalizado.', 'Crear mi cuenta gratuita', 'Ya tengo una cuenta', 'Tu resultado está guardado en este dispositivo y te espera en la app.', 'Respuesta guardada.'],
    'es-ar': ['{n} preguntas tipo examen. Elegí un tema:', 'Terminar', 'Tu progreso queda guardado: podés cerrar y seguir más tarde.', '¡{n} preguntas completadas!', 'Creá tu cuenta gratuita para ver tu puntaje y tu plan personalizado.', 'Crear mi cuenta gratuita', 'Ya tengo una cuenta', 'Tu resultado está guardado en este dispositivo y te espera en la app.', 'Respuesta guardada.'],
    de: ['{n} Fragen im Prüfungsstil. Wähle ein Thema:', 'Abschließen', 'Dein Fortschritt wird gespeichert: Du kannst schließen und später weitermachen.', 'Alle {n} Fragen geschafft!', 'Erstelle dein kostenloses Konto, um dein Ergebnis und deinen persönlichen Plan zu sehen.', 'Kostenloses Konto erstellen', 'Ich habe schon ein Konto', 'Dein Ergebnis ist auf diesem Gerät gespeichert und wartet in der App auf dich.', 'Antwort gespeichert.'],
    nl: ['{n} vragen in examenstijl. Kies een thema:', 'Afronden', 'Je voortgang wordt bewaard: je kunt sluiten en later verdergaan.', 'Alle {n} vragen klaar!', 'Maak je gratis account aan om je score en je persoonlijke plan te zien.', 'Gratis account aanmaken', 'Ik heb al een account', 'Je resultaat is op dit apparaat bewaard en wacht op je in de app.', 'Antwoord opgeslagen.'],
    pl: ['{n} pytań w stylu egzaminu. Wybierz temat:', 'Zakończ', 'Postęp jest zapisany: możesz zamknąć i wrócić później.', 'Wszystkie pytania za Tobą!', 'Załóż bezpłatne konto, aby zobaczyć swój wynik i spersonalizowany plan.', 'Załóż bezpłatne konto', 'Mam już konto', 'Twój wynik jest zapisany na tym urządzeniu i czeka na Ciebie w aplikacji.', 'Odpowiedź zapisana.'],
    pt: ['{n} perguntas ao estilo de exame. Escolha um tema:', 'Terminar', 'O seu progresso fica guardado: pode fechar e retomar mais tarde.', '{n} perguntas concluídas!', 'Crie a sua conta gratuita para ver a sua pontuação e o seu plano personalizado.', 'Criar a minha conta gratuita', 'Já tenho conta', 'O seu resultado está guardado neste dispositivo e espera por si na app.', 'Resposta guardada.'],
    'pt-br': ['{n} perguntas no estilo de prova. Escolha um tema:', 'Concluir', 'Seu progresso fica salvo: você pode fechar e continuar depois.', '{n} perguntas concluídas!', 'Crie sua conta gratuita para ver sua pontuação e seu plano personalizado.', 'Criar minha conta gratuita', 'Já tenho uma conta', 'Seu resultado está salvo neste dispositivo e espera por você no app.', 'Resposta salva.'],
    ru: ['{n} вопросов в формате экзамена. Выберите тему:', 'Завершить', 'Прогресс сохраняется: можно закрыть и продолжить позже.', 'Все {n} вопросов пройдены!', 'Создайте бесплатный аккаунт, чтобы увидеть результат и персональный план.', 'Создать бесплатный аккаунт', 'У меня уже есть аккаунт', 'Результат сохранён на этом устройстве и ждёт вас в приложении.', 'Ответ сохранён.'],
    el: ['{n} ερωτήσεις σε στιλ εξέτασης. Διάλεξε θέμα:', 'Τέλος', 'Η πρόοδός σου αποθηκεύεται: μπορείς να κλείσεις και να συνεχίσεις αργότερα.', 'Ολοκλήρωσες και τις {n} ερωτήσεις!', 'Φτιάξε τον δωρεάν λογαριασμό σου για να δεις το σκορ και το προσωπικό σου πλάνο.', 'Δημιουργία δωρεάν λογαριασμού', 'Έχω ήδη λογαριασμό', 'Το αποτέλεσμά σου έχει αποθηκευτεί σε αυτή τη συσκευή και σε περιμένει στην εφαρμογή.', 'Η απάντηση αποθηκεύτηκε.'],
    ja: ['試験形式の{n}問。テーマを選んでください：', '終了する', '進み具合は保存されます。閉じても、あとで続きから再開できます。', '{n}問すべて終了！', '無料アカウントを作成すると、スコアとあなた専用の学習プランが見られます。', '無料アカウントを作成', 'アカウントをお持ちの方', '結果はこの端末に保存され、アプリで確認できます。', '回答を保存しました。'],
    ko: ['시험 형식의 {n}문제. 테마를 고르세요:', '마치기', '진행 상황이 저장돼요. 닫았다가 나중에 이어서 할 수 있어요.', '{n}문제를 모두 풀었어요!', '무료 계정을 만들면 점수와 맞춤 학습 플랜을 볼 수 있어요.', '무료 계정 만들기', '이미 계정이 있어요', '결과는 이 기기에 저장되어 앱에서 기다리고 있어요.', '답을 저장했어요.'],
    'zh-hans': ['{n} 道考试风格的题目。选择一个主题：', '完成', '进度会自动保存：可以先关闭，稍后继续。', '{n} 道题全部完成！', '创建免费账号，查看你的得分和个性化学习计划。', '创建免费账号', '我已有账号', '结果已保存在此设备上，在应用中等你查看。', '答案已保存。'],
    'zh-hant': ['{n} 道考試風格的題目。選擇一個主題：', '完成', '進度會自動儲存：可以先關閉，稍後再繼續。', '{n} 道題全部完成！', '建立免費帳號，查看你的分數和個人化學習計畫。', '建立免費帳號', '我已有帳號', '結果已儲存在此裝置上，在應用程式中等你查看。', '答案已儲存。'],
    ar: ['{n} سؤالًا على نمط الامتحان. اختر موضوعًا:', 'إنهاء', 'يُحفظ تقدّمك: يمكنك الإغلاق والمتابعة لاحقًا.', 'أكملت جميع الأسئلة!', 'أنشئ حسابك المجاني لترى نتيجتك وخطتك الشخصية.', 'إنشاء حسابي المجاني', 'لديّ حساب بالفعل', 'نتيجتك محفوظة على هذا الجهاز وبانتظارك في التطبيق.', 'تم حفظ إجابتك.'],
    th: ['{n} ข้อสไตล์ข้อสอบ เลือกหัวข้อ:', 'เสร็จสิ้น', 'ระบบบันทึกความคืบหน้าไว้ให้ ปิดแล้วกลับมาทำต่อภายหลังได้', 'ทำครบ {n} ข้อแล้ว!', 'สร้างบัญชีฟรีเพื่อดูคะแนนและแผนการเรียนเฉพาะคุณ', 'สร้างบัญชีฟรี', 'มีบัญชีอยู่แล้ว', 'ผลลัพธ์ถูกบันทึกไว้ในอุปกรณ์นี้และรอคุณอยู่ในแอป', 'บันทึกคำตอบแล้ว'],
    tr: ['Sınav tarzında {n} soru. Bir tema seç:', 'Bitir', 'İlerlemen kaydedilir: kapatıp daha sonra devam edebilirsin.', '{n} sorunun hepsi tamam!', 'Puanını ve kişisel planını görmek için ücretsiz hesabını oluştur.', 'Ücretsiz hesabımı oluştur', 'Zaten hesabım var', 'Sonucun bu cihazda kayıtlı ve uygulamada seni bekliyor.', 'Cevabın kaydedildi.']
  };
  var K = ['title', 'sub0', 'wine', 'beer', 'spirits', 'sake', 'mix', 'd_wine', 'd_beer', 'd_spirits', 'd_sake', 'd_mix', 'last', 'close', 'change', 'again', 'res', 'cta_wine', 'cta_sp', 'cta_app', 'err'];
  var K2 = ['sub', 'fin', 'saved', 'g_t', 'g_p', 'g_b', 'g_l', 'g_n', 'ans'];
  var hl = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  var LANG = ({ 'pt-pt': 'pt', 'es-419': 'es-ar', 'zh-cn': 'zh-hans', 'zh-tw': 'zh-hant' })[hl] || hl;
  if (!L[LANG]) LANG = L[LANG.split('-')[0]] ? LANG.split('-')[0] : 'en';
  var U = {}; K.forEach(function (k, i) { U[k] = L[LANG][i] || L.en[i]; }); K2.forEach(function (k, i) { U[k] = ((L2[LANG] || L2.en)[i] || L2.en[i]).replace('{n}', N); });
  var SRC = (document.currentScript && document.currentScript.src) || '/assets/homequiz.js';
  var D = {}; try { D = JSON.parse(document.getElementById('home-data').textContent) || {}; } catch (e) {}
  var TX = D.tx || {}, APP = D.app || '/app/';
  var TXE = { m_next: 'Next question' };
  function tx(k) { return TX[k] || TXE[k]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function jGet(k) { try { return JSON.parse(lsGet(k) || 'null'); } catch (e) { return null; } }
  function emo(t) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i][0] === t) return THEMES[i][1]; return ''; }

  /* the app in the language of this home (when the app has it), opening the sign-up window; spirits → the spirits course */
  var APPL = { de: 'de', nl: 'nl', el: 'el', ja: 'ja', ko: 'ko', 'zh-hant': 'zh-hant', pt: 'pt', 'pt-br': 'pt', tr: 'tr', th: 'th', en: 'en', it: 'it', fr: 'fr', es: 'es', 'es-ar': 'es-ar' };
  function appUrl(th, pc, go) {
    var u; try { u = new URL(APP, location.href); } catch (e) { return APP; }
    if (!u.searchParams.get('lang') && APPL[LANG]) u.searchParams.set('lang', APPL[LANG]);
    var lvl = '';
    if (th && !lsGet('twg-level')) lvl = th === 'spirits' ? (pc >= 55 ? 's2' : 's1') : (th === 'wine' || th === 'mix') ? (pc >= 35 ? '2' : '1') : '';
    u.hash = (lvl ? 'lvl=' + lvl + '&' : '') + 'go=' + (go || 'signup');
    return u.pathname + u.search + u.hash;
  }

  var BANK = null, BY = null, loading = null;
  function load() {
    if (BANK) return Promise.resolve(BANK);
    if (loading) return loading;
    var url = new URL('homequiz/' + LANG + '.json?v=' + QV, SRC).href, en = new URL('homequiz/en.json?v=' + QV, SRC).href;
    function get(u) { return fetch(u, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
    loading = get(url).catch(function (e) { if (LANG === 'en') throw e; return get(en); })
      .then(function (j) { BANK = j; BY = {}; ['wine', 'beer', 'spirits', 'sake'].forEach(function (t) { (j[t] || []).forEach(function (q) { q.th = t; BY[q.id] = q; }); }); return j; }, function (e) { loading = null; throw e; });
    return loading;
  }
  var CSS = '.hqz{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}.hqz[hidden]{display:none}' +
    '.hqz-bg{position:absolute;inset:0;background:rgba(43,26,32,.55);backdrop-filter:blur(2px)}' +
    '.hqz-card{position:relative;text-align:start;width:100%;max-width:620px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow:auto;background:#fdf8f3;color:#2b1a20;border-radius:26px;padding:26px 24px 24px;box-shadow:0 30px 70px -20px rgba(62,15,34,.55);font-family:"DM Sans",system-ui,sans-serif;overscroll-behavior:contain}' +
    '.hqz-x{position:absolute;top:12px;inset-inline-end:12px;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#6e1532;font:600 24px/1 system-ui,sans-serif;cursor:pointer;box-shadow:inset 0 0 0 2px #efe3d8}' +
    '.hqz-x:hover{background:#fbe9ee}' +
    '.hqz :focus-visible{outline:3px solid #d4a23a;outline-offset:2px}' +
    '.hqz h2{font:600 26px/1.2 Fraunces,Georgia,serif;color:#3e0f22;margin:0 52px 6px 0;margin-inline:0 52px;text-align:start}' +
    '.hqz-sub{margin:0 0 18px;color:#6b5a5f}' +
    '.hqz-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}' +
    '.hqz-th{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;min-height:118px;padding:16px 10px 14px;border-radius:20px;border:2px solid #efe3d8;background:#fff;color:#2b1a20;font:inherit;cursor:pointer;text-align:center;transition:border-color .15s,transform .15s,box-shadow .15s}' +
    '.hqz-th:hover{border-color:#8c1d40;transform:translateY(-2px);box-shadow:0 12px 22px -14px rgba(140,29,64,.6)}' +
    '.hqz-th.on{border-color:#d4a23a;background:#fffaf0}' +
    '.hqz-th[data-th=mix]{grid-column:1/-1;flex-direction:row;justify-content:center;min-height:0;gap:12px;text-align:start}' +
    '.hqz-ic{font-size:38px;line-height:1.1}.hqz-th[data-th=mix] .hqz-ic{font-size:32px}' +
    '.hqz-tx{display:flex;flex-direction:column;align-items:center;gap:3px}.hqz-th[data-th=mix] .hqz-tx{align-items:flex-start}.hqz-nm{display:block;font:700 18px/1.2 "DM Sans",sans-serif;color:#6e1532}.hqz-ds{display:block;font-size:13px;line-height:1.3;color:#6b5a5f}' +
    '.hqz-last{position:absolute;top:8px;inset-inline-start:8px;padding:2px 8px;border-radius:999px;background:#f3d58c;color:#3e0f22;font-size:11px;font-weight:700}' +
    '.hqz-run{position:absolute;top:8px;inset-inline-end:8px;padding:2px 8px;border-radius:999px;background:#6e1532;color:#fff;font-size:11px;font-weight:700;direction:ltr}' +
    '@media (min-width:600px){.hqz-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}' +
    '.hqz-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 52px 10px 0;margin-inline:0 52px;font-weight:700;color:#6e1532;font-size:14px}' +
    '.hqz-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:#fbe9ee}.hqz-n{direction:ltr;white-space:nowrap}' +
    '.hqz-bar{height:6px;border-radius:6px;background:#efe3d8;overflow:hidden;margin-bottom:16px}.hqz-bar i{display:block;height:100%;background:linear-gradient(90deg,#a3264f,#d4a23a);transition:width .3s}' +
    '.hqz-q{font:600 21px/1.35 Fraunces,Georgia,serif;margin:0 0 14px;color:#2b1a20;overflow-wrap:anywhere}' +
    '.hqz-o{display:block;width:100%;margin:0 0 10px;padding:14px 16px;border-radius:16px;border:2px solid #efe3d8;background:#fffdfb;color:#2b1a20;font:inherit;font-size:16px;text-align:start;cursor:pointer;transition:border-color .15s;overflow-wrap:anywhere}' +
    '.hqz-o:hover:not(:disabled){border-color:#8c1d40}.hqz-o:disabled{cursor:default}' +
    '.hqz-o.sel{border-color:#6e1532;background:#fbe9ee;font-weight:700}.hqz-o:disabled:not(.sel){opacity:.6}' +
    '.hqz-sv{margin:6px 0 14px;font-weight:700;color:#6e1532}' +
    '.hqz-fb{padding:14px 16px;border-radius:16px;background:#fff;box-shadow:inset 0 0 0 2px #efe3d8;margin:6px 0 14px;line-height:1.45;overflow-wrap:anywhere}' +
    '.hqz-fb b{color:#6e1532}' +
    '.hqz-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}' +
    '.hqz .b3{max-width:100%;text-align:center;line-height:1.2}' +
    '.hqz-foot{margin-top:18px;padding-top:12px;border-top:1px solid #efe3d8;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:13px;color:#6b5a5f}' +
    '.hqz-foot span{flex:1 1 200px}.hqz-lk{border:0;background:none;padding:6px 0;font:inherit;font-weight:700;color:#6e1532;text-decoration:underline;cursor:pointer;min-height:32px}' +
    '.hqz-card .hqz-end{text-align:center;padding-top:6px}.hqz-big{font-size:54px;line-height:1;margin:4px 0 6px}' +
    '.hqz-end h2{margin-inline:0;text-align:center}.hqz-end .hqz-row{justify-content:center;margin-top:16px}' +
    '.hqz-end p{margin:10px auto 0;max-width:440px;line-height:1.45}.hqz-end .hqz-gn{font-size:13px;color:#6b5a5f}' +
    '.hqz-qm{width:96px;height:96px;margin:6px auto 12px;border-radius:50%;display:grid;place-items:center;background:#fbe9ee;box-shadow:inset 0 0 0 6px #efe3d8;font:700 22px/1 Fraunces,Georgia,serif;color:#6e1532}' +
    '.hqz-err{color:#c62828}' +
    '@media (max-width:420px){.hqz{padding:10px}.hqz-card{padding:22px 16px 18px;border-radius:22px;max-height:calc(100dvh - 20px)}.hqz h2{font-size:22px}.hqz-q{font-size:19px}.hqz-th{min-height:106px;padding:14px 8px 12px}.hqz-ic{font-size:34px}.hqz .b3{width:100%}}' +
    '@media (prefers-reduced-motion:reduce){.hqz-th,.hqz-bar i{transition:none}.hqz-th:hover{transform:none}}' +
    'html.hqz-lock{overflow:hidden}';

  var box, card, body, opener = null, theme = null, qs = [], ans = [], i = 0;
  /* saved runs: { theme: { ids:[…], a:[1,0,…], ts } } */
  function runs() { var r = jGet(RUN); return r && typeof r === 'object' ? r : {}; }
  function runOf(t) { var r = runs()[t]; return r && r.ids && r.a && r.ids.length && r.a.length < r.ids.length ? r : null; }
  function saveRun() { var r = runs(); r[theme] = { ids: qs.map(function (q) { return q.id; }), a: ans, ts: Date.now() }; lsSet(RUN, JSON.stringify(r)); }
  function dropRun(t) { var r = runs(); delete r[t]; lsSet(RUN, JSON.stringify(r)); }
  function pending(t) { var r = jGet(RES); return r && r.theme === t && !r.seen ? r : null; }

  function build() {
    if (box) return;
    var st = document.createElement('style'); st.id = 'hqz-css'; st.textContent = CSS; document.head.appendChild(st);
    box = document.createElement('div'); box.className = 'hqz'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'hqz-t');
    box.innerHTML = '<div class="hqz-bg" data-hqz-close></div><div class="hqz-card"><button type="button" class="hqz-x" data-hqz-close aria-label="' + esc(U.close) + '">×</button><div class="hqz-body"></div></div>';
    document.body.appendChild(box);
    card = box.querySelector('.hqz-card'); body = box.querySelector('.hqz-body');
    box.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-hqz-close]')) { close(); return; }
      if (t.closest('a[href]')) { close(); return; }  /* going to the app: let the page's own link handling (e.g. the language note) run */
      var th = t.closest('.hqz-th'); if (th) { start(th.getAttribute('data-th')); return; }
      var o = t.closest('.hqz-o'); if (o && !o.disabled) { answer(o); return; }
      if (t.closest('[data-hqz-next]')) { i++; draw(); return; }
      if (t.closest('[data-hqz-again]')) { start(theme, true); return; }
      if (t.closest('[data-hqz-pick]')) { picker(); return; }
      if (t.closest('[data-hqz-retry]')) { start(theme); return; }
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(card.querySelectorAll('button:not(:disabled),a[href]')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === a || !card.contains(document.activeElement) || document.activeElement.tabIndex < 0)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
  }
  function focusFirst(sel) { var el = body.querySelector(sel); if (el) try { el.focus({ preventScroll: false }); } catch (e) { el.focus(); } card.scrollTop = 0; }
  function open(btn) {
    build(); opener = btn || null;
    box.hidden = false; document.documentElement.classList.add('hqz-lock');
    picker(); load().catch(function () {});
  }
  function close() {
    if (!box || box.hidden) return;
    box.hidden = true; document.documentElement.classList.remove('hqz-lock');
    if (opener) try { opener.focus(); } catch (e) {}
  }
  function picker() {
    var last = lsGet(KEY);
    body.innerHTML = '<h2 id="hqz-t">' + esc(U.title) + '</h2><p class="hqz-sub">' + esc(U.sub) + '</p><div class="hqz-grid">' +
      THEMES.map(function (t) {
        var on = t[0] === last, r = runOf(t[0]), done = !r && pending(t[0]);
        return '<button type="button" class="hqz-th' + (on ? ' on' : '') + '" data-th="' + t[0] + '">' + (on ? '<span class="hqz-last">' + esc(U.last) + '</span>' : '') +
          (r ? '<span class="hqz-run">▶ ' + r.a.length + '/' + r.ids.length + '</span>' : done ? '<span class="hqz-run">✓ ' + done.total + '/' + done.total + '</span>' : '') +
          '<span class="hqz-ic" aria-hidden="true">' + t[1] + '</span><span class="hqz-tx"><span class="hqz-nm">' + esc(U[t[0]]) + '</span><span class="hqz-ds">' + esc(U['d_' + t[0]]) + '</span></span></button>';
      }).join('') + '</div><p class="hqz-sub" style="margin:14px 0 0;font-size:13px">' + esc(U.saved) + '</p>';
    focusFirst(last ? '.hqz-th.on' : '.hqz-th');
  }
  function start(t, fresh) {
    theme = t; lsSet(KEY, t);
    body.innerHTML = '<p class="hqz-sub" aria-live="polite">…</p>';
    load().then(function (B) {
      /* the fixed set of the theme, in its order (the same questions every time) */
      var pool = (t === 'mix' ? (B.mix || []).map(function (id) { return BY[id]; }) : (B[t] || []).slice()).filter(Boolean);
      if (!pool.length) throw new Error('empty');
      var r = fresh ? null : runOf(t);
      if (r && r.ids.join() !== pool.map(function (q) { return q.id; }).join()) r = null;   /* the set changed since: start again */
      if (!r && !fresh && pending(t)) { qs = []; ans = []; return gate(pending(t)); }
      qs = pool; ans = r ? r.a.slice(0, pool.length) : []; i = ans.length; saveRun(); draw();
    }).catch(function () {
      body.innerHTML = '<h2 id="hqz-t">' + esc(U.title) + '</h2><p class="hqz-err" role="alert">' + esc(U.err) + '</p><div class="hqz-row"><button type="button" class="b3 b3p sm" data-hqz-retry>↻</button><button type="button" class="b3 b3g sm" data-hqz-pick>' + esc(U.change) + '</button></div>';
      focusFirst('[data-hqz-retry]');
    });
  }
  function draw() {
    if (i >= qs.length) return finish();
    var q = qs[i], ord = shuffle(q.o.map(function (_, k) { return k; })), QL = q.x ? ' lang="en" dir="auto"' : '';
    body.innerHTML = '<div class="hqz-head"><span class="hqz-chip"><span aria-hidden="true">' + emo(q.th) + '</span>' + esc(U[q.th]) + '</span><span class="hqz-n">' + (i + 1) + ' / ' + qs.length + '</span></div>' +
      '<div class="hqz-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + qs.length + '" aria-valuenow="' + i + '"><i style="width:' + (i / qs.length * 100) + '%"></i></div>' +
      '<h2 class="hqz-q" id="hqz-t" tabindex="-1"' + QL + '>' + esc(q.q) + '</h2>' +
      ord.map(function (k) { return '<button type="button" class="hqz-o" data-o="' + k + '"' + QL + '>' + esc(q.o[k]) + '</button>'; }).join('') +
      '<div class="hqz-live" aria-live="polite"></div>' +
      '<div class="hqz-foot"><span>' + esc(U.saved) + '</span><button type="button" class="hqz-lk" data-hqz-pick>' + esc(U.change) + '</button></div>';
    focusFirst('.hqz-q');
  }
  function answer(b) {
    /* no result on the home: the answer is only recorded (right/wrong, the correct option and the explanation are shown
       in the app after sign-up, in the "review your answers" part of the result screen) */
    ans[i] = +b.getAttribute('data-o'); saveRun();
    [].forEach.call(body.querySelectorAll('.hqz-o'), function (x) { x.disabled = true; });
    b.classList.add('sel'); b.setAttribute('aria-pressed', 'true');
    var lastQ = i + 1 >= qs.length;
    body.querySelector('.hqz-live').innerHTML = '<p class="hqz-sv">✓ ' + esc(U.ans) + '</p>' +
      '<button type="button" class="b3 b3p sm" data-hqz-next>' + esc(lastQ ? U.fin : tx('m_next')) + ' →</button>';
    var nx = body.querySelector('[data-hqz-next]'); try { nx.focus({ preventScroll: true }); } catch (e) { nx.focus(); }
    try { nx.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
  }
  /* the questions are done: save the result for the app and ask for the free account (the score is shown there) */
  function finish() {
    var topics = {}, good = 0;
    qs.forEach(function (q, k) { var t = topics[q.t] || (topics[q.t] = [0, 0]); t[1]++; if (ans[k] === 0) { t[0]++; good++; } });
    /* a: the chosen option of each question (0 = correct), for the review in the app */
    var res = { v: 1, theme: theme, score: good, total: qs.length, topics: topics, a: qs.map(function (q, k) { return [q.id, ans[k]]; }), ts: Date.now(), lang: LANG, home: location.pathname, seen: 0 };
    lsSet(RES, JSON.stringify(res)); dropRun(theme); gate(res);
  }
  function gate(res) {
    var pc = res.total ? Math.round(res.score / res.total * 100) : 0;
    body.innerHTML = '<div class="hqz-end"><div class="hqz-big" aria-hidden="true">' + emo(res.theme) + '</div>' +
      '<div class="hqz-qm" aria-hidden="true">?/' + res.total + '</div>' +
      '<h2 id="hqz-t" tabindex="-1">' + esc(U.g_t) + '</h2><p>' + esc(U.g_p) + '</p>' +
      '<div class="hqz-row"><a class="b3 b3p" data-hqz-go href="' + esc(appUrl(res.theme, pc, 'signup')) + '">' + esc(U.g_b) + ' →</a></div>' +
      '<div class="hqz-row" style="margin-top:8px"><a class="hqz-lk" href="' + esc(appUrl(res.theme, pc, 'login')) + '">' + esc(U.g_l) + '</a></div>' +
      '<p class="hqz-gn">' + esc(U.g_n) + '</p>' +
      '<div class="hqz-row"><button type="button" class="b3 b3g sm" data-hqz-again>↻ ' + esc(U.again) + '</button><button type="button" class="b3 b3g sm" data-hqz-pick>' + esc(U.change) + '</button></div></div>';
    focusFirst('#hqz-t');
  }

  function hook() {
    var btns = document.querySelectorAll('.ctas3 a[href*="go=lvquick"]');
    [].forEach.call(btns, function (a) {
      if (a.getAttribute('data-hqz')) return; a.setAttribute('data-hqz', '1'); a.setAttribute('aria-haspopup', 'dialog');
      ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) { a.addEventListener(ev, function () { load().catch(function () {}); }, { once: true, passive: true }); });
    });
  }
  /* window, capture phase: runs before the homes' own document-level link handlers (the language note before the app) */
  window.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[data-hqz]');
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); e.stopPropagation(); open(a);
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook); else hook();
})();
