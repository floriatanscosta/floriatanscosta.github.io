// Função para carregar o template e o conteúdo
async function carregarPagina() {
    try {
        // Obtém o nome da página atual
        const pagina = window.location.pathname.split("/").pop();

        // Define o arquivo de conteúdo com base na página atual
        let arquivoConteudo = "index.html"; // Página inicial como padrão

        if (pagina === "educacao.html") {
            arquivoConteudo = "educacao.html";
        } else if (pagina === "sobre.html") {
            arquivoConteudo = "sobre.html";
        } else if (pagina === "formacao.html") {
            arquivoConteudo = "formacao.html";
        } else if (pagina === "contato.html") {
            arquivoConteudo = "contato.html";
        } else if (pagina === "arquivos.html") {
            arquivoConteudo = "arquivos.html";
        }

        // Carrega o template
        const templateResponse = await fetch("template.html");
        if (!templateResponse.ok) {
            throw new Error(`Erro ao carregar template: ${templateResponse.statusText}`);
        }
        const templateText = await templateResponse.text();

        // Injeta o template no corpo da página
        document.body.innerHTML = templateText;

        // Garante que o elemento #conteudo exista antes de inserir conteúdo
        const conteudoElemento = document.getElementById("conteudo");
        if (!conteudoElemento) {
            throw new Error("Elemento #conteudo não encontrado no template.");
        }

        // Carrega o conteúdo específico
        const conteudoResponse = await fetch(arquivoConteudo);
        if (!conteudoResponse.ok) {
            throw new Error(`Erro ao carregar ${arquivoConteudo}: ${conteudoResponse.statusText}`);
        }
        const conteudoText = await conteudoResponse.text();

        // Injeta o conteúdo no elemento <main>
        conteudoElemento.innerHTML = conteudoText;
    } catch (error) {
        console.error("Estamos com problemas. Erro ao carregar a página:", error);
    }
}

// Executa a função ao carregar a página
window.onload = carregarPagina;
