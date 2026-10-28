---
version: 3.0.0
name: Floriatan-Design-System
description: "Design system do portfólio acadêmico floriatan.com.br. As cores vêm do logotipo Fc (azul-marinho, petróleo e lavanda); tipografia Roboto com escala fixa; superfícies claras ou escuras com bordas finas e sombras suaves no tom do azul-marinho. Todos os valores de cor, tamanho de fonte, peso e raio são tokens definidos em css/global.css."

colors:
  brand-navy: "#274c77"        # logotipo; títulos e botões
  brand-navy-deep: "#1b3a5e"   # destaques; botão ao passar o mouse
  brand-teal: "#1c7d9a"        # logotipo (centro do gradiente)
  brand-ice: "#cce2ed"         # letras do logotipo
  brand-lavender: "#8682ab"    # ilustração do logotipo
  brand-gradient: "linear-gradient(120deg, #1c7d9a, #3b63a8, #6a6fc4)"  # escuro: #5cc3dc → #8fb0ff → #b3b0f0
  bg-color: "#f5f7fb"          # escuro: #12161c
  box-bg: "#ffffff"            # escuro: #1a2029
  surface-2: "#eef3f8"         # escuro: #222a35
  border-color: "#e1e7ef"      # escuro: #2a323e
  heading-color: "#274c77"     # escuro: #eef3f9
  heading-strong: "#1b3a5e"    # escuro: #ffffff
  text-main: "#2f3747"         # escuro: #dfe4ea
  text-muted: "#5b6474"        # escuro: #a9b2bf
  link-color: "#17738e"        # escuro: #5cc3dc
  accent: "#17738e"            # escuro: #5cc3dc
  accent-2: "#4f5fc4"          # escuro: #9aa5ff
  btn-bg: "#274c77"            # escuro: #2b5c8c
  btn-bg-hover: "#1b3a5e"      # escuro: #336ba2
  focus-ring: "#17738e"        # escuro: #5cc3dc
  success: "#217a41"           # escuro: #7fe0a3
  warning: "#9a5b00"           # escuro: #fcd34d
  danger: "#c62828"            # escuro: #fca5a5
  medal: "#a8730d"             # escuro: #e8b54a

typography:
  font-primary: "'Roboto Variable', Roboto, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"  # servida em /assets/fonts
  font-mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace"
  sizes:
    fs-xs: "0.75rem"
    fs-sm: "0.875rem"
    fs-base: "1rem"
    fs-md: "1.125rem"
    fs-lg: "1.25rem"
    fs-xl: "1.5rem"
    fs-2xl: "2rem"
    fs-3xl: "clamp(2rem, 4.2vw, 3rem)"        # títulos de página
    fs-display: "clamp(2.25rem, 4.8vw, 3.5rem)" # abertura da página inicial
    fs-number: "clamp(2rem, 3.6vw, 2.75rem)"   # números de destaque
  weights:
    fw-regular: 400
    fw-medium: 500
    fw-bold: 700
    fw-black: 800

rounded:
  radius-sm: "6px"
  radius-md: "10px"
  radius-lg: "16px"
  radius-pill: "999px"
  radius-full: "50%"   # só para círculos

spacing:
  spacing-xs: "4px"
  spacing-sm: "8px"
  spacing-md: "16px"
  spacing-lg: "24px"
  spacing-xl: "32px"
  spacing-2xl: "56px"

shadow:
  shadow-sm: "0 1px 2px rgba(23,42,66,.06), 0 1px 1px rgba(23,42,66,.03)"
  shadow-md: "0 10px 24px -10px rgba(23,42,66,.22)"
  shadow-lg: "0 24px 48px -16px rgba(23,42,66,.28)"

motion:
  transition-fast: "0.15s ease"
  transition-normal: "0.3s ease"
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"

components:
  button-primary:
    backgroundColor: "{colors.btn-bg}"
    textColor: "#ffffff"
    rounded: "{rounded.radius-md}"
    padding: "12px 22px"
    fontWeight: "{typography.weights.fw-bold}"
  button-outline:
    backgroundColor: "{colors.box-bg}"
    borderColor: "{colors.border-color}"
    textColor: "{colors.heading-color}"
    rounded: "{rounded.radius-md}"
  card:
    backgroundColor: "{colors.box-bg}"
    borderColor: "{colors.border-color}"
    rounded: "{rounded.radius-lg}"
    padding: "26px"
    shadow: "{shadow.shadow-sm}"
  badge:
    rounded: "{rounded.radius-pill}"
    fontSize: "{typography.sizes.fs-xs}"
    fontWeight: "{typography.weights.fw-bold}"
