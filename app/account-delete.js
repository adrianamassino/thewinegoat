/* The Wine Goat — "Delete my account" (optional module, loaded with defer).
   Apple and Google require every app with accounts to let people delete their account from inside the app.
   When someone is signed in, the account window gets a discreet "Delete my account" link. It asks to type
   the account email, then calls the database function public.delete_my_account (supabase/account_deletion.sql),
   which deletes that person's rows and their account — nobody else's. Then the data saved on this device
   (progress, notes, wine diary) is erased too, the session ends and the app restarts with a confirmation.
   If the database function is not installed yet, the person is told to write to the public contact address. */
(function () {
  "use strict";
  const MAIL = "hello@thewinegoat.com";
  const T = {
    en: { link: "Delete my account", title: "Delete your account?", body: "Your account, your saved progress, notes and results will be deleted for good, on all your devices, together with your access to paid content. This cannot be undone.", pay: "Payments are not refunded automatically. Payment records are kept by the payment provider, as the law requires.", label: "To confirm, type the email of your account:", go: "Delete for good", no: "Cancel", busy: "Deleting…", mismatch: "The email does not match your account.", done: "Your account has been deleted.", ok: "OK", unavailable: "Deleting the account from here is not possible yet. Write to {m} from the email of your account and we will delete it.", admin: "This is an administrator account: it cannot be deleted from the app.", err: "Something went wrong. Check your connection and try again." },
    it: { link: "Elimina il mio account", title: "Eliminare il tuo account?", body: "Il tuo account, i progressi salvati, gli appunti e i risultati verranno eliminati per sempre, su tutti i tuoi dispositivi, insieme all'accesso ai contenuti a pagamento. Non si può annullare.", pay: "I pagamenti non vengono rimborsati in automatico. I dati dei pagamenti restano presso chi li ha gestiti, come richiede la legge.", label: "Per confermare, scrivi l'email del tuo account:", go: "Elimina per sempre", no: "Annulla", busy: "Eliminazione in corso…", mismatch: "L'email non corrisponde al tuo account.", done: "Il tuo account è stato eliminato.", ok: "OK", unavailable: "Da qui non è ancora possibile eliminare l'account. Scrivi a {m} dall'email del tuo account e lo eliminiamo noi.", admin: "Questo è un account amministratore: non si può eliminare dall'app.", err: "Qualcosa non ha funzionato. Controlla la connessione e riprova." },
    fr: { link: "Supprimer mon compte", title: "Supprimer votre compte ?", body: "Votre compte, votre progression enregistrée, vos notes et vos résultats seront supprimés définitivement, sur tous vos appareils, ainsi que votre accès aux contenus payants. Cette action est irréversible.", pay: "Les paiements ne sont pas remboursés automatiquement. Les données de paiement sont conservées par le prestataire de paiement, comme la loi l'exige.", label: "Pour confirmer, saisissez l'e-mail de votre compte :", go: "Supprimer définitivement", no: "Annuler", busy: "Suppression en cours…", mismatch: "L'e-mail ne correspond pas à votre compte.", done: "Votre compte a été supprimé.", ok: "OK", unavailable: "La suppression du compte n'est pas encore possible ici. Écrivez à {m} depuis l'e-mail de votre compte et nous le supprimerons.", admin: "Ce compte est un compte administrateur : il ne peut pas être supprimé depuis l'application.", err: "Une erreur s'est produite. Vérifiez votre connexion et réessayez." },
    es: { link: "Eliminar mi cuenta", title: "¿Eliminar tu cuenta?", body: "Tu cuenta, tu progreso guardado, tus apuntes y tus resultados se eliminarán para siempre, en todos tus dispositivos, junto con tu acceso a los contenidos de pago. No se puede deshacer.", pay: "Los pagos no se reembolsan automáticamente. Los datos de pago los conserva el proveedor de pagos, como exige la ley.", label: "Para confirmar, escribe el email de tu cuenta:", go: "Eliminar para siempre", no: "Cancelar", busy: "Eliminando…", mismatch: "El email no coincide con tu cuenta.", done: "Tu cuenta ha sido eliminada.", ok: "OK", unavailable: "Todavía no es posible eliminar la cuenta desde aquí. Escribe a {m} desde el email de tu cuenta y la eliminaremos.", admin: "Esta es una cuenta de administrador: no se puede eliminar desde la app.", err: "Algo ha fallado. Comprueba tu conexión e inténtalo de nuevo." },
    "es-ar": { link: "Eliminar mi cuenta", title: "¿Eliminar tu cuenta?", body: "Tu cuenta, tu progreso guardado, tus apuntes y tus resultados se van a eliminar para siempre, en todos tus dispositivos, junto con tu acceso a los contenidos pagos. No se puede deshacer.", pay: "Los pagos no se reembolsan automáticamente. Los datos de pago los conserva el proveedor de pagos, como exige la ley.", label: "Para confirmar, escribí el email de tu cuenta:", go: "Eliminar para siempre", no: "Cancelar", busy: "Eliminando…", mismatch: "El email no coincide con tu cuenta.", done: "Tu cuenta fue eliminada.", ok: "OK", unavailable: "Todavía no se puede eliminar la cuenta desde acá. Escribinos a {m} desde el email de tu cuenta y la eliminamos.", admin: "Esta es una cuenta de administrador: no se puede eliminar desde la app.", err: "Algo falló. Revisá tu conexión y probá de nuevo." },
    de: { link: "Mein Konto löschen", title: "Dein Konto löschen?", body: "Dein Konto, dein gespeicherter Fortschritt, deine Notizen und Ergebnisse werden endgültig gelöscht, auf all deinen Geräten, zusammen mit deinem Zugang zu kostenpflichtigen Inhalten. Das lässt sich nicht rückgängig machen.", pay: "Zahlungen werden nicht automatisch erstattet. Zahlungsdaten bleiben, wie gesetzlich vorgeschrieben, beim Zahlungsanbieter gespeichert.", label: "Gib zur Bestätigung die E-Mail-Adresse deines Kontos ein:", go: "Endgültig löschen", no: "Abbrechen", busy: "Wird gelöscht …", mismatch: "Die E-Mail-Adresse stimmt nicht mit deinem Konto überein.", done: "Dein Konto wurde gelöscht.", ok: "OK", unavailable: "Das Konto kann hier noch nicht gelöscht werden. Schreib von der E-Mail-Adresse deines Kontos an {m} und wir löschen es.", admin: "Das ist ein Administratorkonto: Es kann nicht in der App gelöscht werden.", err: "Etwas ist schiefgelaufen. Prüfe deine Verbindung und versuch es noch einmal." },
    nl: { link: "Mijn account verwijderen", title: "Je account verwijderen?", body: "Je account, je opgeslagen voortgang, je notities en je resultaten worden definitief verwijderd, op al je apparaten, samen met je toegang tot betaalde inhoud. Dit kan niet ongedaan worden gemaakt.", pay: "Betalingen worden niet automatisch terugbetaald. Betaalgegevens blijven bewaard bij de betaaldienst, zoals de wet vereist.", label: "Typ ter bevestiging het e-mailadres van je account:", go: "Definitief verwijderen", no: "Annuleren", busy: "Bezig met verwijderen…", mismatch: "Het e-mailadres komt niet overeen met je account.", done: "Je account is verwijderd.", ok: "OK", unavailable: "Het account kan hier nog niet worden verwijderd. Mail vanaf het e-mailadres van je account naar {m} en wij verwijderen het.", admin: "Dit is een beheerdersaccount: het kan niet vanuit de app worden verwijderd.", err: "Er ging iets mis. Controleer je verbinding en probeer het opnieuw." },
    el: { link: "Διαγραφή του λογαριασμού μου", title: "Διαγραφή του λογαριασμού σου;", body: "Ο λογαριασμός σου, η αποθηκευμένη πρόοδος, οι σημειώσεις και τα αποτελέσματά σου θα διαγραφούν οριστικά, σε όλες τις συσκευές σου, μαζί με την πρόσβασή σου στο περιεχόμενο επί πληρωμή. Η ενέργεια αυτή δεν αναιρείται.", pay: "Οι πληρωμές δεν επιστρέφονται αυτόματα. Τα στοιχεία των πληρωμών διατηρούνται από τον πάροχο πληρωμών, όπως ορίζει ο νόμος.", label: "Για επιβεβαίωση, γράψε το email του λογαριασμού σου:", go: "Οριστική διαγραφή", no: "Άκυρο", busy: "Γίνεται διαγραφή…", mismatch: "Το email δεν ταιριάζει με τον λογαριασμό σου.", done: "Ο λογαριασμός σου διαγράφηκε.", ok: "OK", unavailable: "Η διαγραφή του λογαριασμού δεν είναι ακόμη δυνατή από εδώ. Γράψε στο {m} από το email του λογαριασμού σου και θα τον διαγράψουμε εμείς.", admin: "Αυτός είναι λογαριασμός διαχειριστή: δεν μπορεί να διαγραφεί από την εφαρμογή.", err: "Κάτι πήγε στραβά. Έλεγξε τη σύνδεσή σου και δοκίμασε ξανά." },
    ja: { link: "アカウントを削除する", title: "アカウントを削除しますか？", body: "アカウント、保存された学習の進捗、ノート、結果が、すべての端末から完全に削除され、有料コンテンツも利用できなくなります。この操作は取り消せません。", pay: "お支払いは自動的には返金されません。お支払いの記録は、法律に基づき決済事業者が保管します。", label: "確認のため、アカウントのメールアドレスを入力してください：", go: "完全に削除する", no: "キャンセル", busy: "削除しています…", mismatch: "メールアドレスがアカウントと一致しません。", done: "アカウントを削除しました。", ok: "OK", unavailable: "現在、ここからアカウントを削除することはできません。アカウントのメールアドレスから {m} までご連絡いただければ、こちらで削除します。", admin: "これは管理者アカウントのため、アプリからは削除できません。", err: "エラーが発生しました。接続を確認して、もう一度お試しください。" },
    ko: { link: "내 계정 삭제", title: "계정을 삭제할까요?", body: "계정, 저장된 학습 진도, 노트와 결과가 모든 기기에서 영구적으로 삭제되고, 유료 콘텐츠 이용 권한도 함께 사라져요. 이 작업은 되돌릴 수 없어요.", pay: "결제 금액은 자동으로 환불되지 않아요. 결제 기록은 법에 따라 결제 서비스 업체에 보관돼요.", label: "확인을 위해 계정 이메일을 입력해 주세요:", go: "영구 삭제", no: "취소", busy: "삭제하는 중…", mismatch: "이메일이 계정과 일치하지 않아요.", done: "계정이 삭제되었어요.", ok: "확인", unavailable: "아직 여기에서는 계정을 삭제할 수 없어요. 계정 이메일로 {m}에 메일을 보내 주시면 삭제해 드릴게요.", admin: "관리자 계정은 앱에서 삭제할 수 없어요.", err: "문제가 발생했어요. 연결 상태를 확인하고 다시 시도해 주세요." },
    "zh-hant": { link: "刪除我的帳號", title: "要刪除你的帳號嗎？", body: "你的帳號、已儲存的學習進度、筆記與成績，將從你所有的裝置上永久刪除，付費內容的使用權也會一併失效。此操作無法復原。", pay: "付款不會自動退款。付款紀錄會依法由支付服務業者保存。", label: "請輸入你的帳號電子郵件以確認：", go: "永久刪除", no: "取消", busy: "刪除中…", mismatch: "電子郵件與你的帳號不符。", done: "你的帳號已刪除。", ok: "確定", unavailable: "目前還無法在這裡刪除帳號。請用你帳號的電子郵件寫信到 {m}，我們會為你刪除。", admin: "這是管理員帳號，無法在 App 中刪除。", err: "發生錯誤。請檢查網路連線後再試一次。" },
    pt: { link: "Excluir minha conta", title: "Excluir sua conta?", body: "Sua conta, seu progresso salvo, suas anotações e seus resultados serão excluídos para sempre, em todos os seus dispositivos, junto com seu acesso aos conteúdos pagos. Não é possível desfazer.", pay: "Os pagamentos não são reembolsados automaticamente. Os dados de pagamento ficam com o provedor de pagamentos, como a lei exige.", label: "Para confirmar, digite o e-mail da sua conta:", go: "Excluir para sempre", no: "Cancelar", busy: "Excluindo…", mismatch: "O e-mail não corresponde à sua conta.", done: "Sua conta foi excluída.", ok: "OK", unavailable: "Ainda não é possível excluir a conta por aqui. Escreva para {m} a partir do e-mail da sua conta e nós a excluiremos.", admin: "Esta é uma conta de administrador: não pode ser excluída pelo app.", err: "Algo deu errado. Verifique sua conexão e tente novamente." },
    tr: { link: "Hesabımı sil", title: "Hesabın silinsin mi?", body: "Hesabın, kayıtlı ilerlemen, notların ve sonuçların tüm cihazlarından kalıcı olarak silinecek; ücretli içeriklere erişimin de sona erecek. Bu işlem geri alınamaz.", pay: "Ödemeler otomatik olarak iade edilmez. Ödeme kayıtları, yasa gereği ödeme sağlayıcısında saklanır.", label: "Onaylamak için hesabının e-posta adresini yaz:", go: "Kalıcı olarak sil", no: "Vazgeç", busy: "Siliniyor…", mismatch: "E-posta adresi hesabınla eşleşmiyor.", done: "Hesabın silindi.", ok: "Tamam", unavailable: "Hesap şu an buradan silinemiyor. Hesabının e-posta adresinden {m} adresine yaz, biz silelim.", admin: "Bu bir yönetici hesabı: uygulamadan silinemez.", err: "Bir sorun oluştu. Bağlantını kontrol edip yeniden dene." },
    th: { link: "ลบบัญชีของฉัน", title: "ต้องการลบบัญชีของคุณหรือไม่", body: "บัญชีของคุณ ความคืบหน้าที่บันทึกไว้ โน้ต และผลลัพธ์ จะถูกลบอย่างถาวรจากทุกอุปกรณ์ของคุณ รวมถึงสิทธิ์เข้าถึงเนื้อหาแบบชำระเงิน การดำเนินการนี้ไม่สามารถย้อนกลับได้", pay: "การชำระเงินจะไม่ได้รับเงินคืนโดยอัตโนมัติ ข้อมูลการชำระเงินจะถูกเก็บไว้โดยผู้ให้บริการชำระเงินตามที่กฎหมายกำหนด", label: "เพื่อยืนยัน กรุณาพิมพ์อีเมลของบัญชีคุณ:", go: "ลบอย่างถาวร", no: "ยกเลิก", busy: "กำลังลบ…", mismatch: "อีเมลไม่ตรงกับบัญชีของคุณ", done: "ลบบัญชีของคุณเรียบร้อยแล้ว", ok: "ตกลง", unavailable: "ขณะนี้ยังไม่สามารถลบบัญชีจากที่นี่ได้ กรุณาเขียนถึง {m} จากอีเมลของบัญชีคุณ แล้วเราจะลบให้", admin: "บัญชีนี้เป็นบัญชีผู้ดูแลระบบ จึงไม่สามารถลบจากแอปได้", err: "เกิดข้อผิดพลาด กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง" },
  };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function tx() {
    let l = "";
    try { l = lang; } catch (e) { try { l = localStorage.getItem("wset3-lang") || document.documentElement.lang || ""; } catch (e2) {} }
    l = String(l || "en").toLowerCase();
    return T[l] || T[l.split("-")[0]] || T.en;
  }
  const acc = () => window.twgAccount;
  const signedIn = () => { const A = acc(); return !!(A && A.signedIn && A.signedIn() && A.client && A.client()); };
  const box = () => document.querySelector("#acct-bg .acct");

  /* the link at the bottom of the account window, only when signed in */
  function addLink() {
    const b = box();
    if (!b || !signedIn() || b.dataset.twgdel || b.querySelector("[data-twgdel]")) return;
    const p = document.createElement("p"); p.className = "twgdel-row";
    p.innerHTML = `<button type="button" class="lnk" data-twgdel="ask">${esc(tx().link)}</button>`;
    b.appendChild(p);
  }
  /* replaces the content of the account window, keeping its close button */
  function fill(html) {
    const b = box(); if (!b) return null;
    b.dataset.twgdel = "1";
    [...b.children].forEach(c => { if (!c.matches(".x")) c.remove(); });
    b.insertAdjacentHTML("beforeend", html);
    return b;
  }
  function ask() {
    const A = acc(), t = tx(); if (!signedIn()) return;
    const b = fill(`<h2>${esc(t.title)}</h2><p>${esc(t.body)}</p><p>${esc(t.pay)}</p>
      <label for="twgdel-e" class="twgdel-lab">${esc(t.label)}</label><b class="twgdel-mail">${esc(A.email())}</b>
      <input type="email" id="twgdel-e" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" inputmode="email">
      <div class="msg e" id="twgdel-msg" role="alert" hidden></div>
      <button type="button" class="go twgdel-go" data-twgdel="go">${esc(t.go)}</button>
      <p class="twgdel-row"><button type="button" class="lnk" data-twgdel="no">${esc(t.no)}</button></p>`);
    const i = b && b.querySelector("#twgdel-e"); if (i) setTimeout(() => { try { i.focus(); } catch (e) {} }, 50);
  }
  function say(text) { const m = document.getElementById("twgdel-msg"); if (m) { m.textContent = text; m.hidden = !text; } }
  /* Erases what the app saved on this device; the language choice is kept so the app reopens in the same language.
     The app restarts by itself when the session ends and saves what it has in memory while closing (quiz in
     progress, drafts): so after the wipe nothing may be written back until the restart, and a flag tells the
     fresh page to show the confirmation. */
  const FLAG = "twg-account-deleted", DBS = ["twg-cellar", "twg-notes"];
  function clearDb(name) {
    return new Promise(res => {
      let q; try { q = indexedDB.open(name); } catch (e) { return res(); }
      q.onerror = q.onblocked = () => res();
      q.onsuccess = () => { const db = q.result;
        try { const st = [...db.objectStoreNames]; if (!st.length) { db.close(); return res(); }
          const tx = db.transaction(st, "readwrite"); st.forEach(n => tx.objectStore(n).clear());
          tx.oncomplete = tx.onerror = tx.onabort = () => { try { db.close(); } catch (e) {} res(); };
        } catch (e) { try { db.close(); } catch (e2) {} res(); } };
    });
  }
  async function wipe() {
    let keep = null; try { keep = localStorage.getItem("wset3-lang"); } catch (e) {}
    try { if (typeof IAP !== "undefined" && IAP && IAP.logOut) await IAP.logOut(); } catch (e) {}   // store apps: unlink the purchases identity
    /* empty the databases that exist (never create one: the app builds them itself), then ask to remove them */
    let have = null; try { if (indexedDB.databases) have = (await indexedDB.databases()).map(d => d.name); } catch (e) {}
    for (const n of DBS) { if (have && !have.includes(n)) continue; if (have) await clearDb(n); try { indexedDB.deleteDatabase(n); } catch (e) {} }
    try { sessionStorage.clear(); } catch (e) {}
    try { localStorage.clear(); if (keep) localStorage.setItem("wset3-lang", keep); localStorage.setItem(FLAG, "1"); } catch (e) {}
    try { Storage.prototype.setItem = function () {}; } catch (e) {}
  }
  /* final message, on its own layer above everything */
  function done(t, restart) {
    if (document.getElementById("twgdel-done")) return;
    const o = document.createElement("div"); o.id = "twgdel-done"; o.setAttribute("role", "alertdialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", t.done);
    o.innerHTML = `<div class="twgdel-card"><h2>${esc(t.done)}</h2><button type="button" data-twgdel="${restart ? "reload" : "close"}">${esc(t.ok)}</button></div>`;
    document.body.appendChild(o);
    const b = o.querySelector("button"); try { b.focus(); } catch (e) {}
  }
  let busy = false;
  async function go() {
    if (busy) return;
    const A = acc(), t = tx(), i = document.getElementById("twgdel-e"), btn = document.querySelector('[data-twgdel="go"]');
    if (!signedIn() || !i || !btn) return;
    const typed = (i.value || "").trim();
    if (!typed || typed.toLowerCase() !== String(A.email() || "").toLowerCase()) { say(t.mismatch); try { i.focus(); } catch (e) {} return; }
    busy = true; say(""); btn.disabled = true; const label = btn.textContent; btn.textContent = t.busy;
    try {
      const sb = A.client();
      const { error } = await sb.rpc("delete_my_account", { p_confirm_email: typed });
      if (error) throw error;
      await wipe();
      const bg = document.getElementById("acct-bg"); if (bg) bg.remove();
      done(t, true);
      try { await sb.auth.signOut({ scope: "local" }); } catch (e2) {}   // the app restarts by itself when the session ends
      return;
    } catch (e) {
      const code = String((e && e.code) || ""), msg = String((e && e.message) || "");
      let out = t.err;
      if (code === "PGRST202" || /could not find the function|schema cache/i.test(msg)) out = t.unavailable.replace("{m}", MAIL);
      else if (/administrator/i.test(msg)) out = t.admin;
      else if (code === "22023" || /does not match/i.test(msg)) out = t.mismatch;
      say(out); btn.disabled = false; btn.textContent = label;
    } finally { busy = false; }
  }
  document.addEventListener("click", e => {
    const b = e.target && e.target.closest && e.target.closest("[data-twgdel]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const k = b.dataset.twgdel;
    if (k === "ask") ask();
    else if (k === "go") go();
    else if (k === "no") { const A = acc(); if (A && A.open) A.open(); }
    else if (k === "reload") location.replace(location.pathname);
    else if (k === "close") { const o = document.getElementById("twgdel-done"); if (o) o.remove(); }
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target && e.target.id === "twgdel-e") { e.preventDefault(); go(); } });

  const css = `.acct .twgdel-row{margin:12px 0 0;text-align:center}
.acct .twgdel-row .lnk{font-size:.8rem;opacity:.75;text-decoration:underline;background:none;border:0;cursor:pointer;padding:8px;color:inherit;font-family:inherit}
.acct .twgdel-lab{display:block;margin-top:12px;font-size:.88rem;font-weight:700}
.acct .twgdel-mail{display:block;margin:2px 0 8px;word-break:break-all}
.acct #twgdel-e{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:14px;border:1.5px solid var(--line,#e5d7cf);font:inherit;background:var(--surface,#fff);color:inherit}
.acct .twgdel-go{background:#b3261e!important;color:#fff!important;border-color:#8c1d18!important;margin-top:12px}
.acct .twgdel-go[disabled]{opacity:.6;cursor:default}
#twgdel-done{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--bg,#fbf6ef);color:var(--fg,#3e0f22)}
#twgdel-done .twgdel-card{max-width:420px;text-align:center}
#twgdel-done h2{margin:0 0 20px;font-size:1.5rem;line-height:1.25}
#twgdel-done button{font:inherit;font-weight:700;padding:14px 34px;border-radius:999px;border:0;background:var(--accent,#7a1838);color:var(--on-accent,#fff);cursor:pointer}`;
  function init() {
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    new MutationObserver(addLink).observe(document.body, { childList: true, subtree: true });
    addLink();
    /* first start after a deletion: confirm it */
    let was = false; try { was = localStorage.getItem(FLAG) === "1"; if (was) localStorage.removeItem(FLAG); } catch (e) {}
    if (was) done(tx(), false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
