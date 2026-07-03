import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { apiGet, apiPost } from '../src/api';

type SimulatorBase = {
  volumes: { gas: number; diesel: number; ethanol: number };
  costs: { gas: number; diesel: number; ethanol: number };
};

type SimulatorCalculate = {
  inputs: { gasPrice: number; dieselPrice: number; ethanolPrice: number };
  profit: { dailyProfit: number; monthlyProfit: number; marginAvg: number };
  dailyChange: number;
};

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}
function fmtBRL_k(n: number) {
  return (n / 1000).toFixed(1) + 'k';
}

export default function SimulatorPage(): JSX.Element {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const [base, setBase] = useState<SimulatorBase | null>(null);
  const [loadingBase, setLoadingBase] = useState(true);
  const [errorBase, setErrorBase] = useState<string | null>(null);

  const [gasPrice, setGasPrice] = useState(5.89);
  const [dieselPrice, setDieselPrice] = useState(5.49);
  const [ethanolPrice, setEthanolPrice] = useState(3.79);

  const [loadingCalc, setLoadingCalc] = useState(false);
  const [errorCalc, setErrorCalc] = useState<string | null>(null);

  const [dailyProfit, setDailyProfit] = useState<number | null>(null);
  const [monthlyProfit, setMonthlyProfit] = useState<number | null>(null);
  const [marginAvg, setMarginAvg] = useState<number | null>(null);
  const [dailyChange, setDailyChange] = useState<number | null>(null);

  const colors = useMemo(
    () => ({
      blue: '#1d4ed8',
      yellow: '#fbbf24',
      green: '#10b981',
      grid: '#f1f5f9',
    }),
    []
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingBase(true);
        setErrorBase(null);

        const { base: baseData } = await apiGet<{ base: SimulatorBase }>('/api/simulator');
        if (mounted) setBase(baseData);
      } catch (e: any) {
        if (!mounted) return;
        setErrorBase(e?.message ?? 'Erro ao carregar simulador');
      } finally {
        if (!mounted) return;
        setLoadingBase(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!base) return;
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      setLoadingCalc(true);
      setErrorCalc(null);

      try {
        const json = await apiPost<SimulatorCalculate>('/api/simulator/calculate', {
          gasPrice,
          dieselPrice,
          ethanolPrice,
        });

        if (cancelled) return;

        setDailyProfit(json.profit.dailyProfit);
        setMonthlyProfit(json.profit.monthlyProfit);
        setMarginAvg(json.profit.marginAvg);
        setDailyChange(json.dailyChange);

        chartRef.current?.destroy();
        const volumes = base.volumes;
        const costs = base.costs;

        const gasProfit = (json.inputs.gasPrice - costs.gas) * volumes.gas;
        const dieselProfit = (json.inputs.dieselPrice - costs.diesel) * volumes.diesel;
        const ethanolProfit = (json.inputs.ethanolPrice - costs.ethanol) * volumes.ethanol;

        chartRef.current = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: ['Gasolina', 'Diesel', 'Etanol'],
            datasets: [
              {
                label: 'Lucro (R$)',
                data: [gasProfit, dieselProfit, ethanolProfit],
                backgroundColor: [colors.blue, colors.yellow, colors.green],
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { grid: { color: colors.grid } }, x: { grid: { display: false } } },
          },
        });
      } catch (e: any) {
        if (cancelled) return;
        setErrorCalc(e?.message ?? 'Erro ao calcular');
        setDailyProfit(null);
        setMonthlyProfit(null);
        setMarginAvg(null);
        setDailyChange(null);
      } finally {
        if (cancelled) return;
        setLoadingCalc(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [base, gasPrice, dieselPrice, ethanolPrice, colors]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  const dailyChangeClass =
    dailyChange == null ? 'card-change neutral' : dailyChange >= 0 ? 'card-change up' : 'card-change down';

  const cardValueDaily = dailyProfit == null ? '...' : 'R$ ' + fmtBRL(dailyProfit);
  const cardValueMonthly = monthlyProfit == null ? '...' : 'R$ ' + fmtBRL_k(monthlyProfit);
  const cardValueMargin = marginAvg == null ? '...' : marginAvg.toFixed(1) + '%';
  const dailyChangeText =
    dailyChange == null
      ? '—'
      : (dailyChange >= 0 ? '▲ ' : '▼ ') + Math.abs(dailyChange).toFixed(1) + '% vs atual';

  const root = React.createElement(
    'div',
    { className: 'section' },
    React.createElement(
      'div',
      { className: 'grid grid-2' },
      // Left controls
      React.createElement(
        'div',
        { className: 'simulator-control' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Simulador de Lucro')
        ),
        React.createElement(
          'p',
          { style: { fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 } },
          'Ajuste os preços e veja o impacto em tempo real no lucro.'
        ),
        errorBase
          ? React.createElement(
              'div',
              { style: { marginBottom: 16, color: '#991b1b', background: '#fee2e2', padding: 12, borderRadius: 10 } },
              errorBase
            )
          : null,
        errorCalc
          ? React.createElement(
              'div',
              { style: { marginBottom: 16, color: '#991b1b', background: '#fee2e2', padding: 12, borderRadius: 10 } },
              errorCalc
            )
          : null,

        React.createElement(
          'div',
          { className: 'slider-group' },
          React.createElement(
            'div',
            { className: 'slider-header' },
            React.createElement('label', null, 'Preço Gasolina'),
            React.createElement('span', null, 'R$ ' + gasPrice.toFixed(2).replace('.', ','))
          ),
          React.createElement('input', {
            type: 'range',
            min: '5.5',
            max: '6.5',
            step: '0.01',
            value: gasPrice,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setGasPrice(Number(e.target.value)),
          })
        ),

        React.createElement(
          'div',
          { className: 'slider-group' },
          React.createElement(
            'div',
            { className: 'slider-header' },
            React.createElement('label', null, 'Preço Diesel'),
            React.createElement('span', null, 'R$ ' + dieselPrice.toFixed(2).replace('.', ','))
          ),
          React.createElement('input', {
            type: 'range',
            min: '5.0',
            max: '6.0',
            step: '0.01',
            value: dieselPrice,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setDieselPrice(Number(e.target.value)),
          })
        ),

        React.createElement(
          'div',
          { className: 'slider-group' },
          React.createElement(
            'div',
            { className: 'slider-header' },
            React.createElement('label', null, 'Preço Etanol'),
            React.createElement('span', null, 'R$ ' + ethanolPrice.toFixed(2).replace('.', ','))
          ),
          React.createElement('input', {
            type: 'range',
            min: '3.3',
            max: '4.3',
            step: '0.01',
            value: ethanolPrice,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEthanolPrice(Number(e.target.value)),
          })
        )
      ),
      // Right content
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'grid grid-3', style: { marginBottom: 20 } },
          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-header' },
              React.createElement('div', { className: 'card-title' }, 'Lucro Diário'),
              React.createElement('div', { className: 'card-icon green' }, '💰')
            ),
            React.createElement('div', { className: 'card-value' }, cardValueDaily),
            React.createElement('div', { className: dailyChangeClass, id: 'dailyChange' }, dailyChangeText)
          ),

          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-header' },
              React.createElement('div', { className: 'card-title' }, 'Lucro Mensal'),
              React.createElement('div', { className: 'card-icon blue' }, '📈')
            ),
            React.createElement('div', { className: 'card-value' }, cardValueMonthly),
            React.createElement('div', { className: 'card-change up', id: 'monthlyChange' }, '▲ 12,3%')
          ),

          React.createElement(
            'div',
            { className: 'card' },
            React.createElement(
              'div',
              { className: 'card-header' },
              React.createElement('div', { className: 'card-title' }, 'Margem Média'),
              React.createElement('div', { className: 'card-icon yellow' }, '🎯')
            ),
            React.createElement('div', { className: 'card-value' }, cardValueMargin),
            React.createElement('div', { className: 'card-change neutral', id: 'marginChange' }, 'Meta: 12%')
          )
        ),

        React.createElement(
          'div',
          { className: 'card' },
          React.createElement(
            'div',
            { className: 'card-header' },
            React.createElement('div', { className: 'card-title' }, 'Projeção de Impacto')
          ),
          React.createElement(
            'div',
            { className: 'chart-container', style: { height: 220 } },
            React.createElement('canvas', { ref: (el: HTMLCanvasElement | null) => (chartCanvasRef.current = el), id: 'simulatorChart' })
          )
        ),

        loadingCalc || loadingBase
          ? React.createElement('div', { style: { marginTop: 12, fontSize: 12, color: 'var(--gray-500)' } }, 'Atualizando...')
          : null
      )
    )
  );

  return root;
}
