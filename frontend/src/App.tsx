import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigation } from './presentation/components/Navigation';
import { AuthProvider } from './presentation/providers/AuthProvider';
import { HomePage } from './presentation/pages/HomePage';
import { SemestersPage } from './presentation/pages/SemestersPage';
import { ProtectedRoute } from './presentation/routes/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/semesters"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'SECRETARY']}>
                    <SemestersPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
