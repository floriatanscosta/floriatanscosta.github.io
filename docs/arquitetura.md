# Arquitetura e estrutura

Como o site [floriatan.com.br](https://floriatan.com.br/) é construído: tecnologias, critérios de qualidade, fluxo de geração e organização dos arquivos. Visão geral do projeto no [README](../README.md).

_Conferido com os arquivos do repositório em 14/11/2026._

## Tecnologias

- HTML, CSS e JavaScript sem frameworks nem dependências externas (exceto o Google Analytics); fonte Roboto servida localmente.
- Gerador em **Python 3** (`_src/build.py`, só a biblioteca padrão).
- Currículo em PDF com **ReportLab** e **svglib** (`_src/cv_pdf.py`).
- Hospedagem no **GitHub Pages** (o Jekyll apenas copia os arquivos; ver `_config.yml`) com domínio próprio (`CNAME`).
- Sem etapa de build no servidor: as páginas geradas são versionadas junto com a fonte, e o GitHub Pages publica o que estiver no branch `main`.
- Cache: o gerador acrescenta `?v=AAAAMMDD` (data do build) aos CSS das páginas geradas, para que o navegador busque a versão nova após cada publicação. As Ferramentas e a página de desenvolvimento, escritas à mão, não recebem esse sufixo automaticamente; nas Ferramentas, o `app.js` de cada uma leva um `?v=` manual (versão na Assinatura, data no Custom Plate), a atualizar a cada mudança.

### Qualidade

- **Acessibilidade:** link "pular para o conteúdo", navegação por teclado, foco visível, `aria-current`, `aria-expanded`, contraste AA nos temas claro e escuro, respeito a `prefers-reduced-motion`. Auditoria automatizada (axe-core, WCAG 2.1 AA) sem violações.
- **SEO:** título e descrição por página e idioma, `canonical`, `hreflang`, Open Graph, dados estruturados `Person` (JSON-LD) e `sitemap.xml`.
- **Privacidade:** Google Analytics bloqueado até o consentimento do visitante (RGPD/LGPD), no site e nas Ferramentas; textos do aviso em `site.json` → `consent` (site) e escritos em cada página das Ferramentas. Ver [Medição de audiência](#medição-de-audiência-google-analytics).
- **Segurança:** Content-Security-Policy via `<meta>`, `rel="noopener noreferrer"` em links externos, nenhum script inline nas páginas geradas.
- **Desempenho:** imagens WebP (≈ 90 % menores que os PNG originais), dimensões declaradas, `loading="lazy"`, fonte com `preload`.

## Arquitetura

```text
_src/data/*.json ─────┐
                      ├──▶ _src/build.py ──▶ /*.html  /en/*.html  /es/*.html  sitemap.xml
_src/pages/<idioma>/ ─┘          │
                                 └──▶ _src/cv_pdf.py ──▶ assets/cv/floriatan-costa-cv-<idioma>.pdf

ferramentas/**  (HTML escrito à mão, fora do gerador) ──▶ publicado como está
```

| Parte | Responsabilidade |
|---|---|
| `_src/` | **Fonte** do site, não publicada (o Jekyll ignora pastas iniciadas por `_`) |
| `_src/build.py` | Gerador: monta cabeçalho, rodapé, metadados e seletor de idioma; com `--check`, verifica links internos; com `--no-pdf`, não gera os currículos |
| `_src/cv_pdf.py` | Currículo em PDF (requer ReportLab e svglib); fontes Roboto em `_src/fonts/` (licença OFL) |
| `_src/data/site.json` | Textos da interface (menu, rótulos, botões, aviso de cookies) em pt/en/es |
| `_src/data/cv.json` | Dados do currículo: prêmios, formação, experiência, projetos, revisões, métricas… |
| `_src/data/publications.json` | Artigos e trabalhos em eventos (títulos no idioma original) |
| `_src/data/media.json` | Mídia e divulgação: revistas de divulgação, notícias, entrevistas, podcasts e menções (página Mídia) |
| `_src/pages/pt\|en\|es/*.html` | Conteúdo de cada página; blocos de dados entram como `{{nome_do_bloco}}` |
| `/*.html`, `/en/`, `/es/` | Páginas **geradas**: 13 em português na raiz (inclui `vida` e `404`) e 11 em inglês e em espanhol (35 no total) |
| `css/global.css` | Tokens (cores do logotipo, escala tipográfica, pesos, raios, sombras), base, cabeçalho, menu, rodapé, botões, aviso de cookies |
| `css/main.css` | Componentes de conteúdo (abertura da página inicial, cartões, linha do tempo, publicações, métricas…) |
| `css/exemplos.css` | Componentes antigos usados só na página de desenvolvimento `exemplos.html` |
| `css/premiacoes.css`, `css/design.css`, `css/vida.css` | Estilos próprios de cada uma dessas páginas |
| `js/theme-init.js` | Aplica o tema (claro, escuro ou seguir o sistema) antes da renderização (evita "piscar") |
| `js/app.js` | Menu móvel, seletor de tema e de idioma, aviso de idioma, e-mails protegidos da página Contato, ano do rodapé |
| `js/publications.js` | Filtro da lista de publicações |
| `js/design.js` | Botões "Copiar" da paleta da página Design |
| `js/vida.js` | Animações e galeria da página Vida de cientista |
| `js/analytics.js` | Aviso de consentimento + Google Analytics 4 (só carrega após "Aceitar") + eventos `pdf_download` e `tool_action` |
| `assets/` | Logo, favicon, ícones (`sprite.svg`), fontes Roboto, imagens e logos (`svg/` e `img/logos/`) |
| `assets/_docs/License.txt` | Aviso que remete ao `LICENSE` da raiz (pasta com `_`, não publicada) |
| `assets/cv/` | Currículos em PDF (pt, en, es), gerados por `_src/cv_pdf.py` |
| `sitemap.xml` | Gerado automaticamente, com alternativas `hreflang` (só as páginas geradas; as Ferramentas não entram) |
| `ferramentas/` | **Ferramentas** (Assinatura de e-mail e Custom Plate publicadas; Fluidodinâmica em desenvolvimento): HTML estático, fora do gerador e sem tradução; usam a mesma base visual (`/css`, `/js`, `/assets`) mais `ferramentas/css/ferramentas.css` e o `style.css` de cada ferramenta, e o mesmo `js/analytics.js`. Ver [`ferramentas/README.md`](../ferramentas/README.md) |
| `exemplos.html` | Página de desenvolvimento escrita à mão (fora do gerador e do menu), com `Disallow` no `robots.txt` |
| `_testes/` | Protótipo da página inicial (design v2) e `RELATORIO-DESIGN.md` (auditoria de 28/10/2026); não publicado |
| `docs/` | Documentação: arquitetura, atualização, design system, histórico e pendências; excluída da publicação no `_config.yml` |
| `.claude/launch.json` | Configuração do servidor local de visualização (`python -m http.server 8765`); não publicada |
| `CLAUDE.md` | Instruções para o assistente de código (regras de commits e pull requests); não publicado |
| `LICENSE` | Licença: todos os direitos reservados (ver a seção [Licença](#licença)) |

As Ferramentas ficavam no repositório [`web`](https://github.com/floriatanscosta/web) (`floriatan.com.br/web/`) até 14/11/2026. Ele continua público **só como legado**: guarda as imagens usadas pelas assinaturas de e-mail já enviadas (`components/assinatura/assets/` e `components/gerador/`) e a página `assinatura.html`, que leva o endereço antigo `/web/assinatura` para `/ferramentas/assinatura/`. Os demais endereços antigos de `/web/` (lista, Custom Plate, fluidodinâmica, Sobre, Aviso) foram removidos em 14/11/2026 e dão erro 404.

## Medição de audiência (Google Analytics)

Um único script, `js/analytics.js`, atende o site principal e as Ferramentas (ID `G-0NDPRCLMYV`, no atributo `data-ga-id` do aviso `#consent`).

- **Consentimento:** tudo começa negado (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`). O `gtag.js` só é baixado depois de "Aceitar"; a escolha fica 12 meses no `localStorage` (`analytics_consent`) e pode ser mudada pelo botão "Preferências" do rodapé. Ao recusar, os cookies `_ga*` são apagados. Indicadores do Google e personalização de anúncios ficam sempre desativados.
- **Contexto em todos os eventos:** `site_section` (`site` ou `ferramentas`), `content_group` (`Site principal` ou `Ferramentas`), `page_language` (atributo `lang` do `<html>`) e, nas Ferramentas, `tool_name` (nome da pasta, ou `lista`, `sobre`, `aviso`).
- **`pdf_download`:** clique (ou botão do meio) em link para `.pdf`, com `file_name`, `link_url`, `link_text`, `link_domain`, `outbound`, `link_location` e `pdf_type` (`curriculo`, `interno`, `externo`); também no "Exportar PDF" das Ferramentas (`pdf_type = gerado_ferramenta`).
- **`tool_action`:** clique em elemento com `data-track="<ação>"` e `form_used` (uma vez por página, ao alterar um campo). Os valores digitados nunca são enviados.
- **No painel do GA4:** os parâmetros `pdf_type`, `link_location`, `outbound`, `tool_name`, `tool_action`, `site_section` e `page_language` precisam estar cadastrados como dimensões personalizadas (escopo Evento) para aparecer nos relatórios (ver `PENDENCIAS.md`, F2).

## Estrutura do repositório

```text
floriatanscosta.github.io/
├── .claude/launch.json         # servidor local de visualização (não publicado)
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
├── _testes/                    # protótipo da página inicial e auditoria de design (não publicado)
│   ├── css/                    # home-v2.css, tokens-v2.css
│   ├── index.html
│   └── RELATORIO-DESIGN.md
├── assets/
│   ├── _docs/License.txt       # aviso que remete ao LICENSE da raiz
│   ├── cv/                     # floriatan-costa-cv-pt|en|es.pdf (gerados)
│   ├── fonts/                  # Roboto .woff2 + License.txt
│   ├── icons/                  # ícones SVG e sprite.svg
│   ├── img/                    # foto (profile.webp), apple-touch-icon, fotos da linha do tempo (time1–6.webp)
│   │   │                       # + cover.png e profile.png antigos (ver PENDENCIAS F4)
│   │   └── logos/              # logos institucionais em imagem
│   ├── svg/                    # logos institucionais e ilustração de fundo
│   ├── cover.png               # imagem de compartilhamento (og:image)
│   ├── favicon.svg
│   └── logo.svg
├── css/
│   ├── design.css
│   ├── exemplos.css            # só exemplos.html
│   ├── global.css
│   ├── main.css
│   ├── premiacoes.css
│   └── vida.css
├── docs/                       # documentação (não publicada)
│   ├── arquitetura.md          # este arquivo
│   ├── atualizacao.md          # como atualizar, gerar e publicar
│   ├── CHANGELOG.md            # histórico de alterações
│   ├── design.md               # design system
│   └── PENDENCIAS.md           # feito, ideias, dados a conferir
├── en/                         # páginas geradas em inglês
├── es/                         # páginas geradas em espanhol
├── ferramentas/                # Ferramentas (HTML estático, ver ferramentas/README.md)
│   ├── _fluidodinamica/        # calculadora em desenvolvimento (não publicada)
│   ├── _modelo/                # ponto de partida para uma ferramenta nova (não publicado)
│   ├── assinatura/             # index.html, app.js, style.css, cover.png, README.md, assets/
│   ├── css/ferramentas.css     # estilos comuns das Ferramentas
│   ├── plate/                  # Custom Plate, idem (assets/slide.svg)
│   ├── index.html, sobre.html, aviso.html
│   ├── CHANGELOG.md            # histórico das Ferramentas (não publicado)
│   └── README.md               # (não publicado)
├── js/
│   ├── analytics.js
│   ├── app.js
│   ├── design.js
│   ├── publications.js
│   ├── theme-init.js
│   └── vida.js
├── index.html, biografia.html, experiencia.html, publicacoes.html, producao.html,
│   premiacoes.html, midia.html, metricas.html, contato.html, sobre.html, design.html, vida.html, 404.html
├── exemplos.html               # página de desenvolvimento
├── .gitignore
├── _config.yml                 # configuração do Jekyll / GitHub Pages
├── CLAUDE.md                   # instruções para o assistente de código
├── CNAME                       # floriatan.com.br
├── LICENSE                     # todos os direitos reservados
├── README.md
├── robots.txt
└── sitemap.xml
```

Para resumir, a árvore mostra só as pastas das páginas em `_src/pages/`, `en/`, `es/` e dos
ícones e imagens em `assets/`, sem listar cada arquivo.

Página de desenvolvimento (não indexada, fora do menu): `exemplos.html`, a única que carrega `css/exemplos.css`. As antigas `guia.html` e `design-meta.html` foram apagadas em 14/11/2026.

## O que é publicado

O GitHub Pages publica o conteúdo do branch `main`, com estas exceções:

- pastas e arquivos iniciados por `_` ou `.` (`_src/`, `_testes/`, `assets/_docs/`, `ferramentas/_modelo/`, `ferramentas/_fluidodinamica/`, `.claude/`), ignorados pelo Jekyll;
- os itens da lista `exclude` do `_config.yml`: `README.md`, `CLAUDE.md`, `docs/`, `LICENSE` e os README e CHANGELOG de `ferramentas/`.

Atenção: o GitHub Pages converte em página **qualquer** arquivo `.md`, mesmo sem cabeçalho YAML. Todo Markdown novo fora de `docs/` e de pastas com `_` precisa entrar no `exclude` (até 14/11/2026 o `CLAUDE.md` aparecia em `floriatan.com.br/CLAUDE.html`).
Os arquivos não publicados continuam visíveis no GitHub, porque o repositório é público.

## Repositórios

| Repositório | Papel |
|---|---|
| [`floriatanscosta/floriatanscosta.github.io`](https://github.com/floriatanscosta/floriatanscosta.github.io) | **Principal**: site, fonte, Ferramentas e documentação; publicado em `floriatan.com.br` |
| [`floriatanscosta/web`](https://github.com/floriatanscosta/web) | **Legado**, só para a Assinatura: imagens das assinaturas de e-mail já enviadas (também usadas pelo gerador atual) e redirecionamento de `/web/assinatura`. Manter público, com o branch `main` e o GitHub Pages ativos; não mover nem renomear os arquivos de imagem |

## Licença

Todo o conteúdo e o código deste repositório são de Floriatan Santos Costa, com **todos os direitos
reservados**. Usar o código em outros softwares, ou o conteúdo em outros materiais, depende de
autorização prévia e por escrito. Termos completos em [`LICENSE`](../LICENSE); resumo no
[README](../README.md#licença).
