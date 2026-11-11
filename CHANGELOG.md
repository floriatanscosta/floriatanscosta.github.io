# Histórico de alterações

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
