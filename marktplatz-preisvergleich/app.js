(() => {
  "use strict";

  const PLATFORMS = [
    { id: "sahibinden",    name: "sahibinden",         land: "TR", domain: "sahibinden.com",   home: "https://www.sahibinden.com",   direct: null },
    { id: "amazon-tr",     name: "Amazon Türkiye",     land: "TR", domain: "amazon.com.tr",     home: "https://www.amazon.com.tr",     direct: (q) => `https://www.amazon.com.tr/s?k=${q}` },
    { id: "trendyol",      name: "Trendyol",           land: "TR", domain: "trendyol.com",      home: "https://www.trendyol.com",      direct: (q) => `https://www.trendyol.com/sr?q=${q}` },
    { id: "hepsiburada",   name: "Hepsiburada",        land: "TR", domain: "hepsiburada.com",   home: "https://www.hepsiburada.com",   direct: (q) => `https://www.hepsiburada.com/ara?q=${q}` },
    { id: "amazon-de",     name: "Amazon.de",          land: "DE", domain: "amazon.de",         home: "https://www.amazon.de",         direct: (q) => `https://www.amazon.de/s?k=${q}` },
    { id: "kleinanzeigen", name: "eBay Kleinanzeigen", land: "DE", domain: "kleinanzeigen.de",  home: "https://www.kleinanzeigen.de",  direct: null },
    { id: "idealo",        name: "idealo.de",          land: "DE", domain: "idealo.de",         home: "https://www.idealo.de",         direct: (q) => `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${q}` },
    { id: "otto",          name: "OTTO",               land: "DE", domain: "otto.de",           home: "https://www.otto.de",           direct: null },
  ];

  const STORAGE_KEY = "mpv_offers_v1";
  const RATE_KEY = "mpv_fx_rate_v1";
  const MIN_OFFERS = 10;

  const $ = (id) => document.getElementById(id);

  const queryInput   = $("query");
  const micBtn       = $("mic-btn");
  const micLangSel   = $("mic-lang");
  const micStatus    = $("mic-status");
  const goBtn        = $("go-btn");
  const linksCard     = $("links-card");
  const linksTr       = $("links-tr");
  const linksDe       = $("links-de");
  const platformSel   = $("f-platform");
  const form          = $("offer-form");
  const offerTbody     = $("offer-tbody");
  const offerCounter   = $("offer-counter");
  const fxRateInput    = $("fx-rate");
  const compareStats   = $("compare-stats");

  let offers = loadOffers();

  init();

  function init() {
    populatePlatformSelect();
    setupSpeech();
    goBtn.addEventListener("click", onGenerateLinks);
    form.addEventListener("submit", onSaveOffer);
    fxRateInput.value = parseFloat(localStorage.getItem(RATE_KEY)) || 54.78;
    fxRateInput.addEventListener("input", () => {
      localStorage.setItem(RATE_KEY, fxRateInput.value || "54.78");
      render();
    });
    $("export-csv").addEventListener("click", exportCsv);
    $("export-json").addEventListener("click", exportJson);
    $("clear-all").addEventListener("click", clearAll);
    render();
  }

  // ---------- Suchlinks ----------

  function onGenerateLinks() {
    const query = queryInput.value.trim();
    if (!query) {
      queryInput.focus();
      return;
    }
    const q = encodeURIComponent(query);
    const items = PLATFORMS.map((p) => ({
      ...p,
      googleUrl: `https://www.google.com/search?q=${encodeURIComponent("site:" + p.domain + " " + query)}`,
      directUrl: p.direct ? p.direct(q) : null,
    }));

    linksTr.innerHTML = items.filter((p) => p.land === "TR").map(renderLinkItem).join("");
    linksDe.innerHTML = items.filter((p) => p.land === "DE").map(renderLinkItem).join("");
    linksCard.hidden = false;
    linksCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderLinkItem(p) {
    return `
      <div class="link-item">
        <span class="name">${escapeHtml(p.name)}</span>
        <div class="btns">
          ${p.directUrl ? `<a href="${p.directUrl}" target="_blank" rel="noopener">Direktsuche</a>` : ""}
          <a class="secondary" href="${p.googleUrl}" target="_blank" rel="noopener">Google-Suche</a>
          <a class="secondary" href="${p.home}" target="_blank" rel="noopener">Startseite</a>
        </div>
      </div>`;
  }

  // ---------- Spracheingabe ----------

  function setupSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      micBtn.disabled = true;
      micStatus.textContent = "Spracherkennung wird von diesem Browser nicht unterstützt (Chrome/Edge empfohlen).";
      return;
    }
    let recognition = null;
    let listening = false;

    micBtn.addEventListener("click", () => {
      if (listening) {
        recognition && recognition.stop();
        return;
      }
      recognition = new SR();
      recognition.lang = micLangSel.value;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        listening = true;
        micBtn.classList.add("listening");
        micStatus.textContent = "Höre zu …";
      };
      recognition.onresult = (e) => {
        const text = e.results[0][0].transcript;
        queryInput.value = text;
        micStatus.textContent = `Erkannt: "${text}"`;
      };
      recognition.onerror = (e) => {
        micStatus.textContent = "Fehler bei der Spracherkennung: " + e.error;
      };
      recognition.onend = () => {
        listening = false;
        micBtn.classList.remove("listening");
      };
      recognition.start();
    });
  }

  // ---------- Angebote: Speicher ----------

  function loadOffers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveOffers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  }

  function populatePlatformSelect() {
    const groups = { TR: [], DE: [] };
    PLATFORMS.forEach((p) => groups[p.land].push(p));
    platformSel.innerHTML =
      `<optgroup label="Türkei">${groups.TR.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}</optgroup>` +
      `<optgroup label="Deutschland">${groups.DE.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join("")}</optgroup>` +
      `<option value="sonstige">Sonstige</option>`;
  }

  function collectTags(containerId, freeTextId) {
    const checked = Array.from(document.querySelectorAll(`#${containerId} input[type=checkbox]:checked`)).map((c) => c.value);
    const free = ($(freeTextId).value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return [...checked, ...free];
  }

  function onSaveOffer(e) {
    e.preventDefault();
    const platformId = platformSel.value;
    const platform = PLATFORMS.find((p) => p.id === platformId);

    const offer = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      platform: platform ? platform.name : "Sonstige",
      land: $("f-land").value,
      titel: $("f-titel").value.trim(),
      link: $("f-link").value.trim(),
      preis: parseFloat($("f-preis").value) || 0,
      waehrung: $("f-waehrung").value,
      versand: parseFloat($("f-versand").value) || 0,
      zustand: $("f-zustand").value,
      bewertung: $("f-bewertung").value.trim(),
      lieferzeit: $("f-lieferzeit").value ? parseInt($("f-lieferzeit").value, 10) : null,
      kaufFakten: collectTags("tags-kauf", "f-kauf-frei"),
      nichtkaufFakten: collectTags("tags-nichtkauf", "f-nichtkauf-frei"),
      notiz: $("f-notiz").value.trim(),
    };

    offers.push(offer);
    saveOffers();
    form.reset();
    fillPlatformDefault();
    render();
  }

  function fillPlatformDefault() {
    $("f-versand").value = 0;
  }

  function deleteOffer(id) {
    offers = offers.filter((o) => o.id !== id);
    saveOffers();
    render();
  }

  // ---------- Berechnung & Rendering ----------

  function fxRate() {
    return parseFloat(fxRateInput.value) > 0 ? parseFloat(fxRateInput.value) : 54.78;
  }

  function totalEur(offer) {
    const total = (offer.preis || 0) + (offer.versand || 0);
    return offer.waehrung === "TRY" ? total / fxRate() : total;
  }

  function render() {
    renderCounter();
    renderTable();
    renderStats();
  }

  function renderCounter() {
    offerCounter.textContent = `${offers.length} / ${MIN_OFFERS} erfasst`;
    offerCounter.classList.toggle("ok", offers.length >= MIN_OFFERS);
  }

  function renderTable() {
    if (offers.length === 0) {
      offerTbody.innerHTML = `<tr><td colspan="11" style="color:var(--muted)">Noch keine Angebote erfasst.</td></tr>`;
      return;
    }
    const withTotals = offers.map((o) => ({ o, total: totalEur(o) }));
    const minTotal = Math.min(...withTotals.map((x) => x.total));
    withTotals.sort((a, b) => a.total - b.total);

    offerTbody.innerHTML = withTotals
      .map(({ o, total }) => {
        const pro = o.kaufFakten.length;
        const contra = o.nichtkaufFakten.length;
        let badge = `<span class="badge neutral">Neutral</span>`;
        if (pro > contra) badge = `<span class="badge good">Empfehlenswert</span>`;
        if (contra > pro) badge = `<span class="badge bad">Eher nicht</span>`;

        const titleCell = o.link
          ? `<a href="${o.link}" target="_blank" rel="noopener" style="color:inherit">${escapeHtml(o.titel)}</a>`
          : escapeHtml(o.titel);

        return `
          <tr class="${total === minTotal ? "cheapest" : ""}">
            <td>${escapeHtml(o.platform)}</td>
            <td>${o.land === "TR" ? "🇹🇷" : "🇩🇪"}</td>
            <td>${titleCell}</td>
            <td>${o.preis.toFixed(2)} ${o.waehrung}</td>
            <td>${o.versand.toFixed(2)} ${o.waehrung}</td>
            <td>${total.toFixed(2)} €</td>
            <td>${escapeHtml(o.zustand)}</td>
            <td title="${escapeHtml(o.kaufFakten.join(", "))}">${pro}</td>
            <td title="${escapeHtml(o.nichtkaufFakten.join(", "))}">${contra}</td>
            <td>${badge}</td>
            <td><button class="row-del" title="Löschen" data-id="${o.id}">🗑</button></td>
          </tr>`;
      })
      .join("");

    offerTbody.querySelectorAll(".row-del").forEach((btn) => {
      btn.addEventListener("click", () => deleteOffer(btn.dataset.id));
    });
  }

  function renderStats() {
    if (offers.length === 0) {
      compareStats.innerHTML = `<p class="hint">Noch keine Angebote für einen Vergleich vorhanden.</p>`;
      return;
    }
    const tr = offers.filter((o) => o.land === "TR").map(totalEur);
    const de = offers.filter((o) => o.land === "DE").map(totalEur);
    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
    const avgTr = avg(tr);
    const avgDe = avg(de);

    const allTotals = offers.map((o) => ({ o, total: totalEur(o) }));
    const cheapest = allTotals.reduce((min, x) => (x.total < min.total ? x : min), allTotals[0]);

    let diffCard = `<div class="stat"><div class="label">Preisunterschied TR ⇄ DE</div><div class="value">–</div></div>`;
    if (avgTr !== null && avgDe !== null) {
      const diff = avgDe - avgTr;
      const pct = avgTr > 0 ? (diff / avgTr) * 100 : 0;
      const teurer = diff >= 0 ? "DE teurer" : "TR teurer";
      diffCard = `
        <div class="stat">
          <div class="label">Preisunterschied Ø (DE − TR)</div>
          <div class="value ${diff >= 0 ? "neg" : "pos"}">${diff >= 0 ? "+" : ""}${diff.toFixed(2)} € (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)</div>
          <div class="label">${teurer}</div>
        </div>`;
    }

    compareStats.innerHTML = `
      <div class="stat">
        <div class="label">Angebote 🇹🇷 Türkei</div>
        <div class="value">${tr.length}</div>
      </div>
      <div class="stat">
        <div class="label">Angebote 🇩🇪 Deutschland</div>
        <div class="value">${de.length}</div>
      </div>
      <div class="stat">
        <div class="label">Ø Preis TR (EUR)</div>
        <div class="value">${avgTr !== null ? avgTr.toFixed(2) + " €" : "–"}</div>
      </div>
      <div class="stat">
        <div class="label">Ø Preis DE (EUR)</div>
        <div class="value">${avgDe !== null ? avgDe.toFixed(2) + " €" : "–"}</div>
      </div>
      ${diffCard}
      <div class="stat">
        <div class="label">Günstigstes Gesamtangebot</div>
        <div class="value">${cheapest.total.toFixed(2)} €</div>
        <div class="label">${escapeHtml(cheapest.o.platform)} (${cheapest.o.land})</div>
      </div>
    `;
  }

  // ---------- Export ----------

  function exportCsv() {
    if (offers.length === 0) return;
    const headers = ["Plattform", "Land", "Titel", "Link", "Preis", "Waehrung", "Versand", "GesamtEUR", "Zustand", "Bewertung", "Lieferzeit", "Kauffakten", "Nichtkauffakten", "Notiz"];
    const rows = offers.map((o) => [
      o.platform, o.land, o.titel, o.link, o.preis, o.waehrung, o.versand,
      totalEur(o).toFixed(2), o.zustand, o.bewertung, o.lieferzeit ?? "",
      o.kaufFakten.join(" | "), o.nichtkaufFakten.join(" | "), o.notiz,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    downloadBlob(csv, "marktplatz-vergleich.csv", "text/csv;charset=utf-8");
  }

  function exportJson() {
    if (offers.length === 0) return;
    downloadBlob(JSON.stringify(offers, null, 2), "marktplatz-vergleich.json", "application/json");
  }

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (offers.length === 0) return;
    if (!confirm("Wirklich alle erfassten Angebote löschen? Das kann nicht rückgängig gemacht werden.")) return;
    offers = [];
    saveOffers();
    render();
  }

  // ---------- Utils ----------

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
