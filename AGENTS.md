# AGENTS.md

## Project Intent

This is a Next.js character manager for a dark fantasy role playing game based on the Tirakans Reiche rulebook.

The app should feel like a practical digital character sheet, not a marketing site. It should preserve the mood of the LaTeX book while staying usable for repeated character creation and editing.

## Source Of Truth

`vorlage/` contains the LaTeX rulebook source and is the truth for game rules, wording, character creation steps, sheet structure, and option lists.

Important files:

- `vorlage/main.tex`: book/page styling, title and chapter page direction.
- `vorlage/sheet.tex`: character sheet structure and panel styling.
- `vorlage/chapters/03_charaktere.tex`: character definition and creation flow.
- `vorlage/chapters/13_anhang_marks.tex`: Abstammung, Weg, Bindung, and related rulebook options.

When changing mechanics, wizard steps, labels, derived values, or predefined choices, check `vorlage/` first.

## Product Rules

- No login or user accounts.
- Characters are public if someone knows the character hash.
- Every created character receives a copyable hash.
- Character creation follows the rulebook wizard flow, though the UI may later merge or reduce visible steps.
- Abstammung, Weg, and Bindung must be selectable from rulebook options and must also allow custom values.
- The detail page should primarily be a view mode with small inline edit controls.
- Use local PostgreSQL with Prisma dev migrations.

## UI Direction

- Overall style: dark, restrained fantasy with parchment character-sheet panels.
- Reuse the visual language from `vorlage/main.tex` and `vorlage/sheet.tex`: dark chapter/title pages, framed page edges, parchment panels, dark red section headers.
- Avoid generic SaaS dashboard styling.
- Keep controls compact and usable. The wizard step display should stay small: current step centered, plus simple numbered circles/buttons without long captions.
- The start page should stay focused: create a character or open an existing one by hash.

## Verification

Do not use `npm run build` as the default verification command while a dev server is running; it currently makes the Next.js dev server crash in this project.

Use:

```bash
npm run check-types
```

Run additional targeted checks only when needed. Do not start another dev server if one is already running.

## Development Notes

- Prefer scoped edits that match existing project patterns.
- Keep Prisma migrations checked in under `prisma/migrations`.
- Do not modify `vorlage/` unless the user explicitly asks to change the rulebook source.
- Keep generated artifacts such as `*.tsbuildinfo` out of version control.
