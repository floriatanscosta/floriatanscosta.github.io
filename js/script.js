document.addEventListener("DOMContentLoaded", async function () {
    console.log("Iniciando carregamento...");

    try {
        document.body.style.opacity = "0";

        console.log("Carregando CSS...");
        await carregarCSS("../css/styles.css");
        console.log("CSS carregado!");

        const pagina = window.location.pathname.split("/").pop() || "index";
        console.log(`Página detectada: ${pagina}`);

        const paginasValidas = ["index", "atuacao", "design", "vida-de-cientista", "destaques", "educacao", "metricas", "testes", "historico", "premiacoes", "sobre", "formacao", "publicacoes", "contato", "arquivos", "projetos", "experiencia"];
        const arquivoConteudo = paginasValidas.includes(pagina) ? pagina : "index";

        console.log("Carregando template...");
        const templateResponse = await fetch("template.html");
        if (!templateResponse.ok) throw new Error(`Erro ao carregar template: ${templateResponse.status}`);
        const templateHTML = await templateResponse.text();
        console.log("Template carregado!");

        document.body.innerHTML = templateHTML;

        const conteudoElemento = document.getElementById("conteudo");
        if (!conteudoElemento) throw new Error("Elemento #conteudo não encontrado no template!");

        console.log(`Carregando conteúdo de ${arquivoConteudo}...`);
        const conteudoResponse = await fetch(arquivoConteudo);
        if (!conteudoResponse.ok) throw new Error(`Erro ao carregar ${arquivoConteudo}: ${conteudoResponse.status}`);
        const conteudoText = await conteudoResponse.text();
        console.log(`Conteúdo de ${arquivoConteudo} carregado!`);

        conteudoElemento.innerHTML = conteudoText;

        console.log("Página carregada com sucesso!");

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
