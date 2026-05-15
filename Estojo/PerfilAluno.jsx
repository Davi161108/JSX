function PerfilAluno(){
    const alunos = [
        {
            nome: "Ana Clara",
            curso: "Informática",
            cidade: "Montes Claros",
            disciplinas: ["React JS", "JavaScript", "Python"]
        },
        {
            nome: "Carlos Henrique",
            curso: "Sistemas",
            cidade: "Belo Horizonte",
            disciplinas: ["HTML", "CSS", "React"]
        }
    ];

    return(
        <div>
            <h1>Perfil dos Alunos</h1>

            {alunos.map((aluno, index) => (
            <div key={index}>
                <h2>{aluno.nome}</h2>
                <p>Curso: {aluno.curso}</p>
                <p>Cidade: {aluno.cidade}</p>

                <h3>Disciplinas</h3>
                <ul>
                    {aluno.disciplinas.map((d, i) => (
                    <li key={i}>{d}</li>
                    ))}
                </ul>
            </div>
            ))}
        </div>
    )
}

export default PerfilAluno;
