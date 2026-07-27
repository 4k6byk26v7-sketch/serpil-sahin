/* ŞAHIN & PARTNER – Website-Logik
   ==================================================
   HINWEIS: Trage hier eure echten Kontaktdaten ein.
   Diese Werte werden für WhatsApp-Button, E-Mail und
   die Anzeige verwendet.
   ================================================== */
const CONFIG = {
  kanzlei:   "Anwaltskanzlei Serpil Şahin",
  email:     "info@serpil-sahin.de",
  telefon:   "+49 162 62 100 87",
  telRaw:    "+491626210087",
  whatsapp:  "491626210087",               // WhatsApp +49 162 6210087
  adresse:   "Klingholzstraße 7, 65189 Wiesbaden",
};

/* ---------- Kontaktdaten in Seite einsetzen ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-cfg]").forEach(el => {
    const key = el.getAttribute("data-cfg");
    if (CONFIG[key]) el.textContent = CONFIG[key];
  });
  // E-Mail-Links
  document.querySelectorAll("[data-mail]").forEach(a => {
    a.href = "mailto:" + CONFIG.email;
  });
  // Telefon-Links
  document.querySelectorAll("[data-tel]").forEach(a => {
    a.href = "tel:" + CONFIG.telRaw;
  });
  // WhatsApp-Links
  const waText = encodeURIComponent("Guten Tag, ich habe eine Frage an die Anwaltskanzlei Serpil Şahin.");
  document.querySelectorAll("[data-wa]").forEach(a => {
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`;
    a.target = "_blank"; a.rel = "noopener";
  });
  // Notfall-WhatsApp (vorausgefüllte Notfall-Nachricht)
  const waEmerg = encodeURIComponent("🚨 NOTFALL – Ich hatte gerade einen Verkehrsunfall und benötige dringend anwaltliche Hilfe. Bitte melden Sie sich schnellstmöglich.");
  document.querySelectorAll("[data-wa-emergency]").forEach(a => {
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${waEmerg}`;
    a.target = "_blank"; a.rel = "noopener";
  });
  // WhatsApp-Sprachnachricht (öffnet Chat – Nutzer nimmt dort die Sprachnachricht auf)
  const waVoice = encodeURIComponent("Guten Tag, ich sende Ihnen gleich eine Sprachnachricht zu meinem Anliegen.");
  document.querySelectorAll("[data-wa-voice]").forEach(a => {
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${waVoice}`;
    a.target = "_blank"; a.rel = "noopener";
  });
});

/* ---------- Mobile Navigation ---------- */
function toggleNav() {
  document.querySelector(".nav__links").classList.toggle("open");
}

