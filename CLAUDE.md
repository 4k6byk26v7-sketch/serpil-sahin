# CLAUDE.md

## Antwortstil (Anweisung des Nutzers, 18.08.2026)

Antworten an den Nutzer IMMER kurz halten: wenige Sätze, kein Ausschmücken, keine Wiederholung bereits gesagter Erklärungen. Statusmeldungen maximal ein bis zwei Sätze. Der Nutzer ist nicht technisch — Fachbegriffe vermeiden, aber knapp bleiben.

Dieses Repository enthält die statische Kanzlei-Website (serpil-sahin). Cloud-Sessions auf diesem Repo laufen in einem Container, dessen Netzwerk-Policy **youtube.com blockiert** (der Egress-Proxy beantwortet CONNECT mit 403). Ein Obsidian-Vault existiert in diesem Container **nicht** — der liegt ausschließlich auf dem Mac des Nutzers.

## Automatische Weiterleitung: YouTube-/Video-/Obsidian-Aufträge

Wenn der Nutzer in einer Cloud-Session einen Auftrag gibt, der eines der folgenden erfordert —

- ein YouTube-Video/Short ansehen, anhören oder transkribieren,
- Videoinhalte als Markdown-Notiz ins Obsidian-Vault („Zweites Gehirn") schreiben,
- sonstige Arbeit, die den lokalen Obsidian-Vault braucht —

dann **nicht** lange gegen die Netzwerksperre anrennen und **nicht** mit „geht nicht" antworten. Stattdessen den Auftrag sofort an die lokale Mac-Session des Nutzers weiterreichen. Dort sind YouTube-Zugriff, yt-dlp und der Obsidian-Vault vorhanden; über 120 Videos wurden dort bereits nach diesem Muster ausgewertet.

### Ablauf (erprobt am 17.08.2026)

1. `mcp__Claude_Code_Remote__list_sessions` mit `mine: true` aufrufen.
2. Ziel-Session wählen: die **neueste** Session mit `environment_kind: "bridge"` und `connection_status: "connected"` — bevorzugt mit dem Titel **„Zweites gehirn taeglich"** (das ist die Obsidian-Routine-Session; die Session-ID wechselt täglich, daher immer frisch nachschlagen). Fallback: eine andere verbundene Bridge-Session.
3. `create_trigger` aufrufen: nur `name`, `prompt` und `persistent_session_id` (Ziel-Session-ID) setzen — kein `cron_expression`, kein `run_once_at` (Poke-only-Trigger).
4. Der `prompt` muss den vollständigen, eigenständigen Auftrag enthalten: Video-URL und -ID, Transkript per yt-dlp ziehen (`--skip-download --write-auto-sub` bzw. der etablierte Workflow), Kernpunkte extrahieren, Markdown-Notiz nach den bestehenden Vault-Konventionen (Frontmatter, Tags, Quelle, Datum) anlegen, kritische Bewertung ergänzen, Ergebnis dem Nutzer in jener Session melden.
5. `fire_trigger` mit der Trigger-ID aufrufen, danach `delete_trigger` (Aufräumen).
6. Dem Nutzer kurz melden: Auftrag wurde an die Mac-Session „…" weitergereicht, das Ergebnis erscheint dort.

Falls keine Bridge-Session verbunden ist: dem Nutzer sagen, dass sein Mac gerade nicht erreichbar ist, und den Auftrag als Poke-Trigger an die zuletzt bekannte Session hängen, damit er beim nächsten Verbinden ankommt — oder fragen, ob er Claude Code auf dem Mac starten kann.

### Nicht tun

- Keine fünf Minuten mit Mirror-Diensten (Invidious, noembed, r.jina.ai …) verschwenden — die sind ebenso blockiert. Ein einzelner Schnelltest ist in Ordnung, mehr nicht.
- Keine Videoinhalte erfinden oder „aus dem Gedächtnis" zusammenfassen — nur echte Transkripte/Metadaten verwenden.

## Videoproduktion (Regel ergänzt 20.08.2026 — Anlass: Aufträge endeten im Standbild)

Cloud-Sessions auf diesem Repo haben **kein Videowerkzeug** (kein ffmpeg) und keinen YouTube-Zugang. Alles, was ein bewegtes Ergebnis verlangt — Reel, Short, Clip, Animation, Avatar-Video, Videoschnitt, mp4/mov —, kann hier grundsätzlich nicht entstehen.

Deshalb gilt:

1. **Nicht anfangen, sondern weiterreichen.** Sobald ein Auftrag ein Video als Ergebnis hat, sofort an die Mac-Session weiterreichen (gleiches Verfahren wie oben: `list_sessions` → verbundene Bridge-Session → `create_trigger` mit `persistent_session_id` → `fire_trigger` → `delete_trigger`).
2. **Kein Standbild als Ersatz.** Ein Bild, ein Storyboard, eine HTML-Seite oder eine Bildfolge ist **kein** erfülltes Video-Ergebnis. Wenn nur so etwas möglich ist, das dem Nutzer klar sagen — nicht als fertiges Ergebnis ausgeben.
3. **Der weitergereichte Auftrag muss enthalten:** gewünschtes Format (z. B. 1080x1920 Hochkant für Reel/Short), Länge, Tonspur ja/nein, Zielordner, und die ausdrückliche Vorgabe: **Ergebnis ist eine abspielbare Videodatei (mp4)**. Zusätzlich: vor dem Start `which ffmpeg` prüfen und, falls es fehlt, das dem Nutzer melden statt ersatzweise ein Bild zu liefern.
4. **Am Ende Beweis liefern:** Dateiname, Länge in Sekunden, Auflösung, Dateigröße nennen.

Das Gleiche gilt für Audio (Sprecherstimme, Vertonung) — auch dafür fehlt in der Cloud das Werkzeug.
