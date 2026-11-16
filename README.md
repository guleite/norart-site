# Norart · Molduras, vidros e decoração

Proposta de layout do site institucional da **Norart**, loja de molduras, vidros e espelhos sob medida na Asa Sul, em Brasília (desde 1998).

Site estático em HTML, CSS e JavaScript puros, sem frameworks e sem etapa de instalação.

## Páginas

A navegação acontece numa única página, com rotas pelo endereço (`#`):

| Rota | Conteúdo |
| --- | --- |
| `#inicio` | Banner, números, seleção de molduras, manifesto, provador, diferenciais, mito ou verdade, projetos |
| `#produtos` | Linha de molduras, aplicações, vidros para quadros, vidros e espelhos sob medida |
| `#produto-<id>` | Detalhe de uma moldura (ex.: `#produto-barroca`) |
| `#provador` | Provador de molduras, antes e depois, teste do olhar |
| `#projetos` | Galeria com filtros e trabalhos recentes do Instagram |
| `#sobre` | História, pilares, diferenciais, instalação e público |
| `#contato` | Ficha de orçamento em 4 etapas, telefones, horário e mapa |

## Destaques

- **Provador de molduras:** a obra (enviada pelo visitante ou de exemplo) recebe fotos reais das molduras aplicadas com `border-image`, com passe-partout, vidro e tamanho, em ambientes fotográficos na escala real. A combinação segue para orçamento pelo WhatsApp ou é levada para a ficha de orçamento.
- **Ficha de orçamento:** formulário em etapas com prévia da proporção, sugestões rápidas, anexos em estilo polaroide e resumo ao vivo. O pedido final abre o WhatsApp com a mensagem pronta.
- **Sem venda online:** o site não é uma loja virtual. Não há carrinho nem preços; todo contato termina em pedido de orçamento.
- **Animações leves:** revelação ao rolar, contadores, cartões que viram e transições entre páginas. Quem usa "reduzir movimento" no sistema vê tudo sem animação.

## Estrutura

```
src/
  head.html     título, metatags, fontes e dados estruturados (SEO)
  estilo.css    todo o visual
  corpo.html    marcação de todas as páginas
  app.js        provador, rotas, formulários e animações
img/
  molduras/     fotos das 8 molduras usadas no provador
  real/         fotos reais de trabalhos da Norart
  posts/        recortes de posts do Instagram
build.sh        junta src/ em index.html e artifact.html
index.html      página completa (gerada)
artifact.html   versão para a prévia publicada no Claude (gerada)
```

## Como editar e gerar

Edite os arquivos em `src/` e rode:

```bash
bash build.sh
```

Para visualizar, abra o `index.html` no navegador ou sirva a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve .
```

## Publicação

O site está publicado no GitHub Pages em https://guleite.github.io/norart-site/, a partir da branch `main` (raiz). Cada push em `main` atualiza o site em cerca de um minuto.

## Observações

- Ambientes, obras de exemplo e as fotos das molduras foram gerados com IA para a apresentação. As fotos de trabalhos em `img/real/` e `img/posts/` são da própria Norart.
- Os prazos de produção mostrados no provador e nas fichas das molduras são ilustrativos.
- O mapa da página de contato é ilustrativo. No site final, deve ser trocado pelo mapa do Google incorporado.
