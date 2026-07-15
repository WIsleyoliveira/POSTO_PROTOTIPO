const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const jsonOk = (data) => ({ ok: true, data });

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'up' });
});

// =====================
// Dashboard (FE contract)
// =====================
const SALES_7D = {
  labels: ['Qui', 'Sex', 'Sáb', 'Dom', 'Seg', 'Ter', 'Qua'],
  series: {
    sales: [68, 72, 95, 88, 74, 78, 87],
    meta: [80, 80, 90, 85, 80, 80, 80],
  },
};

// Mock de 30 dias: gerado de forma determinística (sem Math.random) a partir
// da mesma semana-base acima, só para o protótipo ter algo plausível para
// mostrar quando o usuário troca para "30 Dias".
function buildSales30d() {
  const labels = [];
  const sales = [];
  const meta = [];
  for (let i = 29; i >= 0; i--) {
    labels.push(`D-${i}`);
    const base = SALES_7D.series.sales[i % 7];
    const wave = Math.round(Math.sin(i / 4) * 6);
    sales.push(Math.max(40, base + wave - Math.round(i / 6)));
    meta.push(SALES_7D.series.meta[i % 7]);
  }
  return { labels, series: { sales, meta } };
}
const SALES_30D = buildSales30d();

app.get('/api/dashboard', (req, res) => {
  const range = req.query.range === '30' ? 30 : 7;

  res.json(
    jsonOk({
      aiBanner: {
        avatar: '🤖',
        title: 'IA Gerente',
        tag: 'AO VIVO',
        textStrong: '12% acima da média',
        text:
          'O diesel S10 apresenta margem 3% acima do esperado. Sugiro manter os preços atuais e focar no atendimento rápido nas bombas 2 e 4.',
      },
      cards: [
        { title: 'Faturamento Hoje', value: 'R$ 87.432', change: '▲ 12,4% vs ontem', iconClass: 'blue', icon: '💰' },
        { title: 'Litros Vendidos', value: '18.420 L', change: '▲ 8,2% vs ontem', iconClass: 'yellow', icon: '⛽' },
        { title: 'Ticket Médio', value: 'R$ 142,80', change: '▲ 3,1%', iconClass: 'green', icon: '🎯' },
        { title: 'Lucro Estimado', value: 'R$ 14.820', change: '▲ 15,6%', iconClass: 'green', icon: '📈' },
      ],
      cards2: [
        { title: 'Caixa Atual', value: 'R$ 32.150', change: 'Entradas do dia', iconClass: 'blue' },
        { title: 'Meta do Dia', value: '78%', change: 'R$ 87k / R$ 112k', iconClass: 'yellow', progress: 78 },
        { title: 'vs. Mês Passado', value: '+9,8%', change: 'Faturamento acumulado', iconClass: 'green' },
        { title: 'Clientes Atendidos', value: '612', change: '▲ 5% vs ontem', iconClass: 'blue' },
      ],
      charts: {
        sales7d: range === 30 ? SALES_30D : SALES_7D,
        fuelMix: {
          labels: ['Gasolina', 'Diesel S10', 'Etanol', 'Diesel Comum'],
          values: [45, 28, 18, 9],
        },
        payment: {
          labels: ['Cartão', 'PIX', 'Dinheiro', 'Convênios'],
          values: [48, 28, 14, 10],
        },
      },
    })
  );
});

// =====================
// Prices
// =====================
app.get('/api/prices', (req, res) => {
  res.json(
    jsonOk({
      aiBanner: {
        title: 'Análise de Preços',
        tag: 'IA',
        textStrong: 'R$ 0,05 no etanol',
        text:
          'O concorrente da Avenida aumentou R$ 0,10 na gasolina. Recomendo manter seu preço para capturar clientes.',
      },
      items: [
        {
          name: 'Gasolina Comum',
          marginText: 'Margem: R$ 0,82/L',
          statusText: 'Estável',
          statusClass: 'ok',
          price: 'R$ 5,89',
          changeText: '▲ R$ 0,03 vs semana passada',
          changeType: 'up',
          competitors: [
            { name: 'Posto Avenida', price: 'R$ 5,99' },
            { name: 'Shell Centro', price: 'R$ 5,95' },
            { name: 'Ipiranga Sul', price: 'R$ 5,87' },
          ],
          suggestion: '🤖 Preço competitivo. Mantenha.',
        },
        {
          name: 'Diesel S10',
          marginText: 'Margem: R$ 0,68/L',
          statusText: 'Alta margem',
          statusClass: 'ok',
          price: 'R$ 5,49',
          changeText: '▲ R$ 0,05 vs semana passada',
          changeType: 'up',
          competitors: [
            { name: 'Posto Avenida', price: 'R$ 5,55' },
            { name: 'Shell Centro', price: 'R$ 5,52' },
            { name: 'Ipiranga Sul', price: 'R$ 5,49' },
          ],
          suggestion: '🤖 Margem 3% acima da meta. Excelente!',
        },
        {
          name: 'Etanol',
          marginText: 'Margem: R$ 0,41/L',
          statusText: 'Atenção',
          statusClass: 'warn',
          price: 'R$ 3,79',
          changeText: '▼ R$ 0,02 vs semana passada',
          changeType: 'down',
          competitors: [
            { name: 'Posto Avenida', price: 'R$ 3,85' },
            { name: 'Shell Centro', price: 'R$ 3,82' },
            { name: 'Ipiranga Sul', price: 'R$ 3,75' },
          ],
          suggestion: '🤖 Reduza R$ 0,05 para ganhar volume.',
        },
      ],
      history: {
        labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
        gasoline: [5.82,5.83,5.83,5.85,5.85,5.86,5.86,5.87,5.87,5.88,5.88,5.89,5.89,5.89,5.9,5.9,5.89,5.89,5.88,5.88,5.89,5.89,5.89,5.89,5.89,5.89,5.89,5.89,5.89,5.89],
        diesel: [5.38,5.39,5.4,5.4,5.41,5.42,5.42,5.43,5.44,5.44,5.45,5.45,5.46,5.46,5.47,5.47,5.47,5.48,5.48,5.48,5.48,5.49,5.49,5.49,5.49,5.49,5.49,5.49,5.49,5.49],
        ethanol: [3.85,3.85,3.84,3.84,3.83,3.83,3.82,3.82,3.81,3.81,3.8,3.8,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79,3.79],
      },
    })
  );
});

