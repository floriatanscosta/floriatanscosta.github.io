# _modelo/ — ponto de partida para uma ferramenta nova (não publicado)

O Jekyll ignora pastas que começam com `_`, então nada daqui vai para o site.
Como o repositório é público, não guarde aqui senhas, chaves ou dados pessoais.

## Criar uma ferramenta

1. Copie esta pasta para `ferramentas/_<nome-da-ferramenta>/` (com `_` enquanto estiver em
   desenvolvimento; minúsculas, palavras separadas por hífen).
2. Troque o título, a descrição, o `canonical`/`og:url` e o `<main>` de `index.html`.
3. Escreva a lógica em `app.js` e os estilos próprios em `style.css`; imagens em `assets/`.

## Testar localmente

Na raiz do repositório, sirva o site e abra `http://127.0.0.1:8765/ferramentas/_<nome>/`:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

(O servidor local serve pastas com `_`; o GitHub Pages não.)

## Publicar

1. Renomeie a pasta para `ferramentas/<nome>/` (sem `_`).
2. No `index.html`, troque `href="style.css"` e `src="app.js"` pelos caminhos absolutos
   `/ferramentas/<nome>/style.css` e `/ferramentas/<nome>/app.js`.
3. Crie `cover.png` (940 × 470 px) e `README.md` na pasta.
4. Acrescente o link no menu (`<nav>`) de todas as páginas de `/ferramentas/`, um cartão em
   `ferramentas/index.html` e uma descrição em `ferramentas/sobre.html`. Marque o item da
   página atual com `aria-current="page"`.
5. Registre no `ferramentas/CHANGELOG.md`.
