import { useState } from "react";
import Botao from "./Botao";
import Display from "./Display";
import InputNumero from "./InputNumero";

function Calculadora() {
    const [numero1, setNumero1] = useState("");
    const [numero2, setNumero2] = useState("");
    const [resultado, setResultado] = useState("");

    function somar() {
        setResultado(Number(numero1) + Number(numero2));
    }

    function subtrair() {
        setResultado(Number(numero1) - Number(numero2));
    }

    function multiplicar() {
        setResultado(Number(numero1) * Number(numero2));
    }

    function dividir() {
        if (Number(numero2) === 0) {
            setResultado("Não é possível dividir por zero");
        } else {
            setResultado(Number(numero1) / Number(numero2));
        }
    }

    function limpar() {
        setNumero1("");
        setNumero2("");
        setResultado("");
    }

    return (
        <div>
            <h1>Calculadora React</h1>

            <InputNumero
                placeholder="Digite o primeiro número"
                value={numero1}
                onChange={(e) => setNumero1(e.target.value)}
            />

            <InputNumero
                placeholder="Digite o segundo número"
                value={numero2}
                onChange={(e) => setNumero2(e.target.value)}
            />

            <br />
            <br />

            <Botao onClick={somar}>Somar</Botao>
            <Botao onClick={subtrair}>Subtrair</Botao>
            <Botao onClick={multiplicar}>Multiplicar</Botao>
            <Botao onClick={dividir}>Dividir</Botao>
            <Botao onClick={limpar}>Limpar</Botao>
            
            <br />
            <br />
            
            <Display resultado={resultado} />
        </div>
    );
}

export default Calculadora;
