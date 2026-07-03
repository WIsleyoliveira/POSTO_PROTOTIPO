import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const COLORS = {
  blue: '#1d4ed8',
  yellow: '#fbbf24',
  green: '#10b981',
  gray: '#64748b',
  grid: '#f1f5f9',
};

type Tank = {
  id: string;
  name: string;
  type: string;
  status: { className: string; text: string };
  percent: number;
  liters: string;
  autonomy: string;
  kind: 'gasolina' | 'diesel' | 'ethanol';
  alert?: string;
};

type Seed = {
  tanks: Tank[];
  history: {
    labels: string[];
    gasolina: number[];
    dieselS10: number[];
    etanol: number[];
  };
};

export default function TanksPage(): JSX.Element {
  const seed = useMemo<Seed>(
    () => ({
      tanks: [
        {
          id: '01',
          name: 'Tanque 01',
          type: 'Gasolina Comum',
          status: { className: 'ok', text: 'OK' },
          percent: 72,
          liters: '21.600 L',
          autonomy: '5 dias',
          kind: 'gasolina',
        },
        {
          id: '02',
          name: 'Tanque 02',
          type: 'Diesel S10',
          status: { className: 'err', text: 'Crítico' },
          percent: 18,
          liters: '5.400 L',
          autonomy: '2 dias',
          kind: 'diesel',
          alert: '⚠️ Reabastecimento urgente recomendado',
        },
        {
          id: '03',
          name: 'Tanque 03',
          type: 'Etanol',
          status: { className: 'warn', text: 'Atenção' },
          percent: 42,
          liters: '12.600 L',
          autonomy: '3 dias',
          kind: 'ethanol',
        },
        {
          id: '04',
          name: 'Tanque 04',
          type: 'Diesel Comum',
          status: { className: 'ok', text: 'OK' },
          percent: 85,
          liters: '25.500 L',
          autonomy: '7 dias',
          kind: 'diesel',
        },
      ],
      history: {
        labels: ['00h','02h','04h','06h','08h','10h','12h','14h','16h','18h','20h','22h'],
        gasolina: [85,84,83,82,80,78,76,75,74,73,72,72],
        dieselS10: [45,43,40,38,34,30,26,24,22,20,18,18],
        etanol: [62,61,60,58,56,54,52,50,48,46,44,42],
      },
    }),
    []
  );

  const [rendered, setRendered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
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
            fill: false,
          } as any,
          {
            label: 'Diesel S10',
            data: seed.history.dieselS10,
            borderColor: COLORS.yellow,
            tension: 0.3,
            borderWidth: 2,
            fill: false,
          } as any,
          {
            label: 'Etanol',
            data: seed.history.etanol,
            borderColor: COLORS.green,
            tension: 0.3,
            borderWidth: 2,
            fill: false,
          } as any,
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: COLORS.grid }, ticks: { callback: (v: any) => `${v}%` } },
          x: { grid: { display: false } },
        },
      } as any,
    });

    setRendered(true);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [seed]);

  return React.createElement(
    'div',
    { className: 'module-page active' },

    // Banner AI
    React.createElement(
      'div',
      { className: 'ai-banner' },
      React.createElement('div', { className: 'ai-avatar' }, '🤖'),
      React.createElement(
        'div',
        { className: 'ai-text' },
        React.createElement('h3', null, 'Monitoramento de Tanques ', React.createElement('span', { className: 'tag' }, 'TEMPO REAL')),
        React.createElement(
          'p',
          null,
          React.createElement('strong', null, 'Atenção:'),
          ' Restam apenas 18% de Diesel S10. Com o consumo atual, o tanque esvaziará em aproximadamente ',
          React.createElement('strong', null, '2 dias'),
          '. Recomendo acionar a distribuidora hoje.'
        )
      )
    ),

    // Cards de tanques
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'grid grid-4' },
        ...seed.tanks.map((t) => {
          const fillKindClass = t.kind === 'diesel' ? 'diesel' : t.kind === 'ethanol' ? 'ethanol' : '';
          return React.createElement(
            'div',
            { key: t.id, className: 'tank-card' },
            React.createElement(
              'div',
              { className: 'tank-header' },
              React.createElement(
                'div',
                null,
                React.createElement('div', { className: 'tank-name' }, t.name),
                React.createElement('div', { className: 'tank-type' }, t.type)
              ),
              React.createElement('span', { className: `status ${t.status.className}` }, t.status.text)
            ),
            React.createElement(
              'div',
              { className: 'tank-visual' },
              React.createElement('div', { className: `tank-fill ${fillKindClass}`.trim(), style: { height: `${t.percent}%` } }),
              React.createElement('div', { className: 'tank-percent' }, `${t.percent}%`)
            ),
            React.createElement(
              'div',
              { className: 'tank-stats' },
              React.createElement('div', { className: 'tank-stat' }, React.createElement('strong', null, t.liters), React.createElement('span', null, 'Volume atual')),
              React.createElement('div', { className: 'tank-stat' }, React.createElement('strong', null, t.autonomy), React.createElement('span', null, 'Autonomia'))
            ),
            t.alert
              ? React.createElement('div', { className: 'tank-alert' }, t.alert)
              : null
          );
        })
      )
    ),

    // Histórico
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'section-header' },
        React.createElement('h3', null, 'Histórico de Níveis - 24h')
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'chart-container' },
          React.createElement('canvas', { ref: (el: HTMLCanvasElement | null) => (canvasRef.current = el), id: 'tankHistoryChart' })
        ),
        rendered ? null : React.createElement('div', { style: { padding: 12, color: COLORS.gray, fontSize: 12 } }, 'Carregando gráfico...')
      )
    )
  );
}
