# Floriatan Santos Costa — Portfólio Acadêmico

Site pessoal e acadêmico publicado em **[floriatan.com.br](https://floriatan.com.br/)**.
Reúne trajetória, produção científica, prêmios, métricas e contato de Floriatan Santos Costa, pesquisador de pós-doutorado em química analítica, em **português, inglês e espanhol**.

## Estrutura

```
/                       páginas em português (index, biografia, experiencia, publicacoes, producao,
                        premiacoes, metricas, contato, sobre, design, vida, 404)
/en/  /es/              as mesmas 10 páginas principais em inglês e espanhol
/css/global.css         tokens (cores, fontes, espaçamentos), base, cabeçalho, menu, rodapé, botões
/css/main.css           componentes de conteúdo (cartões, linha do tempo, publicações, métricas...)
/css/premiacoes.css     /css/design.css   /css/vida.css   estilos próprios de cada uma dessas páginas
/js/theme-init.js       aplica o tema (claro, escuro ou seguir o sistema) antes da renderização (evita "piscar")
/js/app.js              menu móvel, seletor de tema e de idioma, aviso de idioma, ano do rodapé
/assets/cv/             currículos em PDF (pt, en, es), gerados por _src/cv_pdf.py
/js/publications.js     filtro da lista de publicações
/js/design.js           botões "Copiar" da paleta da página Design
/js/vida.js             animações e galeria da página Vida de cientista
/js/analytics.js        aviso de consentimento + Google Analytics (só carrega após "Aceitar")
/assets/                logo, favicon, ícones (sprite.svg), fontes Roboto, imagens e logos (svg/ e img/logos/)
/sitemap.xml            gerado automaticamente, com alternativas hreflang
/_src/                  FONTE do site (não é publicada — o Jekyll ignora pastas iniciadas por "_")
   build.py             gerador (Python 3, apenas biblioteca padrão)
   cv_pdf.py            currículo em PDF (requer ReportLab); fontes Roboto em fonts/ (licença OFL)
   data/site.json       textos da interface (menu, rótulos, botões) em pt/en/es
   data/cv.json         dados do currículo: prêmios, formação, experiência, projetos, revisões, métricas...
   data/publications.json  artigos e trabalhos em eventos (títulos no idioma original)
   pages/pt|en|es/*.html   conteúdo de cada página; blocos de dados entram como {{nome_do_bloco}}
```

Páginas de desenvolvimento (não indexadas, fora do menu): `guia.html`, `design-meta.html`, `exemplos.html`, `test.html`, `template.html`.

## Como atualizar o conteúdo

1. Edite os dados em `_src/data/` (por exemplo, inclua um artigo em `publications.json` ou atualize `metrics` em `cv.json`)
   ou o texto de uma página em `_src/pages/<idioma>/<página>.html`.
2. Gere o site:
   ```bash
   python3 _src/build.py --check
   ```
   O comando regenera todas as páginas, o `sitemap.xml` e os currículos em PDF, e verifica os links internos.
   - **Currículo em PDF** (`assets/cv/floriatan-costa-cv-pt|en|es.pdf`): gerado por `_src/cv_pdf.py` a partir de
     `cv.json` e `publications.json`, sem foto. O rodapé traz a data de geração e a data da última alteração desses
     dois arquivos. Requer o ReportLab e a svglib (ícones e logotipo), instalados uma única vez com `pip install reportlab svglib`. Sem ele, o build avisa e
     gera só as páginas; para pular os PDFs de propósito, use `python3 _src/build.py --check --no-pdf`.
3. Faça commit dos arquivos gerados e da fonte, e envie ao GitHub. O GitHub Pages publica automaticamente.

> Não edite diretamente os `.html` da raiz, `/en` ou `/es`: eles são sobrescritos pelo gerador.

### Convenções
- **Logos de instituições** (`"logo"` em `cv.json`): arquivos `.svg` ficam em `assets/svg/`; logos em imagem (`.webp`/`.png`, para SVGs muito pesados) ficam em `assets/img/logos/`. Basta informar o nome do arquivo, por exemplo `"logo": "uesc.webp"`.
- **Títulos de publicações, periódicos, eventos, livros e instituições ficam no idioma original** em todas as versões; DOI e autores também não são traduzidos.
- Um artigo novo em `publications.json` precisa de `year`, `title`, `journal` e `doi` (ou `url`, quando não houver DOI); para artigo aceito, acrescente `"status": "accepted"`. Coloque-o no início da lista `articles` (os primeiros aparecem em "Publicações recentes"). Exemplo:
  ```json
  {"year": 2026, "title": "Título original do artigo", "journal": "Talanta", "doi": "10.1016/j.talanta.2026.127000", "status": "published"},
  ```
- Os URLs são iguais nos três idiomas, com prefixo: `/biografia`, `/en/biografia`, `/es/biografia`.
- O cabeçalho, o rodapé, os metadados (SEO, Open Graph, `hreflang`, `canonical`) e o seletor de idioma são gerados — basta criar a página em `_src/pages/<idioma>/`.
- No cabeçalho de um fragmento, além de `title:` e `description:`, podem ser usados `styles:` (CSS próprio da página), `scripts:` (JS próprio) e `body_class:`. Exemplo: a página "Vida de cientista" usa `styles: /css/vida.css` e `scripts: /js/vida.js`.
- **Imagens da página "Vida de cientista"** (`_src/pages/pt/vida.html`): salve as fotos em WebP em `assets/img/vida/`. Para transformar um capítulo em apresentação automática, coloque duas ou mais `<img class="v-slide">` dentro do mesmo `<div class="v-slides">`; para a galeria, copie um `<li>` da lista `v-marquee`. Sempre preencha `alt`, `width` e `height`.

## Tecnologia e qualidade
- HTML, CSS e JavaScript sem frameworks nem dependências externas (exceto o Google Analytics); fonte Roboto servida localmente.
- Acessibilidade: link "pular para o conteúdo", navegação por teclado, foco visível, `aria-current`, `aria-expanded`, contraste AA nos temas claro e escuro, respeito a `prefers-reduced-motion`. Auditoria automatizada (axe-core, WCAG 2.1 AA) sem violações.
- SEO: título e descrição por página e idioma, `canonical`, `hreflang`, Open Graph, dados estruturados `Person` (JSON-LD) e `sitemap.xml`.
- Privacidade: Google Analytics bloqueado até o consentimento do visitante (RGPD/LGPD); textos do aviso em `site.json` → `consent`.
- Segurança: Content-Security-Policy via `<meta>`, `rel="noopener noreferrer"` em links externos, nenhum script inline.
- Desempenho: imagens WebP (≈ 90 % menores que os PNG originais), dimensões declaradas, `loading="lazy"`, fonte com `preload`.

## Documentação adicional
- `design.md` — design system (tokens, tipografia, componentes).
- `CHANGELOG.md` — histórico de alterações.
- `PENDENCIAS.md` — informações que faltam ou precisam ser conferidas.

## Licença

O **código** deste repositório (HTML, CSS, JavaScript e os scripts em Python de `_src/`) está sob a
[licença MIT](LICENSE): pode ser usado, copiado e adaptado, desde que o aviso de copyright seja mantido.

Ficam **fora** da licença MIT, com todos os direitos reservados:

- o **conteúdo**: textos, dados do currículo (`_src/data/`), fotos e imagens (`assets/img/`) e os currículos em PDF (`assets/cv/`);
- o **logotipo Fc** e a ilustração da identidade visual (`assets/logo.svg`, `assets/favicon.svg`, `assets/svg/fundo.svg`).

Itens de terceiros seguem as próprias licenças ou regras de marca:

- **Fonte Roboto**: SIL Open Font License 1.1 (`assets/fonts/License.txt` e `_src/fonts/OFL.txt`);
- **Ícones do Material Symbols** (sol, lua, ajuda): Apache License 2.0, do Google;
- **Logotipos de perfis, bases e instituições** (ORCID, Lattes, LinkedIn, ResearchGate, Google Scholar, DOI, UFPR, UNIZAR, Embrapa, SBQ, LAESB e outros): marcas dos respectivos titulares, usadas apenas para identificar perfis e vínculos.

