# Calculadora de fluidodinâmica para ICP-MS (em teste)

Página: **https://floriatan.com.br/ferramentas/fluidodinamica/** (`index.html`)
Pasta: `ferramentas/fluidodinamica/` · Script: `app.js` · Estilos: `style.css` (+ comuns em `ferramentas/css/ferramentas.css`)
Endereços antigos: `/web/test-gota` e `/web/fluidodinamica` (redirecionam para o novo)

Ferramenta em teste, fora da lista de ferramentas e sem indexação nos buscadores
(`noindex`). Calcula, para uma câmara de nebulização cilíndrica, o volume interno, a
velocidade linear do gás, o tempo de residência e o número de Reynolds, e indica o regime
de fluxo. Tudo roda no navegador.

## Entradas

| Campo | Unidade | Mínimo |
|---|---|---|
| Gás de arraste/bainha | Argônio, hélio ou nitrogênio | — |
| Vazão do nebulizador | L/min | 0,01 |
| Vazão de bainha / make-up | L/min | 0 |
| Diâmetro interno médio | mm | 1 |
| Comprimento útil da câmara | mm | 5 |

## Cálculos

- Volume (mL) = π · r² · L, com r e L em cm.
- Vazão total = nebulizador + bainha.
- Velocidade linear (m/s) = vazão total (m³/s) ÷ área da seção (m²).
- Tempo de residência (ms) = volume ÷ vazão total.
- Reynolds: Re = ρ · v · D ÷ μ, com densidade (ρ) e viscosidade (μ) do gás a 25 °C e 1 atm
  (constantes em `GAS`, no início de `app.js`).
- Regime: laminar (Re < 2000), transição (2000 a 4000) ou turbulento (> 4000).

Os resultados são estimativas para comparar configurações; não substituem a caracterização
experimental da câmara.

## Arquivos

| Arquivo | Uso |
|---|---|
| `index.html` | Página e formulário |
| `app.js` | Cálculos e atualização dos resultados |
| `style.css` | Estilos próprios (campos, resultados e regime de fluxo) |
| `README.md` | Este arquivo (não publicado) |

Ainda não há imagem de capa (`cover.png`): ela só é necessária quando a ferramenta entrar
na lista de `/ferramentas/`.
