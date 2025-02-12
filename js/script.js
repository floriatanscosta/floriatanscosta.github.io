document.addEventListener("DOMContentLoaded", async function () {
    console.log("Iniciando carregamento...");
    
    try {
        // Oculta a página antes do carregamento
        document.body.style.opacity = "0";

        // Carrega o CSS antes de qualquer outra coisa
        console.log("Carregando CSS...");
        await carregarCSS("../css/styles.css");
        console.log("CSS carregado!");

        // Obtém o nome da página atual
        const pagina = window.location.pathname.split("/").pop() || "index.html";
        console.log(`Página detectada: ${pagina}`);

        // Lista de páginas
        const paginasValidas = ["index.html", "educacao.html", "testes.html", "historico.html", "premiacoes.html", "sobre.html", "formacao.html", "publicacoes.html", "contato.html", "arquivos.html"];
        const arquivoConteudo = paginasValidas.includes(pagina) ? pagina : "index.html";

        // Carrega o template
        console.log("Carregando template...");
        const templateResponse = await fetch("template.html");
        if (!templateResponse.ok) throw new Error(`Erro ao carregar template: ${templateResponse.status}`);
        const templateHTML = await templateResponse.text();
        console.log("Template carregado!");

        // Insere o template
        document.body.innerHTML = templateHTML;

        // Confirma se o elemento #conteudo é valido
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

        // Exibe a página suavemente
        document.body.style.opacity = "1";
    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        document.body.innerHTML = `<h1>Erro ao carregar a página</h1><p>${error.message}</p>`;
        document.body.style.opacity = "1"; // Garante visibilidade mesmo em erro
    }
});

// Função para carregar CSS antes do conteúdo
async function carregarCSS(arquivoCSS) {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = arquivoCSS;
        link.onload = resolve;  // Chama resolve quando o CSS carregar
        link.onerror = () => reject(new Error(`Erro ao carregar CSS: ${arquivoCSS}`));
        document.head.appendChild(link);
    });
}
