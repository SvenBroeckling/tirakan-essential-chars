# Tirakan Essential Chars

Next.js-basierter Charakter-Manager für das Dark-Fantasy-Rollenspiel *Tirakans Reiche* in der Variante *tirakan-essential*. Die Anwendung dient als digitaler Charakterbogen und orientiert sich an den Regeln und dem visuellen Stil des Regelwerks.

## Betrieb

Die Anwendung setzt eine PostgreSQL-Datenbank voraus. Am einfachsten lässt sie sich mittels Docker Compose starten:

```bash
docker-compose up -d
```

Die App ist anschließend unter `http://localhost:3000` erreichbar.

## Versionierung

Dieses Projekt folgt der semantischen Versionierung (`vx.y.z`). Die Versionierung ist mit dem Schwesterprojekt [tirakan-essential](https://github.com/SvenBroeckling/tirakan-essential) abgestimmt:

* Versionen mit identischen `x` (Major) und `y` (Minor) Stellen sind zwischen beiden Projekten kompatibel.
* Die `z` (Patch) Stelle entwickelt sich in beiden Projekten unabhängig voneinander weiter.
