# Histórico de alterações

## 2026-11-14 — Custom Plate: endereço `/ferramentas/plate/`
- A ferramenta Custom Plate mudou de `/ferramentas/custom-plate/` para **`/ferramentas/plate/`** (pasta `ferramentas/plate/`). Links atualizados no menu de todas as páginas das Ferramentas, na lista, em "Sobre", no modelo `_modelo/`, no canonical, `og:url`, `og:image`, no rodapé do PDF e nos README.
- `ferramentas/custom-plate/index.html` passou a ser só um redirecionamento para o endereço novo, para não quebrar links já divulgados.

## 2026-11-14 — Repositório `web` reduzido ao legado da Assinatura
- O repositório `floriatanscosta/web` passou a guardar só as imagens das assinaturas de e-mail (`components/assinatura/assets/` e `components/gerador/`), a página `assinatura.html` (redireciona `/web/assinatura` para `/ferramentas/assinatura/`), `_config.yml`, README e a licença v2. As demais páginas, códigos e documentos foram apagados; os endereços antigos `/web/`, `/web/custom-plate`, `/web/fluidodinamica`, `/web/sobre` e `/web/aviso` deixam de existir.
- `docs/arquitetura.md`, `ferramentas/README.md`, `ferramentas/fluidodinamica/README.md` e `PENDENCIAS.md` atualizados.

## 2026-11-14 — Revisão da arquitetura e licença v2
- `LICENSE` (versão 2): continua com todos os direitos reservados e agora diz expressamente que usar o código, ou trechos dele, em **outros softwares**, sites, produtos ou serviços, e usar textos, dados, imagens, logotipo ou design em **outros materiais** (publicações, aulas, apresentações, redes sociais etc.) depende de autorização prévia e por escrito. Também define o que vale como autorização por escrito, proíbe raspagem e uso para treinar modelos de IA, deixa claro que o repositório público não concede licença e inclui as Ferramentas e o uso livre dos resultados gerados por elas.
- `README.md`: seção de licença reescrita conforme a versão 2; link para `ferramentas/README.md`.
- `docs/arquitetura.md` conferido com os arquivos: incluídos `_testes/`, `.claude/launch.json`, `docs/`, páginas de desenvolvimento, sufixo `?v=` de cache, arquivos antigos de `assets/img/`, as novas seções "O que é publicado", "Repositórios" e "Licença"; corrigida a descrição de `ferramentas/fluidodinamica/` (sem capa nem `assets/`).
- `docs/atualizacao.md`: visualização local, páginas escritas à mão, Ferramentas e licença do conteúdo novo.
- `assets/_docs/License.txt`: o texto provisório foi trocado por um aviso que remete ao `LICENSE`.
- Ferramentas, "Aviso de uso": a seção "Direitos autorais" menciona o uso em outros softwares e materiais.

## 2026-11-14 — Ferramentas integradas ao site
- Conteúdo do repositório `floriatanscosta/web` trazido para a nova pasta **`ferramentas/`**, publicada em `floriatan.com.br/ferramentas/`: lista, Sobre, Aviso de uso, Gerador de assinatura, Custom Plate e Calculadora de fluidodinâmica. Uma pasta por ferramenta com `index.html`, `app.js`, `style.css`, `cover.png`, `README.md` e `assets/`; estilos comuns em `ferramentas/css/ferramentas.css`. Detalhes em `ferramentas/README.md` e `ferramentas/CHANGELOG.md`.
- Rodapé de todas as páginas: link "Ferramentas" aponta para `/ferramentas/` (gerado por `_src/build.py`). O verificador de links (`--check`) passa a cobrir as Ferramentas.
- `design-meta.html` deixa de carregar CSS do repositório `web`; usa `ferramentas/css/ferramentas.css` e o painel `.form-panel` foi para `css/exemplos.css`.
- `_config.yml`: README e CHANGELOG de `ferramentas/` fora da publicação.

## 2026-11-14 — Documentação reorganizada
- `README.md` resumido: sobre o projeto, principais funcionalidades, documentação adicional e licença.
- Detalhes técnicos movidos para a nova pasta `docs/`: `docs/arquitetura.md` (tecnologias, qualidade, arquitetura e estrutura) e `docs/atualizacao.md` (como atualizar o conteúdo e convenções). A pasta não é publicada no site (`exclude` no `_config.yml`).

## 2026-11-14 — Licença: todos os direitos reservados
- `LICENSE`: a licença MIT foi substituída por uma licença proprietária (todos os direitos reservados, Leis nº 9.610/1998 e nº 9.609/1998), que cobre código, textos, dados, imagens, PDFs, logotipo e documentação. Copiar, modificar, redistribuir, republicar ou usar comercialmente depende de autorização por escrito; continuam permitidos a visita ao site, o que os Termos de Serviço do GitHub exigem e a citação de trechos curtos com a fonte.
- Itens de terceiros (fonte Roboto, ícones do Material Symbols, logotipos de instituições e perfis) continuam com as próprias licenças.
- README: seção de licença reescrita, com a observação sobre as cópias obtidas enquanto valia a MIT.

