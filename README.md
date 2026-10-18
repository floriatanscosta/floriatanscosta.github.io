# Floriatan Santos Costa — Portfólio Acadêmico

Site pessoal e acadêmico publicado em **[floriatan.com.br](https://floriatan.com.br/)**.
Reúne trajetória, produção científica, prêmios, métricas e contato de Floriatan Santos Costa, pesquisador de pós-doutorado em química analítica, em **português, inglês e espanhol**.

## Estrutura

```
/                       páginas em português (index, biografia, experiencia, publicacoes, producao,
                        premiacoes, metricas, contato, sobre, design, vida, 404)
/en/  /es/              as mesmas 10 páginas principais em inglês e espanhol
/css/global.css         tokens (cores, fontes, espaçamentos), base, cabeçalho, menu, rodapé, botões
/css/main.css           componentes de conteúdo (cartões, linha do tempo, publicações, métricas...)
/js/theme-init.js       aplica o tema claro/escuro antes da renderização (evita "piscar")
/js/app.js              menu móvel, tema, seletor de idioma, ano do rodapé
/js/publications.js     filtro da lista de publicações
/js/shutter.js          fundo animado (WebGL) da página Design
/js/analytics.js        aviso de consentimento + Google Analytics (só carrega após "Aceitar")
/assets/                logo, favicon, ícones (sprite.svg), fontes Roboto, imagens e logos (svg/)
/sitemap.xml            gerado automaticamente, com alternativas hreflang
/_src/                  FONTE do site (não é publicada — o Jekyll ignora pastas iniciadas por "_")
   build.py             gerador (Python 3, apenas biblioteca padrão)
   data/site.json       textos da interface (menu, rótulos, botões) em pt/en/es
   data/cv.json         dados do currículo: prêmios, formação, experiência, projetos, revisões, métricas...
   data/publications.json  artigos e trabalhos em eventos (títulos no idioma original)
   pages/pt|en|es/*.html   conteúdo de cada página; blocos de dados entram como {{nome_do_bloco}}
```

Páginas de desenvolvimento (não indexadas, fora do menu): `guia.html`, `design-meta.html`, `exemplos.html`, `test.html`, `template.html`.

## Como atualizar o conteúdo

1. Edite os dados em `_src/data/` (por exemplo, inclua um artigo em `publications.json` ou atualize `metrics` em `cv.json`)
   ou o texto de uma página em `_src/pages/<idioma>/<página>.html`.
2. Gere o site:
   ```bash
   python3 _src/build.py --check
   ```
   O comando regenera todas as páginas e o `sitemap.xml` e verifica links internos.
3. Faça commit dos arquivos gerados e da fonte, e envie ao GitHub. O GitHub Pages publica automaticamente.

> Não edite diretamente os `.html` da raiz, `/en` ou `/es`: eles são sobrescritos pelo gerador.

### Convenções
- **Títulos de publicações, periódicos, eventos, livros e instituições ficam no idioma original** em todas as versões; DOI e autores também não são traduzidos.
- Um artigo novo em `publications.json` precisa de `year`, `title`, `journal` e `doi` (ou `url`, quando não houver DOI); para artigo aceito, acrescente `"status": "accepted"`. Coloque-o no início da lista `articles` (os primeiros aparecem em "Publicações recentes"). Exemplo:
  ```json
  {"year": 2026, "title": "Título original do artigo", "journal": "Talanta", "doi": "10.1016/j.talanta.2026.127000", "status": "published"},
  ```
- Os URLs são iguais nos três idiomas, com prefixo: `/biografia`, `/en/biografia`, `/es/biografia`.
- O cabeçalho, o rodapé, os metadados (SEO, Open Graph, `hreflang`, `canonical`) e o seletor de idioma são gerados — basta criar a página em `_src/pages/<idioma>/`.

## Tecnologia e qualidade
- HTML, CSS e JavaScript sem frameworks nem dependências externas (exceto o Google Analytics); fonte Roboto servida localmente.
- Acessibilidade: link "pular para o conteúdo", navegação por teclado, foco visível, `aria-current`, `aria-expanded`, contraste AA nos temas claro e escuro, respeito a `prefers-reduced-motion`. Auditoria automatizada (axe-core, WCAG 2.1 AA) sem violações.
- SEO: título e descrição por página e idioma, `canonical`, `hreflang`, Open Graph, dados estruturados `Person` (JSON-LD) e `sitemap.xml`.
- Privacidade: Google Analytics bloqueado até o consentimento do visitante (RGPD/LGPD); textos do aviso em `site.json` → `consent`.
- Segurança: Content-Security-Policy via `<meta>`, `rel="noopener noreferrer"` em links externos, nenhum script inline.
- Desempenho: imagens WebP (≈ 90 % menores que os PNG originais), dimensões declaradas, `loading="lazy"`, fonte com `preload`.

## Documentação adicional
- `design.md` — design system (tokens, tipografia, componentes).
- `CHANGELOG.md` — histórico de alterações.
- `PENDENCIAS.md` — informações que faltam ou precisam ser conferidas.
