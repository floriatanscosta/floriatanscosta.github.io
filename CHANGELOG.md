# Histórico de alterações

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
