// Função para carregar o template e o conteúdo
function carregarPagina() {
    // Obtém o nome da página atual (ex: "sobre.html")
    const pagina = window.location.pathname.split("/").pop();

    // Define o arquivo de conteúdo com base na página atual
    let arquivoConteudo = "";
    switch (pagina) {
        case "sobre.html":
            arquivoConteudo = "sobre.html";
            break;
        case "experiencia.html":
            arquivoConteudo = "experiencia.html";
            break;
        case "educacao.html":
            arquivoConteudo = "educacao.html";
            break;
        default:
            arquivoConteudo = "index.html"; // Página inicial
    }

    // Carrega o template
    fetch("template.html")
        .then(response => response.text())
        .then(data => {
            // Injeta o template no corpo da página
            document.body.innerHTML = data;

            // Carrega o conteúdo específico
            fetch(arquivoConteudo)
                .then(response => response.text())
                .then(conteudo => {
                    // Injeta o conteúdo no elemento <main>
                    document.getElementById("conteudo").innerHTML = conteudo;
                })
                .catch(error => console.error("Erro ao carregar o conteúdo:", error));
        })
        .catch(error => console.error("Erro ao carregar o template:", error));
}

// Executa a função ao carregar a página
window.onload = carregarPagina;