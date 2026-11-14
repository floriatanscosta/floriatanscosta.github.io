# Floriatan Santos Costa — Portfólio Acadêmico

**Site pessoal e acadêmico em três idiomas, gerado a partir de dados em JSON.**

Publicado em **[floriatan.com.br](https://floriatan.com.br/)**.
Reúne trajetória, produção científica, prêmios, métricas e contato de Floriatan Santos Costa, pesquisador de pós-doutorado em química analítica, em **português, inglês e espanhol**.

---

## Sobre o projeto

O site reúne, em um só lugar, a trajetória acadêmica, as publicações, os prêmios, as métricas e os
contatos do pesquisador. O conteúdo é mantido em arquivos de dados e transformado nas páginas dos
três idiomas e nos currículos em PDF, de modo que uma informação nova entra uma única vez e aparece
em todo o site.

## Funcionalidades

- **Páginas:** início, biografia, experiência, publicações, produção, premiações, mídia, métricas, contato, sobre, design, *Vida de cientista* (só em português) e página de erro 404.
- **Três idiomas** com os mesmos endereços (`/biografia`, `/en/biografia`, `/es/biografia`), seletor de idioma e aviso discreto quando o navegador usa outro idioma.
- **Tema claro, escuro ou "seguir o sistema"**, aplicado antes da renderização para não piscar.
- **Currículo em PDF** em pt, en e es, gerado dos mesmos dados do site.
- **Filtro de publicações**, resumo de premiações calculado dos dados, página **Mídia** organizada por tipo de conteúdo e paleta com botão "Copiar" na página Design.
- **Ferramentas** em `/ferramentas/`: gerador de assinatura de e-mail, Custom Plate Design XML (Tecan) e calculadora de fluidodinâmica ICP-MS, tudo no navegador ([`ferramentas/README.md`](ferramentas/README.md)).
- **Google Analytics só após consentimento** do visitante.
- **Acessível e bem indexado:** navegação por teclado, contraste AA nos dois temas, metadados de SEO e dados estruturados em todas as páginas.

## Documentação adicional

- [`docs/arquitetura.md`](docs/arquitetura.md) — tecnologias, qualidade (acessibilidade, SEO, privacidade, segurança, desempenho), arquitetura e estrutura do repositório.
- [`docs/atualizacao.md`](docs/atualizacao.md) — como atualizar o conteúdo, gerar o site e publicar; convenções.
- [`design.md`](design.md) — design system (tokens, tipografia, componentes).
- [`CHANGELOG.md`](CHANGELOG.md) — histórico de alterações.
- [`PENDENCIAS.md`](PENDENCIAS.md) — o que já foi feito, ideias de melhoria com progresso e dados a conferir.

## Licença

**Todos os direitos reservados.** O código (HTML, CSS, JavaScript e os scripts em Python de `_src/`),
os textos, os dados do currículo (`_src/data/`), as fotos e imagens (`assets/img/`), os currículos em
PDF (`assets/cv/`), o logotipo Fc e a identidade visual (`assets/logo.svg`, `assets/favicon.svg`,
`assets/svg/fundo.svg`), o sistema de design e a documentação deste repositório são de Floriatan
Santos Costa e **não podem ser copiados, modificados, redistribuídos, republicados ou usados
comercialmente sem autorização prévia e por escrito**. Os termos estão em [`LICENSE`](LICENSE).

Sem autorização, é permitido apenas: visitar o site em `floriatan.com.br`, ver e fazer *fork* no
GitHub nos limites dos Termos de Serviço do GitHub e citar trechos curtos com indicação da fonte.
Pedidos de autorização: [floriatan.com.br/contato](https://floriatan.com.br/contato).

Itens de terceiros não são do autor e seguem as próprias licenças ou regras de marca:

- **Fonte Roboto**: SIL Open Font License 1.1 (`assets/fonts/License.txt` e `_src/fonts/OFL.txt`);
- **Ícones do Material Symbols** (sol, lua, ajuda): Apache License 2.0, do Google;
- **Logotipos de perfis, bases e instituições** (ORCID, Lattes, LinkedIn, ResearchGate, Google Scholar, DOI, UFPR, UNIZAR, Embrapa, SBQ, LAESB e outros): marcas dos respectivos titulares, usadas apenas para identificar perfis e vínculos.

> Até 13/11/2026 o código deste repositório esteve sob a licença MIT. Quem obteve uma cópia
> naquele período mantém, para aquela versão, as permissões da MIT; a nova licença vale para
> as versões publicadas a partir de 14/11/2026.
