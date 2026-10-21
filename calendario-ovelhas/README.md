# Lã-boratório das Ovelhas

Calendário compartilhado do casal, com o tema de duas ovelhas cientistas:

- **Viviane** (ovelha bebê, lacinho rosa, de jaleco quando está trabalhando): Engenharia Biomédica no Einstein
- **Dov** (ovelha maior, olhos castanhos): Engenharia de Computação no Insper e Física na USP

Tudo fica num único arquivo, `index.html` (HTML + CSS + JS puros, desenhos em SVG feitos no próprio código).

## O que tem

- Calendário mensal com compromissos de cada um ou dos dois juntos, repetição semanal/quinzenal (aulas do semestre), exclusão de um dia só e compromissos de vários dias (viagens), com primeiro e último dia.
- Cores por tipo (aula, prova, lab/pesquisa, evento social, encontro, saúde, estágio, viagem, outro). Cada ovelha tem a sua paleta e existe uma paleta do casal; dá para editar as cores na aba "Nosso rebanho".
- Feriados nacionais, datas de São Paulo e pontos facultativos (Carnaval, Corpus Christi), Dia dos Namorados.
- Feriados judaicos calculados pelo calendário hebraico do navegador (`Intl`, `ca-hebrew`), com as vésperas (Erev) e a data hebraica de cada dia.
- Aviso "Shabat Shalom!" na sexta e no sábado; no painel do dia, nesses dias, aparece a ilustração da ovelha bebê acendendo as velas.
- Ilustração por tipo de compromisso no formulário (Lab / pesquisa: laboratório com bobina de Tesla, laser e equações de Maxwell).
- Lista de compras com 10 categorias ilustradas: mercado, banho & cuidados, farmácia, casa & limpeza, pesquisa & laboratório, dates, presentes, viagens, Guarujá e outros.
- Wishlist da Viviane, com prioridade, preço, link da loja e "Ganhei!". No modo Dov aparece um "Vou dar" para reservar presentes sem ela ver.
- Fundo de lousa verde com fórmulas e rabiscos de giz discretos.
- Aba "Sobre" com uma pilha de fotos da desenvolvedora (pasta `sobre/`, publicada ao lado da página), o parceiro de bancada, uma dedicatória ao Dov e a ficha técnica.
- Ovelhas e cenas desenhadas em SVG no próprio código, em traço vetorial limpo com cores chapadas e várias poses: perfil, 3/4, de frente, sentada e deitada.

## Sincronização

Publicado como Artifact do Claude, o app usa o banco de dados compartilhado do artifact (`db`):
os dois veem as mudanças ao vivo. Para convidar o namorado: menu **Compartilhar** do artifact,
convite pelo e-mail do Dov como **Editor**, sem link público.

Aberto direto como arquivo local, o app funciona em "modo local" e guarda os dados só no navegador.

## Extensão para o computador

A pasta [`extensao/`](extensao/) tem uma extensão para Chrome e Edge com:
- o dia de hoje no ícone;
- um mini-calendário com os feriados;
- Shabat Shalom na sexta e no sábado;
- um botão que abre o calendário compartilhado.

Veja como instalar em [`extensao/LEIAME.md`](extensao/LEIAME.md).
