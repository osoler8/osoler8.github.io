# Generador de dictats (GitHub Pages, sense API)

Aplicació React + Vite + Tailwind 100% client-side (sense OpenAI). Genera dictats localment segons **títol/tema**, **regla** i **curs** (1r–6è).

## URL prevista
https://osoler8.github.io/generador-dictats/

## Publicar a GitHub Pages
1. Puja aquest codi al repo `osoler8/generador-dictats` (branxa `main`).
2. A Settings → Pages, selecciona **Source: GitHub Actions**.
3. Ves a la pestanya **Actions** i comprova que el workflow **“Deploy to GitHub Pages”** s’executa sol en fer `push`. Quan acabi, tindràs la URL activa.

## Desenvolupament local
```bash
npm i
npm run dev
```
S'obrirà en `http://localhost:5173/generador-dictats/` (la `base` està configurada).

## Notes
- Sense API ni clau: tot es genera al navegador.
- Si canvies el nom del repo, actualitza `base` a `vite.config.ts`.

## Llicència
Desenvolupat per **Oriol Soler**. Llicència **CC BY-SA 4.0**.
