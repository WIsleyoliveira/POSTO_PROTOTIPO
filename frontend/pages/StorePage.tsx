import React, { useMemo, useState } from 'react';

type StockRow = {
  product: string;
  category: string;
  qty: string;
  validity: string;
  statusClass: string;
  statusText: string;
};

type TableRow = {
  product: string;
  category: string;
  qty: string;
  validity: string;
  statusClass: string;
  statusText: string;
};

export default function StorePage(): JSX.Element {
  const [visible] = useState(true);

  const rows = useMemo<TableRow[]>(
    () => [
      { product: 'Iogurte Natural', category: 'Laticínios', qty: '12 un', validity: '05/07/2026', statusClass: 'err', statusText: '3 dias' },
      { product: 'Sanduíche Natural', category: 'Prontos', qty: '8 un', validity: '03/07/2026', statusClass: 'err', statusText: 'Hoje' },
      { product: 'Suco Integral', category: 'Bebidas', qty: '24 un', validity: '15/07/2026', statusClass: 'warn', statusText: '13 dias' },
      { product: 'Pão de Queijo', category: 'Congelados', qty: '40 un', validity: '20/07/2026', statusClass: 'ok', statusText: '18 dias' },
    ],
    []
  );

  return React.createElement(
    'div',
    { className: 'module-page active' },

    // Banner IA
    React.createElement(
      'div',
      { className: 'ai-banner' },
      React.createElement('div', { className: 'ai-avatar' }, '🤖'),
      React.createElement(
        'div',
        { className: 'ai-text' },
        React.createElement('h3', null, 'Loja de Conveniência ', React.createElement('span', { className: 'tag' }, 'IA')),
        React.createElement(
          'p',
          null,
          'A loja vende mais entre ',
          React.createElement('strong', null, '17h e 20h'),
          '. Sugiro reforçar o estoque de bebidas geladas e salgados nesse período. Hoje: ',
          React.createElement('strong', null, 'R$ 4.820'),
          ' em vendas (+8% vs ontem).'
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'grid grid-4' },
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Vendas Hoje'), React.createElement('div', { className: 'card-icon green' }, '💰')),
          React.createElement('div', { className: 'card-value' }, 'R$ 4.820'),
          React.createElement('div', { className: 'card-change up' }, '▲ 8% vs ontem')
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Ticket Médio'), React.createElement('div', { className: 'card-icon blue' }, '🎯')),
          React.createElement('div', { className: 'card-value' }, 'R$ 18,40'),
          React.createElement('div', { className: 'card-change up' }, '▲ 2,1%')
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Itens em Estoque'), React.createElement('div', { className: 'card-icon yellow' }, '📦')),
          React.createElement('div', { className: 'card-value' }, '842'),
          React.createElement('div', { className: 'card-change neutral' }, '12 categorias')
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Perdas (30d)'), React.createElement('div', { className: 'card-icon red' }, '⚠️')),
          React.createElement('div', { className: 'card-value' }, 'R$ 340'),
          React.createElement('div', { className: 'card-change down' }, '▼ 15% vs mês anterior')
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Produtos com Validade Próxima')
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
                React.createElement('th', null, 'Produto'),
                React.createElement('th', null, 'Categoria'),
                React.createElement('th', null, 'Qtd'),
                React.createElement('th', null, 'Validade'),
                React.createElement('th', null, 'Status')
              )
            ),
            React.createElement(
              'tbody',
              null,
              ...rows.map((r) =>
                React.createElement(
                  'tr',
                  { key: r.product },
                  React.createElement('td', null, r.product),
                  React.createElement('td', null, r.category),
                  React.createElement('td', null, r.qty),
                  React.createElement('td', null, r.validity),
                  React.createElement('td', null, React.createElement('span', { className: `status ${r.statusClass}` }, r.statusText))
                )
              )
            )
          )
        )
      )
    )
  );
}
