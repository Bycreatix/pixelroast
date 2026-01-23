import React from 'react';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import { RoastProvider } from './contexts/RoastContext';

function App() {
  return (
    <AuthProvider>
      <RoastProvider>
        <Layout>
          <Home />
        </Layout>
      </RoastProvider>
    </AuthProvider>
  );
}

export default App;
