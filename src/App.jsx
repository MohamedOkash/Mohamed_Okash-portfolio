import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from './app/providers/HelmetProvider';
import { AppRouter } from './app/router';

import { LazyMotion, domAnimation } from 'framer-motion';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <LazyMotion features={domAnimation}>
          <AppRouter />
        </LazyMotion>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