---

# Design system — floriatan.com.br (v3.0)

## Visão geral

A identidade parte do logotipo **Fc**: o gradiente de **petróleo** (`#1c7d9a`) a **azul-marinho** (`#274c77`), as letras em **azul-gelo** (`#cce2ed`) e a ilustração em **lavanda** (`#8682ab`). A interface usa essas cores em papéis fixos: o azul-marinho comanda títulos e botões, o petróleo marca links, destaques e foco, e um único degradê de marca (`--brand-gradient`) aparece em detalhes (filetes, sublinhado do menu, trecho destacado do título da página inicial).

Superfícies são claras e neutras (ou escuras no tema escuro), separadas por bordas finas de 1 px e sombras suaves no tom do azul-marinho. Não há cores fora dos tokens.

## Regras

1. **Cor, tamanho de fonte, peso e raio sempre por token** (`var(--…)`). Exceções aceitas: amostras da paleta na página Design, fundos de demonstração do logotipo, cores oficiais dos ODS (em `exemplos.css`), máscaras (`#000` em `mask-image`), fundo branco atrás de logotipos institucionais e a paleta fixa da versão impressa.
2. **Quatro pesos:** 400 (texto), 500 (rótulos, menu), 700 (links, botões, subtítulos), 800 (títulos e números).
3. **Quatro raios:** 6 px (campos, itens de menu), 10 px (botões, caixas pequenas), 16 px (cartões), 999 px (pílulas e selos). Círculos usam `--radius-full`.
4. **Escala tipográfica:** `--fs-xs` a `--fs-2xl` para texto e interface; `--fs-3xl` para títulos de página, `--fs-display` só para a abertura da página inicial, `--fs-number` para números de destaque.
5. **Texto em degradê** só no trecho destacado do título da página inicial, no título da página "Vida de cientista" e no código da página 404.

## Cores

| Papel | Token | Claro | Escuro |
|---|---|---|---|
| Fundo da página | `--bg-color` | `#f5f7fb` | `#12161c` |
| Cartões | `--box-bg` | `#ffffff` | `#1a2029` |
| Superfície de realce | `--surface-2` | `#eef3f8` | `#222a35` |
| Bordas | `--border-color` | `#e1e7ef` | `#2a323e` |
| Títulos | `--heading-color` | `#274c77` | `#eef3f9` |
| Títulos de destaque | `--heading-strong` | `#1b3a5e` | `#ffffff` |
| Texto | `--text-main` | `#2f3747` | `#dfe4ea` |
| Texto secundário | `--text-muted` | `#5b6474` | `#a9b2bf` |
| Links e destaques | `--link-color`, `--accent`, `--focus-ring` | `#17738e` | `#5cc3dc` |
| Detalhes, fim do degradê | `--accent-2` | `#4f5fc4` | `#9aa5ff` |
| Botão | `--btn-bg` / `--btn-bg-hover` | `#274c77` / `#1b3a5e` | `#2b5c8c` / `#336ba2` |
| Estados | `--success`, `--warning`, `--danger` | `#217a41`, `#9a5b00`, `#c62828` | `#7fe0a3`, `#fcd34d`, `#fca5a5` |
| Prêmios | `--medal` | `#a8730d` | `#e8b54a` |

No tema escuro os títulos (`#eef3f9`) ficam um nível abaixo dos destaques (`#ffffff`), para manter a hierarquia.

**Contraste (WCAG 2.1):** texto 11,1:1; texto secundário 5,6:1; links/acento 5,1:1 sobre o fundo e 4,9:1 sobre `--surface-2`; botão 8,8:1. No escuro: texto 14,2:1, secundário 7,7:1, acento 8,9:1, botão 7,0:1. Estados: 5,3–5,6:1 no claro.

**Apelidos de compatibilidade** (só para as Ferramentas em `/web`, não usar em código novo): `--color-bg-surface-1` → `--surface-2`, `--text-color-error` → `--danger`, `--bg-error` → `--danger` a 18 %.

O tema tem três modos — claro, escuro e seguir o sistema — guardados em `localStorage` ("theme") e aplicados por `js/theme-init.js` antes da renderização (`<html data-theme>` e `data-theme-mode`). A paleta completa está documentada na página `/design`.

## Tipografia

Roboto variável servida pelo próprio site (WOFF2 em `/assets/fonts`). Monoespaçada do sistema para siglas e dados técnicos.

