import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { apiGet } from '../src/api';

type DashboardData = {
  aiBanner: { avatar: string; title: string; tag: string; textStrong: string; text: string };
  cards: Array<{ title: string; value: string; change: string; iconClass: string; icon?: string }>;
  cards2: Array<{ title: string; value: string; change: string; iconClass: string; icon?: string; progress?: number }>;
  charts: {
    sales7d: { labels: string[]; series: { sales: number[]; meta: number[] } };
    fuelMix: { labels: string[]; values: number[] };
    payment: { labels: string[]; values: number[] };
  };
};

function esc(s: unknown): string {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#039;');
}

function safeAt<T>(arr: any, idx: number, fallback: T): T {
  if (!Array.isArray(arr)) return fallback;
  return (arr[idx] ?? fallback) as T;
}

export default function DashboardPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [range, setRange] = useState<7 | 30>(7);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const chartsRef = useRef<{ sales?: Chart; fuel?: Chart; payment?: Chart }>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const dashboardData = await apiGet<DashboardData>(`/api/dashboard?range=${range}`);
        if (mounted) setData(dashboardData);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? 'Erro ao carregar dados');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [range]);

  // charts: só após data chegar
  useEffect(() => {
    if (!data) return;

    const salesCanvas = document.getElementById('salesChart') as HTMLCanvasElement | null;
    const fuelCanvas = document.getElementById('fuelMixChart') as HTMLCanvasElement | null;
    const paymentCanvas = document.getElementById('paymentChart') as HTMLCanvasElement | null;

    if (!salesCanvas || !fuelCanvas || !paymentCanvas) return;

    chartsRef.current.sales?.destroy();
    chartsRef.current.fuel?.destroy();
    chartsRef.current.payment?.destroy();

    chartsRef.current.sales = new Chart(salesCanvas, {
      type: 'line',
      data: {
        labels: data.charts.sales7d.labels,
        datasets: [
          {
            label: 'Faturamento (R$ mil)',
            data: data.charts.sales7d.series.sales,
            borderColor: '#1d4ed8',
            backgroundColor: 'rgba(29,78,216,0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3
          },
          {
            label: 'Meta (R$ mil)',
            data: data.charts.sales7d.series.meta,
            borderColor: '#fbbf24',
            borderDash: [5, 5],
            tension: 0,
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { beginAtZero: false, grid: { color: '#f1f5f9' } },
          x: { grid: { display: false } }
        }
      }
    });

    chartsRef.current.fuel = new Chart(fuelCanvas, {
      type: 'doughnut',
      data: {
        labels: data.charts.fuelMix.labels,
        datasets: [
          {
            data: data.charts.fuelMix.values,
            backgroundColor: ['#1d4ed8', '#fbbf24', '#10b981', '#3b82f6'],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%'
      }
    });

    chartsRef.current.payment = new Chart(paymentCanvas, {
      type: 'doughnut',
      data: {
        labels: data.charts.payment.labels,
        datasets: [
          {
            data: data.charts.payment.values,
            backgroundColor: ['#1d4ed8', '#fbbf24', '#10b981', '#64748b'],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '65%'
      }
    });
  }, [data]);

  const html = useMemo(() => {
    if (!data) return '';

    const cFallback = { title: '', value: '', change: '', iconClass: 'blue', icon: '' as string | undefined };
    const dFallback = { title: '', value: '', change: '', iconClass: 'blue', icon: '' as string | undefined, progress: 0 as number };

    const c1 = safeAt(data.cards, 0, cFallback);
    const c2 = safeAt(data.cards, 1, cFallback);
    const c3 = safeAt(data.cards, 2, cFallback);
    const c4 = safeAt(data.cards, 3, cFallback);

    const d1 = safeAt(data.cards2, 0, dFallback);
    const d2 = safeAt(data.cards2, 1, dFallback);
    const d3 = safeAt(data.cards2, 2, dFallback);
    const d4 = safeAt(data.cards2, 3, dFallback);

    const pct = typeof d2.progress === 'number' ? d2.progress : 0;

    return `
      <div class="ai-banner">
        <div class="ai-avatar">${esc(data.aiBanner.avatar || '🤖')}</div>
        <div class="ai-text">
          <h3>${esc(data.aiBanner.title)} <span class="tag">${esc(data.aiBanner.tag)}</span></h3>
          <p>Hoje as vendas estão <strong>${esc(data.aiBanner.textStrong)}</strong>. ${esc(data.aiBanner.text)}</p>
        </div>
      </div>

      <div class="section">
        <div class="grid grid-4">
          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(c1.title)}</div>
              <div class="card-icon ${esc(c1.iconClass)}">${esc(c1.icon || '')}</div>
            </div>
            <div class="card-value">${esc(c1.value)}</div>
            <div class="card-change up">${esc(c1.change)}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(c2.title)}</div>
              <div class="card-icon ${esc(c2.iconClass)}">${esc(c2.icon || '')}</div>
            </div>
            <div class="card-value">${esc(c2.value)}</div>
            <div class="card-change up">${esc(c2.change)}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(c3.title)}</div>
              <div class="card-icon ${esc(c3.iconClass)}">${esc(c3.icon || '')}</div>
            </div>
            <div class="card-value">${esc(c3.value)}</div>
            <div class="card-change up">${esc(c3.change)}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(c4.title)}</div>
              <div class="card-icon ${esc(c4.iconClass)}">${esc(c4.icon || '')}</div>
            </div>
            <div class="card-value">${esc(c4.value)}</div>
            <div class="card-change up">${esc(c4.change)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="grid grid-4">
          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(d1.title)}</div>
              <div class="card-icon ${esc(d1.iconClass)}">${esc(d1.icon || '')}</div>
            </div>
            <div class="card-value">${esc(d1.value)}</div>
            <div class="card-change neutral">${esc(d1.change)}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(d2.title)}</div>
              <div class="card-icon ${esc(d2.iconClass)}">${esc(d2.icon || '')}</div>
            </div>
            <div class="card-value">${esc(d2.value)}</div>
            <div class="progress" style="margin-top:8px">
              <div class="progress-bar yellow" style="width:${esc(pct)}%"></div>
            </div>
            <div class="card-change neutral" style="margin-top:6px">${esc(d2.change)}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(d3.title)}</div>
              <div class="card-icon ${esc(d3.iconClass)}">${esc(d3.icon || '')}</div>
            </div>
            <div class="card-value">${esc(d3.value)}</div>
            <div class="card-change up">${esc(d3.change)}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">${esc(d4.title)}</div>
              <div class="card-icon ${esc(d4.iconClass)}">${esc(d4.icon || '')}</div>
            </div>
            <div class="card-value">${esc(d4.value)}</div>
            <div class="card-change up">${esc(d4.change)}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3>Evolução de Vendas - Últimos ${esc(range)} dias</h3>
          <div class="actions">
            <button id="range7Btn" class="btn ${range === 7 ? 'btn-primary' : 'btn-outline'}" type="button">7 Dias</button>
            <button id="range30Btn" class="btn ${range === 30 ? 'btn-primary' : 'btn-outline'}" type="button">30 Dias</button>
          </div>
        </div>
        <div class="card">
          <div class="chart-container">
            <canvas id="salesChart"></canvas>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="grid grid-2">
          <div class="card">
            <div class="card-header">
              <div class="card-title">Mix de Combustível</div>
            </div>
            <div class="chart-container" style="height:240px">
              <canvas id="fuelMixChart"></canvas>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Formas de Pagamento</div>
            </div>
            <div class="chart-container" style="height:240px">
              <canvas id="paymentChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }, [data, range]);

  // Liga os botões "7 Dias" / "30 Dias" (renderizados via innerHTML acima)
  // à troca de período, que dispara um novo fetch em /api/dashboard.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const btn7 = root.querySelector<HTMLButtonElement>('#range7Btn');
    const btn30 = root.querySelector<HTMLButtonElement>('#range30Btn');

    const onClick7 = () => setRange(7);
    const onClick30 = () => setRange(30);

    btn7?.addEventListener('click', onClick7);
    btn30?.addEventListener('click', onClick30);

    return () => {
      btn7?.removeEventListener('click', onClick7);
      btn30?.removeEventListener('click', onClick30);
    };
  }, [html]);

  if (loading) return <div style={{ padding: 16 }}>Carregando dashboard...</div>;
  if (err) return <div style={{ padding: 16, color: '#991b1b', background: '#fee2e2', borderRadius: 10 }}>{err}</div>;
  if (!data) return <div style={{ padding: 16 }}>Sem dados</div>;

  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
