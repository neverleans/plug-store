---
id: maintenance
title: Como isto é mantido
sidebar_label: Como isto é mantido
sidebar_position: 4
description: O que "mantido" significa aqui, em forma de verificações que você mesmo pode rodar — incluindo o gate que instala os pacotes do jeito que você vai instalar, fora do workspace.
---

# Como isto é mantido

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Você vai saber exatamente o que é verificado antes de um release chegar até
você, o que não é, e como rodar as mesmas verificações na sua máquina.

</div>

Todo projeto diz que é mantido. A palavra sozinha não vale nada, então esta
página explica o que ela significa aqui em coisas que dá para conferir — e nomeia
os pontos onde a garantia acaba.

## Tudo sai no mesmo número de versão

Os três pacotes são sempre publicados juntos na mesma versão, e o
`scripts/version.mjs` reescreve os intervalos entre pacotes para semver literal,
para que nada interno vaze num manifesto publicado.

Essa regra existe porque foi quebrada. O `plug-store-themes` ficou parado em
`0.1.0` durante três releases do `plug-store-core` enquanto o workflow de release
reportava **sucesso** todas as vezes — porque nenhum passo perguntava ao registry
o que tinha sido publicado de fato. Enquanto isso, a CLI já escrevia
`themes ^0.1.2` em todo projeto gerado, então o `npm install` de quem rodou
`npm create plug-store` naquela janela falhava com 404.

O conserto não é atenção, é um job. O `verify-release` roda depois de publicar e
reprova o release a menos que:

- os três pacotes reportem a versão da tag no `npm view`, e
- `npm view <pacote>@^<versão-da-cli>` resolva — ou seja, o intervalo exato que a
  CLI escreve no seu `package.json` seja instalável.

## O gate que importa: um build de consumidor de verdade

Tudo dentro deste repositório é testado através de symlinks do workspace do pnpm,
que resolvem imports que um `npm install` de verdade não resolveria. Essa brecha
não é teórica — é de onde vieram os dois bugs que chegaram a usuários:

| Bug | Por que a suíte normal não conseguia ver |
|---|---|
| `themes` declarava `core` só como peer dependency | O symlink resolvia mesmo assim |
| O projeto gerado nunca importava `dist/index.css` | Nada renderizava o projeto gerado |

Então um job sai do workspace por completo e se comporta como você:

1. `pnpm pack` nos três pacotes, gerando tarballs de verdade.
2. Instala a **CLI a partir do tarball dela** — o que prova que o campo `files`
   entrega tudo que ela precisa em tempo de execução, não só o que por acaso está
   no disco.
3. Roda essa CLI para gerar um projeto num diretório temporário, sem interação.
4. `npm install` e depois `npm run build`.
5. Inspeciona o que saiu.

O passo 5 é o que pega regressão, e ele afirma coisas que um build verde não
garante:

| Verificação | O bug que ela pega |
|---|---|
| `dist/index.html` existe | O build não produziu nada, calado |
| O bundle de CSS contém `--primary:` | O `core/dist/index.css` não entrou — a loja renderiza sem estilo |
| O bundle de CSS passa de 10 kB | O `content` do Tailwind não alcança a biblioteca compilada, então toda classe utilitária foi purgada |
| O bundle de JS contém `TechVault` | O registro de temas foi eliminado por tree-shaking ou nunca foi empacotado |

Roda em quatro combinações, porque bug de empacotamento raramente é portátil:
**Ubuntu e Windows, cada um contra React 18 e React 19.** Separador de caminho e
resolução de peer dependency são exatamente o tipo de coisa que funciona num e
não funciona no outro.

**Você pode rodar por conta.** Não é mágica exclusiva do CI — clone o repositório,
`pnpm install`, `pnpm build` e depois:

```bash
pnpm e2e
```

Ou escolha a versão maior do React a testar:

```bash
node scripts/e2e-consumer.mjs --react 19
```

## O que roda a cada commit

| Verificação | Detalhe |
|---|---|
| Lint | Workspace inteiro |
| Build | Node 18, 20 e 22 — os pacotes precisam continuar compilando no 18 porque é o que o README da CLI promete |
| Testes | 43 testes em 8 arquivos |
| Build da documentação | Link quebrado **derruba o build**, então nenhuma página daqui aponta para o vazio |
| Build de consumidor | As quatro combinações acima |

Sendo honesto sobre a contagem: 43 é pouco, e não está distribuído por igual.
Onze cobrem o payload do Pix, nove a mensagem de pedido do WhatsApp e sete a
ligação do data provider, porque são os lugares onde uma falha silenciosa custa
dinheiro sem levantar erro. Renderização de componente tem cobertura rala.

## O que *não* é coberto

- **Resolução no registry.** O gate de consumidor reescreve as dependências para
  tarballs `file:` locais, então ele nunca pede ao npm que resolva um intervalo
  publicado. Foi exatamente por isso que o 404 do `themes` passou. O
  `verify-release` fecha o caso concreto; o gate em si continua cego para isso.
- **Regressão visual.** Nada compara o resultado renderizado entre releases. Um
  tema pode mudar de aparência sem que nenhuma verificação perceba.
- **Navegadores.** Builds são verificados, navegadores não. Não há Playwright nem
  matriz de navegadores.
- **O provider REST contra um endpoint real.** Os testes de data provider usam um
  provider de mentira e os dados de demonstração — eles provam a *ligação* (que o
  seu provider é mesmo chamado, e que um `getReviews` ausente degrada em vez de
  quebrar), não que algum backend específico responde certo.

## Por que esta página existe

Manutenção é o produto de verdade de um framework. Componente é a parte que ficou
fácil de gerar; manter algo funcionando através de versões maiores do React,
sistemas operacionais, manias de gerenciador de pacote e um registry que serve
uma combinação quebrada sem reclamar é a parte que não ficou.

Uma camada paga de integrações brasileiras mantidas está sendo estudada — a lista
do que ainda não existe está em [Feito para o Brasil](./brazil.md). Se ela vier a
existir, vai ser julgada exatamente por isto: se a manutenção é real. Então a
versão gratuita dela está documentada aqui primeiro, com as falhas incluídas,
para você formar opinião antes de alguém te cobrar.

## Próximo passo

- [Feito para o Brasil](./brazil.md) — o que o framework sabe, e onde isso acaba.
- [Contribuindo](https://github.com/neverleans/plug-store/blob/master/CONTRIBUTING.md) — como rodar tudo isso localmente.
- [Changelog](https://github.com/neverleans/plug-store/blob/master/CHANGELOG.md) — todos os releases, inclusive os quebrados.
