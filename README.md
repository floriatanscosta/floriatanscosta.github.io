# Floriatan Santos Costa — Portfólio Acadêmico

**Site pessoal e acadêmico em três idiomas, gerado a partir de dados em JSON.**

Publicado em **[floriatan.com.br](https://floriatan.com.br/)**.
Reúne trajetória, produção científica, prêmios, métricas e contato de Floriatan Santos Costa, pesquisador de pós-doutorado em química analítica, em **português, inglês e espanhol**.

---

## Sobre o projeto

O site é HTML estático servido pelo GitHub Pages. O conteúdo não é editado nas páginas
publicadas: ele fica em arquivos de dados e fragmentos de página em `_src/`, e um gerador
em Python monta as três versões de idioma, o `sitemap.xml` e os currículos em PDF.
Assim, um artigo novo ou uma métrica atualizada entra uma única vez e aparece em todas as
páginas e idiomas.

## Funcionalidades

- **Páginas:** início, biografia, experiência, publicações, produção, premiações, métricas, contato, sobre, design, *Vida de cientista* (só em português) e página de erro 404.
- **Três idiomas** com os mesmos endereços (`/biografia`, `/en/biografia`, `/es/biografia`), seletor de idioma e aviso discreto quando o navegador usa outro idioma.
- **Tema claro, escuro ou "seguir o sistema"**, aplicado antes da renderização para não piscar.
- **Currículo em PDF** em pt, en e es, gerado dos mesmos dados do site.
- **Filtro de publicações**, resumo de premiações calculado dos dados e paleta com botão "Copiar" na página Design.
- **Google Analytics só após consentimento** do visitante.

## Tecnologias

- HTML, CSS e JavaScript sem frameworks nem dependências externas (exceto o Google Analytics); fonte Roboto servida localmente.
- Gerador em **Python 3** (`_src/build.py`, só a biblioteca padrão).
- Currículo em PDF com **ReportLab** e **svglib** (`_src/cv_pdf.py`).
- Hospedagem no **GitHub Pages** (Jekyll apenas copia os arquivos; ver `_config.yml`) com domínio próprio (`CNAME`).

### Qualidade

- Acessibilidade: link "pular para o conteúdo", navegação por teclado, foco visível, `aria-current`, `aria-expanded`, contraste AA nos temas claro e escuro, respeito a `prefers-reduced-motion`. Auditoria automatizada (axe-core, WCAG 2.1 AA) sem violações.
- SEO: título e descrição por página e idioma, `canonical`, `hreflang`, Open Graph, dados estruturados `Person` (JSON-LD) e `sitemap.xml`.
- Privacidade: Google Analytics bloqueado até o consentimento do visitante (RGPD/LGPD); textos do aviso em `site.json` → `consent`.
- Segurança: Content-Security-Policy via `<meta>`, `rel="noopener noreferrer"` em links externos, nenhum script inline.
- Desempenho: imagens WebP (≈ 90 % menores que os PNG originais), dimensões declaradas, `loading="lazy"`, fonte com `preload`.

## Arquitetura

```text
_src/data/*.json ─────┐
                      ├──▶ _src/build.py ──▶ /*.html  /en/*.html  /es/*.html  sitemap.xml
_src/pages/<idioma>/ ─┘          │
                                 └──▶ _src/cv_pdf.py ──▶ assets/cv/floriatan-costa-cv-<idioma>.pdf
```

| Parte | Responsabilidade |
|---|---|
| `_src/` | **Fonte** do site, não publicada (o Jekyll ignora pastas iniciadas por `_`) |
| `_src/build.py` | Gerador: monta cabeçalho, rodapé, metadados e seletor de idioma; com `--check`, verifica links internos |
| `_src/cv_pdf.py` | Currículo em PDF (requer ReportLab); fontes Roboto em `_src/fonts/` (licença OFL) |
| `_src/data/site.json` | Textos da interface (menu, rótulos, botões) em pt/en/es |
| `_src/data/cv.json` | Dados do currículo: prêmios, formação, experiência, projetos, revisões, métricas… |
| `_src/data/publications.json` | Artigos e trabalhos em eventos (títulos no idioma original) |
| `_src/pages/pt\|en\|es/*.html` | Conteúdo de cada página; blocos de dados entram como `{{nome_do_bloco}}` |
| `/*.html`, `/en/`, `/es/` | Páginas **geradas**, em português na raiz e as 10 principais em inglês e espanhol |
| `css/global.css` | Tokens (cores, fontes, espaçamentos), base, cabeçalho, menu, rodapé, botões |
| `css/main.css` | Componentes de conteúdo (cartões, linha do tempo, publicações, métricas…) |
| `css/premiacoes.css`, `css/design.css`, `css/vida.css` | Estilos próprios de cada uma dessas páginas |
| `js/theme-init.js` | Aplica o tema (claro, escuro ou seguir o sistema) antes da renderização (evita "piscar") |
| `js/app.js` | Menu móvel, seletor de tema e de idioma, aviso de idioma, ano do rodapé |
| `js/publications.js` | Filtro da lista de publicações |
| `js/design.js` | Botões "Copiar" da paleta da página Design |
| `js/vida.js` | Animações e galeria da página Vida de cientista |
| `js/analytics.js` | Aviso de consentimento + Google Analytics (só carrega após "Aceitar") |
| `assets/` | Logo, favicon, ícones (`sprite.svg`), fontes Roboto, imagens e logos (`svg/` e `img/logos/`) |
| `assets/cv/` | Currículos em PDF (pt, en, es), gerados por `_src/cv_pdf.py` |
| `sitemap.xml` | Gerado automaticamente, com alternativas `hreflang` |

A base visual (`/css`, `/js`, `/assets`) também é carregada pelas ferramentas do repositório
[`web`](https://github.com/floriatanscosta/web), publicadas em `floriatan.com.br/web/`.

## Estrutura do repositório

```text
floriatanscosta.github.io/
├── _src/                       # fonte (não publicada)
│   ├── data/
│   │   ├── cv.json
│   │   ├── publications.json
│   │   └── site.json
│   ├── fonts/                  # Roboto .ttf para o PDF + OFL.txt
│   ├── pages/
│   │   ├── en/                 # 10 páginas
│   │   ├── es/                 # 10 páginas
│   │   └── pt/                 # 12 páginas (inclui 404 e vida)
│   ├── build.py
│   └── cv_pdf.py
├── assets/
│   ├── _docs/License.txt
│   ├── cv/                     # floriatan-costa-cv-pt|en|es.pdf (gerados)
│   ├── fonts/                  # Roboto .woff2 + License.txt
│   ├── icons/                  # ícones SVG e sprite.svg
│   ├── img/                    # foto, capas, fotos da linha do tempo (.webp)
│   │   └── logos/              # logos institucionais em imagem
│   ├── svg/                    # logos institucionais e ilustração de fundo
│   ├── cover.png
│   ├── favicon.svg
│   └── logo.svg
├── css/
│   ├── design.css
│   ├── global.css
│   ├── main.css
│   ├── premiacoes.css
│   └── vida.css
├── en/                         # páginas geradas em inglês
├── es/                         # páginas geradas em espanhol
├── js/
│   ├── analytics.js
│   ├── app.js
│   ├── design.js
│   ├── publications.js
│   ├── theme-init.js
│   └── vida.js
├── index.html, biografia.html, experiencia.html, publicacoes.html, producao.html,
│   premiacoes.html, metricas.html, contato.html, sobre.html, design.html, vida.html, 404.html
├── guia.html, design-meta.html, exemplos.html     # páginas de desenvolvimento
├── .gitignore
├── _config.yml                 # configuração do Jekyll / GitHub Pages
├── CHANGELOG.md
├── CNAME                       # floriatan.com.br
├── design.md
├── LICENSE
├── PENDENCIAS.md
├── README.md
├── robots.txt
└── sitemap.xml
```

Para resumir, a árvore mostra só as pastas das páginas em `_src/pages/`, `en/`, `es/` e dos
ícones e imagens em `assets/`, sem listar cada arquivo.

Páginas de desenvolvimento (não indexadas, fora do menu): `guia.html`, `design-meta.html` e `exemplos.html`.

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
     dois arquivos. Requer o ReportLab e a svglib (ícones e logotipo), instalados uma única vez com `pip install reportlab svglib`. Sem eles, o build avisa e
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

## Documentação adicional

- [`design.md`](design.md) — design system (tokens, tipografia, componentes).
- [`CHANGELOG.md`](CHANGELOG.md) — histórico de alterações.
- [`PENDENCIAS.md`](PENDENCIAS.md) — informações que faltam ou precisam ser conferidas.

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
