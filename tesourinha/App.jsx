import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Aluno from './components/aluno'
import BoasVindas from './components/BoasVindas'
import ProductCard from './components/ProductCard'
import Contador from './components/Contador'
import Cadastro from './components/Cadastro'

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

      <BoasVindas />

      <ProductCard 
        nome="Notebook"
        preco={3500}
        categoria="Eletrônicos"
      />

      <Contador />

      <Cadastro />
      
    </div>
  );
}

export default App
