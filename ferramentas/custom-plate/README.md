# Custom Plate Design XML Generator

Página: **https://floriatan.com.br/ferramentas/custom-plate/** (`index.html`)
Pasta: `ferramentas/custom-plate/` · Script: `app.js` · Estilos: `style.css` (+ comuns em `ferramentas/css/ferramentas.css`)

Gera o arquivo XML de uma placa personalizada (`<HPDDPlate>`) para o **Tecan Uno Dispenser**
e mostra, em escala, a grade de gotas sobre uma lâmina de vidro. Tudo roda no navegador:
nada é enviado a servidores. A interface é em inglês, como o software do equipamento.

## Como usar

1. Preencha os parâmetros. O XML e a pré-visualização são atualizados a cada alteração.
2. Confira a grade na lâmina. A gota **A1** aparece destacada (magenta); abaixo da imagem ficam a
   posição de A1 na lâmina e a extensão da grade (de centro a centro).
3. Clique em **Copy code** ou **Download** (o arquivo recebe o nome do ID, como `1A_240.xml`).
4. Para registrar a configuração, clique em **Export PDF** (veja abaixo).
5. Importe o arquivo no software do equipamento e **confira a placa lá** antes de dispensar.

## Exportar em PDF

O botão **Export PDF** monta uma folha A4, em inglês como a interface, e abre a impressão do
navegador; escolha **Salvar como PDF** (o nome sugerido é `Custom Plate - <ID>`). A folha traz:

- **cabeçalho**: ID da placa, total de gotas e matriz (linhas × colunas);
- **Plate preview**: a mesma lâmina da tela, em escala, com A1 destacado, a posição de A1,
  a extensão da grade e, se houver, o aviso de grade fora do vidro;
- **Settings**: tabela com todos os campos, o valor usado e o elemento XML correspondente;
- **XML**: o código completo, com o nome do arquivo;
- **rodapé**: data de geração e o lembrete de conferir a placa no software do equipamento.

Tudo cabe em uma página. A exportação é bloqueada enquanto houver erro de configuração,
como acontece com a cópia e o download. Não há biblioteca externa: o PDF é gerado pelo
próprio navegador e nada é enviado a servidores.

## Parâmetros

| Campo | Elemento XML | O que é | Efeito na pré-visualização |
|---|---|---|---|
| ID / Name | `<id>`, `<name>` | Identificador e nome da placa (o mesmo valor nos dois) | — |
| Rows | `<rows>` | Número de linhas da matriz | Linhas de gotas (eixo vertical) |
| Cols | `<cols>` | Número de colunas | Colunas de gotas (eixo horizontal) |
| Row pitch (mm) | `<rowpitch>` | Distância entre centros de linhas vizinhas | Espaçamento vertical |
| Col pitch (mm) | `<colpitch>` | Distância entre centros de colunas vizinhas | Espaçamento horizontal |
| A1 Offset X (mm) | `<a1offsetx>` | Deslocamento da primeira posição (A1) no eixo X | Move a grade para a esquerda/direita |
| A1 Offset Y (mm) | `<a1offsety>` | Deslocamento de A1 no eixo Y | Move a grade para cima/baixo |
| Default volume | `<defaultassayvolume>` | Volume padrão por posição (≥ 0) | — |
| Shake type | `<shaketype>` | `Never`, `Small` ou `Large` | — |
| Shake default | `<shakedefault>` | Agitação ligada por padrão (`True`/`False`) | — |
| Move acceleration | `<moveaccel>` | `Slow` ou `Fast` | — |
| Custom A1 | `<customa1>` | Usa deslocamento personalizado para A1 (`True`/`False`) | — |
| Nozzle mask | `<nozzlemask>` | `One`, `Small` ou `Large` | — |
| Horizontal offset | `<horizontaloffset>` | Parâmetro do equipamento: deslocamento horizontal global aplicado pelo dispensador | Nenhum (só vai para o XML) |
| Preview droplet size | — | Tamanho das gotas desenhadas (não entra no XML) | Tamanho das gotas |

Os números são gravados na forma simples (`2.0` vira `2`, `1e1` vira `10`), e o texto do ID
é escapado, de modo que caracteres como `<` e `&` não quebram o XML.

### Exemplo (valores padrão)

```xml
<?xml version="1.0" encoding="utf-8"?>
<HPDDPlate>
  <id>1A_240</id>
  <name>1A_240</name>
  <rows>20</rows>
  <cols>12</cols>
  <rowpitch>2</rowpitch>
  <colpitch>2</colpitch>
  <a1offsetx>-1.35</a1offsetx>
  <a1offsety>8</a1offsety>
  <defaultassayvolume>0</defaultassayvolume>
  <shaketype>Never</shaketype>
  <shakedefault>False</shakedefault>
  <moveaccel>Slow</moveaccel>
  <customa1>False</customa1>
  <nozzlemask>Small</nozzlemask>
  <horizontaloffset>0</horizontaloffset>
</HPDDPlate>
```

## Limites e avisos

**Erros (bloqueiam o XML, a cópia e o download):**

- campo vazio ou inválido (inclusive ID só com espaços);
- mais de **1536 gotas** no total (linhas × colunas);
- extensão física acima de **41 mm nas linhas** ou **24,5 mm nas colunas**:
  o máximo de linhas é `floor(41 / row pitch) + 1` e o de colunas é `floor(24,5 / col pitch) + 1`.

**Aviso (não bloqueia):** parte da grade fica fora do vidro da lâmina na pré-visualização.
Revise os offsets, o pitch e o número de linhas e colunas.

## Pré-visualização

- Escala: 1 mm = 6 px. A imagem de fundo (`slide.svg`) tem 30 × 80 mm e desenha uma lâmina
  de 26 × 76 mm, com o vidro de 2 a 28 mm (X) e de 2 a 58 mm (Y); de 58 mm em diante fica a
  área fosca da etiqueta. As linhas verdes tracejadas (14 e 54 mm) são só referência visual.
- Posição de A1 na imagem: **X = 5,35 + A1 Offset X** e **Y = 7 + A1 Offset Y** (mm).
  A referência foi calibrada para que os valores padrão (X −1,35; Y 8) ponham A1 em
  4 × 15 mm, com a grade padrão de 20 × 12 centralizada na lâmina, como antes de os
  offsets moverem a grade.
- A referência do equipamento (de onde ele mede os offsets) depende do adaptador e da
  calibração. A pré-visualização serve para comparar configurações e achar erros grosseiros;
  ela **não substitui** a conferência no software do equipamento.
- Se o seu adaptador usar outra referência, ajuste `ORIGIN_X_MM` e `ORIGIN_Y_MM` no início
  de `app.js`; as medidas da lâmina estão em `GLASS`.

## Arquivos

| Arquivo | Uso |
|---|---|
| `index.html` | Página e formulário |
| `app.js` | Validação, geração do XML, pré-visualização, cópia, download e exportação em PDF |
| `assets/slide.svg` | Desenho da lâmina (fundo da pré-visualização e do PDF, referenciado em `style.css`) |
| `style.css` | Estilos próprios (lâmina, gotas, XML e folha do PDF) |
| `cover.png` | Imagem do cartão em `/ferramentas/` e de compartilhamento (`og:image`) |
| `README.md` | Este arquivo (não publicado: está em `exclude` no `_config.yml`) |

Mantenha os nomes de `assets/slide.svg` e `cover.png`: o primeiro é usado pelo `style.css` (caminho relativo) e o segundo como `og:image` (caminho absoluto).
