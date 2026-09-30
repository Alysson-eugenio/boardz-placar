# BoardZ Placar

Placar de mesa para bares de jogos de tabuleiro. O cliente lê o QR Code, escolhe o jogo na biblioteca e marca os pontos no celular.

**Fase 1 (esta):** só o front-end, com dados de exemplo. Tudo roda com `npm run dev`.

## Como rodar

```bash
npm install
npm run dev
```

O Vite mostra dois endereços: `Local` (no PC) e `Network`. Abra o `Network` no celular, na mesma rede Wi-Fi, para testar o toque de verdade.

## O que já funciona

- **Biblioteca** com busca e filtro por tipo de placar (`/`)
- **Tela do jogo** com a cor do jogo (`/jogo/:id`), com 3 tipos de placar:
  - **Soma:** botões grandes de + e −, com passo escolhido pelo cliente (1, 5, 10...)
  - **Rodadas:** tabela com uma coluna por jogador e total no topo (aceita negativos)
  - **Nível:** sobe e desce de 1 em 1 até a meta
- **Meta e vencedor:** trilha de pontos por jogador e aviso quando alguém vence
- **Revanche** (mesmos jogadores, pontos zerados) e **Nova mesa** (apaga tudo)
- **Partida efêmera:** fica só no aparelho (`localStorage`) e expira sozinha em 8 horas
- **Admin** (`/admin`): login de mentira, lista de jogos, cadastro e edição com pré-visualização da capa

### Extras de mesa

- **Rolar dados:** botão flutuante em todas as telas (d4 a d100, até 6 dados, crítico e falha crítica no d20)
- **Quem começa?:** roleta, iniciativa (d20 com desempate) ou moeda (com 2 jogadores). Quem sai sorteado ganha a marca "Começa"
- **Classes de personagem:** cada jogador ganha uma classe (guerreiro, mago, bardo...) no lugar do peão, e pode trocar
- **Level up:** no placar por nível aparece "Level up!", e os pontos sobem flutuando a cada toque
- **Vitória:** confete de dados e peões, banner dourado nas cores do jogo e placar final contando
- **Capas:** inclinam e brilham ao tocar ou passar o mouse, e um brilho passa por elas quando a biblioteca abre
- **Hall da fama** (`/hall-da-fama`): ranking de vitórias e jogos mais jogados. Por enquanto com dados de exemplo (`src/data/hallOfFame.js`)

Na fase 1 os jogos cadastrados no admin ficam só na memória e somem ao recarregar a página. É proposital: a fase 2 troca isso pelo banco.

## Estrutura

```
src/
  config/venue.js      tema do estabelecimento (nome, cores, logo)
  data/games.js        jogos de exemplo
  lib/scoring.js       regras: totais, ranking, vencedor
  hooks/useMatch.js    estado da partida + salvamento no aparelho
  context/             jogos e login do admin
  components/          capa, placares, modal, editor de jogadores...
  pages/               biblioteca, jogo, admin
```

## Entregar para outro bar

Edite só `src/config/venue.js`: nome, slogan, cores e logo. Para usar o logo real, coloque o arquivo em `public/` e aponte em `logoSrc`. O resto do app se ajusta sozinho.

## Fase 2 (depois)

- Banco gratuito (Neon/Postgres) para a biblioteca de jogos e para o Hall da fama (o gancho está em `src/lib/stats.js`)
- Login real do admin (hoje aceita qualquer e-mail e senha)
- PWA (instalável, abre em tela cheia) e QR Code
- Deploy na Vercel (o `vercel.json` já está pronto para as rotas do React Router)
