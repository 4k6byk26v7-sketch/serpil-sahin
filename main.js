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
    keys: ["unfall", "verkehrsunfall", "hatte einen unfall", "auto", "crash", "kollision"],
    answer: "Nach einem Unfall gilt: Ruhe bewahren, Unfallstelle sichern, bei Verletzten den Notruf 112 wählen und die Polizei (110) rufen. Dokumentieren Sie alles (Fotos, Zeugen, Kennzeichen) und unterschreiben Sie kein Schuldanerkenntnis. Wir prüfen kostenlos, ob Ihnen Schadensersatz, Schmerzensgeld oder ein eigener Gutachter zusteht. Möchten Sie eine Ersteinschätzung? Schreiben Sie uns über das Kontaktformular oder per WhatsApp."
  },
  {
    keys: ["gutachter", "sachverständige", "sachverständiger", "bewerben", "zusammenarbeit", "kooperation", "gutachten"],
    answer: "Sie sind Unfallgutachter/Kfz-Sachverständiger und möchten mit uns zusammenarbeiten? Über unsere Seite „Für Gutachter“ können Sie direkt eine Kooperationsanfrage stellen. Wir vermitteln passende Mandate im Verkehrsrecht und arbeiten auf transparenter, verlässlicher Basis. Zum Formular: Menüpunkt „Für Gutachter“."
  },
  {
    keys: ["kosten", "preis", "honorar", "was kostet", "gebühr", "teuer"],
    answer: "Bei Verkehrsunfällen mit gegnerischem Verschulden trägt in der Regel die gegnerische Versicherung die Anwaltskosten. Verfügen Sie über eine Rechtsschutzversicherung, übernimmt diese die Kosten – wir klären die Deckung gern für Sie. Ein Erstkontakt zur Einschätzung ist unverbindlich."
  },
  {
    keys: ["rechtsschutz", "versicherung", "deckung"],
    answer: "Ja, wir rechnen problemlos über Ihre Rechtsschutzversicherung ab und stellen für Sie eine Deckungsanfrage. Halten Sie am besten Ihre Versicherungsnummer bereit."
  },
  {
    keys: ["bußgeld", "bussgeld", "punkte", "flensburg", "fahrverbot", "blitzer", "geschwindigkeit", "ordnungswidrigkeit"],
    answer: "Bei Bußgeldbescheiden, drohendem Fahrverbot oder Punkten in Flensburg lohnt sich oft ein Einspruch – Messfehler und Formfehler sind häufig. Wichtig: Die Einspruchsfrist beträgt nur 2 Wochen ab Zustellung. Senden Sie uns den Bescheid schnellstmöglich zu."
  },
  {
    keys: ["schmerzensgeld", "schaden", "schadenersatz", "entschädigung", "haushaltsführung", "verdienstausfall"],
    answer: "Nach einem unverschuldeten Unfall können Ihnen u.a. Reparaturkosten, Wertminderung, Nutzungsausfall, Schmerzensgeld, Verdienstausfall und Anwaltskosten zustehen. Wir setzen Ihre Ansprüche gegenüber der Versicherung durch."
  },
  {
    keys: ["termin", "beratung", "erstberatung", "anrufen", "kontakt", "erreichen", "sprechzeiten"],
    answer: "Sie erreichen uns telefonisch, per E-Mail oder WhatsApp. Am schnellsten: der WhatsApp-Button unten rechts. Alternativ nutzen Sie das Kontaktformular – wir melden uns kurzfristig zurück."
  },
  {
    keys: ["rechtsgebiet", "andere", "familienrecht", "arbeitsrecht", "mietrecht", "strafrecht", "was macht ihr", "spezialisiert"],
    answer: "Der Schwerpunkt der Kanzlei liegt im Verkehrsrecht; daneben betreue ich auch weitere Rechtsgebiete (u.a. Zivil-, Vertrags-, Straf- und Versicherungsrecht). Schildern Sie uns Ihr Anliegen – wir sagen Ihnen ehrlich, ob wir helfen können."
  },
  {
    keys: ["frist", "verjährung", "zu spät", "wie lange"],
    answer: "Fristen sind im Verkehrsrecht entscheidend: Einspruch gegen Bußgeld = 2 Wochen, Schadensersatzansprüche verjähren meist nach 3 Jahren. Warten Sie nicht zu lange – je früher wir informiert sind, desto besser."
  },
];

const AI_FALLBACK = "Das kann ich pauschal nicht beantworten – jeder Fall ist anders. Am besten schildern Sie uns Ihr Anliegen direkt: über das Kontaktformular, per WhatsApp (Button unten rechts) oder E-Mail. Wir melden uns kurzfristig bei Ihnen.";

const AI_GREETING = "Guten Tag! Ich bin der digitale Assistent der Anwaltskanzlei Serpil Şahin. Ich beantworte allgemeine Fragen rund um Verkehrsrecht, Unfall und die Zusammenarbeit mit Gutachtern. Womit kann ich helfen?";

function aiToggle() {
  const panel = document.getElementById("aiPanel");
  panel.classList.toggle("open");
  if (panel.classList.contains("open") && !panel.dataset.init) {
    aiBotSay(AI_GREETING);
    panel.dataset.init = "1";
    document.getElementById("aiInput")?.focus();
  }
}

function aiBotSay(text) {
  const body = document.getElementById("aiBody");
  const div = document.createElement("div");
  div.className = "ai-msg ai-msg--bot";
  div.textContent = text;
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
  return best ? best.answer : AI_FALLBACK;
}

function aiSend(preset) {
  const input = document.getElementById("aiInput");
  const text = (preset || input.value).trim();
  if (!text) return;
  aiUserSay(text);
  input.value = "";
  setTimeout(() => aiBotSay(aiRespond(text)), 350);
}

function aiKey(e) { if (e.key === "Enter") aiSend(); }
