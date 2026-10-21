# Servistec Virtual Dyno

Este projeto é uma base funcional de simulador 3D de oficina automotiva com dinamômetro de rolo em React + Vite + Three.js e simulação de motor.

## Execução

```bash
npm install
npm run dev
```

## Assets sugeridos

Para reforçar o visual realista, adicione os arquivos a seguir em `public/assets/` quando quiser usar materiais e cena mais próximos do conceito fotográfico:

- `public/assets/hdri/industrial.hdr` (opcional)
- `public/assets/models/sportscar.glb` (opcional)
- `public/assets/textures/` com albedo, normal, roughness, metalness, AO e emissive.

## Fontes aceitáveis

- Poly Haven: https://polyhaven.com/
- ambientCG: https://ambientcg.com/
- Kenney: https://kenney.nl/
- Sketchfab: modelos CC-BY ou CC0.

## Observações

- O projeto não usa logotipos protegidos.
- O cenário atual funciona como base visual e mecânica, com fallback procedural para manter a estética sem depender de assets externos.
