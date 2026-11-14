# Floriatan Santos Costa — Portfólio Acadêmico e Ferramentas

**Site pessoal e acadêmico em três idiomas, gerado a partir de dados em JSON, com ferramentas web para o laboratório.**

Publicado em **[floriatan.com.br](https://floriatan.com.br/)** · Ferramentas em **[floriatan.com.br/ferramentas](https://floriatan.com.br/ferramentas/)**

---

## O que é este repositório

Este repositório é a fonte e a versão publicada do site de **Floriatan Santos Costa**, pesquisador de
pós-doutorado em química analítica. Ele reúne:

- o **portfólio acadêmico**, com trajetória, publicações, produção, prêmios, mídia, métricas e contato em
  **português, inglês e espanhol**;
- os **currículos em PDF** nos três idiomas, gerados dos mesmos dados do site;
- as **Ferramentas**, aplicações que rodam no navegador para o laboratório e a comunicação acadêmica;
- o **gerador** em Python e a **documentação** técnica.

O site é estático, hospedado no GitHub Pages, sem frameworks nem banco de dados.

## Objetivos

- **Um lugar oficial e atualizado** para a trajetória e a produção científica do pesquisador, que
  complementa o Lattes, o ORCID e o Google Scholar e tem endereço próprio.
- **Uma informação entra uma vez e aparece em todo lugar.** Um artigo novo em `publications.json`
  aparece nas páginas dos três idiomas e nos currículos em PDF.
- **Alcance internacional**, com o mesmo conteúdo em português, inglês e espanhol e endereços iguais
  (`/biografia`, `/en/biografia`, `/es/biografia`).
- **Ferramentas úteis e simples**, sem instalação nem cadastro, que não enviam os dados digitados a
  servidores.
- **Qualidade como requisito:** acessibilidade (WCAG 2.1 AA), bom desempenho, boa indexação e privacidade
  (RGPD/LGPD), com código fácil de manter.

## Funcionalidades

- **Páginas:** início, biografia, experiência, publicações, produção, premiações, mídia, métricas, contato, sobre, design, *Vida de cientista* (só em português) e página de erro 404.
- **Três idiomas** com os mesmos endereços, seletor de idioma e aviso discreto quando o navegador usa outro idioma.
- **Tema claro, escuro ou "seguir o sistema"**, aplicado antes da renderização para não piscar.
- **Currículo em PDF** em pt, en e es, gerado dos mesmos dados do site.
- **Filtro de publicações**, resumo de premiações calculado dos dados, página **Mídia** organizada por tipo de conteúdo e paleta com botão "Copiar" na página Design.
- **E-mails protegidos contra robôs** na página Contato.
- **Ferramentas** em `/ferramentas/`: gerador de assinatura de e-mail e Custom Plate Design XML (Tecan). Uma calculadora de fluidodinâmica ICP-MS está em desenvolvimento e ainda não foi publicada. Detalhes em [`ferramentas/README.md`](ferramentas/README.md).
- **Google Analytics 4 só após consentimento**, no site e nas Ferramentas. Ele mede páginas vistas, downloads de PDF e uso das Ferramentas, sem os dados digitados.
- **Acessível e bem indexado:** navegação por teclado, contraste AA nos dois temas, metadados de SEO e dados estruturados em todas as páginas.

## Como funciona, em resumo

```text
_src/data/*.json + _src/pages/<idioma>/*.html ──▶ python3 _src/build.py --check ──▶ páginas, sitemap e PDFs
```

O conteúdo fica em `_src/`. O gerador produz as páginas HTML da raiz, de `/en` e de `/es`, o
`sitemap.xml` e os currículos em PDF. Tudo é versionado, e o GitHub Pages publica o branch `main`. As
Ferramentas são HTML escrito à mão e não passam pelo gerador. O passo a passo está em
[`docs/atualizacao.md`](docs/atualizacao.md).

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [`docs/arquitetura.md`](docs/arquitetura.md) | Tecnologias, qualidade, arquitetura, medição de audiência, estrutura do repositório e o que é ou não publicado |
| [`docs/atualizacao.md`](docs/atualizacao.md) | Como atualizar o conteúdo, gerar o site e publicar; convenções |
| [`docs/design.md`](docs/design.md) | Design system: tokens, tipografia e componentes |
| [`docs/PENDENCIAS.md`](docs/PENDENCIAS.md) | O que já foi feito, ideias de melhoria com progresso e dados a conferir |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Histórico de alterações do site |
| [`ferramentas/README.md`](ferramentas/README.md) | Ferramentas: estrutura, visual, medição de uso e caminhos que não podem mudar |
| [`ferramentas/CHANGELOG.md`](ferramentas/CHANGELOG.md) | Histórico das Ferramentas |

## Licença

**Todos os direitos reservados** (licença própria, versão 2.1). O código (HTML, CSS, JavaScript e os
scripts em Python de `_src/`), os textos, os dados (`_src/data/`), as fotos e imagens, os currículos em
PDF, o logotipo Fc, a identidade visual, o sistema de design, as Ferramentas e a documentação são de
Floriatan Santos Costa. Os termos completos estão em [`LICENSE`](LICENSE).

O repositório ser público **não concede nenhuma licença**. Dependem de **autorização prévia e por escrito**
do autor, no todo ou em parte, com ou sem fins lucrativos:

- copiar, modificar, adaptar, traduzir, redistribuir, republicar ou incorporar o conteúdo ou o código em outra página;
- **usar o código, ou qualquer trecho dele, em outros softwares**, sites, aplicativos, produtos ou serviços;
- **usar textos, dados, imagens, o logotipo ou o design em outros materiais** (publicações, aulas,
  apresentações, pôsteres, vídeos, redes sociais, documentos institucionais etc.);
- usar o nome ou o logotipo do autor para sugerir parceria ou endosso;
- usar comercialmente, extrair dados de forma automatizada ou usar o conteúdo para treinar modelos de IA.

**Sem autorização, é permitido:**

- visitar o site em `floriatan.com.br` e baixar o currículo para leitura;
- usar as Ferramentas no próprio site e usar livremente os resultados gerados por elas (o XML, a sua assinatura, o PDF exportado);
- compartilhar links;
- ver o código e fazer *fork* no GitHub, nos limites dos Termos de Serviço do GitHub;
- citar trechos curtos com indicação da fonte.

A autorização só vale se for dada pelo autor por escrito (documento ou e-mail) e descrever o conteúdo,
a finalidade, o meio e o prazo do uso. Pedidos de autorização:
[floriatan.com.br/contato](https://floriatan.com.br/contato).

O conteúdo e as Ferramentas são oferecidos sem garantia. Confira os resultados das Ferramentas antes de
usá-los em equipamentos, amostras ou reagentes.

Itens de terceiros não são do autor e seguem as próprias licenças ou regras de marca:

- **Fonte Roboto**: SIL Open Font License 1.1 (`assets/fonts/License.txt` e `_src/fonts/OFL.txt`);
- **Ícones do Material Symbols** (sol, lua, ajuda): Apache License 2.0, do Google;
- **Logotipos de perfis, bases, fabricantes e instituições** (ORCID, Lattes, LinkedIn, ResearchGate, Google Scholar, DOI, UFPR, UNIZAR, Embrapa, SBQ, LAESB, Tecan e outros): marcas dos respectivos titulares, usadas apenas para identificar perfis e vínculos.

> Até 13/11/2026 o código deste repositório esteve sob a licença MIT. Quem obteve uma cópia
> naquele período mantém, apenas para aquela cópia, as permissões da MIT. A licença atual vale para
> as versões publicadas a partir de 14/11/2026.
