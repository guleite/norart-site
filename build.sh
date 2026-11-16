#!/usr/bin/env bash
# Junta os arquivos de src/ em duas saídas:
#   index.html    -> página completa, para abrir no navegador ou hospedar (ex.: GitHub Pages)
#   artifact.html -> mesma página sem <html>/<head>/<body>, usada na prévia publicada pelo Claude
set -e
cd "$(dirname "$0")"

estilo() { printf '<style>\n'; cat src/estilo.css; printf '</style>\n'; }
corpo()  { cat src/corpo.html; printf '<script>\n'; cat src/app.js; printf '</script>\n'; }

{ cat src/head.html; estilo; corpo; } > artifact.html

{
  printf '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  cat src/head.html
  estilo
  printf '</head>\n<body>\n'
  corpo
  printf '</body>\n</html>\n'
} > index.html

wc -c index.html artifact.html
