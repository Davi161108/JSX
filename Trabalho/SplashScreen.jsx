// SplashScreen.jsx
import React, { useEffect } from 'react';
import { Box } from '@mui/material';

const fontImport = `@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Dancing+Script:wght@400..700&family=Kaushan+Script&display=swap");`;

const disneyStyles = `
  @keyframes disneyDraw {
    0% {
      stroke-dashoffset: 1000;
      fill: rgba(255, 255, 255, 0);
    }
    65% {
      stroke-dashoffset: 0;
      fill: rgba(255, 255, 255, 0);
    }
    85% {
      fill: rgba(255, 255, 255, 0.3);
    }
    100% {
      stroke-dashoffset: 0;
      fill: rgba(255, 255, 255, 1);
      filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 30px rgba(0, 140, 255, 0.6));
    }
  }

  /* Nova animação que abre a janela da esquerda para a direita */
  @keyframes writeLeftToRight {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }

  .disney-text {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: disneyDraw 7.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .writing-clip {
    /* Abre a máscara de forma contínua acompanhando o traço */
    animation: writeLeftToRight 2.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
`;

const SplashScreen = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinished) {
        onFinished();
      }
    }, 9000);

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <>
      <style>{fontImport}</style>
      <style>{disneyStyles}</style>

      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #002d5c 0%, #001F3F 50%, #000814 100%)',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Criamos a janela de revelação que cresce horizontalmente */}
            <clipPath id="leftToRightClip">
              <rect className="writing-clip" x="0" y="0" width="0%" height="100%" />
            </clipPath>
          </defs>

          {/* Aplicamos o clipPath diretamente no seu bloco de texto original */}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="130"
            fontFamily="'Dancing Script', cursive"
            className="disney-text"
            pathLength="1000"
            fill="transparent"
            stroke="#FFFFFF"
            
            // O efeito de revelação sequencial é injetado aqui:
            clipPath="url(#leftToRightClip)"
            
            strokeWidth="2.2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeMiterlimit="4"
          >
            Koplo
          </text>
        </svg>
      </Box>
    </>
  );
};

export default SplashScreen;
