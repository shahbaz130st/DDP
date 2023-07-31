import React from 'react';
import { AuthContextProvider } from './src/components/authContextProvider';
import { Navigation } from './src/components/navigation/navigation';
import { ServicesContextProvider } from './src/components/servicesContextProvider';

function App() {

  return (
    <AuthContextProvider>
      <ServicesContextProvider>
          <Navigation />
      </ServicesContextProvider>
    </AuthContextProvider>
  );
};

export default App;
