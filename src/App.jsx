import React from 'react';
import { Layout } from './components/layout/Layout';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Home />
      </Layout>
    </AuthProvider>
  );
}

export default App;
