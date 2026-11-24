readme = """# Portal Interdimensional — Rick and Morty

## Estrutura do repositório
```text
portal-interdimensional/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Como executar
Abra o arquivo `index.html` no navegador. É necessária conexão com a internet para consultar a API.

## API utilizada
Rick and Morty API: https://rickandmortyapi.com/
Endpoint: https://rickandmortyapi.com/api/character

## Recursos
- Consulta com `fetch` e `async/await`.
- Cards criados dinamicamente com `document.createElement`.
- Inserção dos cards no DOM com `appendChild`.
- Busca por nome, filtro por status e paginação.
- Layout responsivo.
"""

(root/"index.html").write_text(html, encoding="utf-8")
(root/"css"/"style.css").write_text(css, encoding="utf-8")
(root/"js"/"script.js").write_text(js, encoding="utf-8")
(root/"README.md").write_text(readme, encoding="utf-8")

zip_path = Path("/mnt/data/Codigos_Separados_GitHub_Rick_and_Morty.zip")
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for file in root.rglob("*"):
        if file.is_file():
            z.write(file, file.relative_to(root))

print("Arquivos separados criados:")
print(root/"index.html")
print(root/"css"/"style.css")
print(root/"js"/"script.js")
print(root/"README.md")
print(zip_path)
