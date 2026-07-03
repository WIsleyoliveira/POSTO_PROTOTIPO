import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const COLORS = {
  blue: '#1d4ed8',
  yellow: '#fbbf24',
  green: '#10b981',
  gray: '#64748b',
  grid: '#f1f5f9',
};

type PriceCard = {
  name: string;
  margin: string;
  statusClass: string;
  statusText: string;
  value: string;
  changeClass: string;
  changeText: string;
  competitors: Array<{ name: string; price: string }>;
  suggestion: string;
};

type Seed = {
  cards: PriceCard[];
  history: {
    labels: string[];
    gasolina: number[];
    diesel: number[];
    etanol: number[];
  };
};

function splitPrice(value: string) {
  const parts = value.split('/');
  return {
    main: parts[0] ?? value,
    small: '/' + (parts[1] ?? ''),
  };
}

export default function PricesPage(): JSX.Element {
  const seed = useMemo<Seed>(
    () => ({
      cards: [
        {
          name: 'Gasolina Comum',
          margin: 'Margem: R$ 0,82/L',
          statusClass: 'ok',
          statusText: 'Estável',
          value: 'R$ 5,89/L',
          changeClass: 'up',
          changeText: '▲ R$ 0,03 vs semana passada',
          competitors: [
            { name: 'Posto Avenida', price: 'R$ 5,99' },
            { name: 'Shell Centro', price: 'R$ 5,95' },
            { name: 'Ipiranga Sul', price: 'R$ 5,87' },
          ],
          suggestion: '🤖 Preço competitivo. Mantenha.',
        },
        {
          name: 'Diesel S10',
          margin: 'Margem: R$ 0,68/L',
          statusClass: 'ok',
          statusText: 'Alta margem',
          value: 'R$ 5,49/L',
          changeClass: 'up',
          changeText: '▲ R$ 0,05 vs semana passada',
          competitors: [
            { name: 'Posto Avenida', price: 'R$ 5,55' },
            { name: 'Shell Centro', price: 'R$ 5,52' },
            { name: 'Ipiranga Sul', price: 'R$ 5,49' },
          ],
          suggestion: '🤖 Margem 3% acima da meta. Excelente!',
        },
        {
          name: 'Etanol',
          margin: 'Margem: R$ 0,41/L',
          statusClass: 'warn',
          statusText: 'Atenção',
          value: 'R$ 3,79/L',
          changeClass: 'down',
          changeText: '▼ R$ 0,02 vs semana passada',
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
        gasolina: [5.82, 5.83, 5.83, 5.85, 5.85, 5.86, 5.86, 5.87, 5.87, 5.88, 5.88, 5.89, 5.89, 5.89, 5.9, 5.9, 5.89, 5.89, 5.88, 5.88, 5.89, 5.89, 5.89, 5.89, 5.89, 5.89, 5.89, 5.89, 5.89, 5.89],
        diesel: [5.38, 5.39, 5.4, 5.4, 5.41, 5.42, 5.42, 5.43, 5.44, 5.44, 5.45, 5.45, 5.46, 5.46, 5.47, 5.47, 5.47, 5.48, 5.48, 5.48, 5.48, 5.49, 5.49, 5.49, 5.49, 5.49, 5.49, 5.49, 5.49, 5.49],
        etanol: [3.85, 3.85, 3.84, 3.84, 3.83, 3.83, 3.82, 3.82, 3.81, 3.81, 3.8, 3.8, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79, 3.79],
      },
    }),
    []
  );

  const [loaded, setLoaded] = useState(false);

  const historyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = historyCanvasRef.current;
    if (!canvas) return;

    if (historyChartRef.current) historyChartRef.current.destroy();
    historyChartRef.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: seed.history.labels,
        datasets: [
          {
            label: 'Gasolina',
            data: seed.history.gasolina,
            borderColor: COLORS.blue,
            tension: 0.3,
            borderWidth: 2,
          } as any,
          {
            label: 'Diesel',
            data: seed.history.diesel,
            borderColor: COLORS.yellow,
            tension: 0.3,
            borderWidth: 2,
          } as any,
          {
            label: 'Etanol',
            data: seed.history.etanol,
            borderColor: COLORS.green,
            tension: 0.3,
            borderWidth: 2,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: COLORS.grid } },
          x: { grid: { display: false }, title: { display: true, text: 'Dias' } },
        },
      } as any,
    });

    setLoaded(true);

    return () => {
      historyChartRef.current?.destroy();
      historyChartRef.current = null;
    };
  }, [seed]);

  const cards = seed.cards.map((p) => {
    const split = splitPrice(p.value);
    return React.createElement(
      'div',
      { key: p.name, className: 'price-card' },
      React.createElement(
        'div',
        { className: 'price-header' },
        React.createElement(
          'div',
          null,
          React.createElement('div', { className: 'price-name' }, p.name),
          React.createElement('div', { style: { fontSize: 11, color: 'var(--gray-500)' } }, p.margin)
        ),
        React.createElement('span', { className: `status ${p.statusClass}` }, p.statusText)
      ),
      React.createElement(
        'div',
        { className: 'price-value' },
        split.main,
        React.createElement('small', null, split.small)
      ),
      React.createElement('div', { className: `price-change ${p.changeClass}` }, p.changeText),
      React.createElement(
        'div',
        { className: 'price-competitors' },
        React.createElement('h5', null, 'Concorrentes'),
        ...p.competitors.map((c) =>
          React.createElement(
            'div',
            { key: c.name, className: 'competitor-row' },
            React.createElement('span', null, c.name),
            React.createElement('span', null, c.price)
          )
        )
      ),
      React.createElement('div', { className: 'ai-suggestion' }, p.suggestion)
    );
  });

  return React.createElement(
    'div',
    { className: 'module-page active' },

    // AI banner (mock)
    React.createElement(
      'div',
      { className: 'ai-banner' },
      React.createElement('div', { className: 'ai-avatar' }, '🤖'),
      React.createElement(
        'div',
        { className: 'ai-text' },
        React.createElement('h3', null, 'Análise de Preços ', React.createElement('span', { className: 'tag' }, 'IA')),
        React.createElement(
          'p',
          null,
          'Você pode reduzir ',
          React.createElement('strong', null, 'R$ 0,05 no etanol'),
          ' e continuar com boa margem. O concorrente da Avenida aumentou R$ 0,10 na gasolina. Recomendo manter seu preço para capturar clientes.'
        )
      )
    ),

    // Cards
    React.createElement('div', { className: 'section' }, React.createElement('div', { className: 'grid grid-3' }, ...cards)),

    // Histórico
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'section-header' },
        React.createElement('h3', null, 'Histórico de Preços - 30 dias')
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'chart-container' },
          React.createElement('canvas', {
            id: 'priceHistoryChart',
            ref: (el: HTMLCanvasElement | null) => (historyCanvasRef.current = el),
          })
        ),
        loaded
          ? null
          : React.createElement('div', { style: { padding: 12, color: COLORS.gray, fontSize: 12 } }, 'Carregando gráfico...')
      )
    )
  );
}
