// js/menu.js

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
            themeBtn.innerHTML = `<img src="/assets/icons/escuro.svg" alt="Ativar o modo escuro" style="width: 20px; height: 20px;">`;
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeBtn) {
            themeBtn.innerHTML = `<img src="/assets/icons/claro.svg" alt="Ativar o modo claro" style="width: 20px; height: 20px;">`;
        }
    }
}

// Função para troca manual de idioma
function switchLanguage(lang) {
    localStorage.setItem('preferred_lang', lang);
    const currentPath = window.location.pathname;
    
    if (lang === 'en' && !currentPath.startsWith('/en/')) {
        // Se estiver na raiz, vai para /en/. Se não, adiciona /en antes do caminho (ex: /en/biografia)
        const newPath = currentPath === '/' ? '/en/' : '/en' + currentPath;
        window.location.href = newPath;
    }
    else if (lang === 'pt' && currentPath.startsWith('/en/')) {
        // Remove exatamente o '/en' do início do caminho
        const newPath = currentPath.replace(/^\/en/, '') || '/';
        window.location.href = newPath;
    }
}