# Rede VR Fuel — Sistema de Gestão (protótipo)

## Como rodar

```bash
# 1. Backend (API + serve o build do frontend em produção)
cd backend
npm install
npm start          # http://localhost:3000

# 2. Frontend em modo desenvolvimento (opcional, com hot-reload)
cd frontend
npm install
npm run dev         # http://localhost:5174 (proxy automático para /api -> :3000)
```

O `backend/dist` já vem com o build de produção do frontend pronto, então
`cd backend && npm install && npm start` já sobe o app completo em
`http://localhost:3000` sem precisar mexer no frontend.

Se você alterar algo no frontend, rode `npm run build` dentro de `frontend/`
para regerar `backend/dist` (o `vite.config.ts` já aponta o `outDir` para lá).

## O que foi corrigido

1. **CSS faltando na maior parte das páginas.** O projeto tinha migrado de
   um protótipo estático (`public/index.html`, removido) para React, mas boa
   parte do CSS específico de cada página (tanques, bombas, preços,
   funcionários, manutenção, mapa, simulador) nunca foi copiado para o
   `frontend/src/styles/global.css` novo — por isso essas telas apareciam
   "quebradas"/sem estilo. Todo esse CSS foi migrado de volta.
2. **URL da API fixa em `http://localhost:3000`.** O Dashboard e o
   Simulador tinham a API "hardcoded", o que quebra assim que o backend
   roda em outra porta/host. Agora usam caminho relativo (`/api/...`) via
   `frontend/src/api.ts`, com proxy configurado no Vite (`vite.config.ts`)
   para o modo desenvolvimento.
3. **`tsconfig.json` com `target`/`lib` desatualizados** (`ES2020`), o que
   quebrava a checagem de tipos em `String.prototype.replaceAll`. Atualizado
   para `ES2021`.
4. **Botões sem nenhuma ação** (`+ Adicionar`, `+ Nova Ordem`,
   `+ Nova Compra`, `+ Adicionar Item`, `Cobrar`, `Ver todos`,
   `Faturamento`/`Lucro`, `7 Dias`/`30 Dias`) foram todos ligados a lógica
   real em memória (adicionam/removem itens de listas, alternam estados,
   etc.), com feedback visual via um toast simples
   (`frontend/src/notify.ts`). Não há persistência real — é tudo mockado —
   mas agora o protótipo responde a cliques em vez de ser só decoração.
5. **`/api/dashboard`** agora aceita `?range=7|30` para o toggle "7 Dias /
   30 Dias" do gráfico de vendas, com um mock de 30 dias no backend.
6. Removidos `public/index.html` (protótipo estático legado, não usado por
   nada) e os `node_modules`/`dist` obsoletos do pacote entregue.

## Estrutura

```
backend/     Express + rotas REST mockadas (server.js)
frontend/    React + Vite + Chart.js
  pages/     Uma página por módulo do menu lateral
  components/AppLayoutFixed.tsx   Sidebar + topbar
  src/api.ts       Helpers fetch (apiGet/apiPost) com URL relativa
  src/notify.ts    Toast simples para feedback de ações mockadas
  src/styles/global.css   CSS de todo o app
```
