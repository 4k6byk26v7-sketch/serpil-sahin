/* ==========================================================================
   Anwaltskanzlei Serpil Şahin — Verhalten
   --------------------------------------------------------------------------
   Grundsatz: Progressive Enhancement. Alle Kontaktwege (Telefon, E-Mail,
   WhatsApp) stehen bereits als echte href-Attribute im HTML. Diese Datei
   verbessert die Bedienung, sie stellt sie nicht her — ohne JavaScript
   bleibt die Seite vollständig nutzbar.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    kanzlei:  'Anwaltskanzlei Serpil Şahin',
    email:    'info@serpil-sahin.de',
    telefon:  '+49 162 62 100 87',
    telRaw:   '+491626210087',
    whatsapp: '491626210087',
    adresse:  'Klingholzstraße 7, 65189 Wiesbaden'
  };

  var lang = (document.documentElement.lang || 'de').slice(0, 2);
  if (lang !== 'tr' && lang !== 'en') lang = 'de';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }


  /* ----------------------------------------------------------------------
     1 · Kontaktdaten — nur Textausgabe. Die Links selbst stehen im HTML.
     ---------------------------------------------------------------------- */
  $$('[data-cfg]').forEach(function (el) {
    var key = el.getAttribute('data-cfg');
    if (CONFIG[key]) el.textContent = CONFIG[key];
  });


  /* ----------------------------------------------------------------------
     2 · Navigation — barrierefrei bedienbar
     ---------------------------------------------------------------------- */
  var toggle = $('.nav__toggle');
  var links  = $('.nav__links');
  var header = $('.site-header');

  function setNav(open) {
    if (!toggle || !links) return;
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open
      ? (lang === 'tr' ? 'Menüyü kapat' : lang === 'en' ? 'Close menu' : 'Menü schließen')
      : (lang === 'tr' ? 'Menüyü aç'   : lang === 'en' ? 'Open menu'  : 'Menü öffnen'));
  }

  if (toggle && links) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', links.id || 'navLinks');

    on(toggle, 'click', function () {
      var open = !links.classList.contains('open');
      setNav(open);
      // Der Knopf steht im DOM hinter den Links; ohne Fokusverschiebung
      // wuerde die naechste Tab-Taste das geoeffnete Menue ueberspringen.
      if (open) {
        var first = links.querySelector('a');
        if (first) requestAnimationFrame(function () { first.focus(); });
      }
    });

    // Escape schließt und gibt den Fokus zurück
    on(document, 'keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (links.classList.contains('open')) {
        setNav(false);
        toggle.focus();
        return;
      }
      // Aufklappmenue schliessen (WCAG 1.4.13 "Dismissible")
      var dd = document.activeElement && document.activeElement.closest('.has-dd');
      if (dd) { dd.querySelector('a').blur(); }
    });

    // Klick außerhalb schließt
    on(document, 'click', function (e) {
      if (!links.classList.contains('open')) return;
      if (header && !header.contains(e.target)) setNav(false);
    });

    // Beim Wechsel auf Desktop-Breite zurücksetzen
    var mq = window.matchMedia('(min-width: 1081px)');
    var onChange = function (e) { if (e.matches) setNav(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* Schatten am Header, sobald gescrollt wird — ohne Scroll-Listener. */
  if (header && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '0px' }).observe(sentinel);
  }


  /* ----------------------------------------------------------------------
     3 · Sanftes Einblenden beim Scrollen
     Die Klasse `js` steht bereits am <html> (Inline-Skript im <head>),
     damit ohne JavaScript nichts unsichtbar bleibt.
     ---------------------------------------------------------------------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var targets = $$('.card, .door, .benefit, .q-card, details.faq, .review, .gm-card');
    if (targets.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          observerLaeuft = true;
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      targets.forEach(function (el) {
        // Was beim Laden bereits im Bild ist, wird nicht animiert.
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('reveal', 'in');
        } else {
          el.classList.add('reveal');
          io.observe(el);
        }
      });

      // Sicherheitsnetz: nur einspringen, wenn der Observer nachweislich
      // nicht arbeitet. Vorher wurde nach 2,5 s bedingungslos alles
      // eingeblendet — damit war der Effekt auf langen Seiten wirkungslos.
      var observerLaeuft = false;
      setTimeout(function () {
        if (observerLaeuft) return;
        targets.forEach(function (el) { el.classList.add('in'); });
      }, 2500);
    }
  }


  /* ----------------------------------------------------------------------
     4 · FAQ — „alle Fragen anzeigen“
     ---------------------------------------------------------------------- */
  $$('.faq-more').forEach(function (btn) {
    var wrap = btn.closest('.faq-wrap');
    if (!wrap) return;
    // Erst mit JavaScript wird eingeklappt. Ohne JS bleiben alle Fragen
    // lesbar, statt dauerhaft hinter einem wirkungslosen Knopf zu liegen.
    wrap.classList.add('faq-collapsed');
    var more = btn.getAttribute('data-more') || btn.textContent.trim();
    var less = btn.getAttribute('data-less') || 'Weniger anzeigen';
    btn.setAttribute('aria-expanded', wrap.classList.contains('faq-collapsed') ? 'false' : 'true');

    on(btn, 'click', function () {
      var collapsed = wrap.classList.toggle('faq-collapsed');
      btn.textContent = collapsed ? more : less;
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
  });


  /* ----------------------------------------------------------------------
     5 · Google-Karte erst nach ausdrücklicher Einwilligung laden
     ---------------------------------------------------------------------- */
  var mapBtn = $('[data-map-load]');
  on(mapBtn, 'click', function () {
    var consent = $('#mapConsent');
    if (!consent) return;
    var f = document.createElement('iframe');
    f.title = lang === 'tr' ? 'Büro konumu haritası'
            : lang === 'en' ? 'Map showing the office location'
            : 'Karte mit dem Kanzleistandort';
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(CONFIG.adresse) + '&output=embed';
    f.width = '100%';
    f.height = '340';
    f.style.cssText = 'border:0;display:block';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    consent.parentNode.replaceChild(f, consent);
  });


  /* ----------------------------------------------------------------------
     6 · Formulare — Doppelabsenden verhindern
     ---------------------------------------------------------------------- */
  $$('form.form').forEach(function (form) {
    on(form, 'submit', function () {
      var btn = form.querySelector('[type="submit"]');
      if (!btn || !form.checkValidity()) return;
      btn.disabled = true;
      btn.textContent = lang === 'tr' ? 'Gönderiliyor …'
                      : lang === 'en' ? 'Sending …'
                      : 'Wird gesendet …';
      // Falls der Versand scheitert, bleibt das Formular bedienbar.
      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = btn.getAttribute('data-label-default') || btn.textContent;
      }, 8000);
    });
  });

  /* Herkunft der Landingpage-Anfragen (?src=…) übernehmen */
  var quelle = $('input[name="quelle"]');
  if (quelle) {
    var src = new URLSearchParams(location.search).get('src');
    if (src) quelle.value = src.slice(0, 60);
  }


  /* ----------------------------------------------------------------------
     7 · Textbaustein-Hilfe für Gutachter (mandanten.html)
     ---------------------------------------------------------------------- */
  var gmBtn = $('[data-gm-build]');
  if (gmBtn) {
    var gmText = $('#gmText');
    var gmOut  = $('#gmOut');
    var gmWa   = $('#gmWa');
    var gmCopy = $('[data-gm-copy]');

    var TPL = {
      de: function (a) { return 'Guten Tag,\n\nich hatte ' + a[0] + '. ' + a[1] + '. ' +
             'Mein Fahrzeug ist ' + a[2] + '. ' + a[3] + '.\n\n' +
             'Können Sie meinen Fall übernehmen? Über eine kurze Rückmeldung freue ich mich.\n\nFreundliche Grüße'; },
      tr: function (a) { return 'Merhaba,\n\n' + a[0] + ' geçirdim. ' + a[1] + '. ' +
             'Aracım ' + a[2] + '. ' + a[3] + '.\n\n' +
             'Dosyamı üstlenebilir misiniz? Kısa bir geri dönüş için şimdiden teşekkürler.\n\nSaygılarımla'; },
      en: function (a) { return 'Hello,\n\nI had ' + a[0] + '. ' + a[1] + '. ' +
             'My vehicle is ' + a[2] + '. ' + a[3] + '.\n\n' +
             'Could you take on my case? I would appreciate a brief reply.\n\nKind regards'; }
    };

    /* Der WhatsApp-Link folgt dem – ggf. noch bearbeiteten – Text. */
    function gmSync() {
      if (!gmWa || !gmText) return;
      gmWa.hidden = false;
      gmWa.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(gmText.value);
    }

    on(gmBtn, 'click', function () {
      var vals = ['gmQ1', 'gmQ2', 'gmQ3', 'gmQ4'].map(function (id) {
        var el = document.getElementById(id);
        return el ? el.value : '';
      });
      if (gmText) gmText.value = (TPL[lang] || TPL.de)(vals);
      if (gmOut) gmOut.hidden = false;
      gmSync();
      if (gmText) gmText.focus();
    });

    on(gmText, 'input', gmSync);

    on(gmCopy, 'click', function () {
      if (!gmText || !navigator.clipboard) return;
      navigator.clipboard.writeText(gmText.value).then(function () {
        var t = gmCopy.textContent;
        gmCopy.textContent = lang === 'tr' ? 'Kopyalandı' : lang === 'en' ? 'Copied' : 'Kopiert';
        setTimeout(function () { gmCopy.textContent = t; }, 1800);
      });
    });
  }


  /* ----------------------------------------------------------------------
     8 · Digitaler Assistent (regelbasiert, rein im Browser)
     ---------------------------------------------------------------------- */
  var panel = $('#aiPanel');
  if (panel) initAssistant(panel);

  function initAssistant(panel) {
    var body   = $('#aiBody', panel);
    var input  = $('#aiInput', panel);
    var lastFocus = null;

    var GREETING = {
      de: 'Guten Tag! Ich bin der digitale Assistent der Anwaltskanzlei Serpil Şahin. Ich beantworte allgemeine Fragen rund um Verkehrsrecht, Unfall und die Zusammenarbeit mit Gutachtern. Womit kann ich helfen?',
      tr: 'Merhaba! Serpil Şahin Avukatlık Bürosu\'nun dijital asistanıyım. Trafik hukuku, kaza ve bilirkişilerle iş birliği hakkında genel soruları yanıtlarım. Nasıl yardımcı olabilirim?',
      en: 'Hello! I\'m the digital assistant of the Serpil Şahin Law Office. I answer general questions about traffic law, accidents and cooperation with experts. How can I help?'
    };

    var FALLBACK = {
      de: 'Das kann ich pauschal nicht beantworten – jeder Fall ist anders. Am besten schildern Sie uns Ihr Anliegen direkt: über das Kontaktformular, per WhatsApp oder E-Mail. Wir melden uns kurzfristig bei Ihnen.',
      tr: 'Bunu genel olarak yanıtlayamam – her dosya farklıdır. En iyisi konunuzu doğrudan bize anlatın: iletişim formu, WhatsApp veya e-posta ile. Kısa sürede size döneriz.',
      en: 'I can\'t answer that in general terms – every case is different. It\'s best to describe your matter directly: via the contact form, WhatsApp or e-mail. We\'ll get back to you shortly.'
    };

    var KNOWLEDGE = [
      { keys: ['telefonieren','anrufen','anruf','rückruf','telefonat','telefonisch','sprechen','aramak','telefon','ara','call','phone','speak'], html: true, answer: {
        de: 'Sehr gern – am schnellsten erreichen Sie uns direkt:<br><br><a href="tel:' + CONFIG.telRaw + '" style="font-weight:700">' + CONFIG.telefon + '</a> (antippen zum Anrufen)<br><a href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener" style="font-weight:700">WhatsApp öffnen</a> – auch für Sprachanrufe.<br><br>Termine nach Vereinbarung – wir rufen Sie auch gern zurück: Hinterlassen Sie Ihre Nummer per WhatsApp oder Formular.',
        tr: 'Memnuniyetle – bize en hızlı şöyle ulaşırsınız:<br><br><a href="tel:' + CONFIG.telRaw + '" style="font-weight:700">' + CONFIG.telefon + '</a> (aramak için dokunun)<br><a href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener" style="font-weight:700">WhatsApp\'ı açın</a> – sesli aramalar için de.<br><br>Randevu ile görüşülür – sizi geri de ararız: numaranızı WhatsApp veya form ile bırakın.',
        en: 'Gladly – the fastest way to reach us:<br><br><a href="tel:' + CONFIG.telRaw + '" style="font-weight:700">' + CONFIG.telefon + '</a> (tap to call)<br><a href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener" style="font-weight:700">Open WhatsApp</a> – also for voice calls.<br><br>Appointments by arrangement – we\'ll gladly call you back: leave your number via WhatsApp or the form.'
      }},
      { keys: ['unfall','verkehrsunfall','auto','crash','kollision','kaza','trafik kazası','accident','collision'], answer: {
        de: 'Nach einem Unfall gilt: Ruhe bewahren, Unfallstelle sichern, bei Verletzten den Notruf 112 wählen und die Polizei (110) rufen. Dokumentieren Sie alles (Fotos, Zeugen, Kennzeichen) und unterschreiben Sie kein Schuldanerkenntnis. Wir prüfen für Sie, ob Ihnen Schadensersatz, Schmerzensgeld oder ein eigener Gutachter zusteht. Für eine Ersteinschätzung schreiben Sie uns über das Kontaktformular oder per WhatsApp.',
        tr: 'Kazadan sonra: sakin olun, kaza yerini güvene alın, yaralı varsa 112\'yi ve polisi (110) arayın. Her şeyi belgeleyin (fotoğraf, tanık, plaka) ve kusur kabul eden hiçbir belge imzalamayın. Size tazminat, manevi tazminat veya kendi bilirkişi hakkınız olup olmadığını inceleriz. Ön değerlendirme için bize iletişim formundan veya WhatsApp\'tan yazın.',
        en: 'After an accident: stay calm, secure the scene, call 112 for injuries and the police (110). Document everything (photos, witnesses, plates) and sign no admission of fault. We check whether you are entitled to damages, compensation for pain and suffering, or your own expert. For an initial assessment, message us via the contact form or WhatsApp.'
      }},
      { keys: ['gutachter','sachverständige','sachverständiger','kooperation','gutachten','honorar durchsetzen','bilirkişi','ekspertiz','assessor','expert','cooperation'], answer: {
        de: 'Sie sind Kfz-Sachverständiger? Wir setzen gekürzte Gutachterhonorare gegenüber Versicherern durch – auf Basis der BGH-Rechtsprechung 2024 zum Sachverständigenrisiko. Ihre Neutralität bleibt gewahrt: Die Gutachterwahl liegt stets beim Mandanten, wir geben keine Vermittlungszusagen. Details und Anfrage: Menüpunkt „Für Gutachter“.',
        tr: 'Kfz bilirkişisi misiniz? Kesilen bilirkişi ücretlerini, BGH\'nin 2024 bilirkişi riski içtihadına dayanarak sigortalara karşı tahsil ederiz. Tarafsızlığınız korunur: bilirkişi seçimi her zaman müvekkile aittir, iş yönlendirme sözü vermeyiz. Ayrıntılar ve başvuru: „Bilirkişiler İçin“ menüsü.',
        en: 'Are you a vehicle expert? We enforce reduced expert fees against insurers – based on the BGH\'s 2024 case law on the expert risk. Your neutrality is preserved: the client always chooses the expert, and we make no referral promises. Details and enquiry: the „For Experts“ menu.'
      }},
      { keys: ['kosten','kostet','kost','preis','honorar','gebühr','teuer','maliyet','ücret','cost','price','fee','how much','what does it cost'], answer: {
        de: 'Bei einem unverschuldeten Verkehrsunfall trägt die gegnerische Haftpflichtversicherung in der Regel die erforderlichen Anwaltskosten. Verfügen Sie über eine Rechtsschutzversicherung, übernimmt diese die Kosten – wir klären die Deckung gern für Sie. Was in Ihrem Fall gilt, sagen wir Ihnen vor der Beauftragung.',
        tr: 'Kusursuz bir trafik kazasında gerekli avukatlık ücretlerini kural olarak karşı tarafın trafik sigortası öder. Hukuki koruma sigortanız varsa masrafları o karşılar – teminatı sizin için netleştiririz. Sizin dosyanızda ne geçerli olduğunu, vekalet vermeden önce söyleriz.',
        en: 'After a no-fault traffic accident, the other party\'s liability insurer usually covers the necessary legal fees. If you have legal expenses insurance, it covers the costs – we\'ll clarify the coverage for you. We tell you what applies in your case before you engage us.'
      }},
      { keys: ['rechtsschutz','versicherung','deckung','sigorta','hukuki koruma','insurance','coverage'], answer: {
        de: 'Ja, wir rechnen problemlos über Ihre Rechtsschutzversicherung ab und stellen für Sie eine Deckungsanfrage. Halten Sie am besten Ihre Versicherungsnummer bereit.',
        tr: 'Evet, hukuki koruma sigortanız üzerinden sorunsuz çalışır ve sizin için teminat talebi oluştururuz. En iyisi sigorta numaranızı hazır bulundurun.',
        en: 'Yes, we bill via your legal expenses insurance without any problem and submit a coverage request for you. It\'s best to have your policy number ready.'
      }},
      { keys: ['bußgeld','bussgeld','punkte','flensburg','fahrverbot','blitzer','geschwindigkeit','ordnungswidrigkeit','ceza','para cezası','fine','penalty','points'], answer: {
        de: 'Bei Bußgeldbescheiden, drohendem Fahrverbot oder Punkten in Flensburg lohnt sich oft ein Einspruch – Messfehler und Formfehler sind häufig. Wichtig: Die Einspruchsfrist beträgt nur 2 Wochen ab Zustellung. Senden Sie uns den Bescheid schnellstmöglich zu.',
        tr: 'Para cezası kararlarında, sürüş yasağı tehdidinde veya Flensburg puanlarında itiraz çoğu zaman değer – ölçüm ve şekil hataları sıktır. Önemli: itiraz süresi tebliğden itibaren yalnızca 2 haftadır. Kararı bize en kısa sürede gönderin.',
        en: 'For fine notices, a threatened driving ban or points in Flensburg, an appeal is often worthwhile – measurement and formal errors are common. Important: the appeal deadline is only 2 weeks from service. Send us the notice as soon as possible.'
      }},
      { keys: ['schmerzensgeld','schaden','schadenersatz','entschädigung','verdienstausfall','tazminat','manevi','compensation','damages'], answer: {
        de: 'Nach einem unverschuldeten Unfall können Ihnen u.a. Reparaturkosten, Wertminderung, Nutzungsausfall, Schmerzensgeld, Verdienstausfall und Anwaltskosten zustehen. Wir setzen Ihre Ansprüche gegenüber der Versicherung durch.',
        tr: 'Kusursuz bir kazadan sonra onarım masrafları, değer kaybı, kullanım kaybı, manevi tazminat, gelir kaybı ve avukatlık ücretleri gibi haklarınız olabilir. Taleplerinizi sigortaya karşı biz takip ederiz.',
        en: 'After a no-fault accident you may be entitled to repair costs, loss of value, loss of use, compensation for pain and suffering, loss of earnings and legal fees. We enforce your claims against the insurer.'
      }},
      { keys: ['termin','beratung','erstberatung','kontakt','erreichen','sprechzeiten','randevu','iletişim','appointment','contact','reach'], answer: {
        de: 'Sie erreichen uns telefonisch, per E-Mail oder WhatsApp. Am schnellsten: der WhatsApp-Button. Alternativ nutzen Sie das Kontaktformular – wir melden uns kurzfristig zurück.',
        tr: 'Bize telefon, e-posta veya WhatsApp ile ulaşabilirsiniz. En hızlısı: WhatsApp düğmesi. Alternatif olarak iletişim formunu kullanın – kısa sürede size döneriz.',
        en: 'You can reach us by phone, e-mail or WhatsApp. Fastest: the WhatsApp button. Alternatively use the contact form – we\'ll get back to you shortly.'
      }},
      { keys: ['rechtsgebiet','familienrecht','arbeitsrecht','mietrecht','strafrecht','spezialisiert','alan','uzman','practice area','specialised','specialized'], answer: {
        de: 'Der Schwerpunkt der Kanzlei liegt im Verkehrsrecht; daneben betreue ich auch weitere Rechtsgebiete (u.a. Zivil-, Vertrags-, Straf- und Versicherungsrecht). Schildern Sie uns Ihr Anliegen – wir sagen Ihnen klar, ob wir helfen können.',
        tr: 'Büronun ağırlığı trafik hukukundadır; ayrıca başka alanlara da bakıyorum (medeni, sözleşme, ceza ve sigorta hukuku dâhil). Konunuzu bize anlatın – yardımcı olup olamayacağımızı net söyleriz.',
        en: 'The firm\'s focus is traffic law; I also handle other areas (including civil, contract, criminal and insurance law). Tell us about your matter – we\'ll say clearly whether we can help.'
      }},
      { keys: ['frist','verjährung','zu spät','wie lange','süre','zamanaşımı','deadline','limitation'], answer: {
        de: 'Fristen sind im Verkehrsrecht entscheidend: Einspruch gegen Bußgeld = 2 Wochen, Schadensersatzansprüche verjähren meist nach 3 Jahren. Warten Sie nicht zu lange – je früher wir informiert sind, desto besser.',
        tr: 'Trafik hukukunda süreler belirleyicidir: para cezasına itiraz = 2 hafta, tazminat talepleri genellikle 3 yılda zamanaşımına uğrar. Çok beklemeyin – ne kadar erken haberdar olursak o kadar iyi.',
        en: 'Deadlines are decisive in traffic law: appeal against a fine = 2 weeks, damages claims usually lapse after 3 years. Don\'t wait too long – the sooner we\'re informed, the better.'
      }}
    ];

    function say(text, cls, asHtml) {
      var div = document.createElement('div');
      div.className = 'ai-msg ai-msg--' + cls;
      if (asHtml) div.innerHTML = text; else div.textContent = text;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }

    function respond(text) {
      var q = text.toLowerCase();
      var best = null, score = 0;
      KNOWLEDGE.forEach(function (item) {
        var hits = item.keys.filter(function (k) { return q.indexOf(k) !== -1; }).length;
        if (hits > score) { score = hits; best = item; }
      });
      return best || { answer: FALLBACK };
    }

    function send(preset) {
      var text = (preset || input.value).trim();
      if (!text) return;
      say(text, 'user');
      input.value = '';
      setTimeout(function () {
        var r = respond(text);
        say(r.answer[lang] || r.answer.de, 'bot', r.html);
      }, 320);
    }

    function setOpen(open) {
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      openers.forEach(function (o) { o.setAttribute('aria-expanded', open ? 'true' : 'false'); });

      if (open) {
        lastFocus = document.activeElement;
        if (!panel.dataset.init) {
          say(GREETING[lang], 'bot');
          panel.dataset.init = '1';
        }
        // Erst nach dem Sichtbarwerden fokussieren — sonst schlaegt der
        // Aufruf still fehl und Screenreader melden den Dialog nicht.
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { if (input) input.focus(); });
        });
      } else if (lastFocus) {
        lastFocus.focus();
      }
    }

    panel.setAttribute('aria-hidden', 'true');
    // Jeder Auslöser öffnet den Assistenten: der schwebende Knopf und
    // zusätzliche Schaltflächen im Inhalt (data-ai-open).
    var openers = $$('.fab--ai, [data-ai-open]');
    openers.forEach(function (o) {
      o.setAttribute('aria-expanded', 'false');
      o.setAttribute('aria-controls', 'aiPanel');
      on(o, 'click', function () { setOpen(!panel.classList.contains('open')); });
    });
    on($('.ai-close', panel), 'click', function () { setOpen(false); });
    on($('.ai-send', panel), 'click', function () { send(); });
    on(input, 'keydown', function (e) { if (e.key === 'Enter') send(); });
    $$('.ai-chip', panel).forEach(function (chip) {
      on(chip, 'click', function () { send(chip.getAttribute('data-q') || chip.textContent.trim()); });
    });
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------
     Feste Kontaktleiste zurückziehen, solange die Hero-Knöpfe sichtbar sind.
     Gemessen bei 375x667: die Leiste nimmt 58px von 667px — auf genau dem
     Schirm, auf dem der Hero am knappsten steht. Wo die Knöpfe des Heros
     ohnehin zu sehen sind, ist sie eine Dopplung.
     Ohne IntersectionObserver bleibt die Leiste stehen (Rückfallebene).
     ------------------------------------------------------------------ */
  (function () {
    var leiste = $('.mobile-cta');
    var anker = $('.hero-cta');
    if (!leiste || !anker || !('IntersectionObserver' in window)) return;

    leiste.classList.add('mobile-cta--zurueck');
    /* Die Leiste sitzt UNTEN — der Rand muss deshalb an der unteren Kante
       eingezogen werden, nicht an der oberen. Und threshold 1 statt 0: die
       Knöpfe müssen VOLLSTÄNDIG zu sehen sein, damit die Leiste weichen darf.
       Mit dem Vorgabewert 0 genügte ein einziges überlapptes Pixel — dann
       stand auf 375x667 kein einziger Handlungsknopf im Bild und die Leiste
       war trotzdem schon weg. */
    new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        leiste.classList.toggle('mobile-cta--zurueck', e.intersectionRatio >= 0.99);
      });
    }, { rootMargin: '0px 0px -58px 0px', threshold: [0, 0.99, 1] }).observe(anker);
  })();
})();
