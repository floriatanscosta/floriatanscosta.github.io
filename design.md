---
version: 1.0.0
name: Floriatan-Design-System
description: "Um design system acadêmico e profissional construído com foco em legibilidade, performance e estética modular. O sistema equilibra a sobriedade da pesquisa científica (painéis brancos/escuros puros, tipografia estruturada) com toques modernos de Glassmorphism e gradientes sutis. Totalmente fluido e utilitário, ele suporta transições perfeitas para o Modo Escuro, mantendo o contraste e a hierarquia visual por meio de bordas suaves e elevações por sombra."

colors:
  bg-color: "#ffffff" # Dark: #1A1F26
  heading-color: "#5a729e" # Dark: #FFFFFF
  btn-bg: "#5a729e" # Dark: #1F242A
  btn-bg-hover: "#4a5f7c" # Dark: #292f35
  text-main: "#444444" # Dark: #E5E5E5
  box-bg: "#ffffff" # Dark: #23282F
  border-color: "#e2e8f0" # Dark: #2F333C
  nav-bg: "#24577f"
  footer-bg: "#f9f9f9" # Dark: #1F242A
  semantic-success: "#4CB96E"
  semantic-warning: "#d97706"
  semantic-error: "#dc2626"
  header-gradient: "linear-gradient(230deg, #ebb7dd47, #0f58832e)"

typography:
  font-primary: "Roboto, Arial, Tahoma, Verdana, sans-serif"
  font-mono: "'Courier New', monospace"
  display-h2:
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.2
  display-h3:
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
  body-text-base:
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body-text-sm:
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  ui-tag:
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.5px"
    textTransform: "uppercase"

rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
  full: "50%"
  pill: "20px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"

components:
  button-primary:
    backgroundColor: "{colors.btn-bg}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    shadow: "{shadow-sm}"
  button-outline:
    backgroundColor: "transparent"
    borderColor: "{colors.heading-color}"
    textColor: "{colors.heading-color}"
    rounded: "{rounded.md}"
  card-default:
    backgroundColor: "{colors.box-bg}"
    borderColor: "{colors.border-color}"
    rounded: "{rounded.md}"
    padding: "20px"
    shadow: "{shadow-sm}"
  glass-panel:
    backgroundColor: "rgba(255, 255, 255, 0.15)"
    backdropFilter: "blur(20px) saturate(180%)"
    borderColor: "rgba(255, 255, 255, 0.3)"
    rounded: "{rounded.lg}"
  ui-tag-solid:
    backgroundColor: "{colors.heading-color}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

## Visão Geral

Ao contrário do sistema puramente monocromático e focado em blocos de cores pastel[cite: 13], o Design System "Floriatan" baseia-se num contraste dual (Claro/Escuro) governado por variáveis CSS unificadas. O layout é desenhado para ferramentas de produtividade e perfis académicos, utilizando contentores modulares (`.card`, `.project-card`, `.form-panel`) assentes em fundos neutros (`box-bg`).

A distinção visual é alcançada através de:

- **Bordas finas e sombras sutis:** O sistema utiliza `{colors.border-color}` de 1px e `--shadow-sm` para definir fronteiras, evitando blocos de cor invasivos.
- **Tipografia funcional:** Utilização do `Roboto` para interface e `Courier New` para dados técnicos, XML e marcações laboratoriais.
- **Glassmorphism:** Empregues em secções de herói (`.hero-content-glass`) e tags (`.ui-tag-glass`) para adicionar profundidade e modernidade sem sacrificar a legibilidade técnica.

## Cores

O sistema está alicerçado em variáveis responsivas ao tema do utilizador (`[data-theme="dark"]`).

- **Base de Superfície:** `--bg-color` (Branco ou #1A1F26) atua como o fundo do ecrã, enquanto `--box-bg` (Branco ou #23282F) eleva os cartões e formulários.
- **Identidade e Interação:** `--heading-color` (#5a729e / Branco) comanda todos os títulos, botões primários e links de texto.
- **Feedback Semântico:** Verde (#4CB96E), Laranja (#d97706) e Vermelho (#dc2626) são padronizados em `.alert-box` e `.ui-tag`.

## Tipografia

A hierarquia não depende exclusivamente de alterações de peso[cite: 13], mas de uma combinação rigorosa de tamanho e cor semântica.

- **Títulos (H1-H6):** Utilizam sempre `--heading-color` e margens inferiores generosas (40px) para separar secções.
- **Texto Base:** A cor `--text-main` (#444444 ou #E5E5E5) garante contraste AAAA em parágrafos.
- **Utilitários (`text-sm`, `text-muted`):** Guiam o utilizador em formulários e legendas sem poluir a interface primária.

## Elevação e Profundidade (Depth)

- **Level 0 (Flat):** Fundo da página e painéis de aviso em linha.
- **Level 1 (Bordas + Box-bg):** Cartões de projeto, painéis de formulário, e caixas de visualização (`.preview-box`).
- **Level 2 (Shadow-md no Hover):** Botões primários e `.project-card:hover`. O cartão sobe 5px no eixo Y, criando uma sensação tátil de interatividade.
- **Level 3 (Glassmorphism):** Utilizado em painéis especiais (`.glass-panel`). Combina transparência e desfoque (`backdrop-filter`) para criar uma profundidade simulada sob imagens ou fundos gradientes.

## Componentes Chave

### Botões e Formulários

Centralizados globalmente. Todos os inputs possuem `border-radius: var(--radius-sm)` e transicionam o contorno para a `--heading-color` ao focar, projetando uma ligeira aura (`box-shadow`). Botões partilham o mesmo padrão de altura, utilizando `display: inline-flex` com `gap: 8px` para alinhar texto e ícones nativamente.

### Etiquetas de Sistema (UI Tags)

Um sistema expansivo de crachás (`.ui-tag`) com variantes: `solid`, `soft` (fundo com 15% de opacidade), `outline`, `gradient` e `glow`. Utilizados para categorizar publicações, ferramentas ou estados operativos.

### Paineis e Grelhas (Layout)

- `.app-container` dita a divisão 50/50 em ecrãs grandes para ferramentas como o Gerador de Assinaturas e Custom Plate XML.
- `.project-grid` ajusta-se automaticamente (`auto-fit, minmax(300px, 1fr)`) para diretórios e portfólios, empilhando elegantemente em dispositivos móveis.
