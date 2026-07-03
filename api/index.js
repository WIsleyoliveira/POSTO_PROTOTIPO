// Vercel trata qualquer arquivo dentro de /api como uma função serverless.
// Aqui a gente só reaproveita o app Express já existente no backend
// (mesmas rotas /api/dashboard, /api/simulator, etc.), sem duplicar lógica.
module.exports = require('../backend/app');
