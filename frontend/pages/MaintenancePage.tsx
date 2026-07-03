import React, { useMemo, useState } from 'react';
import { notify } from '../src/notify';

type MaintEquip = {
  icon: string;
  name: string;
  detail: string;
  statusClass: string;
  statusText: string;
};

const NEW_ORDER_POOL: MaintEquip[] = [
  { icon: '🧯', name: 'Extintor Área 2', detail: 'Ordem aberta agora • Aguardando técnico', statusClass: 'warn', statusText: 'Agendada' },
  { icon: '🚿', name: 'Lavador de Peças', detail: 'Ordem aberta agora • Aguardando técnico', statusClass: 'warn', statusText: 'Agendada' },
  { icon: '🖥️', name: 'PDV Loja 02', detail: 'Ordem aberta agora • Aguardando técnico', statusClass: 'warn', statusText: 'Agendada' },
];

export default function MaintenancePage(): JSX.Element {
  const summary = useMemo(
    () => ({
      ok: { value: '18', text: 'de 22 total' },
      pending: { value: '3', text: '2 urgentes' },
      next: { value: '5 dias', text: 'Gerador - 10/07' },
    }),
    []
  );

  const [equipments, setEquipments] = useState<MaintEquip[]>(() => [
    { icon: '⛽', name: 'Bomba 05', detail: 'Manutenção corretiva - Troca de mangueira • Técnico: João Silva • Início: 02/07 08:30', statusClass: 'err', statusText: 'Em andamento' },
    { icon: '🔌', name: 'Compressor de Ar', detail: 'Preventiva agendada • Próxima: 08/07/2026', statusClass: 'warn', statusText: 'Agendada' },
    { icon: '⚡', name: 'Gerador', detail: 'Preventiva agendada • Próxima: 10/07/2026', statusClass: 'warn', statusText: 'Agendada' },
    { icon: '🚗', name: 'Elevador Hidráulico', detail: 'Manutenção preventiva concluída • Última: 28/06/2026', statusClass: 'ok', statusText: 'OK' },
    { icon: '🎯', name: 'Calibrador Digital', detail: 'Calibração em dia • Próxima: 20/07/2026', statusClass: 'ok', statusText: 'OK' },
    { icon: '🛢️', name: 'Tanques (Todos)', detail: 'Inspeção trimestral em dia • Próxima: 15/08/2026', statusClass: 'ok', statusText: 'OK' },
  ]);

  const [nextOrderIdx, setNextOrderIdx] = useState(0);

  const handleNewOrder = () => {
    const template = NEW_ORDER_POOL[nextOrderIdx % NEW_ORDER_POOL.length];
    setEquipments((prev) => [{ ...template }, ...prev]);
    setNextOrderIdx((i) => i + 1);
    notify(`Ordem de serviço criada para "${template.name}".`);
  };

  return React.createElement(
    'div',
    { className: 'module-page active' },

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'grid grid-3' },
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Equipamentos OK'), React.createElement('div', { className: 'card-icon green' }, '✅')),
          React.createElement('div', { className: 'card-value' }, summary.ok.value),
          React.createElement('div', { className: 'card-change neutral' }, summary.ok.text)
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Manutenções Pendentes'), React.createElement('div', { className: 'card-icon yellow' }, '⚠️')),
          React.createElement('div', { className: 'card-value' }, summary.pending.value),
          React.createElement('div', { className: 'card-change down' }, summary.pending.text)
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Próxima Preventiva'), React.createElement('div', { className: 'card-icon blue' }, '🔧')),
          React.createElement('div', { className: 'card-value' }, summary.next.value),
          React.createElement('div', { className: 'card-change neutral' }, summary.next.text)
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
          React.createElement('div', { className: 'card-title' }, 'Status dos Equipamentos'),
          React.createElement('button', { className: 'btn btn-primary', onClick: handleNewOrder }, '+ Nova Ordem')
        ),
        React.createElement(
          'div',
          { style: { padding: 8 } },
          ...equipments.map((e, idx) =>
            React.createElement(
              'div',
              { key: `${e.name}-${idx}`, className: 'maint-item' },
              React.createElement('div', { className: 'maint-icon' }, e.icon),
              React.createElement('div', { className: 'maint-info' },
                React.createElement('h4', null, e.name),
                React.createElement('p', null, e.detail)
              ),
              React.createElement('span', { className: `status ${e.statusClass}` }, e.statusText)
            )
          )
        )
      )
    )
  );
}
