// Função para carregar o template e o conteúdo
async function carregarPagina() {
    try {
        // Obtém o nome da página atual (ex: "educacao.html")
        const pagina = window.location.pathname.split("/").pop();

        // Define o arquivo de conteúdo com base na página atual
        let arquivoConteudo = "";
        if (pagina === "educacao.html") {
            arquivoConteudo = "educacao.html";
        } else {
            arquivoConteudo = "index.html"; // Página inicial
        }

        // Carrega o template
        const templateResponse = await fetch("template.html");
        const templateText = await templateResponse.text();

        // Injeta o template no corpo da página
        document.body.innerHTML = templateText;

        // Carrega o conteúdo específico
        const conteudoResponse = await fetch(arquivoConteudo);
        const conteudoText = await conteudoResponse.text();

        // Injeta o conteúdo no elemento <main>
        document.getElementById("conteudo").innerHTML = conteudoText;
    } catch (error) {
        console.error("Estamos com problemas. Erro ao carregar a página:", error);
    }
}

// Executa a função ao carregar a página
window.onload = carregarPagina;