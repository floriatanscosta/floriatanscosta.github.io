// Função para carregar o conteúdo dinâmico
function carregarConteudo() {
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

    // Busca o conteúdo da página
    fetch(arquivoConteudo)
        .then(response => response.text())
        .then(data => {
            // Injeta o conteúdo no elemento <main>
            document.getElementById("conteudo").innerHTML = data;
        })
        .catch(error => console.error("Erro ao carregar o conteúdo:", error));
}

// Executa a função ao carregar a página
window.onload = carregarConteudo;