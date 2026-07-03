import React, { useMemo, useState } from 'react';
import { notify } from '../src/notify';

type EmployeeCard = {
  initials: string;
  name: string;
  role: string;
  commission: string;
  presence: string;
};

const NAME_POOL: Array<{ name: string; role: string }> = [
  { name: 'Bruna Castro', role: 'Operadora • Turno A' },
  { name: 'Diego Ramos', role: 'Frentista • Turno B' },
  { name: 'Camila Torres', role: 'Caixa Loja' },
  { name: 'Eduardo Nunes', role: 'Operador • Turno C' },
  { name: 'Juliana Rocha', role: 'Administrativo' },
];

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export default function EmployeesPage(): JSX.Element {
  const summary = useMemo(
    () => ({
      total: { value: '24', text: '18 operadores, 6 admin', icon: '👥', iconClass: 'blue' },
      today: { value: '14', text: 'Turno A e B', icon: '✅', iconClass: 'green' },
      vacation: { value: '3', text: 'próximos 30 dias', icon: '🏖️', iconClass: 'yellow' },
      commission: { value: 'R$ 8.420', text: '▲ 6% vs mês anterior', icon: '💰', iconClass: 'green' },
    }),
    []
  );

  const [employees, setEmployees] = useState<EmployeeCard[]>(() => [
    { initials: 'CM', name: 'Carlos Mendes', role: 'Operador • Turno A', commission: 'R$ 1.240', presence: '98%' },
    { initials: 'AP', name: 'Ana Paula', role: 'Operadora • Turno A', commission: 'R$ 1.380', presence: '100%' },
    { initials: 'JS', name: 'João Silva', role: 'Operador • Turno B', commission: 'R$ 980', presence: '95%' },
    { initials: 'ML', name: 'Marcos Lima', role: 'Frentista • Turno B', commission: 'R$ 1.120', presence: '97%' },
    { initials: 'PA', name: 'Pedro Alves', role: 'Operador • Turno C', commission: 'R$ 1.050', presence: '96%' },
    { initials: 'LF', name: 'Lucas Ferreira', role: 'Caixa Loja', commission: 'R$ 780', presence: '99%' },
    { initials: 'RO', name: 'Rafael Oliveira', role: 'Operador • Turno C', commission: 'R$ 920', presence: '94%' },
    { initials: 'FS', name: 'Fernanda Souza', role: 'Administrativo', commission: 'R$ 450', presence: '100%' },
  ]);

  const handleAddEmployee = () => {
    const pick = NAME_POOL[employees.length % NAME_POOL.length];
    const newEmployee: EmployeeCard = {
      initials: initialsOf(pick.name),
      name: pick.name,
      role: pick.role,
      commission: 'R$ 0',
      presence: '100%',
    };
    setEmployees((prev) => [...prev, newEmployee]);
    notify(`${pick.name} adicionado(a) à equipe.`);
  };

  return React.createElement(
    'div',
    { className: 'module-page active' },

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'grid grid-4' },
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Total Funcionários'), React.createElement('div', { className: 'card-icon ' + summary.total.iconClass }, summary.total.icon)),
          React.createElement('div', { className: 'card-value' }, summary.total.value),
          React.createElement('div', { className: 'card-change neutral' }, summary.total.text)
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Em Escala Hoje'), React.createElement('div', { className: 'card-icon ' + summary.today.iconClass }, summary.today.icon)),
          React.createElement('div', { className: 'card-value' }, summary.today.value),
          React.createElement('div', { className: 'card-change neutral' }, summary.today.text)
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Férias Próximas'), React.createElement('div', { className: 'card-icon ' + summary.vacation.iconClass }, summary.vacation.icon)),
          React.createElement('div', { className: 'card-value' }, summary.vacation.value),
          React.createElement('div', { className: 'card-change neutral' }, summary.vacation.text)
        ),
        React.createElement(
          'div',
          { className: 'card' },
          React.createElement('div', { className: 'card-header' }, React.createElement('div', { className: 'card-title' }, 'Comissão Mês'), React.createElement('div', { className: 'card-icon ' + summary.commission.iconClass }, summary.commission.icon)),
          React.createElement('div', { className: 'card-value' }, summary.commission.value),
          React.createElement('div', { className: 'card-change up' }, summary.commission.text)
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'section' },
      React.createElement(
        'div',
        { className: 'section-header' },
        React.createElement('h3', null, 'Equipe'),
        React.createElement('button', { className: 'btn btn-primary', onClick: handleAddEmployee }, '+ Adicionar')
      ),
      React.createElement(
        'div',
        { className: 'grid grid-4' },
        ...employees.map((e) =>
          React.createElement(
            'div',
            { key: e.name, className: 'emp-card' },
            React.createElement('div', { className: 'emp-avatar' }, e.initials),
            React.createElement('h4', null, e.name),
            React.createElement('div', { className: 'role' }, e.role),
            React.createElement(
              'div',
              { className: 'emp-stats' },
              React.createElement('div', null, React.createElement('strong', null, e.commission), React.createElement('span', null, 'Comissão')),
              React.createElement('div', null, React.createElement('strong', null, e.presence), React.createElement('span', null, 'Presença'))
            )
          )
        )
      )
    )
  );
}
