---
id: pix
title: Pagamentos Pix
sidebar_label: Pix
sidebar_position: 5
description: Como o PlugStore monta um BR Code Pix estático real e conforme a especificação — o payload EMV, o checksum CRC-16, os limites de campo, e o que o Pix estático não faz.
---

import PixPlayground from '@site/src/components/PixPlayground';

# Pagamentos Pix

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Um checkout que produz um código Pix que o app do banco realmente aceita, e uma
visão clara de onde o Pix estático para.

</div>

## Como ligar

Dois campos de configuração, e BRL:

```tsx
<CatalogApp
  config={{
    currency: 'BRL',
    pixKey: 'bloom@example.com',
    pixMerchantCity: 'Sao Paulo',
    companyName: 'Bloom Cosméticos',
  }}
/>
```

A opção Pix passa a aparecer no checkout, mostrando o QR code e o texto para
copiar e colar ("Pix Copia e Cola").

`pixKey` aceita qualquer tipo de chave: CPF, CNPJ, e-mail, telefone no formato
`+55…`, ou chave aleatória.

## É um BR Code de verdade

Vale dizer isso com todas as letras porque implementações de fachada são comuns.
O PlugStore implementa o payload **EMV® QRCPS-MPM** descrito no *Manual de
Padrões para Iniciação do Pix* do Banco Central do Brasil.

O payload é uma sequência de campos TLV — dois dígitos de id, dois de tamanho,
depois o valor:

| Id | Conteúdo |
|---|---|
| `00` | Indicador de formato do payload, `01` |
| `01` | Ponto de iniciação, `11` (estático, reutilizável) |
| `26` | Conta do recebedor: `br.gov.bcb.pix` + sua chave |
| `52` | Código de categoria do comerciante, `0000` |
| `53` | Moeda, `986` (BRL) |
| `54` | Valor, omitido quando zero para o pagador digitar |
| `58` | País, `BR` |
| `59` | Nome do recebedor |
| `60` | Cidade do recebedor |
| `62` | Dados adicionais: o identificador da transação |
| `63` | CRC-16 |

O checksum é **CRC-16/CCITT-FALSE** — polinômio `0x1021`, valor inicial
`0xFFFF`, sem reflexão de entrada nem de saída — calculado sobre o payload
inteiro, *incluindo* a tag `6304` do próprio campo de CRC. Errar isso é
exatamente o que faz um código escanear como inválido, então há testes
unitários cobrindo.

## Experimente

Isto roda o `buildPixPayload` do pacote publicado — a mesma função que o
checkout chama — e depois recalcula o checksum do jeito que um app de banco faz.
Edite qualquer campo e veja o payload mudar.

<PixPlayground />

## Limites dos campos

A especificação restringe nomes e cidades a ASCII imprimível. O PlugStore faz a
conversão para você: acentos são decompostos e removidos, o texto vira
maiúsculo e é truncado.

| Campo | Origem | Limite | Fallback |
|---|---|---|---|
| Nome do recebedor | `config.companyName` | 25 caracteres | `RECEBEDOR` |
| Cidade do recebedor | `config.pixMerchantCity` | 15 caracteres | `BRASIL` |
| Identificador (txid) | o id de pedido gerado | 25 caracteres | `***` |

Então `São Paulo` vira `SAO PAULO`, e um nome de loja comprido é cortado em 25
caracteres. Escolha um nome fantasia curto se a razão social for longa.

## Gerar um código por conta própria

O gerador é exportado, então você pode montar um código fora do checkout — para
uma fatura, um recibo, ou um link de "pague este valor".

```ts
import { buildPixPayload } from '@neverleans-labs/plug-store-core';

const codigo = buildPixPayload({
  pixKey: 'bloom@example.com',
  merchantName: 'Bloom Cosméticos',
  merchantCity: 'Sao Paulo',
  amount: 149.9,        // omita para o pagador definir o valor
  txid: 'PEDIDO-1042',  // opcional, padrão '***'
});
```

`buildPixPayload` lança erro quando falta a `pixKey` — um código Pix sem chave
nunca serve para nada, então falhar alto é melhor que devolver um texto que não
faz nada em silêncio.

A função de checksum também é exportada, caso você precise validar um payload
vindo de outro lugar:

```ts
import { pixCrc16 } from '@neverleans-labs/plug-store-core';

const corpo = codigo.slice(0, -4);        // tudo até o valor do CRC
pixCrc16(corpo) === codigo.slice(-4);     // true para um código válido
```

## Renderizar o QR code

O `pixGateway` devolve `pixQrCodeUrl`, uma URL de imagem de um serviço público
de QR, para que o checksum embutido funcione sem dependência extra.

Para uma loja em produção, gere o QR localmente — assim o payload não sai para
um terceiro e funciona offline:

```tsx
import QRCode from 'qrcode';

const dataUrl = await QRCode.toDataURL(codigo, { width: 300, margin: 1 });
```

## O que o Pix estático não faz

O fluxo embutido é **Pix estático**. Ele cria uma cobrança válida. Só isso.

- **Sem confirmação.** Seu app nunca fica sabendo que o dinheiro entrou. Alguém
  precisa conferir no banco.
- **Sem conciliação por pedido do lado do banco.** O txid vai no payload, mas
  casar isso com uma liquidação exige a API do banco.
- **Sem estorno nem cancelamento.**

Confirmação automática significa *Pix dinâmico*: conta em um PSP, endpoint de
webhook no seu servidor e verificação de assinatura. Quando você tiver isso,
pluga como [adaptador customizado](./checkout.md#custom-adapters) — o PlugStore
sai do caminho.

## Próximos passos

- [Checkout e adaptadores](./checkout.md)
- [Configuração da loja](./configuration.md)
