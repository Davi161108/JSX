import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Header from './components/header'
import Aluno from './components/aluno'

function App() {

  return (
    <div>
      <Header
        disciplina="Banco de Dados"
      />

      <Aluno
        nome="Davi"
        idade={20}
        curso="Engenharia"
        cidade="São Paulo"
      />
    </div>
  );
}

export default App
