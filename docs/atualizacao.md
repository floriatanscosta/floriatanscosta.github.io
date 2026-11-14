# Como atualizar o conteúdo

Passo a passo para editar dados e páginas, gerar o site e publicar, e as convenções a seguir. Arquitetura e estrutura dos arquivos em [`arquitetura.md`](arquitetura.md).

1. Edite os dados em `_src/data/` (por exemplo, inclua um artigo em `publications.json` ou atualize `metrics` em `cv.json`)
   ou o texto de uma página em `_src/pages/<idioma>/<página>.html`.
2. Gere o site:
   ```bash
   python3 _src/build.py --check
   ```
   O comando regenera todas as páginas, o `sitemap.xml` e os currículos em PDF, e verifica os links internos.
   - **Currículo em PDF** (`assets/cv/floriatan-costa-cv-pt|en|es.pdf`): gerado por `_src/cv_pdf.py` a partir de
     `cv.json`, `publications.json` e `media.json`, sem foto. O rodapé traz a data de geração e a data da última alteração desses
     arquivos. Requer o ReportLab e a svglib (ícones e logotipo), instalados uma única vez com `pip install reportlab svglib`. Sem eles, o build avisa e
     gera só as páginas; para pular os PDFs de propósito, use `python3 _src/build.py --check --no-pdf`.
3. Faça commit dos arquivos gerados e da fonte, e envie ao GitHub. O GitHub Pages publica automaticamente.
   Para conferir antes, sirva o site localmente com `python3 -m http.server 8765` na raiz e abra `http://localhost:8765/`.

> Não edite diretamente os `.html` gerados (raiz, `/en` e `/es`): eles são sobrescritos pelo gerador.
> As exceções, escritas à mão, são `guia.html`, `design-meta.html`, `exemplos.html` e tudo em `ferramentas/`.

## Convenções

- **Estilos:** cores, tamanhos de fonte, pesos e raios vêm sempre dos tokens de `css/global.css` (ver [`design.md`](../design.md)). Não escreva valores fixos nos CSS.

- **Logos de instituições** (`"logo"` em `cv.json`): arquivos `.svg` ficam em `assets/svg/`; logos em imagem (`.webp`/`.png`, para SVGs muito pesados) ficam em `assets/img/logos/`. Basta informar o nome do arquivo, por exemplo `"logo": "uesc.webp"`.
- **Títulos de publicações, periódicos, eventos, livros e instituições ficam no idioma original** em todas as versões; o DOI também não é traduzido. As listas de autores não são exibidas no site nem guardadas nos JSON.
- Um artigo novo em `publications.json` precisa de `year`, `title`, `journal` e `doi` (ou `url`, quando não houver DOI); para artigo aceito, acrescente `"status": "accepted"`. Coloque-o no início da lista `articles` (os primeiros aparecem em "Publicações recentes"). Exemplo:
  ```json
  {"year": 2026, "title": "Título original do artigo", "journal": "Talanta", "doi": "10.1016/j.talanta.2026.127000", "status": "published"},
  ```
- Os URLs são iguais nos três idiomas, com prefixo: `/biografia`, `/en/biografia`, `/es/biografia`.
- O cabeçalho, o rodapé, os metadados (SEO, Open Graph, `hreflang`, `canonical`) e o seletor de idioma são gerados — basta criar a página em `_src/pages/<idioma>/`.
- **Página Mídia** (`/midia`): cada conteúdo é um item em `_src/data/media.json` com `type` (`magazine`, `news`, `interview`, `podcast`, `mention` ou `other`), `title` (no idioma original), `source` e `url`; opcionais: `year` ou `date` (AAAA-MM-DD), `lang` (idioma do título) e `description` (`{"pt", "en", "es"}`). A página cria uma seção por tipo, com atalhos quando houver mais de um, e o link abre em nova aba. Exemplo:
  ```json
  {"type": "interview", "date": "2026-11-05", "title": "Título original", "source": "Nome do veículo", "url": "https://...", "lang": "pt"}
  ```
- No cabeçalho de um fragmento, além de `title:` e `description:`, podem ser usados `styles:` (CSS próprio da página), `scripts:` (JS próprio) e `body_class:`. Exemplo: a página "Vida de cientista" usa `styles: /css/vida.css` e `scripts: /js/vida.js`.
- **Imagens da página "Vida de cientista"** (`_src/pages/pt/vida.html`): salve as fotos em WebP em `assets/img/vida/` (crie a pasta na primeira vez). Para transformar um capítulo em apresentação automática, coloque duas ou mais `<img class="v-slide">` dentro do mesmo `<div class="v-slides">`; para a galeria, copie um `<li>` da lista `v-marquee`. Sempre preencha `alt`, `width` e `height`.
- **Ferramentas** (`ferramentas/`): não passam pelo gerador; para criar uma nova, copie `ferramentas/_modelo/` e siga [`ferramentas/README.md`](../ferramentas/README.md). Ao mudar o menu, atualize todas as páginas de `/ferramentas/`.
- **Licença:** todo o conteúdo novo (código, textos, imagens) fica sob o [`LICENSE`](../LICENSE), com todos os direitos reservados. Ao incluir material de terceiros (fonte, ícone, logotipo), registre a licença dele no `LICENSE` e no README.
