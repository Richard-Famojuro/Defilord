import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefilordLanding from './components/DefilordLanding';
import BorrowPage from './components/BorrowPage';
import DashboardPage from './components/DashboardPage';
import NotFoundPage from './components/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefilordLanding />} />
        <Route path="/borrow" element={<BorrowPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
