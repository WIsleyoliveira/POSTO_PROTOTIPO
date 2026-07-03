// Sobe o app Express localmente (dev). Na Vercel, quem serve as rotas
// /api/* é a função serverless em api/index.js, que reaproveita o mesmo
// app.js (sem chamar .listen()).
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Rede VR Fuel backend running on http://localhost:' + PORT);
});
