// Utilitário simples de "toast" (notificação flutuante), usado para dar
// feedback visual em ações mockadas (ex.: "+ Adicionar", "Cobrar", "Nova
// Ordem"...) que ainda não têm um backend real por trás. Sem dependências
// extras: cria/anima um <div> no body e some sozinho.

let container: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (container && document.body.contains(container)) return container;
  container = document.createElement('div');
  container.setAttribute('id', 'toast-container');
  Object.assign(container.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
  } as CSSStyleDeclaration);
  document.body.appendChild(container);
  return container;
}

export type ToastKind = 'success' | 'info' | 'error';

const KIND_STYLES: Record<ToastKind, { bg: string; fg: string; icon: string }> = {
  success: { bg: '#d1fae5', fg: '#065f46', icon: '✅' },
  info: { bg: '#dbeafe', fg: '#1d4ed8', icon: 'ℹ️' },
  error: { bg: '#fee2e2', fg: '#991b1b', icon: '⚠️' },
};

export function notify(message: string, kind: ToastKind = 'success') {
  const root = getContainer();
  const el = document.createElement('div');
  const style = KIND_STYLES[kind];

  Object.assign(el.style, {
    background: style.bg,
    color: style.fg,
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
    transform: 'translateX(20px)',
    opacity: '0',
    transition: 'transform 0.25s ease, opacity 0.25s ease',
    maxWidth: '320px',
  } as CSSStyleDeclaration);

  el.textContent = `${style.icon} ${message}`;
  root.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)';
    el.style.opacity = '1';
  });

  setTimeout(() => {
    el.style.transform = 'translateX(20px)';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 250);
  }, 2600);
}
