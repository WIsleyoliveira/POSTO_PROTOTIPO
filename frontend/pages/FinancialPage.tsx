import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { notify } from '../src/notify';

const COLORS = {
  blue: '#1d4ed8',
  yellow: '#fbbf24',
  green: '#10b981',
  red: '#ef4444',
  gray: '#64748b',
  grid: '#f1f5f9',
};

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}
function fmtBRL_k(n: number) {
  return (n / 1000).toFixed(1) + 'k';
}

type Seed = {
  payment: { labels: string[]; values: number[] };
  cashflow: { labels: string[]; entradas: number[]; saidas: number[] };
};

type OverdueInvoice = {
  client: string;
  type: string;
  value: string;
  dueDate: string;
  daysLate: string;
};

function destroyChart(c: Chart | null) {
  if (!c) return;
  c.destroy();
}

export default function FinancialPage(): JSX.Element {
  const paymentRef = useRef<HTMLCanvasElement | null>(null);
  const cashflowRef = useRef<HTMLCanvasElement | null>(null);

  const paymentChartRef = useRef<Chart | null>(null);
  const cashflowChartRef = useRef<Chart | null>(null);

  const [rendered, setRendered] = useState(false);

  const [overdue, setOverdue] = useState<OverdueInvoice[]>(() => [
    { client: 'Transportes Silva LTDA', type: 'Convênio', value: 'R$ 1.840,00', dueDate: '25/06/2026', daysLate: '7 dias' },
    { client: 'Auto Escola Central', type: 'Convênio', value: 'R$ 920,00', dueDate: '28/06/2026', daysLate: '4 dias' },
    { client: 'Marcos Oliveira', type: 'Cartão Loja', value: 'R$ 380,00', dueDate: '30/06/2026', daysLate: '2 dias' },
    { client: 'Logística Express', type: 'Convênio', value: 'R$ 1.680,00', dueDate: '01/07/2026', daysLate: '1 dia' },
  ]);

  const [extraOverdue] = useState<OverdueInvoice[]>(() => [
    { client: 'Frota Rápida Transportes', type: 'Convênio', value: 'R$ 640,00', dueDate: '22/06/2026', daysLate: '10 dias' },
    { client: 'Sindicato dos Taxistas', type: 'Convênio', value: 'R$ 1.120,00', dueDate: '20/06/2026', daysLate: '12 dias' },
    { client: 'Renata Almeida', type: 'Cartão Loja', value: 'R$ 210,00', dueDate: '29/06/2026', daysLate: '3 dias' },
  ]);

  const [showAll, setShowAll] = useState(false);

  const handleCobrar = (client: string) => {
    setOverdue((prev) => prev.filter((inv) => inv.client !== client));
    notify(`Cobrança enviada para ${client}.`);
  };

  const handleVerTodos = () => {
    if (showAll) {
      setShowAll(false);
      return;
    }
    setOverdue((prev) => [...prev, ...extraOverdue]);
    setShowAll(true);
    notify(`Mostrando todas as ${overdue.length + extraOverdue.length} faturas em atraso.`, 'info');
  };

  const seed = useMemo<Seed>(
    () => ({
      payment: {
        labels: ['Cartão', 'PIX', 'Dinheiro', 'Convênios'],
        values: [48, 28, 14, 10], // R$ mil (mock)
      },
      cashflow: {
        labels: ['Qui', 'Sex', 'Sáb', 'Dom', 'Seg', 'Ter', 'Hoje'],
        entradas: [72, 78, 98, 92, 76, 82, 87],
        saidas: [48, 52, 58, 54, 50, 52, 55],
      },
    }),
    []
  );

  useEffect(() => {
    const paymentCanvas = paymentRef.current;
    const cashflowCanvas = cashflowRef.current;
    if (!paymentCanvas || !cashflowCanvas) return;

    destroyChart(paymentChartRef.current);
    destroyChart(cashflowChartRef.current);
    paymentChartRef.current = null;
    cashflowChartRef.current = null;

    paymentChartRef.current = new Chart(paymentCanvas, {
      type: 'doughnut',
      data: {
        labels: seed.payment.labels,
        datasets: [
          {
            data: seed.payment.values,
            backgroundColor: [COLORS.blue, COLORS.yellow, COLORS.green, COLORS.gray],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%',
      },
    });

    cashflowChartRef.current = new Chart(cashflowCanvas, {
      type: 'bar',
      data: {
        labels: seed.cashflow.labels,
        datasets: [
          {
            label: 'Entradas',
            data: seed.cashflow.entradas,
            backgroundColor: COLORS.green,
            borderRadius: 6,
          },
          {
            label: 'Saídas',
            data: seed.cashflow.saidas,
            backgroundColor: COLORS.red,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { grid: { color: COLORS.grid } }, x: { grid: { display: false } } },
      },
    });

    setRendered(true);

    return () => {
      destroyChart(paymentChartRef.current);
      destroyChart(cashflowChartRef.current);
      paymentChartRef.current = null;
      cashflowChartRef.current = null;
    };
  }, [seed]);

  const root = React.createElement(
    'div',
    { className: 'section' },

    // Cards topo
    React.createElement(
      'div',
      { className: 'grid grid-4' },
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Fluxo de Caixa'),
          React.createElement('div', { className: 'card-icon green' }, '💵')
        ),
        React.createElement('div', { className: 'card-value' }, 'R$ 142.380'),
        React.createElement('div', { className: 'card-change up' }, '▲ 18% vs mês anterior')
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Contas a Receber'),
          React.createElement('div', { className: 'card-icon blue' }, '📥')
        ),
        React.createElement('div', { className: 'card-value' }, 'R$ 28.400'),
        React.createElement('div', { className: 'card-change neutral' }, '12 faturas')
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Contas a Pagar'),
          React.createElement('div', { className: 'card-icon red' }, '📤')
        ),
        React.createElement('div', { className: 'card-value' }, 'R$ 96.200'),
        React.createElement('div', { className: 'card-change down' }, 'Próx. 7 dias: R$ 42k')
      ),
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Inadimplência'),
          React.createElement('div', { className: 'card-icon yellow' }, '⚠️')
        ),
        React.createElement('div', { className: 'card-value' }, 'R$ 4.820'),
        React.createElement('div', { className: 'card-change down' }, '7 clientes')
      )
    ),

    // Gráficos
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'grid grid-2' },
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' },
            React.createElement('div', { className: 'card-title' }, 'Receita por Forma de Pagamento')
          ),
          React.createElement(
            'div',
            { className: 'chart-container', style: { height: 260 } },
            React.createElement('canvas', {
              ref: (el: HTMLCanvasElement | null) => (paymentRef.current = el),
              id: 'paymentTypeChart',
            })
          )
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' },
            React.createElement('div', { className: 'card-title' }, 'Fluxo de Caixa - 7 dias')
          ),
          React.createElement(
            'div',
            { className: 'chart-container', style: { height: 260 } },
            React.createElement('canvas', {
              ref: (el: HTMLCanvasElement | null) => (cashflowRef.current = el),
              id: 'cashflowChart',
            })
          )
        )
      ),
      rendered
        ? null
        : React.createElement('div', { style: { padding: 12, color: COLORS.gray, fontSize: 12 } }, 'Carregando gráficos...')
    ),

    // Tabela
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Clientes Inadimplentes'),
          React.createElement('button', { className: 'btn btn-outline', onClick: handleVerTodos }, showAll ? 'Ver menos' : 'Ver todos')
        ),
        React.createElement(
          'div',
          { className: 'table-wrap' },
          React.createElement(
            'table',
            null,
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement('th', null, 'Cliente'),
                React.createElement('th', null, 'Tipo'),
                React.createElement('th', null, 'Valor'),
                React.createElement('th', null, 'Vencimento'),
                React.createElement('th', null, 'Dias Atraso'),
                React.createElement('th', null, 'Ação')
              )
            ),
            React.createElement(
              'tbody',
              null,
              overdue.length === 0
                ? React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      { colSpan: 6, style: { textAlign: 'center', color: COLORS.gray, padding: 24 } },
                      'Nenhuma fatura em atraso 🎉'
                    )
                  )
                : overdue.map((inv) =>
                    React.createElement(
                      'tr',
                      { key: inv.client },
                      React.createElement('td', null, React.createElement('strong', null, inv.client)),
                      React.createElement('td', null, inv.type),
                      React.createElement('td', null, inv.value),
                      React.createElement('td', null, inv.dueDate),
                      React.createElement('td', null, inv.daysLate),
                      React.createElement(
                        'td',
                        null,
                        React.createElement('button', { className: 'btn btn-outline', onClick: () => handleCobrar(inv.client) }, 'Cobrar')
                      )
                    )
                  )
            )
          )
        )
      )
    )
  );

  return root;
}
