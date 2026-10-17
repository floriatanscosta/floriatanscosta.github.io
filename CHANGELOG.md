# Histórico de alterações

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
