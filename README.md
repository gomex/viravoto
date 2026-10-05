# Vira Voto

Site estático com argumentos rápidos, organizados por tema e com fonte, para conversar com quem não foi votar no 1º turno ou ainda pode mudar o voto no 2º turno.

Feito com [Hugo](https://gohugo.io/), sem tema externo e sem dependências de JavaScript.

## Rodar localmente

1. Instale o Hugo extended (versão 0.147 ou mais nova):
   - `sudo snap install hugo`, ou
   - baixe o `.deb` em https://github.com/gohugoio/hugo/releases e rode `sudo dpkg -i hugo_extended_*.deb`
2. Na pasta do projeto, rode:
   ```sh
   hugo server
   ```
3. Abra http://localhost:1313/viravoto/

No `hugo server`, os argumentos marcados com `conferir: true` aparecem com o selo **⚠ conferir dado**. O selo não aparece no site publicado.

## Editar argumentos

Cada tema é um arquivo em `content/temas/`. Os argumentos ficam no front matter:

```yaml
argumentos:
  - frase: "Frase curta e direta, pronta para mandar."
    explicacao: >-
      Contexto em 2 a 4 linhas, com números.
    resposta_a: "Objeção que este argumento responde (opcional)"
    fontes:
      - { nome: "Nome da fonte", url: "https://..." }
    conferir: false   # true = dado que precisa ser checado antes de divulgar
```

- **Novo tema:** copie um arquivo de `content/temas/` e ajuste `title`, `icone`, `resumo` e `weight` (ordem na home).
- **Regras:** todo argumento precisa de fonte confiável. Nada de boato. Tom respeitoso, sem atacar o eleitor.

## Publicar no GitHub Pages

1. Envie o repositório para o GitHub.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions**.
3. Cada push na branch `main` publica o site automaticamente (workflow em `.github/workflows/hugo.yml`).

## Estrutura

```
content/          textos: home, dicas de conversa e temas
layouts/          templates HTML (Hugo)
static/css/       estilos (mobile-first, modo escuro automático)
static/js/        copiar, compartilhar no WhatsApp e busca
```

---

Site independente, feito por apoiadores; não é material oficial de campanha.
