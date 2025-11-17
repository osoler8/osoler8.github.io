# Multiplicació vertical — Descomposició guiada

Aplicació web simple per explicar la multiplicació vertical i la descomposició del multiplicand en 
centenes, desenes i unitats (o milers, etc.). L’alumne pot resoldre pas a pas: `unitats × m`, `desenes × m`, 
`centenes × m` i finalment escriure la suma.

## Ús local
Obre `index.html` amb qualsevol navegador, o bé aixeca un petit servidor estàtic:

- Python: `python -m http.server 8000`
- Node (si tens npx): `npx serve .`

## Publicació a GitHub Pages
1. Crea un repositori nou a GitHub i puja aquests fitxers (arrel del repo).
2. A **Settings → Pages**, selecciona **Deploy from a branch** i tria `branch: main` i `folder: / (root)`.
3. Desa. Al cap d’uns minuts tindràs l’enllaç de GitHub Pages actiu.

No cal cap build ni dependència: és HTML/CSS/JS estàtic.