## 2026-10-28 — Design v3: paleta do logotipo e CSS padronizado
- **Paleta do logotipo:** os tokens passaram a derivar do logotipo Fc (azul-marinho `#274c77`, petróleo `#1c7d9a`/`#17738e`, lavanda `#8682ab`), com um único degradê de marca. Saíram `#5a729e`, `#666fe4` e `#1d6ee7`. Contraste AA conferido nos dois temas.
- **Tema escuro:** títulos (`#eef3f9`) e destaques (`#ffffff`) voltaram a ter níveis diferentes; novo fundo `#12161c` e cartões `#1a2029`.
- **Tokens únicos:** novas escalas de tamanho de fonte (`--fs-*`), pesos (`--fw-*`: 400, 500, 700, 800) e raios (6 / 10 / 16 / 999 px); estados (`--success`, `--warning`, `--danger`, `--medal`). Removidos os tokens duplicados ou sem uso; `--color-bg-surface-1`, `--text-color-error` e `--bg-error` ficaram só como apelidos para as Ferramentas (`/web`).
- **Sem valores fixos:** cores, tamanhos, pesos e raios de `global.css`, `main.css`, `design.css`, `premiacoes.css` e `vida.css` agora vêm dos tokens.
- **Novo `css/exemplos.css`:** o CSS usado só por `exemplos.html`, `guia.html` e `design-meta.html` saiu de `global.css`/`main.css`; classes sem uso foram apagadas.
- **Página inicial:** nova abertura (pt, en, es) com botão principal "Ver publicações", cargo atual em linha compacta, perfis em pílulas e fundo de pontos; no celular o título aparece primeiro e a ilustração vira um selo pequeno. As demais seções não mudaram.
- **Página Design:** paleta da interface e pesos atualizados nos três idiomas. Currículo em PDF e `theme-color` com as novas cores.
- `design.md` reescrito (v3.0, português do Brasil).

## 2026-10-23 — Proteção dos e-mails contra robôs
- Página Contato (pt, en, es): os dois endereços de e-mail não aparecem mais no HTML. Ficam codificados (invertidos e em Base64) no atributo `data-email`, sem "@" nem "mailto:", e o `js/app.js` monta os links no navegador. Sem JavaScript, aparece o aviso "ative o JavaScript para ver o endereço" e o botão "Enviar e-mail" fica oculto.
- `build.py`: funções `email_code()` e `protected_email()`; novo texto `contact.email_hidden` em `site.json`; regra `.btn[hidden]` em `global.css`.

## 2026-10-19 — Página Mídia
- Nova página **Mídia** (`/midia`, `/en/midia`, `/es/midia`) para divulgação científica, notícias, entrevistas, podcasts e menções, com uma seção por tipo de conteúdo, selo do tipo, fonte, ano e link "Acessar publicação"/"Acessar conteúdo" em nova aba (`rel="noopener noreferrer"`).
- Nova fonte de dados `_src/data/media.json`; textos dos tipos em `site.json`; blocos `{{media}}` e `{{media_toc}}` no `build.py`.
- O artigo "Food Chromatography Approaches for Mineral Oil Hydrocarbon Analysis" (LCGC International) saiu de Publicações (bloco `magazine` de `publications.json`) e passou para Mídia.
- "Mídia" incluída no menu principal, entre Premiações e Contato; Publicações e Mídia têm links entre si.
- Currículo em PDF: a seção de revista de divulgação virou "Mídia e divulgação", lida de `media.json`.
- Documentação revisada (README, design.md, PENDENCIAS); descrição de Publicações para buscadores sem a menção a autores; `robots.txt` sem regras para arquivos inexistentes.

## 2026-10-18 — Novas páginas, currículo em PDF e ajustes gerais

### Conteúdo e dados
- Publicações e produção simplificadas: cada item mostra só título, periódico/evento e DOI ou link; listas de autores removidas do site e dos JSON (`cv.json`, `publications.json`).
- Data de atualização removida do rodapé.
- Logos da **UESC** e do **IF Baiano** na formação e na experiência. O logo da UESC usa uma versão WebP de 6 KB (`assets/img/logos/uesc.webp`) no lugar do SVG de 1 MB; o `build.py` passou a aceitar logos em imagem nessa pasta.
- Logos institucionais redesenhados pelo autor (UFPR, UNIZAR, Embrapa, LaESB); nome curto do cabeçalho alterado para "Floriatan".

