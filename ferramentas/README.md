# Ferramentas — floriatan.com.br/ferramentas/

Pequenas aplicações web para o laboratório e a comunicação acadêmica, que rodam inteiramente
no navegador: nenhum dado é enviado a servidores, sem Google Analytics nem cookies.

Até 14/11/2026 ficavam no repositório próprio [`floriatanscosta/web`](https://github.com/floriatanscosta/web),
publicado em `floriatan.com.br/web/`. Aquele repositório continua no ar **só como legado**: guarda as
imagens das assinaturas de e-mail (as já enviadas e as do gerador atual) e redireciona `/web/assinatura`
para `/ferramentas/assinatura/`. Os outros endereços antigos de `/web/` foram removidos.

## Ferramentas

| Ferramenta | Endereço | Descrição |
|---|---|---|
| Gerador de assinatura de e-mail | [`/ferramentas/assinatura/`](https://floriatan.com.br/ferramentas/assinatura/) | [`assinatura/README.md`](assinatura/README.md) |
| Custom Plate Design XML (Tecan) | [`/ferramentas/custom-plate/`](https://floriatan.com.br/ferramentas/custom-plate/) | [`custom-plate/README.md`](custom-plate/README.md) |
| Calculadora de fluidodinâmica ICP-MS (em teste, fora da lista) | [`/ferramentas/fluidodinamica/`](https://floriatan.com.br/ferramentas/fluidodinamica/) | [`fluidodinamica/README.md`](fluidodinamica/README.md) |

Páginas de apoio: lista (`index.html`), [Sobre](https://floriatan.com.br/ferramentas/sobre) e
[Aviso de uso](https://floriatan.com.br/ferramentas/aviso).

## Estrutura

```text
ferramentas/
├── _modelo/                 # NÃO publicado: ponto de partida para uma ferramenta nova
├── css/
│   └── ferramentas.css      # estilos comuns de todas as páginas de /ferramentas/
├── assinatura/              # uma pasta por ferramenta, com o nome do endereço
│   ├── assets/              # cópia das imagens da assinatura (as usadas nos e-mails ficam no repositório web)
│   ├── app.js
│   ├── cover.png            # capa do cartão e og:image (940 × 470 px)
│   ├── index.html           # página: /ferramentas/assinatura/
│   ├── README.md            # descrição, verificações e versões (não publicado)
│   └── style.css            # estilos só desta ferramenta
├── custom-plate/            # mesmo padrão (assets/slide.svg = desenho da lâmina)
├── fluidodinamica/          # mesmo padrão (ainda sem capa)
├── aviso.html               # /ferramentas/aviso
├── index.html               # /ferramentas/ (lista)
├── sobre.html               # /ferramentas/sobre
├── CHANGELOG.md             # histórico das Ferramentas (não publicado)
└── README.md                # este arquivo (não publicado)
```

## Como o visual funciona

As páginas são HTML estático (fora do gerador `_src/build.py` e sem tradução) e usam a base do
site principal, carregada nesta ordem:

1. `/js/theme-init.js`, `/css/global.css` e `/css/main.css` — tokens, cabeçalho, rodapé, botões,
   cartões, formulários e tema (claro, escuro ou seguir o sistema);
2. `/ferramentas/css/ferramentas.css` — variáveis `--web-*`, cartões da lista, layout
   formulário + pré-visualização, campos, avisos, partes comuns da impressão em PDF e responsividade;
3. `/ferramentas/<ferramenta>/style.css` — só o que é daquela ferramenta (inclui a parte própria da folha de PDF);
4. `/js/app.js` e `/ferramentas/<ferramenta>/app.js`.

Cabeçalho e rodapé estão escritos em cada página. Ao mudar o menu, atualize todas as páginas
de `/ferramentas/`.

## Caminhos que não podem mudar

- **Imagens das assinaturas** (repositório `floriatanscosta/web`):
  `components/assinatura/assets/*.png` (carregadas por
  `https://raw.githubusercontent.com/floriatanscosta/web/main/components/assinatura/assets/…`) e
  `components/gerador/*.png` (assinaturas até a 2.0.1). Não mova esses arquivos, não renomeie o
  branch `main` e mantenha aquele repositório público.
- `ferramentas/<ferramenta>/cover.png`: imagens de compartilhamento (`og:image`).
- Os endereços `/ferramentas/<ferramenta>/`, depois de divulgados.

## Indexação

As páginas das ferramentas têm `noindex, nofollow`; a lista, "Sobre" e "Aviso de uso" podem aparecer
nos buscadores.
