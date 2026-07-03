import React, { useMemo, useState } from 'react';
import { notify } from '../src/notify';

type StockItem = {
  product: string;
  category: string;
  stock: number;
  min: number;
};

const NEW_ITEM_POOL: StockItem[] = [
  { product: 'Óleo Lubrax 20W50', category: 'Lubrificantes', stock: 30, min: 20 },
  { product: 'Aditivo de Combustível', category: 'Aditivos', stock: 18, min: 12 },
  { product: 'Refrigerante Lata 350ml', category: 'Bebidas', stock: 96, min: 80 },
  { product: 'Palheta Traseira', category: 'Palhetas', stock: 10, min: 8 },
];

function pct(stock: number, min: number) {
  // apenas p/ visual: percent do “mínimo”
  if (min <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((stock / min) * 100)));
}

export default function StockPage(): JSX.Element {
  const [items, setItems] = useState<StockItem[]>(() => [
    { product: 'Óleo Lubrax 5W30', category: 'Lubrificantes', stock: 48, min: 20 },
    { product: 'Água Mineral 500ml', category: 'Bebidas', stock: 120, min: 100 },
    { product: 'Aditivo Radiador', category: 'Aditivos', stock: 8, min: 15 },
    { product: 'Filtro de Óleo', category: 'Filtros', stock: 32, min: 20 },
    { product: 'Óleo Motor 20W50', category: 'Óleos', stock: 24, min: 15 },
    { product: 'Palheta Limpador', category: 'Palhetas', stock: 14, min: 10 },
    { product: 'Fluido de Freio', category: 'Aditivos', stock: 6, min: 12 },
  ]);

  const handleAddItem = () => {
    const template = NEW_ITEM_POOL[items.length % NEW_ITEM_POOL.length];
    setItems((prev) => [...prev, { ...template }]);
    notify(`"${template.product}" adicionado ao estoque.`);
  };

  return React.createElement(
    'div',
    { className: 'module-page active' },
    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement(
          'div',
          { className: 'card-header' },
          React.createElement('div', { className: 'card-title' }, 'Controle de Estoque Geral'),
          React.createElement('button', { className: 'btn btn-primary', onClick: handleAddItem }, '+ Adicionar Item')
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
                React.createElement('th', null, 'Estoque'),
                React.createElement('th', null, 'Mínimo'),
                React.createElement('th', null, 'Nível'),
                React.createElement('th', null, 'Status')
              )
            ),
            React.createElement(
              'tbody',
              null,
              ...items.map((it, idx) => {
                const p = pct(it.stock, it.min);
                let barClass = 'green';
                let status = 'ok';
                if (it.stock < it.min) {
                  barClass = 'red';
                  status = 'err';
                } else if (it.stock < it.min * 1.2) {
                  barClass = 'yellow';
                  status = 'warn';
                }
                return React.createElement(
                  'tr',
                  { key: `${it.product}-${idx}` },
                  React.createElement('td', null, React.createElement('strong', null, it.product)),
                  React.createElement('td', null, it.category),
                  React.createElement('td', null, `${it.stock} un`),
                  React.createElement('td', null, `${it.min} un`),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'div',
                      { className: 'progress', style: { width: 120 } },
                      React.createElement('div', { className: `progress-bar ${barClass}`, style: { width: `${p}%` } })
                    )
                  ),
                  React.createElement('td', null, React.createElement('span', { className: `status ${status}` }, status === 'ok' ? 'OK' : status === 'warn' ? 'Atenção' : 'Baixo'))
                );
              })
            )
          )
        )
      )
    )
  );
}