/* ---------- Formular -> E-Mail (mailto) ---------- */
function handleForm(e, betreff) {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  let body = "";
  fd.forEach((val, key) => {
    if (key === "datenschutz") return;
    const label = form.querySelector(`[name="${key}"]`)?.dataset.label || key;
    body += `${label}: ${val}\n`;
  });
  const subject = encodeURIComponent(betreff);
  const mailBody = encodeURIComponent(body + `\n---\nGesendet über die Website.`);
  window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${mailBody}`;
  const msg = form.querySelector(".form-success");
  if (msg) msg.style.display = "block";
  return false;
}

/* ==================================================
   KI-ASSISTENT (regelbasiert, läuft im Browser)
   Beantwortet häufige Fragen. Keine Rechtsberatung.
   ================================================== */
const AI_KNOWLEDGE = [
  {
    keys: ["telefonieren","anrufen","anruf","rückruf","telefonat","telefonisch","sprechen","aramak","telefon","ara","call","phone","speak"],
    html: true,
    answer: {
      de: 'Sehr gern – am schnellsten erreichen Sie uns direkt:<br><br>📞 <a href="tel:+491626210087" style="font-weight:700">+49 162 62 100 87</a> (antippen zum Anrufen)<br>💬 <a href="https://wa.me/491626210087" target="_blank" rel="noopener" style="font-weight:700">WhatsApp öffnen</a> – auch für Sprachanrufe.<br><br>Termine nach Vereinbarung – wir rufen Sie auch gern zurück: Hinterlassen Sie Ihre Nummer per WhatsApp oder Formular.',
      tr: 'Memnuniyetle – bize en hızlı şöyle ulaşırsınız:<br><br>📞 <a href="tel:+491626210087" style="font-weight:700">+49 162 62 100 87</a> (aramak için dokunun)<br>💬 <a href="https://wa.me/491626210087" target="_blank" rel="noopener" style="font-weight:700">WhatsApp\'ı açın</a> – sesli aramalar için de.<br><br>Randevu ile görüşülür – sizi geri de ararız: numaranızı WhatsApp veya form ile bırakın.',
      en: 'Gladly – the fastest way to reach us:<br><br>📞 <a href="tel:+491626210087" style="font-weight:700">+49 162 62 100 87</a> (tap to call)<br>💬 <a href="https://wa.me/491626210087" target="_blank" rel="noopener" style="font-weight:700">Open WhatsApp</a> – also for voice calls.<br><br>Appointments by arrangement – we\'ll gladly call you back: leave your number via WhatsApp or the form.'
    }
  },
  {
    keys: ["unfall","verkehrsunfall","auto","crash","kollision","kaza","trafik kazası","accident","collision"],
    answer: {
      de: "Nach einem Unfall gilt: Ruhe bewahren, Unfallstelle sichern, bei Verletzten den Notruf 112 wählen und die Polizei (110) rufen. Dokumentieren Sie alles (Fotos, Zeugen, Kennzeichen) und unterschreiben Sie kein Schuldanerkenntnis. Wir prüfen für Sie, ob Ihnen Schadensersatz, Schmerzensgeld oder ein eigener Gutachter zusteht. Für eine Ersteinschätzung schreiben Sie uns über das Kontaktformular oder per WhatsApp.",
      tr: "Kazadan sonra: sakin olun, kaza yerini güvene alın, yaralı varsa 112'yi ve polisi (110) arayın. Her şeyi belgeleyin (fotoğraf, tanık, plaka) ve kusur kabul eden hiçbir belge imzalamayın. Size tazminat, manevi tazminat veya kendi bilirkişi hakkınız olup olmadığını inceleriz. Ön değerlendirme için bize iletişim formundan veya WhatsApp'tan yazın.",
      en: "After an accident: stay calm, secure the scene, call 112 for injuries and the police (110). Document everything (photos, witnesses, plates) and sign no admission of fault. We check whether you are entitled to damages, compensation for pain and suffering, or your own expert. For an initial assessment, message us via the contact form or WhatsApp."
    }
  },
  {
    keys: ["gutachter","sachverständige","sachverständiger","kooperation","gutachten","honorar durchsetzen","bilirkişi","ekspertiz","assessor","expert","cooperation"],
    answer: {
      de: "Sie sind Kfz-Sachverständiger? Wir setzen gekürzte Gutachterhonorare gegenüber Versicherern durch – auf Basis der BGH-Rechtsprechung 2024 zum Sachverständigenrisiko. Ihre Neutralität bleibt gewahrt: Die Gutachterwahl liegt stets beim Mandanten, wir geben keine Vermittlungszusagen. Details und Anfrage: Menüpunkt „Für Gutachter“.",
      tr: "Kfz bilirkişisi misiniz? Kesilen bilirkişi ücretlerini, BGH'nin 2024 bilirkişi riski içtihadına dayanarak sigortalara karşı tahsil ederiz. Tarafsızlığınız korunur: bilirkişi seçimi her zaman müvekkile aittir, iş yönlendirme sözü vermeyiz. Ayrıntılar ve başvuru: „Bilirkişiler İçin“ menüsü.",
      en: "Are you a vehicle expert? We enforce reduced expert fees against insurers – based on the BGH's 2024 case law on the expert risk. Your neutrality is preserved: the client always chooses the expert, and we make no referral promises. Details and enquiry: the „For Experts“ menu."
    }
  },
  {
    keys: ["kosten","kostet","kost","preis","honorar","gebühr","teuer","maliyet","ücret","cost","price","fee","how much","what does it cost"],
    answer: {
      de: "Bei einem unverschuldeten Verkehrsunfall trägt die gegnerische Haftpflichtversicherung in der Regel die erforderlichen Anwaltskosten. Verfügen Sie über eine Rechtsschutzversicherung, übernimmt diese die Kosten – wir klären die Deckung gern für Sie. Was in Ihrem Fall gilt, sagen wir Ihnen vor der Beauftragung.",
      tr: "Kusursuz bir trafik kazasında gerekli avukatlık ücretlerini kural olarak karşı tarafın trafik sigortası öder. Hukuki koruma sigortanız varsa masrafları o karşılar – teminatı sizin için netleştiririz. Sizin dosyanızda ne geçerli olduğunu, vekalet vermeden önce söyleriz.",
      en: "After a no-fault traffic accident, the other party's liability insurer usually covers the necessary legal fees. If you have legal expenses insurance, it covers the costs – we'll clarify the coverage for you. We tell you what applies in your case before you engage us."
    }
  },
  {
    keys: ["rechtsschutz","versicherung","deckung","sigorta","hukuki koruma","insurance","coverage"],
    answer: {
      de: "Ja, wir rechnen problemlos über Ihre Rechtsschutzversicherung ab und stellen für Sie eine Deckungsanfrage. Halten Sie am besten Ihre Versicherungsnummer bereit.",
      tr: "Evet, hukuki koruma sigortanız üzerinden sorunsuz çalışır ve sizin için teminat talebi oluştururuz. En iyisi sigorta numaranızı hazır bulundurun.",
      en: "Yes, we bill via your legal expenses insurance without any problem and submit a coverage request for you. It's best to have your policy number ready."
    }
  },
  {
    keys: ["bußgeld","bussgeld","punkte","flensburg","fahrverbot","blitzer","geschwindigkeit","ordnungswidrigkeit","ceza","para cezası","fine","penalty","points"],
    answer: {
      de: "Bei Bußgeldbescheiden, drohendem Fahrverbot oder Punkten in Flensburg lohnt sich oft ein Einspruch – Messfehler und Formfehler sind häufig. Wichtig: Die Einspruchsfrist beträgt nur 2 Wochen ab Zustellung. Senden Sie uns den Bescheid schnellstmöglich zu.",
      tr: "Para cezası kararlarında, sürüş yasağı tehdidinde veya Flensburg puanlarında itiraz çoğu zaman değer – ölçüm ve şekil hataları sıktır. Önemli: itiraz süresi tebliğden itibaren yalnızca 2 haftadır. Kararı bize en kısa sürede gönderin.",
      en: "For fine notices, a threatened driving ban or points in Flensburg, an appeal is often worthwhile – measurement and formal errors are common. Important: the appeal deadline is only 2 weeks from service. Send us the notice as soon as possible."
    }
  },
  {
    keys: ["schmerzensgeld","schaden","schadenersatz","entschädigung","verdienstausfall","tazminat","manevi","compensation","damages"],
    answer: {
      de: "Nach einem unverschuldeten Unfall können Ihnen u.a. Reparaturkosten, Wertminderung, Nutzungsausfall, Schmerzensgeld, Verdienstausfall und Anwaltskosten zustehen. Wir setzen Ihre Ansprüche gegenüber der Versicherung durch.",
      tr: "Kusursuz bir kazadan sonra onarım masrafları, değer kaybı, kullanım kaybı, manevi tazminat, gelir kaybı ve avukatlık ücretleri gibi haklarınız olabilir. Taleplerinizi sigortaya karşı biz takip ederiz.",
      en: "After a no-fault accident you may be entitled to repair costs, loss of value, loss of use, compensation for pain and suffering, loss of earnings and legal fees. We enforce your claims against the insurer."
    }
  },
  {
    keys: ["termin","beratung","erstberatung","kontakt","erreichen","sprechzeiten","randevu","iletişim","appointment","contact","reach"],
    answer: {
      de: "Sie erreichen uns telefonisch, per E-Mail oder WhatsApp. Am schnellsten: der WhatsApp-Button unten rechts. Alternativ nutzen Sie das Kontaktformular – wir melden uns kurzfristig zurück.",
      tr: "Bize telefon, e-posta veya WhatsApp ile ulaşabilirsiniz. En hızlısı: sağ alttaki WhatsApp düğmesi. Alternatif olarak iletişim formunu kullanın – kısa sürede size döneriz.",
      en: "You can reach us by phone, e-mail or WhatsApp. Fastest: the WhatsApp button at the bottom right. Alternatively use the contact form – we'll get back to you shortly."
    }
  },
  {
    keys: ["rechtsgebiet","familienrecht","arbeitsrecht","mietrecht","strafrecht","spezialisiert","alan","uzman","practice area","specialised","specialized"],
    answer: {
      de: "Der Schwerpunkt der Kanzlei liegt im Verkehrsrecht; daneben betreue ich auch weitere Rechtsgebiete (u.a. Zivil-, Vertrags-, Straf- und Versicherungsrecht). Schildern Sie uns Ihr Anliegen – wir sagen Ihnen klar, ob wir helfen können.",
      tr: "Büronun ağırlığı trafik hukukundadır; ayrıca başka alanlara da bakıyorum (medeni, sözleşme, ceza ve sigorta hukuku dâhil). Konunuzu bize anlatın – yardımcı olup olamayacağımızı net söyleriz.",
      en: "The firm's focus is traffic law; I also handle other areas (including civil, contract, criminal and insurance law). Tell us about your matter – we'll say clearly whether we can help."
    }
  },
  {
    keys: ["frist","verjährung","zu spät","wie lange","süre","zamanaşımı","deadline","limitation"],
    answer: {
      de: "Fristen sind im Verkehrsrecht entscheidend: Einspruch gegen Bußgeld = 2 Wochen, Schadensersatzansprüche verjähren meist nach 3 Jahren. Warten Sie nicht zu lange – je früher wir informiert sind, desto besser.",
      tr: "Trafik hukukunda süreler belirleyicidir: para cezasına itiraz = 2 hafta, tazminat talepleri genellikle 3 yılda zamanaşımına uğrar. Çok beklemeyin – ne kadar erken haberdar olursak o kadar iyi.",
      en: "Deadlines are decisive in traffic law: appeal against a fine = 2 weeks, damages claims usually lapse after 3 years. Don't wait too long – the sooner we're informed, the better."
    }
  },
];

const AI_FALLBACK = {
  de: "Das kann ich pauschal nicht beantworten – jeder Fall ist anders. Am besten schildern Sie uns Ihr Anliegen direkt: über das Kontaktformular, per WhatsApp (Button unten rechts) oder E-Mail. Wir melden uns kurzfristig bei Ihnen.",
  tr: "Bunu genel olarak yanıtlayamam – her dosya farklıdır. En iyisi konunuzu doğrudan bize anlatın: iletişim formu, WhatsApp (sağ alttaki düğme) veya e-posta ile. Kısa sürede size döneriz.",
  en: "I can't answer that in general terms – every case is different. It's best to describe your matter directly: via the contact form, WhatsApp (button bottom right) or e-mail. We'll get back to you shortly."
};

const AI_GREETING = {
  de: "Guten Tag! Ich bin der digitale Assistent der Anwaltskanzlei Serpil Şahin. Ich beantworte allgemeine Fragen rund um Verkehrsrecht, Unfall und die Zusammenarbeit mit Gutachtern. Womit kann ich helfen?",
  tr: "Merhaba! Serpil Şahin Avukatlık Bürosu'nun dijital asistanıyım. Trafik hukuku, kaza ve bilirkişilerle iş birliği hakkında genel soruları yanıtlarım. Nasıl yardımcı olabilirim?",
  en: "Hello! I'm the digital assistant of the Serpil Şahin Law Office. I answer general questions about traffic law, accidents and cooperation with experts. How can I help?"
};

function aiLang(){var l=(document.documentElement.lang||'de').slice(0,2);return (l==='tr'||l==='en')?l:'de';}

function aiToggle() {
  const panel = document.getElementById("aiPanel");
  panel.classList.toggle("open");
  if (panel.classList.contains("open") && !panel.dataset.init) {
    aiBotSay(AI_GREETING[aiLang()]);
    panel.dataset.init = "1";
    document.getElementById("aiInput")?.focus();
  }
}

function aiBotSay(text, asHtml) {
  const body = document.getElementById("aiBody");
  const div = document.createElement("div");
  div.className = "ai-msg ai-msg--bot";
  if (asHtml) { div.innerHTML = text; } else { div.textContent = text; }
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function aiUserSay(text) {
  const body = document.getElementById("aiBody");
  const div = document.createElement("div");
  div.className = "ai-msg ai-msg--user";
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function aiRespond(text) {
  const q = text.toLowerCase();
  let best = null, score = 0;
  AI_KNOWLEDGE.forEach(item => {
    const hits = item.keys.filter(k => q.includes(k)).length;
    if (hits > score) { score = hits; best = item; }
  });
  return best ? best : {answer: AI_FALLBACK};
}

function aiSend(preset) {
  const input = document.getElementById("aiInput");
  const text = (preset || input.value).trim();
  if (!text) return;
  aiUserSay(text);
  input.value = "";
  setTimeout(() => {
    const r = aiRespond(text);
    const lang = aiLang();
    const ans = (r.answer && typeof r.answer === "object" && !Array.isArray(r.answer)) ? (r.answer[lang] || r.answer.de) : r.answer;
    aiBotSay(ans, r.html);
  }, 350);
}

function aiKey(e) { if (e.key === "Enter") aiSend(); }

/* === Premium UI: Ratgeber-Dropdown & Scroll-Reveal === */
document.addEventListener('DOMContentLoaded', function(){
  try{
    var a=document.querySelector('.nav__links a[href$="ratgeber/index.html"]');
    if(!a && /\/ratgeber\//.test(location.pathname)) a=document.querySelector('.nav__links a[href="index.html"].active');
    if(a){
      var prefix=a.getAttribute('href').replace(/index\.html$/,'');
      var items=[['index.html','Alle Ratgeber-Artikel →','dd-all'],
        ['was-tun-nach-verkehrsunfall.html','Checkliste nach dem Unfall'],
        ['schmerzensgeld.html','Schmerzensgeld'],
        ['nutzungsausfall.html','Nutzungsausfall'],
        ['totalschaden.html','Totalschaden & 130%-Regel'],
        ['wertminderung.html','Wertminderung'],
        ['fiktive-abrechnung.html','Fiktive Abrechnung'],
        ['sachverstaendigen-risiko.html','Sachverständigen-Risiko'],
        ['dashcam.html','Dashcam als Beweis'],
        ['fahrerflucht.html','Fahrerflucht']];
      var li=a.parentElement; li.classList.add('has-dd');
      var dd=document.createElement('div'); dd.className='nav-dd';
      items.forEach(function(it){var l=document.createElement('a');l.href=prefix+it[0];l.textContent=it[1];if(it[2])l.className=it[2];dd.appendChild(l);});
      li.appendChild(dd);
    }
  }catch(e){}
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    var els=document.querySelectorAll('.card,.door,.step,details.faq');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
    els.forEach(function(el){el.classList.add('reveal');io.observe(el);});
  }
});

/* FAQ-Toggle */
function faqMore(btn){
  var wrap=btn.closest('.faq-wrap');
  var less=btn.getAttribute('data-less'), more=btn.textContent;
  if(wrap.classList.toggle('faq-collapsed')){btn.textContent=btn.dataset.more||more;}
  else{btn.dataset.more=more;btn.textContent=less;}
}
/* Mobiler CTA-Balken */
document.addEventListener('DOMContentLoaded', function(){
  try{
    var tel=(typeof CONFIG!=='undefined'&&CONFIG.telefon)?CONFIG.telefon.replace(/\s/g,''):'+491626210087';
    var wa=(typeof CONFIG!=='undefined'&&CONFIG.whatsapp)?CONFIG.whatsapp:'491626210087';
    var bar=document.createElement('div');bar.className='mobile-cta';
    var l=document.documentElement.lang||'de';
    var T={de:['Anrufen','WhatsApp'],tr:['Ara','WhatsApp'],en:['Call','WhatsApp']}[l]||['Anrufen','WhatsApp'];
    bar.innerHTML='<a href="tel:'+tel+'">'+T[0]+'</a><a href="https://wa.me/'+wa+'" target="_blank" rel="noopener">'+T[1]+'</a>';
    document.body.appendChild(bar);
    var chips=document.querySelector('.ai-chips');
    if(chips){var cl=(document.documentElement.lang||'de').slice(0,2);var ct={de:'📞 Telefonieren',tr:'📞 Telefon',en:'📞 Call'}[cl]||'📞 Telefonieren';var cq={de:'ich möchte telefonieren',tr:'telefon etmek istiyorum',en:'I want to call'}[cl]||'ich möchte telefonieren';var c=document.createElement('button');c.className='ai-chip';c.textContent=ct;c.onclick=function(){aiSend(cq);};chips.insertBefore(c,chips.firstChild);}
  }catch(e){}
});


/* ---------- Social-Media-Icons im Footer (Facebook + Instagram) ---------- */
document.addEventListener("DOMContentLoaded", function () {
  var brand = document.querySelector(".site-footer .footer-brand");
  if (!brand || brand.querySelector(".footer-social")) return;
  var FB = "https://www.facebook.com/profile.php?id=61592177447957";
  var IG = "https://www.instagram.com/kanzlei.sahin/";
  var wrap = document.createElement("div");
  wrap.className = "footer-social";
  wrap.setAttribute("aria-label", "Soziale Medien");
  wrap.innerHTML =
    '<a href="' + FB + '" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4H16.4V5.6c-.3 0-1.3-.1-2.4-.1-2.3 0-3.9 1.4-3.9 4v2.7H7.7V14h2.4v7z"/></svg></a>' +
    '<a href="' + IG + '" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2m0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6m5.8-7.8a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0"/></svg></a>';
  brand.appendChild(wrap);
  if (!document.getElementById("footer-social-style")) {
    var st = document.createElement("style");
    st.id = "footer-social-style";
    st.textContent =
      ".footer-social{display:flex;gap:12px;margin-top:18px}" +
      ".footer-social a{width:40px;height:40px;padding:0;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);transition:.2s}" +
      ".footer-social a:hover{background:var(--gold,#c9a24b);transform:translateY(-2px)}" +
      ".footer-social svg{width:20px;height:20px;fill:#e6edf3}" +
      ".footer-social a:hover svg{fill:#102A43}";
    document.head.appendChild(st);
  }
});