| Uso | Tamanho | Peso |
|---|---|---|
| Abertura da página inicial | `--fs-display` | 800 |
| Título de página (`.page-hero h1`) | `--fs-3xl` | 800 |
| Título de seção (`.section-title`, `h2`) | `--fs-xl` | 800 |
| Título de cartão | `--fs-lg` | 800 |
| Texto | `--fs-base`, entrelinha 1,6 | 400 |
| Texto auxiliar, menu, botões | `--fs-sm` | 400–700 |
| Rótulos em caixa-alta (`.eyebrow`, `.card-subtitle-sm`) | `--fs-xs`, espaçamento 0,1 em | 700 |

## Elevação

- **Nível 0:** fundo da página, listas compactas.
- **Nível 1:** cartões e caixas — borda de 1 px + `--shadow-sm`.
- **Nível 2:** ao passar o mouse e elementos fixos (filtro de publicações) — `--shadow-md`, cartão sobe 2–3 px.
- **Nível 3:** menus suspensos, aviso de cookies — `--shadow-lg`.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `css/global.css` | Tokens, base, cabeçalho, menus, rodapé, botões, alertas, sanfona, dicas, modal, aviso de cookies, impressão. Carregado também pelas Ferramentas. |
| `css/main.css` | Componentes de conteúdo e a página inicial. Carregado também pelas Ferramentas. |
| `css/premiacoes.css`, `css/design.css`, `css/vida.css` | Estilos de cada uma dessas páginas (campo `styles:` do fragmento). |
| `css/exemplos.css` | Componentes antigos usados só em `exemplos.html`, `guia.html` e `design-meta.html`. |

## Componentes

| Componente | Classe | Uso |
|---|---|---|
| Abertura da página inicial | `.home-hero`, `.home-title`, `.home-title__hl`, `.home-lead`, `.home-actions` | Texto à esquerda e arte à direita; no celular o texto vem primeiro e a arte vira um selo de 128 px |
| Cargo atual | `.now-pill` | Linha compacta com ponto verde, logotipo e cargo (bloco `{{current}}`) |
| Perfis acadêmicos | `.profile-pills` | Pílulas pequenas com ícone (bloco `{{profiles}}`) |
| Cabeçalho de página | `.page-hero`, `.eyebrow`, `.lead`, `.page-toc` | Título, subtítulo e atalhos de seção |
| Título de seção | `.section`, `.section-title` | Título com filete à direita |
| Cartão | `.card`, `.card-title`, `.card-subtitle-sm` | Blocos de conteúdo |
| Linha do tempo | `.tl`, `.tl-item`, `.tl-logo` | Formação e atuação profissional |
| Lista ano + texto | `.item-list`, `.item-year`, `.item-sub` | Cursos, palestras, eventos, orientações |
| Publicações | `.pub-list`, `.pub-item`, `.pub-title`, `.pub-link` | Artigos e trabalhos em eventos |
| Mídia | `.media-item`, `.media-type` (com `.pub-list`, `.pub-item`, `.badge`) | Página `/midia` |
| Prêmios | `.aw-stats`, `.aw-timeline`, `.aw-card`, `.aw-card--featured` | Página de premiações (`css/premiacoes.css`) |
| Métricas | `.stat-strip`, `.metrics-grid`, `.metric-card`, `.totals` | Indicadores e totais |
| Chips e selos | `.chip`, `.chip--mono`, `.badge`, `.badge--accent/ok/muted` | Linhas de pesquisa, técnicas, status |
| Botões | `.btn`, `.btn-outline`, `.btn-cv`, `.btn-block`, `.btn-group` | Ação principal (cheio) e secundária (contorno) |
| Página Design | `.ds-hero`, `.ds-section`, `.ds-swatches`, `.ds-sw`, `.ds-type`, `.ds-scale` | `css/design.css` |
| Vida de cientista | `.v-hero`, `.v-chapter`, `.v-slides`, `.v-marquee`, `.v-lightbox` | `css/vida.css`, `js/vida.js` |
| Seletores | `details.lang-menu`, `details.theme-menu` | Idioma e tema |
| Aviso de idioma | `.lang-notice` | Criado por `js/app.js`, sem redirecionar |
| Ícones | `<svg class="icon"><use href="/assets/icons/sprite.svg#nome">` | doi, external, award, mail, pin, globe, moon, sun, contrast, download, menu, close, building |

## Acessibilidade

Contraste mínimo AA nos dois temas, foco visível com `--focus-ring`, nenhuma informação transmitida só por cor, animações desligadas com `prefers-reduced-motion`.

## Impressão

`@media print` em `global.css`, `main.css` e nos CSS de página: paleta clara fixa, sem sombras nem filtros, textos em degradê convertidos em texto sólido, navegação e botões ocultos e seções expansíveis abertas.
