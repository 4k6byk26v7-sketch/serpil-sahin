# Marktplatz-Preisvergleich TR ⇄ DE

Eigenständiges, rein clientseitiges Tool (HTML/CSS/JS, kein Server, keine Abhängigkeiten).
Liegt bewusst als isolierter Unterordner in diesem Repo und hat inhaltlich nichts mit den
übrigen Kanzlei-Seiten zu tun.

## Was es tut

1. **Sprach- oder Texteingabe** eines Suchbegriffs (Web Speech API, DE/TR umschaltbar).
2. Erzeugt daraus **fertige Such-Links** für türkische Marktplätze (sahibinden, Amazon
   Türkiye, Trendyol, Hepsiburada) und deutsche Alternativen (Amazon.de, eBay
   Kleinanzeigen, idealo, OTTO) – je Plattform eine direkte Such-URL (wo das stabile
   URL-Schema bekannt ist) plus eine `site:`-Google-Suche als zuverlässigen Fallback.
3. Du öffnest die Angebote selbst und **trägst sie strukturiert ein**: Preis, Währung,
   Versand, Zustand, Verkäufer-Bewertung, Lieferzeit sowie Kauffakten (Pro) und
   Nichtkauffakten (Contra) als Tags.
4. Ab 10 erfassten Angeboten zeigt das **Vergleichs-Dashboard** Durchschnittspreise
   TR vs. DE (umgerechnet in EUR über einen manuell eingetragenen Wechselkurs), die
   prozentuale Preisdifferenz und das günstigste Gesamtangebot.
5. **Export** als CSV oder JSON, alles wird lokal im Browser (`localStorage`)
   gespeichert – kein Backend, kein Tracking.

## Warum keine automatische Live-Suche/Scraping?

sahibinden, Amazon und Trendyol setzen aktiven Bot-/Anti-Scraping-Schutz ein
(Cloudflare, Rate-Limiting, Captchas); Amazon untersagt automatisiertes Auslesen
zusätzlich in seinen AGB. Ein zuverlässiger, dauerhaft funktionierender Live-Scraper
wäre technisch fragil und würde teils gegen Nutzungsbedingungen verstoßen. Deshalb
bereitet das Tool nur die Suche vor – die eigentliche Sichtung der Angebote bleibt
bewusst manuell.

## Nutzung

Einfach `index.html` lokal im Browser öffnen, oder den Ordner über GitHub Pages /
einen beliebigen statischen Hoster bereitstellen. Spracheingabe funktioniert am
zuverlässigsten in Chrome/Edge über HTTPS oder `localhost`.