### Páginas
- **Vida de cientista** (`/vida`) refeita: abertura animada, capítulos numerados com revelação ao rolar, parallax e inclinação 3D, apresentação automática quando um capítulo tem 2+ imagens, galeria em movimento com imagem ampliada, barra de progresso e indicador de capítulos. CSS e JS próprios (`css/vida.css`, `js/vida.js`).
- **Premiações** (`/premiacoes`): resumo calculado dos dados (total, melhores trabalhos, período) e linha do tempo por ano, com medalha colorida por tipo e destaque para melhor tese e melhor artigo (`css/premiacoes.css`).
- **Design** (`/design`): removidos o fundo WebGL (`js/shutter.js`) e o tema escuro forçado; a página segue o tema do site. Novas seções de Logotipo (anatomia e aplicações), Paleta (cores reais do logotipo e da interface, por função, com botão "Copiar") e Tipografia (espécime, pesos, hierarquia e princípios), nos três idiomas (`css/design.css`, `js/design.js`).
- **Sobre**: texto de privacidade menciona o tema "seguir o sistema".

### Interface
- **Tema com três opções** (claro, escuro e seguir o sistema), em menu no cabeçalho; no modo "sistema" o site acompanha a mudança do sistema operacional com a página aberta. O botão único das Ferramentas (/web) continua funcionando.
- **Aviso de idioma**: faixa discreta quando o idioma do navegador é outro e a página existe nesse idioma; nunca redireciona, pode ser fechada e respeita o idioma escolhido no seletor.
- **Versão impressa** corrigida: sem sombras, textos em degradê viram sólidos, cores legíveis no tema escuro e seções expansíveis abertas ao imprimir.
- Ajustes do autor no CSS: bordas laterais removidas de avisos e subtítulos, cores e raios atualizados.

### Currículo em PDF
- Currículo em PDF (pt, en, es) gerado de `cv.json` e `publications.json` por `_src/cv_pdf.py` (ReportLab + svglib, fontes Roboto em `_src/fonts/`); sem foto; títulos no idioma original.
- Seção **Identificadores** com os ícones e os identificadores de ORCID, Lattes e LinkedIn; **logotipo** no canto superior direito de todas as páginas.
- Rodapé com a data de geração, a data da última alteração dos dados e "Página X de Y".
- Botão de download na página inicial, na Biografia e em Contato. O `build.py` gera os PDFs automaticamente (opção `--no-pdf` para pular).

### Projeto
- Licença **MIT** para o código (`LICENSE`); conteúdo, fotos, PDFs e logotipo com todos os direitos reservados (ver README).
- Campo `styles:` nos fragmentos de página para CSS próprio de cada página.
- `PENDENCIAS.md` reorganizado: o que já foi feito, ideias numeradas por grupo e gráfico de progresso.
- Ferramentas (/web, repositório próprio): tema com três opções, páginas "Sobre" e "Aviso de uso", licença MIT.

## 2026-10-17 — Consentimento de cookies
- Aviso de consentimento (PT/EN/ES) para o Google Analytics: nada é carregado antes de "Aceitar"; "Recusar" tem o mesmo destaque; escolha salva por 12 meses e alterável em "Preferências de cookies" no rodapé; recusa apaga cookies `_ga`.
- Consent Mode do Google com publicidade e personalização sempre negadas; Google Signals desativado.
- Texto de privacidade da página Sobre atualizado nos três idiomas.

## 2026-10-17 — Revisão completa
- Conteúdo completo a partir do Currículo Lattes (06/10/2026): Biografia, Experiência, Premiações e Contato (antes vazias ou "em atualização"); Publicações com os 44 artigos (antes 15); Produção com capítulos, 33 trabalhos em eventos, cursos, palestras, produção técnica e eventos (antes apontava para subpáginas inexistentes); Métricas atualizadas.
- Versões completas em português, inglês e espanhol das páginas: início, biografia, contato, experiência, métricas, premiações, produção, publicações, sobre e design. Seletor de idioma funcional (inclusive espanhol), `hreflang` e URLs equivalentes.
- Gerador estático (`_src/build.py`) com fonte única de dados: cabeçalho, rodapé e metadados consistentes em todas as páginas.
- Novo visual mantendo a identidade (azul/roxo, logo Fc): cabeçalho fixo translúcido, linha do tempo, cartões, filtro de publicações, modo escuro automático pela preferência do sistema.
- Correções: caminhos relativos que quebravam em subpastas, recursos carregados do domínio de produção, múltiplos `<h1>`, `switchLanguage` sem espanhol, links com `target="_blank"` para páginas internas, script WebGL rodando continuamente, título de artigo divergente do publicado ("Interpretating…") e organismo ausente no título do ACS Omega 2026.
- Acessibilidade, SEO, CSP, imagens WebP, fonte Roboto local, `sitemap.xml` e `robots.txt` atualizados.
- Removido `components/header.html` (não utilizado e desatualizado).

## Versões anteriores
- Desenvolvimento do site completo.
- Inclusão do modo escuro e claro.
- Inclusão da mudança de idioma de pt para en.
