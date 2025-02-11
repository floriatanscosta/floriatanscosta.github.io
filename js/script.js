document.addEventListener("DOMContentLoaded", async function () {
    console.log("Iniciando carregamento...");

    try {
        // Obtém o nome da página atual
        const pagina = window.location.pathname.split("/").pop() || "index.html";
        console.log(`Página detectada: ${pagina}`);

        // Lista de páginas válidas
        const paginasValidas = ["index.html", "educacao.html", "sobre.html", "formacao.html", "publicacoes.html", "contato.html", "arquivos.html"];
        const arquivoConteudo = paginasValidas.includes(pagina) ? pagina : "index.html";

        // Carrega o template
        console.log("Carregando template...");
        const templateResponse = await fetch("template.html");
        if (!templateResponse.ok) throw new Error(`Erro ao carregar template: ${templateResponse.status}`);

        const templateHTML = await templateResponse.text();
        console.log("Template carregado!");

        // Insere o template no <body> sem remover scripts
        document.body.innerHTML = templateHTML;

        // Confirma se o elemento #conteudo existe
        const conteudoElemento = document.getElementById("conteudo");
        if (!conteudoElemento) throw new Error("Elemento #conteudo não encontrado no template!");

        // Carrega o conteúdo específico da página
        console.log(`Carregando conteúdo de ${arquivoConteudo}...`);
        const conteudoResponse = await fetch(arquivoConteudo);
        if (!conteudoResponse.ok) throw new Error(`Erro ao carregar ${arquivoConteudo}: ${conteudoResponse.status}`);

        const conteudoText = await conteudoResponse.text();
        console.log(`Conteúdo de ${arquivoConteudo} carregado!`);

        // Insere o conteúdo dentro do #conteudo
        conteudoElemento.innerHTML = conteudoText;

        console.log("Página carregada com sucesso!");
    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        document.body.innerHTML = `<h1>Erro ao carregar a página</h1><p>${error.message}</p>`;
    }
});
