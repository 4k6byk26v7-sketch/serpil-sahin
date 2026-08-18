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
