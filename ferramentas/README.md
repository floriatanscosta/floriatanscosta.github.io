# Ferramentas — floriatan.com.br/ferramentas/

Pequenas aplicações web para o laboratório e a comunicação acadêmica, que rodam inteiramente
no navegador: os dados digitados nunca são enviados a servidores. O Google Analytics (o mesmo `js/analytics.js`
do site principal) só é carregado após o consentimento do visitante e mede páginas vistas e os botões
marcados com `data-track` (ver “Medição de uso” abaixo).

Até 14/11/2026 ficavam no repositório próprio [`floriatanscosta/web`](https://github.com/floriatanscosta/web),
publicado em `floriatan.com.br/web/`. Aquele repositório continua no ar **só como legado**: guarda as
imagens das assinaturas de e-mail (as já enviadas e as do gerador atual) e redireciona `/web/assinatura`
para `/ferramentas/assinatura/`. Os outros endereços antigos de `/web/` foram removidos.

## Ferramentas

| Ferramenta | Endereço | Descrição |
|---|---|---|
| Gerador de assinatura de e-mail | [`/ferramentas/assinatura/`](https://floriatan.com.br/ferramentas/assinatura/) | [`assinatura/README.md`](assinatura/README.md) |
| Custom Plate Design XML (Tecan) | [`/ferramentas/plate/`](https://floriatan.com.br/ferramentas/plate/) | [`plate/README.md`](plate/README.md) |
| Calculadora de fluidodinâmica ICP-MS (**em desenvolvimento, não publicada**) | — (pasta `_fluidodinamica/`) | [`_fluidodinamica/README.md`](_fluidodinamica/README.md) |

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
├── plate/                   # Custom Plate, mesmo padrão (assets/slide.svg = desenho da lâmina)
├── _fluidodinamica/         # NÃO publicado: calculadora em desenvolvimento (ver o README da pasta)
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
- Os endereços `/ferramentas/<ferramenta>/`, depois de divulgados. Se precisar mudar um, deixe uma página de
  redirecionamento no endereço antigo (uma página `index.html` com `<meta http-equiv="refresh">` e `rel="canonical"`
  para o endereço novo). Em 14/11/2026 o Custom Plate mudou de `/ferramentas/custom-plate/` para `/ferramentas/plate/`;
  o redirecionamento foi criado e depois apagado, e o endereço antigo hoje dá erro 404 (ver `docs/PENDENCIAS.md`, F7).

## Medição de uso (Google Analytics)

Todas as páginas de `/ferramentas/` (inclusive `_modelo/` e `_fluidodinamica/`) carregam `/js/analytics.js`, trazem o aviso
de consentimento (`#consent`) antes de `/js/app.js`, o botão “Preferências” no rodapé e a
Content-Security-Policy liberada para `googletagmanager.com` e `google-analytics.com`. Ao criar uma
ferramenta a partir de `_modelo/`, mantenha esses quatro itens.

- Os eventos levam `site_section = ferramentas`, `content_group = Ferramentas` e `tool_name` (nome da pasta).
- Para medir um botão, acrescente `data-track="nome_da_acao"` (ex.: `copy_html`, `download_xml`).
  `data-track="export_pdf"` também gera o evento `pdf_download` com `pdf_type = gerado_ferramenta`.
- `tool_action = form_used` é enviado uma vez por página quando o visitante altera um campo.
- Nunca envie ao GA o conteúdo digitado pelo usuário.

## Indexação

As páginas das ferramentas têm `noindex, nofollow`; a lista, "Sobre" e "Aviso de uso" podem aparecer
nos buscadores.
