import React from 'react';
import { HelmetProvider as Provider } from 'react-helmet-async';

export const HelmetProvider = ({ children }) => {
  return <Provider>{children}</Provider>;
};