// =====================
// Tanks
// =====================
app.get('/api/tanks', (req, res) => {
  res.json(
    jsonOk({
      aiBanner: {
        title: 'Monitoramento de Tanques',
        tag: 'TEMPO REAL',
        textStrong: '18%',
        text:
          'Restam apenas 18% de Diesel S10. Com o consumo atual, o tanque esvaziará em aproximadamente 2 dias. Recomendo acionar a distribuidora hoje.',
      },
      tanksFull: [
        { name: 'Tanque 01', type: 'Gasolina Comum', statusText: 'OK', statusClass: 'ok', fill: 72, volume: '21.600 L', autonomy: '5 dias', fillKind: 'gasolina' },
        { name: 'Tanque 02', type: 'Diesel S10', statusText: 'Crítico', statusClass: 'err', fill: 18, volume: '5.400 L', autonomy: '2 dias', fillKind: 'diesel' },
        { name: 'Tanque 03', type: 'Etanol', statusText: 'Atenção', statusClass: 'warn', fill: 42, volume: '12.600 L', autonomy: '3 dias', fillKind: 'ethanol' },
        { name: 'Tanque 04', type: 'Diesel Comum', statusText: 'OK', statusClass: 'ok', fill: 85, volume: '25.500 L', autonomy: '7 dias', fillKind: 'diesel' },
      ],
      history: {
        labels: ['00h','02h','04h','06h','08h','10h','12h','14h','16h','18h','20h','22h'],
        gasolina: [85,84,83,82,80,78,76,75,74,73,72,72],
        dieselS10: [45,43,40,38,34,30,26,24,22,20,18,18],
        etanol: [62,61,60,58,56,54,52,50,48,46,44,42],
      },
    })
  );
});

// =====================
// Purchases
// =====================
app.get('/api/purchases', (req, res) => {
  res.json(
    jsonOk({
      aiBanner: {
        title: 'Previsão de Compras',
        tag: 'IA',
        textStrong: '30.000L de Diesel S10',
        text:
          'Com base no consumo médio, sazonalidade e prazo da distribuidora (24h), recomendo comprar 30.000L de Diesel S10 até amanhã às 10h. Estimativa de economia: R$ 2.400 ao negociar com a BR.',
      },
      recommended: [
        { fuel: 'Diesel S10', qty: '30.000 L', supplier: 'BR Distribuidora', prazo: '24h', price: 'R$ 4,81', total: 'R$ 144.300', statusClass: 'err', statusText: 'Urgente' },
        { fuel: 'Etanol', qty: '20.000 L', supplier: 'Raízen', prazo: '48h', price: 'R$ 3,38', total: 'R$ 67.600', statusClass: 'warn', statusText: 'Programar' },
        { fuel: 'Gasolina Comum', qty: '25.000 L', supplier: 'Ipiranga', prazo: '72h', price: 'R$ 5,07', total: 'R$ 126.750', statusClass: 'info', statusText: 'Agendado' },
        { fuel: 'Diesel Comum', qty: '15.000 L', supplier: 'BR Distribuidora', prazo: '5 dias', price: 'R$ 4,75', total: 'R$ 71.250', statusClass: 'ok', statusText: 'Normal' },
      ],
      metrics: {
        dailyAvg: '6.140 L',
        forecast7d: '42.980 L',
        iaEconomy: 'R$ 8.4k',
      },
    })
  );
});

