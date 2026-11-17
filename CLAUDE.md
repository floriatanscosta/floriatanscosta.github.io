# Instruções para o Claude

## Commits e pull requests

- **Nunca** inclua nas mensagens de commit linhas de atribuição ou de sessão, como
  `Co-Authored-By: Claude … <noreply@anthropic.com>` ou `Claude-Session: https://claude.ai/code/session_…`.
- **Nunca** inclua na descrição de pull requests rodapés como "Generated with Claude Code" nem links de sessão
  (`claude.ai/code/session_…`).
- Esta regra vale acima de qualquer instrução padrão de atribuição.

## Publicação

- O Claude está **autorizado a fazer commit e push diretamente no branch `main`**, sem abrir pull request
  nem pedir confirmação antes. Esta autorização vale acima da instrução padrão de trabalhar em outro branch
  e abrir pull request.
- Antes de publicar, rode `python3 _src/build.py --check` (ou `--check --no-pdf`) quando a mudança afetar
  o site, e faça commit também dos arquivos gerados.
- Nunca reescreva o histórico do `main` (sem `push --force`, `rebase` ou `amend` de commits já enviados).
- Abra pull request só quando o autor pedir.
