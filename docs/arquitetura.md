# Arquitetura e estrutura

Como o site [floriatan.com.br](https://floriatan.com.br/) é construído: tecnologias, critérios de qualidade, fluxo de geração e organização dos arquivos. Visão geral do projeto no [README](../README.md).

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
| `_src/build.py` | Gerador: monta cabeçalho, rodapé, metadados e seletor de idioma; com `--check`, verifica links internos; com `--no-pdf`, não gera os currículos |
| `_src/cv_pdf.py` | Currículo em PDF (requer ReportLab e svglib); fontes Roboto em `_src/fonts/` (licença OFL) |
| `_src/data/site.json` | Textos da interface (menu, rótulos, botões) em pt/en/es |
| `_src/data/cv.json` | Dados do currículo: prêmios, formação, experiência, projetos, revisões, métricas… |
| `_src/data/publications.json` | Artigos e trabalhos em eventos (títulos no idioma original) |
| `_src/data/media.json` | Mídia e divulgação: revistas de divulgação, notícias, entrevistas, podcasts e menções (página Mídia) |
| `_src/pages/pt\|en\|es/*.html` | Conteúdo de cada página; blocos de dados entram como `{{nome_do_bloco}}` |
| `/*.html`, `/en/`, `/es/` | Páginas **geradas**, em português na raiz e as 11 principais em inglês e espanhol |
| `css/global.css` | Tokens (cores do logotipo, escala tipográfica, pesos, raios, sombras), base, cabeçalho, menu, rodapé, botões |
| `css/main.css` | Componentes de conteúdo (abertura da página inicial, cartões, linha do tempo, publicações, métricas…) |
| `css/exemplos.css` | Componentes antigos usados só nas páginas de desenvolvimento (`exemplos.html`, `guia.html`, `design-meta.html`) |
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
│   │   ├── media.json
│   │   ├── publications.json
│   │   └── site.json
│   ├── fonts/                  # Roboto .ttf para o PDF + OFL.txt
│   ├── pages/
│   │   ├── en/                 # 11 páginas
│   │   ├── es/                 # 11 páginas
│   │   └── pt/                 # 13 páginas (inclui 404 e vida)
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
│   ├── exemplos.css            # só páginas de desenvolvimento
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
│   premiacoes.html, midia.html, metricas.html, contato.html, sobre.html, design.html, vida.html, 404.html
├── guia.html, design-meta.html, exemplos.html     # páginas de desenvolvimento
├── .gitignore
├── _config.yml                 # configuração do Jekyll / GitHub Pages
├── CHANGELOG.md
├── docs/                       # documentação técnica (não publicada)
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

Páginas de desenvolvimento (não indexadas, fora do menu): `guia.html`, `design-meta.html` e `exemplos.html`. Só elas carregam `css/exemplos.css`.
