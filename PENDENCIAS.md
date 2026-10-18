# Pendências e pontos a conferir

Itens que não puderam ser resolvidos só com os dados disponíveis (nada foi inventado).

## Dados
1. **Telefone profissional**: o Lattes traz "34 97676100" (8 dígitos após o código do país; números espanhóis têm 9). Não foi publicado — informe o número correto se quiser exibi-lo em Contato (`_src/data/cv.json` → `person`).
2. **Índice h do Scopus e do Google Scholar**: o Lattes de 06/10/2026 traz citações e documentos, mas não o índice h dessas bases. Foi mantido o valor do site anterior (14, consultado em 16/09/2026), indicado na página.
3. **Artigos sem DOI no Lattes** (ligados à página da editora): Microchemical Journal 2024 (SPR biosensor), J. Food Compos. Anal. 2022, J. Trace Elem. Med. Biol. 2021, Talanta 2021, Analytical Methods 2020 e J. Electroanal. Chem. 2020. Basta preencher o campo `doi` em `publications.json`.
4. **Artigo "Chemometric-assisted classification of sunscreen…"**: consta como "aceito" no Lattes, mas já tem DOI (10.1007/s43630-026-00993-y). Ao sair o volume/páginas, atualize `status`, `volume` e `pages`.
5. **Capítulo de 2023 (Seven Editora)**: o título no Lattes repete "chemical preservatives" e "State Solid" — conferir com a publicação original.
6. **Pós-doutorado na Embrapa (2024)**: o Lattes não indica a unidade/centro nem o período exato.
7. **Logos**: não há logos da UESC e do IF Baiano em `assets/svg/` (aparece um ícone genérico). Adicione os arquivos e o campo `logo` em `cv.json`.
8. **Participação em eventos**: o quadro de totais do Lattes soma 19, mas a lista tem 21 itens (exposição e feira não entram no total). O site mostra os 21 itens listados.

## Funcionalidades / infraestrutura
9. **"Ferramentas" (/web/)**: aponta para outro repositório (floriatan.com.br/web/). `design-meta.html` depende de `/web/components/style.css` e `/web/css/style.css`, que não fazem parte deste repositório.
10. **Página "Vida de cientista"**: existe apenas em português (fora do escopo de tradução); as versões EN/ES indicam isso no link.
11. **Google Analytics e privacidade**: ✅ resolvido — aviso de consentimento implementado (o GA só carrega após "Aceitar"). Recomendável ainda: no painel do Google Analytics, conferir em *Administrador → Coleta e retenção de dados* que os "Indicadores do Google" estão desativados e definir a retenção de dados (ex.: 2 meses).
12. **Formulário de contato**: não implementado (o GitHub Pages não processa formulários). O contato é por e-mail.
13. **Arquivos não utilizados**: `assets/background.svg` (650 KB), `assets/img/time4.png`, `assets/img/cover-google-forms.png`, `assets/img/cover.png` (duplicata de `assets/cover.png`) e os PNG originais de `time*.png`/`profile.png` (substituídos por WebP). Podem ser removidos se não forem usados em outro lugar.
14. **Publicação**: as alterações foram feitas sobre o arquivo .zip enviado; é preciso enviá-las ao repositório `floriatanscosta.github.io` (não houve acesso ao GitHub nesta sessão).

## Ideias de melhoria (para implementar depois)

Sugestões registradas em 18/10/2026. Nenhuma foi implementada ainda.

### Prioritárias
15. **Build automático no GitHub (GitHub Actions)**: um arquivo `.github/workflows/build.yml` que roda `python3 _src/build.py --check` a cada alteração em `_src/` e salva as páginas geradas. Permite atualizar o site editando o `cv.json` ou o `publications.json` direto pelo navegador, sem Python no computador; bloqueia a publicação se houver erro de sintaxe no JSON ou link quebrado. Gratuito em repositórios públicos.
16. **Recursos nas publicações**: botão "Citar" em cada artigo (referência formatada e BibTeX); arquivo `.bib`/`.ris` com todas as publicações para Zotero/Mendeley; selos de Acesso Aberto e link para o PDF (os ícones `openacess.svg` e `pdf.svg` já existem em `assets/icons/`).
17. **Gráficos na página Métricas**: publicações por ano e citações por ano, gerados a partir dos dados existentes.
18. **Ordenação automática dos artigos por ano** no `build.py`, para que a posição no `publications.json` deixe de importar (hoje os primeiros da lista aparecem em "Publicações recentes").

### Conteúdo
19. **Seção de Novidades** na página inicial (artigo aceito, palestra, prêmio…), alimentada por uma lista simples no JSON.
20. **Currículo em PDF para download** nos três idiomas, gerado a partir dos mesmos dados do site.
21. **"Vida de cientista" em inglês e espanhol** (hoje só em português).
22. **Projeto atual em destaque** (saliva, HDES e nanopartículas magnéticas), com imagem ou *graphical abstract*.
23. **Logos da UESC e do IF Baiano** na linha do tempo (ver item 7).

### Automação de dados
24. **Métricas automáticas via OpenAlex** (base aberta e gratuita): atualização semanal de citações e índice h pelo GitHub Actions, como fonte complementar ao Scopus/WoS (os números diferem um pouco).
25. **Importar publicações do ORCID**: artigos novos registrados no ORCID entram no site sem digitação.

### Visibilidade
26. **Dados estruturados `ScholarlyArticle`** em cada publicação, para o Google e o Google Scholar reconhecerem os trabalhos.
27. **Google Search Console**: cadastrar o site e enviar o `sitemap.xml` (requer login do proprietário).
28. **Imagem de compartilhamento por página e idioma** (prévia própria ao postar links no LinkedIn etc.).
