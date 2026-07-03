import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Title = { title: string; subtitle: string };

export default function AppLayoutFixed({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu mobile sempre que a rota muda (usuário navegou pra outra página)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const title = useMemo<Title>(() => {
    switch (pathname) {
      case '/':
        return { title: 'Painel Executivo', subtitle: 'Visão geral do posto Rede VR - Unidade Central' };
      case '/prices':
        return { title: 'Inteligência de Preços', subtitle: 'Monitoramento de concorrentes e sugestões da IA' };
      case '/tanks':
        return { title: 'Controle dos Tanques', subtitle: 'Monitoramento em tempo real dos níveis' };
      case '/purchases':
        return { title: 'Compras Inteligentes', subtitle: 'Previsão e sugestões da IA para abastecimento' };
      case '/pumps':
        return { title: 'Dashboard Bombas', subtitle: 'Performance individual de cada bomba' };
      case '/store':
        return { title: 'Loja de Conveniência', subtitle: 'Controle separado do combustível' };
      case '/stock':
        return { title: 'Estoque', subtitle: 'Lubrificantes, aditivos e produtos gerais' };
      case '/maintenance':
        return { title: 'Manutenção', subtitle: 'Controle de equipamentos e ordens de serviço' };
      case '/financial':
        return { title: 'Financeiro', subtitle: 'Fluxo de caixa, faturas e inadimplência' };
      case '/employees':
        return { title: 'Funcionários', subtitle: 'Escalas, ponto, comissão e férias' };
      case '/simulator':
        return { title: 'Simulador de Lucro', subtitle: 'Ajuste preços e veja o impacto em tempo real' };
      case '/map':
        return { title: 'Mapa de Vendas', subtitle: 'Desempenho de todas as unidades da rede' };
      case '/ai':
        return { title: 'IA Gerente', subtitle: 'Insights e notificações inteligentes' };
      default:
        return { title: 'Rede VR Fuel', subtitle: 'Sistema de Gestão' };
    }
  }, [pathname]);

  const isActive = (p: string) => (p === '/' ? pathname === '/' : pathname.startsWith(p));

  const NavItem = (props: { to: string; icon: string; label: string; keyName: string; badge?: string }) => {
    const { to, icon, label, badge } = props;
    const active = isActive(to);
    return React.createElement(
      Link,
      { to, className: `nav-item ${active ? 'active' : ''}` },
      React.createElement('span', { className: 'icon' }, icon),
      ' ',
      label,
      badge ? React.createElement('span', { className: 'badge' }, badge) : null
    );
  };

  return React.createElement(
    React.Fragment,
    null,
    // Overlay escuro atrás do menu mobile aberto — clicar nele fecha o menu
    React.createElement('div', {
      className: `sidebar-overlay ${menuOpen ? 'visible' : ''}`,
      onClick: () => setMenuOpen(false),
    }),
    React.createElement(
      'aside',
      { className: `sidebar ${menuOpen ? 'open' : ''}` },
      React.createElement(
        'div',
        { className: 'logo' },
        React.createElement('div', { className: 'logo-icon' }, '⛽'),
        React.createElement(
          'div',
          { className: 'logo-text' },
          React.createElement('h1', null, 'REDE VR'),
          React.createElement('p', null, 'Fuel Management System')
        )
      ),

      React.createElement(
        'div',
        { className: 'nav-section' },
        React.createElement('div', { className: 'nav-title' }, 'Principal'),
        NavItem({ keyName: 'dashboard', to: '/', icon: '📊', label: 'Painel Executivo' }),
        NavItem({ keyName: 'prices', to: '/prices', icon: '📈', label: 'Inteligência de Preços' }),
        NavItem({ keyName: 'tanks', to: '/tanks', icon: '🚛', label: 'Controle dos Tanques' }),
        NavItem({ keyName: 'purchases', to: '/purchases', icon: '🚚', label: 'Compras Inteligentes' })
      ),

      React.createElement(
        'div',
        { className: 'nav-section' },
        React.createElement('div', { className: 'nav-title' }, 'Operações'),
        NavItem({ keyName: 'pumps', to: '/pumps', icon: '⛽', label: 'Dashboard Bombas' }),
        NavItem({ keyName: 'store', to: '/store', icon: '🛒', label: 'Loja de Conveniência' }),
        NavItem({ keyName: 'stock', to: '/stock', icon: '📦', label: 'Estoque' }),
        NavItem({ keyName: 'maintenance', to: '/maintenance', icon: '🛠️', label: 'Manutenção', badge: '3' })
      ),

      React.createElement(
        'div',
        { className: 'nav-section' },
        React.createElement('div', { className: 'nav-title' }, 'Gestão'),
        NavItem({ keyName: 'financial', to: '/financial', icon: '💳', label: 'Financeiro' }),
        NavItem({ keyName: 'employees', to: '/employees', icon: '👨‍💼', label: 'Funcionários' })
      ),

      React.createElement(
        'div',
        { className: 'nav-section' },
        React.createElement('div', { className: 'nav-title' }, 'Análises'),
        NavItem({ keyName: 'simulator', to: '/simulator', icon: '💰', label: 'Simulador de Lucro' }),
        NavItem({ keyName: 'map', to: '/map', icon: '📍', label: 'Mapa de Vendas' }),
        NavItem({ keyName: 'ai', to: '/ai', icon: '🤖', label: 'IA Gerente', badge: '5' })
      )
    ),

    React.createElement(
      'main',
      { className: 'main' },
      React.createElement(
        'div',
        { className: 'topbar' },
        React.createElement(
          'div',
          { className: 'topbar-left' },
          React.createElement(
            'button',
            {
              className: 'menu-toggle',
              'aria-label': 'Abrir menu',
              onClick: () => setMenuOpen((v) => !v),
            },
            '☰'
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h2', null, title.title),
            React.createElement('p', null, title.subtitle)
          )
        ),
        React.createElement(
          'div',
          { className: 'topbar-right' },
          React.createElement(
            'div',
            { className: 'search-box' },
            React.createElement('span', null, '🔍'),
            React.createElement('input', { type: 'text', placeholder: 'Buscar...' })
          ),
          React.createElement('div', { className: 'icon-btn' }, '🔔', React.createElement('span', { className: 'dot' })),
          React.createElement('div', { className: 'icon-btn' }, '💬'),
          React.createElement(
            'div',
            { className: 'user' },
            React.createElement('div', { className: 'avatar' }, 'RC'),
            React.createElement(
              'div',
              { className: 'user-info' },
              React.createElement('strong', null, 'Ricardo Costa'),
              React.createElement('span', null, 'Gestor Geral')
            )
          )
        )
      ),
      children
    )
  );
}
