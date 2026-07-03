import React, { useMemo, useState } from 'react';

type AiMsg = {
  variant: 'danger' | 'warn' | 'success' | 'info' | 'neutral';
  icon: string;
  title: string;
  body: string;
  time: string;
};

export default function AiPage(): JSX.Element {
  const [active] = useState(true);

  const msgs = useMemo<AiMsg[]>(
    () => [
      {
        variant: 'danger',
        icon: '📉',
        title: 'Queda nas vendas detectada',
        body: 'As vendas da bomba 3 caíram 22% hoje em comparação com a média. Verifique se há algum problema operacional ou se o operador precisa de suporte.',
        time: 'há 12 minutos',
      },
      {
        variant: 'warn',
        icon: '⛽',
        title: 'Nível crítico de combustível',
        body: 'Há combustível para apenas 2 dias no Tanque 02 (Diesel S10). Recomendo acionar a distribuidora hoje para evitar ruptura de estoque.',
        time: 'há 28 minutos',
      },
      {
        variant: 'warn',
        icon: '💰',
        title: 'Margem do etanol abaixo da meta',
        body: 'A margem do etanol está em R$ 0,41/L, abaixo da meta de R$ 0,50/L. Sugiro revisar o preço ou negociar com o fornecedor Raízen.',
        time: 'há 1 hora',
      },
      {
        variant: 'success',
        icon: '🛒',
        title: 'Pico de vendas na loja',
        body: 'A loja de conveniência vende mais entre 17h e 20h. Reforce o estoque de bebidas geladas e salgados nesse período para maximizar receita.',
        time: 'há 2 horas',
      },
      {
        variant: 'neutral',
        icon: '📈',
        title: 'Oportunidade de preço',
        body: 'O concorrente Posto Avenida aumentou R$ 0,10 na gasolina. Mantenha seu preço atual para capturar parte da clientela.',
        time: 'há 3 horas',
      },
      {
        variant: 'success',
        icon: '✅',
        title: 'Meta do dia quase batida',
        body: 'Faltam apenas R$ 24.500 para atingir a meta diária. Com o ritmo atual, deve ser alcançada até 19h.',
        time: 'há 4 horas',
      },
    ],
    []
  );

  return React.createElement(
    'div',
    { className: 'module-page ' + (active ? 'active' : '') },

    React.createElement(
      'div',
      { className: 'ai-banner' },
      React.createElement('div', { className: 'ai-avatar' }, '🤖'),
      React.createElement(
        'div',
        { className: 'ai-text' },
        React.createElement('h3', null, 'IA Gerente Rede VR ', React.createElement('span', { className: 'tag' }, 'ATIVA 24/7')),
        React.createElement('p', null, 'Monitorando todos os módulos em tempo real. Hoje gerei ', React.createElement('strong', null, '12 insights'), ' e ', React.createElement('strong', null, '5 alertas'), '. Economia sugerida: ', React.createElement('strong', null, 'R$ 8.400'))
      )
    ),

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement('div', { className: 'section-header' }, React.createElement('h3', null, 'Notificações Recentes')),

      ...msgs.map((m, idx) =>
        React.createElement(
          'div',
          { key: idx, className: 'ai-msg ' + (m.variant === 'neutral' ? '' : m.variant) },
          React.createElement('div', { className: 'ai-msg-icon' }, m.icon),
          React.createElement(
            'div',
            { className: 'ai-msg-content' },
            React.createElement('h4', null, m.title),
            React.createElement('p', null, m.body),
            React.createElement('div', { className: 'ai-msg-time' }, m.time)
          )
        )
      )
    )
  );
}
