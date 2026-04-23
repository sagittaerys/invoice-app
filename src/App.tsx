import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { Sidebar } from './components/Sidebar';
import { InvoiceListPage } from './pages/InvoiceListPage';
import { InvoiceDetailPage } from './pages/InvoiceDetailPage';

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <BrowserRouter>
          <Sidebar />
          <Routes>
            <Route path="/" element={<InvoiceListPage />} />
            <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
          </Routes>
        </BrowserRouter>
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;
