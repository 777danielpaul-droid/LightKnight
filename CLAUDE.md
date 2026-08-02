# LightKnight – CLAUDE.md

> 🎮 2D Metroidvania / Action-Adventure • Phaser 3 • TypeScript • Vite

## Schnellstart

Alle Befehle ausführen im Projektordner `/Users/danielpaul/Desktop/LightKnight`.

### Dev-Server
npm run dev

### Build
npm run build

### Type-Check
npm run type-check

---

## Architektur

Projekt folgt einem modularen, ECS-inspirierten Muster:

```
src/
├── config/         → Game & Physics-Konfiguration
├── scenes/         → Phaser-Szenen (Boot, Game, UI)
├── entities/       → Spieler, Gegner, Projektile
├── components/     → Health, Input, Dash, etc.
├── systems/        → Combat, Movement, Ability
├── managers/       → AssetLoader, AudioManager
├── data/           → level.json, abilities.json
├── assets/         → Sprites, Karten, Audio
├── utils/          → Helpers, State-Machine, Vec2
└── types/          → Globale Interfaces
```

---

## Code-Regeln

- TypeScript `strict` aktiv
- Keine hardcoded Werte → alles in `config/` oder `data/`
- Entities halten keine Gameplay-Logik → verwende Systems & Components
- Klare Trennung: Rendering (Scene) / Logik (Entity/System) / Assets (Manager)

---

## Git-Workflow

- Branch: `main` = Release / Playable
- Feature-Branches für größere Features
- Commits: `feat:`, `fix:`, `chore:` – klar & prägnant
- **Daniel gibt Feedback → erst dann committen/pushen**

---

## Style-Guide

- Farbschema: Tiefblau (#0a0f2b), Violett (#2d1a4d), Cyan (#00f0ff), Magenta (#a400ff)
- Waffe: Kampfstock (Melee-Stab)
- Held: HIT – blauer humanoider Tiger
