import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayoutFixed from '../components/AppLayoutFixed';

import DashboardPage from '../pages/DashboardPage';
import PricesPage from '../pages/PricesPage';
import TanksPage from '../pages/TanksPage';
import PurchasesPage from '../pages/PurchasesPage';
import PumpsPage from '../pages/PumpsPage';
import StorePage from '../pages/StorePage';
import StockPage from '../pages/StockPage';
import MaintenancePage from '../pages/MaintenancePage';
import FinancialPage from '../pages/FinancialPage';
import EmployeesPage from '../pages/EmployeesPage';
import SimulatorPage from '../pages/SimulatorPage';
import MapPage from '../pages/MapPage';
import AiPage from '../pages/AiPage';

export default function AppWithLayout(): JSX.Element {
  return (
    <AppLayoutFixed>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/prices" element={<PricesPage />} />
        <Route path="/tanks" element={<TanksPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/pumps" element={<PumpsPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/financial" element={<FinancialPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/ai" element={<AiPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayoutFixed>
  );
}
