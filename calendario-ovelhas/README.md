# Lã-boratório das Ovelhas

Calendário compartilhado do casal, com o tema de duas ovelhas cientistas:

- **Viviane** (ovelha bebê, lacinho rosa, olhos verdes, de jaleco quando está trabalhando): Engenharia Biomédica no Einstein
- **Dov** (ovelha maior, olhos castanhos): Engenharia de Computação no Insper e Física na USP

Tudo fica num único arquivo, `index.html` (HTML + CSS + JS puros, desenhos em SVG feitos no próprio código).

## O que tem

- Calendário mensal com compromissos de cada um ou dos dois juntos, repetição semanal/quinzenal (aulas do semestre) e exclusão de um dia só.
- Cores por tipo (aula, prova, lab/pesquisa, evento social, encontro, saúde, estágio, viagem, outro). Cada ovelha tem a sua paleta e existe uma paleta do casal; dá para editar as cores na aba "Nosso rebanho".
- Feriados nacionais, datas de São Paulo e pontos facultativos (Carnaval, Corpus Christi), Dia dos Namorados.
- Feriados judaicos calculados pelo calendário hebraico do navegador (`Intl`, `ca-hebrew`), com as vésperas (Erev) e a data hebraica de cada dia.
- Aviso "Shabat Shalom!" na sexta e no sábado, com a ovelha bebê acendendo as velas.
- Ilustração por tipo de compromisso no formulário (Lab / pesquisa: as ovelhas operando um grande laser de física nuclear).
- Lista de compras com 10 categorias ilustradas (mercado, banho & cuidados, farmácia, Shabat & festas etc.).
- Wishlist da Viviane, com prioridade, preço, link da loja e "Ganhei!". No modo Dov aparece um "Vou dar" para reservar presentes sem ela ver.
- Fórmulas de física, matemática e engenharia biomédica espalhadas pelo design.

## Sincronização

Publicado como Artifact do Claude, o app usa o banco de dados compartilhado do artifact (`db`):
os dois veem as mudanças ao vivo. Para convidar o namorado: menu **Compartilhar** do artifact,
convite pelo e-mail do Dov como **Editor**, sem link público.

Aberto direto como arquivo local, o app funciona em "modo local" e guarda os dados só no navegador.
