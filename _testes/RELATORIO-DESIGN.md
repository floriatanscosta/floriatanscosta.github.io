# Auditoria de design — floriatan.com.br

_28/10/2026 · análise de `css/*.css`, `design.md` e da página inicial (claro, escuro, 1366 px e 390 px)._

A versão de teste da página inicial está em [`_testes/index.html`](index.html), com os estilos
[`_testes/css/tokens-v2.css`](css/tokens-v2.css) e [`_testes/css/home-v2.css`](css/home-v2.css).
Como a pasta começa com `_`, o Jekyll não a publica. Para ver a página, rode na raiz do repositório
`python -m http.server 8765` e abra `http://localhost:8765/_testes/`.

---

## Resumo

**Itens revisados:** tokens, 5 folhas de estilo, 14 componentes da página inicial · **Problemas encontrados:** 14 · **Nota:** 62/100

O site já tem uma base sólida: acessibilidade, tema escuro, impressão e um gerador estático bem organizado.
O que falta é **coerência visual**. As cores da interface não vêm do logotipo, os tokens existem mas
são pouco usados, e a página inicial repete o mesmo cartão branco em todas as seções, o que
deixa a página monótona depois da abertura.

## 1. Problemas de identidade e consistência

| # | Problema | Onde | Recomendação |
|---|---|---|---|
| 1 | **A paleta da interface não vem do logotipo.** O logo e a arte usam azul-marinho `#274c77`, petróleo `#1c7d9a` e lavanda `#8682ab`. A interface usa outra família: `#5a729e`, `#666fe4` e `#1d6ee7`. O petróleo do logo só aparece codificado direto em `premiacoes.css`. | `global.css` `:root`, `assets/logo.svg`, `assets/svg/fundo.svg` | Derivar os papéis de cor do logotipo (feito em `tokens-v2.css`). |
| 2 | **No tema escuro, `--heading-color` e `--heading-strong` são os dois `#FFFFFF`.** A hierarquia entre título e subtítulo desaparece. | `global.css` `[data-theme="dark"]` | Usar dois níveis: `#eef3f9` e `#ffffff`. |
| 3 | **Muitas cores fora dos tokens:** 107 valores hex em `global.css`, 88 em `main.css`, 40 em `design.css`, 14 em `vida.css` e 13 em `premiacoes.css` (as contagens incluem as definições de tokens). Exemplos: `.metric-number` `#4369bb`/`#2e9a55`, `.badge--accent` `#4a4fc0`, `.tag-*` `#2ea053`/`#d97706`, `.card-title-bold` `#8fa9d6`, a seta do tooltip `#24577f`. | `main.css` §4, §10, §12; `global.css` §8–9 | Criar tokens semânticos (`--success`, `--warning`, `--danger`, `--metric-*`) e trocar os valores fixos por eles. |
| 4 | **Tokens duplicados ou mortos:** `--surface-2` e `--color-bg-surface-1/2` fazem o mesmo papel. `--text-main-2`, `--text-main-3`, `--bg-error`, `--background-gradient`, `--header-gradient` e `--nav-bg` quase não têm uso. `--color-bg-page` e `--color-bg-surface-3` só existem no tema escuro. `--success` existe, mas `.tag-success` usa cor fixa. | `global.css` §1 | Reduzir a um conjunto único: superfícies, texto, marca, estados. |
| 5 | **Cantos arredondados sem padrão.** Os tokens definem 3, 8 e 10 px, mas o código também usa `999px` (14×), `50%` (11×), `8px` (5×), `20px` (4×), `6px`, `4px`, `2px`, `9px`, `12px`, `14px` e `24px`. O `design.md` diz que a pílula tem 20 px; o código usa 999 px. Há ainda `var(--radius-md, 16px)` com um valor reserva diferente do token. | todos os CSS | Ficar com quatro valores: 6 / 10 / 16 / 999 px. |
| 6 | **Oito pesos de fonte (100 a 900).** 600 e 700 são usados para o mesmo papel, e 900 aparece em 17 regras. | todos os CSS | Ficar com quatro: 400, 500, 700 e 800. |
| 7 | **Escala tipográfica ignorada.** Existem `--font-size-sm/base/lg`, mas `main.css` tem 66 `font-size` com valor fixo (0.78, 0.82, 0.85, 0.88, 0.9, 0.92, 0.93, 0.95, 0.98 rem…). Há também `h1–h6 { margin-bottom: 40px }` global, sobrescrito em quase todo lugar. | `main.css`, `global.css` §2 | Usar uma escala de 8 passos (`--fs-xs` … `--fs-display`) e uma margem de título menor. |
| 8 | **Texto em degradê nos números de destaque.** Reduz a legibilidade, e no tema escuro usa uma cor fixa (`#c9ccff`). | `.stat-strip dd` | Usar uma cor sólida de título; guardar o degradê para um destaque só. |
| 9 | **CSS legado misturado ao ativo.** Cerca de 40 % de `main.css` atende só `exemplos.html`/`guia.html`: `.social-*`, `.article-*`, `.project-card`, `.timeline`, `.skill-*`, `.ui-tag-gradient/glow/pulse`, `.ods-*`, `.glass-*`, `.hero-fullscreen`, `.img-reveal`. Em `global.css` ainda há `.lang-dropdown` e `#navMenu`. | `main.css` §8, §11–13; `global.css` §5 | Mover para `css/legado.css`, carregado só nas páginas de exemplo. |
| 10 | **`design.md` desatualizado:** o verde é `#4CB96E` no documento e `#2e8a4f` no CSS; a pílula é 20 px no documento; o glassmorphism é descrito como parte da identidade, mas está fora de uso; o texto mistura português europeu ("ecrã", "utilizador", "secções") com o português do Brasil do site. | `design.md` | Reescrever depois de migrar os tokens (v3.0). |

