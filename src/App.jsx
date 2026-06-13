import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from './app/providers/HelmetProvider';
import { AppRouter } from './app/router';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
