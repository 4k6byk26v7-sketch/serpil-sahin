# Vorschau-Seite bei GitHub aufsetzen

**Ziel:** eine Testadresse, unter der du alle Änderungen ansiehst, bevor
irgendetwas an `serpil-sahin.de` geht. Die echte Seite bleibt dabei
vollständig unangetastet.

Dauer: etwa fünf Minuten. Du brauchst nur deinen GitHub-Login.

---

## Warum ein zweites Repository und nicht ein Zweig im bestehenden

GitHub Pages liefert pro Repository nur **einen** Stand aus. Ein zweiter Zweig
im Live-Repository würde die echte Seite ersetzen, sobald du ihn
veröffentlichst. Ein getrenntes Repository kann dagegen nichts kaputt machen.

---

## Schritt für Schritt

**1 · Neues Repository anlegen**
Auf github.com → `+` oben rechts → *New repository*
- Name: `serpil-vorschau`
- **Public** (bei einem privaten Konto ohne Bezahlplan liefert Pages nichts aus)
- Kein README, kein .gitignore, keine Lizenz ankreuzen
- *Create repository*

**2 · Dateien hochladen**
Auf der leeren Repository-Seite: *uploading an existing file*
Dann den **Inhalt** dieses Ordners hineinziehen — nicht den Ordner selbst,
sondern was darin liegt:

```
index.html · gutachter.html · … · style.css · main.js
Bilder/ · fonts/ · downloads/ · ratgeber/ · tr/ · en/
```

Diese Anleitung selbst brauchst du nicht mitzuladen.
Unten *Commit changes*.

**3 · Pages einschalten**
Im Repository: *Settings* → links *Pages*
- Source: **Deploy from a branch**
- Branch: **main**, Ordner: **/ (root)**
- *Save*

**4 · Warten und öffnen**
Nach ein bis zwei Minuten steht die Adresse oben auf derselben Seite:

```
https://DEIN-BENUTZERNAME.github.io/serpil-vorschau/
```

Auf dem Handy funktioniert sie genauso — von überall, nicht nur zu Hause.

---

## Was an dieser Fassung anders ist als an der echten

Das ist kein Ordner-Duplikat, sondern eine eigens abgesicherte Fassung.
Vier Dinge wurden entfernt oder umgestellt, damit die Vorschau der echten
Seite nicht schaden kann:

| | warum |
|---|---|
| **`CNAME` gelöscht** | Die Datei enthielt `serpil-sahin.de`. Läge sie in einem zweiten Repository mit aktivem Pages, würde GitHub die Domain für dieses Repository beanspruchen — **die echte Seite könnte offline gehen.** Das ist die wichtigste Änderung. |
| **`robots.txt` sperrt alles** | Sonst landet eine Testadresse im Google-Index und konkurriert mit der echten Seite um dieselben Texte. |
| **Jede Seite auf `noindex`** | Zweite Absicherung, falls jemand die Adresse verlinkt. |
| **`sitemap.xml` und die Google-Bestätigungsdatei entfernt** | Beide gehören ausschließlich zur echten Domain. |

Zusätzlich steht in jedem Browser-Tab **`[Vorschau]`** vor dem Seitentitel.
So verwechselst du die beiden Fassungen nicht.

**Am Aussehen und an den Inhalten ist nichts verändert.** Was du dort siehst,
ist exakt das, was live gehen würde.

---

## Wenn dir gefällt, was du siehst

Dann geht der Inhalt aus `Serpil Şahin/Webseite_Update` — **nicht** aus diesem
Vorschau-Ordner — in das echte Repository. Der Unterschied ist wichtig: Die
Live-Fassung braucht `CNAME`, `sitemap.xml`, die Google-Bestätigungsdatei und
die `hreflang`-Angaben, die hier absichtlich fehlen.

Sag mir Bescheid, dann bereite ich das genauso ab — inklusive einer Liste,
welche Dateien sich gegenüber dem heutigen Live-Stand ändern.

## Wenn dir etwas nicht gefällt

Sag welche Seite und was. Jede Änderung ist einzeln in der Versionsverwaltung
festgehalten und lässt sich gezielt zurücknehmen, ohne den Rest anzufassen.

---

## Was ich nicht kann

Auf diesem Rechner liegen **keine GitHub-Zugangsdaten** — kein Token, kein
SSH-Schlüssel, kein `gh`-Kommandozeilenwerkzeug. Ich kann deshalb nicht selbst
hochladen. Zugangsdaten oder Passwörter würde ich auch dann nicht eingeben.

Die Schritte 1 bis 3 sind der Teil, der deine Hand braucht. Alles davor ist
fertig.