## 2. Página inicial

| # | Problema | Evidência | O que a versão de teste faz |
|---|---|---|---|
| 11 | **Falta ritmo depois da abertura.** Indicadores, linhas de pesquisa, publicações e "Explore" usam o mesmo cartão branco, com a mesma borda e a mesma sombra; nada guia o olhar. | Captura em 1366 px | Cada seção ganha uma forma própria: faixa de números sobreposta à abertura, cartões numerados, publicações lado a lado e uma grade com destaque fotográfico. |
| 12 | **Não há ação principal.** O único botão é "Currículo em PDF", em contorno. Os seis cartões de perfil (com ícones coloridos) competem pela atenção e repetem o rodapé; "Métricas" (link interno) está misturado aos perfis externos. | `.profile-links` | Botão principal "Ver publicações" + currículo como secundário. Perfis viram pílulas pequenas. "Métricas" passa para a faixa de números. |
| 13 | **No celular, a arte ocupa a primeira tela inteira**: o título só aparece depois de rolar, e o subtítulo superior quebra em duas linhas. | Captura em 390 px | Texto primeiro; a arte vira um selo de 128 px acima do título. |
| 14 | **"Explore" repete o menu com seis cartões iguais.** | `.nav-cards` | Grade com "Vida de cientista" em destaque (foto `time4.webp`) e quatro atalhos. "Publicações" sai da grade porque já tem botão e seção próprios. |

## 3. Tokens propostos (`tokens-v2.css`)

| Categoria | Atual | Proposto |
|---|---|---|
| Marca | `#5a729e`, `#666fe4`, `#1d6ee7` | Azul-marinho `#274c77` (títulos e botões), petróleo `#17738e` (acento, escurecido para AA), índigo `#4f5fc4`, lavanda `#8682ab` (só decoração) |
| Degradê | 5 degradês diferentes | Um só: `--brand-gradient` (petróleo → azul → índigo) |
| Superfícies | branco sobre um degradê rosa/azul | `#f5f7fb` (página), `#ffffff` (cartão), `#eef3f8` (realce) |
| Texto | `#3d4350` / `#5f6675` | `#2f3747` / `#5b6474` |
| Escuro | títulos `#FFF`, acento `#9aa1ff` | títulos `#eef3f9`/`#fff`, acento `#5cc3dc`, superfícies `#12161c`/`#1a2029`/`#222a35` |
| Tipografia | 3 tokens, 66 valores fixos | `--fs-xs` 0.75 · `sm` 0.875 · `base` 1 · `md` 1.125 · `lg` 1.25 · `xl` 1.5 · `2xl` 2 · `display` clamp(2.25–3.5 rem) |
| Pesos | 100–900 | 400 / 500 / 700 / 800 |
| Raios | 3 / 8 / 10 + 11 valores soltos | 6 / 10 / 16 / 999 px |
| Sombras | cinza neutro | Tom do azul-marinho, 3 níveis |
| Movimento | `0.15s`/`0.3s ease` + curvas soltas | `--dur-fast` 150 ms · `--dur-base` 260 ms · `--ease-out` |

**Contraste (WCAG 2.1, calculado):**

| Combinação | Razão |
|---|---|
| Texto sobre a página | 11,1:1 |
| Texto secundário sobre a página | 5,6:1 |
| Acento sobre a página | 5,1:1 |
| Botão (branco sobre o azul-marinho) | 8,8:1 |
| Escuro: texto | 14,2:1 |
| Escuro: texto secundário | 7,7:1 |
| Escuro: acento | 8,9:1 |
| Fim do degradê (`#6a6fc4`), só em texto grande | 4,2:1 (mínimo para texto grande: 3:1) |

No CSS atual, `--accent` `#666fe4` sobre branco dá 4,2:1, abaixo de 4,5:1 se for usado em texto pequeno.

## 4. Ações prioritárias

1. **Adotar a paleta do logotipo como tokens únicos.** Mover o conteúdo de `tokens-v2.css` para o `:root` de `global.css`, apagar os tokens duplicados e mortos (item 4) e trocar as cores fixas por tokens (item 3). Sozinha, essa mudança já unifica todas as páginas.
2. **Padronizar a escala.** Quatro raios, quatro pesos e oito tamanhos de fonte; substituir os valores soltos (itens 5–7), arquivo por arquivo.
3. **Levar a nova página inicial para `_src/pages/{pt,en,es}/index.html`.** Copiar as regras `.hv-*` de `home-v2.css` para `main.css` §5 (trocando o prefixo por `home-`) e gerar com `build.py`.
4. **Separar o CSS legado** em `css/legado.css` (item 9).
5. **Revisar páginas internas com os mesmos padrões.** O cabeçalho de seção (`eyebrow` + `h2`), os cartões com filete de marca e a faixa de números servem para Métricas, Premiações e Biografia.
6. **Atualizar o `design.md` para a v3.0**, em português do Brasil, com a tabela de tokens acima.

## 5. O que a versão de teste não cobre

- Só existe em português; as versões em inglês e espanhol precisam ser criadas a partir do gerador.
- `tokens-v2.css` redefine as variáveis globais, então o cabeçalho e o rodapé já aparecem com a nova paleta. As outras páginas, porém, não carregam esse arquivo.
- A página de teste não tem o aviso de cookies nem o Google Analytics, e leva `noindex`.
- Não rodei o axe-core: a CSP bloqueia scripts externos. O contraste foi calculado à mão (tabela acima), e os temas claro e escuro foram conferidos visualmente em 1366 px e 390 px (em 390 px, sem rolagem horizontal).
