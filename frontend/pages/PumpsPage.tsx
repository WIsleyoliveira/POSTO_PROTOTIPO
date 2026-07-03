import React, { useMemo } from 'react';

type Pump = {
  number: string;
  statusClass: string;
  statusText: string;
  todayLiters: string;
  todayRevenue: string;
  downtime: string;
  operator: string;
};

export default function PumpsPage(): JSX.Element {
  const pumps = useMemo<Pump[]>(
    () => [
      { number: 'Bomba 01', statusClass: 'active', statusText: '● Ativa', todayLiters: '2.840 L', todayRevenue: 'R$ 16.728', downtime: '12 min', operator: 'Carlos M.' },
      { number: 'Bomba 02', statusClass: 'active', statusText: '● Ativa', todayLiters: '3.120 L', todayRevenue: 'R$ 18.345', downtime: '8 min', operator: 'Ana P.' },
      { number: 'Bomba 03', statusClass: 'idle', statusText: '○ Parada', todayLiters: '1.980 L', todayRevenue: 'R$ 11.234', downtime: '45 min', operator: 'João S.' },
      { number: 'Bomba 04', statusClass: 'active', statusText: '● Ativa', todayLiters: '2.650 L', todayRevenue: 'R$ 15.120', downtime: '15 min', operator: 'Marcos L.' },
      { number: 'Bomba 05', statusClass: 'maint', statusText: '⚠ Manutenção', todayLiters: '1.240 L', todayRevenue: 'R$ 7.012', downtime: '2h 10min', operator: '-' },
      { number: 'Bomba 06', statusClass: 'active', statusText: '● Ativa', todayLiters: '2.980 L', todayRevenue: 'R$ 17.520', downtime: '10 min', operator: 'Pedro A.' },
      { number: 'Bomba 07', statusClass: 'active', statusText: '● Ativa', todayLiters: '1.850 L', todayRevenue: 'R$ 10.840', downtime: '18 min', operator: 'Lucas F.' },
      { number: 'Bomba 08', statusClass: 'idle', statusText: '○ Parada', todayLiters: '1.760 L', todayRevenue: 'R$ 10.633', downtime: '32 min', operator: 'Rafael O.' },
    ],
    []
  );

  return React.createElement(
    'div',
    { className: 'module-page active' },

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'grid grid-4' },
        ...pumps.map((p) =>
          React.createElement(
            'div',
            { key: p.number, className: 'pump-card' },
            React.createElement(
              'div',
              { className: 'pump-header' },
              React.createElement('div', { className: 'pump-number' }, p.number),
              React.createElement('span', { className: `pump-status ${p.statusClass}` }, p.statusText)
            ),
            React.createElement(
              'div',
              { className: 'pump-stats' },
              React.createElement('div', { className: 'pump-stat' }, React.createElement('strong', null, p.todayLiters), React.createElement('span', null, 'Hoje')),
              React.createElement('div', { className: 'pump-stat' }, React.createElement('strong', null, p.todayRevenue), React.createElement('span', null, 'Faturamento')),
              React.createElement('div', { className: 'pump-stat' }, React.createElement('strong', null, p.downtime), React.createElement('span', null, 'Tempo parada')),
              React.createElement('div', { className: 'pump-stat' }, React.createElement('strong', null, p.operator), React.createElement('span', null, 'Operador'))
            )
          )
        )
      )
    )
  );
}
