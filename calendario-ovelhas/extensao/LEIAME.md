# Extensão: Lã-boratório das Ovelhas

Um atalho do calendário no navegador (Chrome, Edge, Brave ou Opera).

- **No ícone:** mostra o dia de hoje e fica lilás na sexta e no sábado, com "Shabat Shalom!" ao passar o mouse.
- **No pop-up:** o dia com a data judaica, um mini-calendário do mês com os feriados brasileiros, de SP e judaicos, e os próximos feriados. Na sexta e no sábado aparece a cena do Shabat.
- **Abrir o calendário:** o botão "Abrir nosso calendário" abre o calendário compartilhado. "Abrir em janela" o abre numa janela própria, como um aplicativo.
- **Atalho de teclado:** `Alt+Shift+O`.

Os compromissos, a lista de compras e a wishlist ficam salvos no calendário em claude.ai. A extensão não lê esses dados, só leva até eles.

## Como instalar

1. Baixe e descompacte a pasta `extensao` (ou o arquivo `ovelhas-extensao.zip`).
2. No navegador, abra `chrome://extensions` (no Edge, `edge://extensions`).
3. Ligue o **Modo do desenvolvedor**, no canto superior direito.
4. Clique em **Carregar sem compactação** e escolha a pasta descompactada.
5. Clique no ícone de quebra-cabeça da barra e fixe a ovelhinha.

Para atualizar, troque os arquivos da pasta e clique em ↻ no cartão da extensão.

## Para quem mexer no código

O arquivo `core.js` (feriados e desenhos das ovelhas) é gerado a partir do `../index.html`. Depois de mudar o calendário, rode `python3 build.py`.
