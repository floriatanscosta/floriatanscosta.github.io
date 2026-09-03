// app.js

// Função para abrir e fechar o menu
function toggleMenu() {
    const menu = document.getElementById("navMenu");
    if (menu) {
        menu.classList.toggle("active");
    } else {
        console.error("O elemento 'navMenu' não foi encontrado na página.");
    }
}

// Função para alternar o tema (modo claro e escuro)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const themeBtn = document.getElementById('theme-toggle');

    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (themeBtn) {
            themeBtn.innerHTML = `<img src="https://floriatan.com.br/assets/icons/escuro.svg" alt="Ativar o modo escuro" style="width: 20px; height: 20px;">`;
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeBtn) {
            themeBtn.innerHTML = `<img src="https://floriatan.com.br/assets/icons/claro.svg" alt="Ativar o modo claro" style="width: 20px; height: 20px;">`;
        }
    }
}

// Função para troca manual de idioma
function switchLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);
    const currentPath = window.location.pathname;

    if (lang === 'en' && !currentPath.startsWith('/en/')) {
        const newPath = currentPath === '/' ? '/en/' : '/en' + currentPath;
        window.location.href = newPath;
    }
    else if (lang === 'pt' && currentPath.startsWith('/en/')) {
        const newPath = currentPath.replace(/^\/en/, '') || '/';
        window.location.href = newPath;
    }
}

// ==== Inicialização ao carregar a página ====
document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = localStorage.getItem('theme');
    const themeBtn = document.getElementById('theme-toggle');

    if (currentTheme === 'dark' && themeBtn) {
        themeBtn.innerHTML = `<img src="https://floriatan.com.br/assets/icons/claro.svg" alt="Ativar o modo claro" style="width: 20px; height: 20px;">`;
    }

    // 2. Insere o ano atual no rodapé
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});