import React, { useMemo, useState } from 'react';

type UnitRow = {
  rank: string;
  unit: string;
  revenue: string;
  profit: string;
  margin: string;
  trendClass: string;
  trendText: string;
};

export default function MapPage(): JSX.Element {
  const [activeMode, setActiveMode] = useState<'faturamento' | 'lucro'>('faturamento');

  const units = useMemo<UnitRow[]>(
    () => [
      { rank: '1º', unit: 'Rede VR Centro', revenue: 'R$ 142.380', profit: 'R$ 24.120', margin: '16,9%', trendClass: 'up', trendText: '▲ 12%' },
      { rank: '2º', unit: 'Rede VR Sul', revenue: 'R$ 118.420', profit: 'R$ 19.840', margin: '16,7%', trendClass: 'up', trendText: '▲ 8%' },
      { rank: '3º', unit: 'Rede VR Norte', revenue: 'R$ 98.750', profit: 'R$ 16.240', margin: '16,4%', trendClass: 'up', trendText: '▲ 5%' },
      { rank: '4º', unit: 'Rede VR Leste', revenue: 'R$ 87.320', profit: 'R$ 14.120', margin: '16,1%', trendClass: 'down', trendText: '▼ 2%' },
      { rank: '5º', unit: 'Rede VR Oeste', revenue: 'R$ 76.480', profit: 'R$ 11.840', margin: '15,4%', trendClass: 'up', trendText: '▲ 3%' },
      { rank: '6º', unit: 'Rede VR Plaza', revenue: 'R$ 68.200', profit: 'R$ 10.420', margin: '15,2%', trendClass: 'neutral', trendText: '→ 0%' },
      { rank: '7º', unit: 'Rede VR Express', revenue: 'R$ 52.140', profit: 'R$ 7.820', margin: '15,0%', trendClass: 'up', trendText: '▲ 7%' },
      { rank: '8º', unit: 'Rede VR Park', revenue: 'R$ 38.920', profit: 'R$ 5.420', margin: '13,9%', trendClass: 'down', trendText: '▼ 4%' },
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
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Unidades Ativas'), React.createElement('div', { className: 'card-icon blue' }, '📍')),
          React.createElement('div', { className: 'card-value' }, '8'),
          React.createElement('div', { className: 'card-change neutral' }, 'Rede VR')
        ),
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Faturamento Total'), React.createElement('div', { className: 'card-icon green' }, '💰')),
          React.createElement('div', { className: 'card-value' }, 'R$ 682k'),
          React.createElement('div', { className: 'card-change up' }, '▲ 11% vs mês anterior')
        ),
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Melhor Unidade'), React.createElement('div', { className: 'card-icon yellow' }, '🏆')),
          React.createElement('div', { className: 'card-value' }, 'Rede VR Centro'),
          React.createElement('div', { className: 'card-change neutral' }, 'R$ 142k no mês')
        ),
        React.createElement('div', { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Lucro Consolidado'), React.createElement('div', { className: 'card-icon green' }, '📈')),
          React.createElement('div', { className: 'card-value' }, 'R$ 118k'),
          React.createElement('div', { className: 'card-change up' }, '▲ 14,2%')
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
          React.createElement('div', { className: 'card-title' }, 'Mapa de Vendas - Rede VR'),
          React.createElement(
            'div',
            { className: 'actions' },
            React.createElement(
              'button',
              {
                className: `btn ${activeMode === 'faturamento' ? 'btn-primary' : 'btn-outline'}`,
                onClick: () => setActiveMode('faturamento'),
              },
              'Faturamento'
            ),
            React.createElement(
              'button',
              {
                className: `btn ${activeMode === 'lucro' ? 'btn-primary' : 'btn-outline'}`,
                onClick: () => setActiveMode('lucro'),
              },
              'Lucro'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'map-container' },
          React.createElement('div', { className: 'map-point gold', style: { top: '20%', left: '30%' } }, React.createElement('strong', null, '1º'), `Rede VR Centro • ${activeMode === 'faturamento' ? units[0].revenue : units[0].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '40%', left: '60%' } }, React.createElement('strong', null, '2º'), `Rede VR Sul • ${activeMode === 'faturamento' ? units[1].revenue : units[1].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '60%', left: '25%' } }, React.createElement('strong', null, '3º'), `Rede VR Norte • ${activeMode === 'faturamento' ? units[2].revenue : units[2].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '30%', left: '75%' } }, React.createElement('strong', null, '4º'), `Rede VR Leste • ${activeMode === 'faturamento' ? units[3].revenue : units[3].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '70%', left: '55%' } }, React.createElement('strong', null, '5º'), `Rede VR Oeste • ${activeMode === 'faturamento' ? units[4].revenue : units[4].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '50%', left: '45%' } }, React.createElement('strong', null, '6º'), `Rede VR Plaza • ${activeMode === 'faturamento' ? units[5].revenue : units[5].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '15%', left: '55%' } }, React.createElement('strong', null, '7º'), `Rede VR Express • ${activeMode === 'faturamento' ? units[6].revenue : units[6].profit}`),
          React.createElement('div', { className: 'map-point', style: { top: '75%', left: '75%' } }, React.createElement('strong', null, '8º'), `Rede VR Park • ${activeMode === 'faturamento' ? units[7].revenue : units[7].profit}`)
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'card' },
        React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Ranking de Unidades')),
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
                React.createElement('th', null, '#'),
                React.createElement('th', null, 'Unidade'),
                React.createElement('th', null, 'Faturamento'),
                React.createElement('th', null, 'Lucro'),
                React.createElement('th', null, 'Margem'),
                React.createElement('th', null, 'Tendência')
              )
            ),
            React.createElement(
              'tbody',
              null,
              ...units.map((u) =>
                React.createElement(
                  'tr',
                  { key: u.rank + u.unit },
                  React.createElement('td', null, React.createElement('strong', null, u.rank)),
                  React.createElement('td', null, u.unit),
                  React.createElement('td', null, u.revenue),
                  React.createElement('td', null, u.profit),
                  React.createElement('td', null, u.margin),
                  React.createElement('td', null, React.createElement('span', { className: 'card-change ' + u.trendClass }, u.trendText))
                )
              )
            )
          )
        )
      )
    )
  );
}
