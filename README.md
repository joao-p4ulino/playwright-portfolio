# Playwright Portfolio - Automation Exercise

Projeto de automacao de testes end-to-end e API com Playwright para o site
[Automation Exercise](https://automationexercise.com/).

O objetivo deste repositorio e demonstrar uma base de testes organizada para um
fluxo realista de QA, com Page Objects, fixtures, dados de teste isolados e
cenarios agrupados por funcionalidade.

## Tecnologias

- [Playwright](https://playwright.dev/) para automacao web e API.
- TypeScript para tipagem e melhor manutencao dos testes.
- Page Object Model para concentrar seletores e fluxos reutilizaveis.
- Fixtures customizadas para compartilhar paginas e contexto entre os testes.

## Cobertura Automatizada

Os testes cobrem fluxos principais do Automation Exercise, incluindo:

- autenticacao e cadastro de usuario;
- navegacao e validacao de conteudo;
- listagem, busca e detalhes de produtos;
- carrinho de compras;
- checkout e pagamento;
- formulario de contato com upload;
- validacoes de rolagem e elementos visiveis;
- endpoints de API usados pelo site.

Cenarios adicionais mapeados para evolucao futura estao em
[`TEST-BACKLOG.md`](./TEST-BACKLOG.md).

## Estrutura

```text
pages/                 Page Objects e fluxos reutilizaveis da UI
tests/                 Specs organizadas por funcionalidade
tests/fixtures/        Fixtures e arquivos auxiliares dos testes
utils/                 Fabricas de dados e utilitarios compartilhados
playwright.config.ts   Configuracao principal do Playwright
TEST-BACKLOG.md        Backlog de cenarios ainda nao automatizados
```

## Pre-requisitos

- Node.js instalado.
- npm instalado.
- Acesso a internet para executar os testes contra
  `https://automationexercise.com/`.

Instale as dependencias:

```bash
npm install
```

Se os browsers do Playwright ainda nao estiverem instalados na maquina, execute:

```bash
npx playwright install
```

## Como Executar

Executar todos os projetos configurados:

```bash
npm test
```

Executar apenas no Chromium:

```bash
npm run test:chromium
```

Executar testes de API:

```bash
npm run test:api
```

Executar no Chromium com navegador visivel:

```bash
npm run test:headed
```

Abrir o ultimo relatorio HTML gerado:

```bash
npm run show:report
```

Abrir o Playwright Codegen apontando para o sistema:

```bash
npm run codegen
```

## Padroes Aplicados

- Os testes usam Page Objects para reduzir duplicacao e deixar as specs mais
  legiveis.
- Dados dinamicos ficam centralizados em `utils/testData.ts`.
- Operacoes de rede reutilizaveis ficam em `utils/network.ts`.
- Fixtures em `tests/fixtures/base.ts` expoem objetos de pagina prontos para uso.
- As specs sao separadas por dominio funcional para facilitar manutencao e
  execucao direcionada.

## Relatorios e Evidencias

Apos uma execucao, o Playwright gera relatorios locais com traces, screenshots e
videos conforme a configuracao do projeto. Para consultar o relatorio HTML mais
recente:

```bash
npm run show:report
```

Em caso de falha, use o trace do Playwright para revisar a acao executada, os
locators, as requisicoes de rede e o estado visual da pagina no momento do erro.
