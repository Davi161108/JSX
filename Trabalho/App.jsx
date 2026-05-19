// App.jsx

import React, { useState } from 'react';
import SplashScreen from './componentes/SplashScreen';


function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen
          onFinished={() => setShowSplash(false)}
        />
      ) : (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '2rem',
          }}
        >
          Aplicação Principal
        </div>
      )}
    </>
  );
}

export default App;
