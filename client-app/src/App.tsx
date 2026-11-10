import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ProtocolsPage } from './pages/ProtocolsPage';
import { ProtocolDetailPage } from './pages/ProtocolDetailPage';
import { LabsPage } from './pages/LabsPage';
import { AiModernPage } from './pages/AiModernPage';
import { QuizzesPage } from './pages/QuizzesPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="protocols" element={<ProtocolsPage />} />
            <Route path="protocols/:id" element={<ProtocolDetailPage />} />
            <Route path="labs" element={<LabsPage />} />
            <Route path="ai-modern" element={<AiModernPage />} />
            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