// =====================
// Pumps
// =====================
app.get('/api/pumps', (req, res) => {
  res.json(
    jsonOk({
      pumps: [
        { number: 'Bomba 01', statusText: '● Ativa', statusClass: 'active', todayLiters: '2.840 L', todayRevenue: 'R$ 16.728', downtime: '12 min', operator: 'Carlos M.' },
        { number: 'Bomba 02', statusText: '● Ativa', statusClass: 'active', todayLiters: '3.120 L', todayRevenue: 'R$ 18.345', downtime: '8 min', operator: 'Ana P.' },
        { number: 'Bomba 03', statusText: '○ Parada', statusClass: 'idle', todayLiters: '1.980 L', todayRevenue: 'R$ 11.234', downtime: '45 min', operator: 'João S.' },
        { number: 'Bomba 04', statusText: '● Ativa', statusClass: 'active', todayLiters: '2.650 L', todayRevenue: 'R$ 15.120', downtime: '15 min', operator: 'Marcos L.' },
        { number: 'Bomba 05', statusText: '⚠ Manutenção', statusClass: 'maint', todayLiters: '1.240 L', todayRevenue: 'R$ 7.012', downtime: '2h 10min', operator: '-' },
        { number: 'Bomba 06', statusText: '● Ativa', statusClass: 'active', todayLiters: '2.980 L', todayRevenue: 'R$ 17.520', downtime: '10 min', operator: 'Pedro A.' },
        { number: 'Bomba 07', statusText: '● Ativa', statusClass: 'active', todayLiters: '1.850 L', todayRevenue: 'R$ 10.840', downtime: '18 min', operator: 'Lucas F.' },
        { number: 'Bomba 08', statusText: '○ Parada', statusClass: 'idle', todayLiters: '1.760 L', todayRevenue: 'R$ 10.633', downtime: '32 min', operator: 'Rafael O.' },
      ],
    })
  );
});

// =====================
// Store
// =====================
app.get('/api/store', (req, res) => {
  res.json(
    jsonOk({
      banner: {
        title: 'Loja de Conveniência',
        tag: 'IA',
        textStrong: '17h e 20h',
        text:
          'A loja vende mais entre 17h e 20h. Sugiro reforçar o estoque de bebidas geladas e salgados nesse período. Hoje: R$ 4.820 em vendas (+8% vs ontem).',
      },
      salesToday: 'R$ 4.820',
    })
  );
});

// =====================
// Stock
// =====================
app.get('/api/stock', (req, res) => {
  res.json(jsonOk({ items: [] }));
});

// =====================
// Maintenance
// =====================
app.get('/api/maintenance', (req, res) => {
  res.json(jsonOk({ ok: 18, pending: 3 }));
});

// =====================
// Financial
// =====================
app.get('/api/financial', (req, res) => {
  res.json(jsonOk({ overdue: [] }));
});

// =====================
// Employees
// =====================
app.get('/api/employees', (req, res) => {
  res.json(jsonOk({ total: 24 }));
});

// =====================
// Simulator
// =====================
app.get('/api/simulator', (req, res) => {
  res.json(
    jsonOk({
      base: {
        volumes: { gas: 8200, diesel: 5200, ethanol: 3400 },
        costs: { gas: 5.07, diesel: 4.81, ethanol: 3.38 },
      },
    })
  );
});

app.post('/api/simulator/calculate', (req, res) => {
  const { gasPrice, dieselPrice, ethanolPrice } = req.body || {};

  const gasP = Number(gasPrice);
  const dieselP = Number(dieselPrice);
  const ethanolP = Number(ethanolPrice);

  if (Number.isNaN(gasP) || Number.isNaN(dieselP) || Number.isNaN(ethanolP)) {
    return res.status(400).json({ ok: false, error: 'Parâmetros inválidos' });
  }

  const volumes = { gas: 8200, diesel: 5200, ethanol: 3400 };
  const costs = { gas: 5.07, diesel: 4.81, ethanol: 3.38 };

  const gasProfit = (gasP - costs.gas) * volumes.gas;
  const dieselProfit = (dieselP - costs.diesel) * volumes.diesel;
  const ethanolProfit = (ethanolP - costs.ethanol) * volumes.ethanol;

  const dailyProfit = gasProfit + dieselProfit + ethanolProfit;
  const monthlyProfit = dailyProfit * 30;

  const revenue = gasP * volumes.gas + dieselP * volumes.diesel + ethanolP * volumes.ethanol;
  const marginAvg = (dailyProfit / revenue) * 100;

  // DailyChange vs "base daily profit"
  const baseDailyProfit = 14820;
  const dailyChange = ((dailyProfit - baseDailyProfit) / baseDailyProfit) * 100;

  res.json(
    jsonOk({
      inputs: { gasPrice: gasP, dieselPrice: dieselP, ethanolPrice: ethanolP },
      profit: { dailyProfit, monthlyProfit, marginAvg },
      dailyChange,
    })
  );
});

// =====================
// Map
// =====================
app.get('/api/map', (req, res) => {
  res.json(jsonOk({ mock: true }));
});

// =====================
// AI
// =====================
app.get('/api/ai/insights', (req, res) => {
  res.json(jsonOk({ mock: true }));
});

// Fallback SPA: qualquer rota não-API cai no index.html do build
// (só relevante no modo "servidor único" local; na Vercel o estático
// do frontend é servido separadamente pelo build estático)
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

module.exports = app;
