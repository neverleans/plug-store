---
id: brazil
title: Feito para o comércio brasileiro
sidebar_label: Feito para o Brasil
sidebar_position: 2
description: Pix, WhatsApp e Mercado Pago são adaptadores de checkout que já vêm na caixa e têm teste — não plugins que você sai procurando. O que está dentro, e exatamente onde acaba.
---

# Feito para o comércio brasileiro

<div className="ps-outcome">
<div className="ps-outcome-title">Ao final desta página</div>

Você vai saber quais partes do comércio brasileiro estão dentro do framework,
quais não estão, e como conferir cada uma das duas afirmações no código-fonte.

</div>

## A afirmação

A maioria dos frameworks de loja trata o Brasil como **locale**: símbolo de
moeda, formato de data, um arquivo de strings traduzido. As formas de pagamento
que realmente fecham venda aqui aparecem depois — como plugin de terceiro, ou
como um parágrafo mandando você construir por conta.

O PlugStore trata o Brasil como o **caso padrão**. Pix e WhatsApp não são
integrações que você adiciona. São adaptadores de checkout que já vêm na caixa,
são exportados da raiz do pacote e têm teste rodando a cada commit.

Esse é o diferencial. Ele está escrito aqui porque o resto desta documentação só
*demonstra* isso, página por página, sem nunca dizer em voz alta.

## Pix que o aplicativo do banco reconhece

O adaptador de Pix não chama API nenhuma e não devolve uma imagem gerada no
painel de terceiro. Ele monta o payload:

```ts
import { buildPixPayload } from '@neverleans-labs/plug-store-core';

buildPixPayload({
  pixKey: 'padaria@example.com',
  merchantName: 'Padaria São João',
  merchantCity: 'São Paulo',
  amount: 49.9,
});
```

```text title="o payload devolvido"
00020101021126410014br.gov.bcb.pix0119padaria@example.com520400005303986540549.905802BR5916PADARIA SAO JOAO6009SAO PAULO62070503***63047C4C
```

Essa string é um payload EMV® MPM seguindo o *Manual de Padrões para Iniciação
do Pix* do Banco Central. Cole no aplicativo de qualquer banco brasileiro e ele
resolve para a chave do lojista.

Dois detalhes são onde as implementações erram calado, e vale nomear os dois
porque um código Pix errado **não estoura exceção** — ele simplesmente não é
lido, em produção, no celular do cliente:

| Detalhe | A regra | O que acontece se passar batido |
|---|---|---|
| **CRC-16** | `CCITT-FALSE`: polinômio `0x1021`, valor inicial `0xFFFF`, **sem** reflexão de entrada ou saída, calculado sobre o payload *incluindo* a tag `6304` do próprio campo de CRC | O app do banco recusa o código com um erro genérico |
| **Dobra para ASCII** | Nome e cidade do recebedor precisam virar ASCII imprimível, em caixa alta, truncados em 25 e 15 caracteres | `São João` quebra o prefixo de tamanho e corrompe todo campo depois dele |

Os dois estão presos por teste — o CRC contra o vetor canônico de verificação, a
dobra contra um nome acentuado que estoura o limite. Onze dos trinta e quatro
testes da suíte são só de Pix, o que já diz onde o risco está concentrado.

Teste com a sua própria chave na [página de Pix](./guides/pix.md) — o gerador
roda dentro da página.

## WhatsApp como forma de checkout, não como botão de compartilhar

Um número enorme de lojas pequenas no Brasil fecha pedido na conversa. O
adaptador de WhatsApp trata isso como checkout de verdade, não como enfeite: o
pedido vira uma mensagem `wa.me` pré-preenchida com cliente, endereço, cada item
com quantidade e preço, desconto, frete e total.

```
👋 *Novo Pedido #ORD-4F2A91*

👤 *Cliente:* Ana Souza
📍 *Endereço:* Rua das Flores 210, São Paulo - SP

📦 *Itens do Pedido:*
• 2x *Pão de forma integral* (R$ 12.90)

🚚 *Frete:* R$ 8.00
💰 *TOTAL:* R$ 33.80
```

Deixando claro o que isso é: um link `wa.me`, que não precisa de aprovação nem de
análise da Meta. Não é a API do WhatsApp Business — veja
[onde isso acaba](#onde-o-conhecimento-brasileiro-acaba).

## Mercado Pago sem o seu segredo no navegador

O `mercadopagoGateway` manda o carrinho para o **seu** endpoint e segue o
`init_point` que ele devolver. O access token fica no seu servidor, que é o lugar
dele; o framework nunca pede para você colocar isso em código de cliente. Mesmo
formato para o Stripe.

O contrato do adaptador está em [Checkout](./guides/checkout.md).

## Moeda e idioma

- **BRL é formatado pelo locale `pt-BR` do Intl** — `R$ 1.234,56`, com os
  separadores no lugar certo.
- **A loja tem uma moeda só e os preços estão guardados nela.** Não existe
  conversão por câmbio, porque loja brasileira não precifica em dólar e converte.
  Trocar a moeda muda a formatação, não a conta.
- **A interface em português é completa, não é fallback.** `pt.ts` e `en.ts` têm
  250 linhas cada — toda chave traduzida, inclusive as que importam num formulário
  de endereço daqui, como `CEP` em vez de um "código postal" traduzido.

Detalhes em [Moeda e idioma](./guides/i18n-currency.md).

## Onde o conhecimento brasileiro acaba

Esta é a metade mais útil da página. Tudo acima existe; tudo abaixo não está no
framework, e fingir o contrário custaria uma semana do seu tempo.

| Não incluído | O que você vai precisar de fato |
|---|---|
| **Confirmação de pagamento** | O Pix que vem junto é *estático*. Ele cria uma cobrança válida; nada avisa o seu app que o dinheiro caiu. Conciliação exige um PSP com webhook, plugado pela [interface de adaptadores](./guides/checkout.md#custom-adapters). |
| **Emissão de NFe** | Não há geração de documento fiscal. Na prática isso significa um provedor tipo Focus NFe ou NFe.io, acionado pelo seu backend. |
| **Frete real** | Frete é um valor configurado. Preço de Correios ou Melhor Envio exige contrato, token e uma tabela que muda. |
| **Sincronismo com marketplace** | Não há integração com Mercado Livre nem Shopee. |
| **API do WhatsApp Business** | O adaptador é um link `wa.me`. Mensagem por template, automação e caixa compartilhada exigem aprovação da Meta e um BSP. |
| **Validação de CPF/CNPJ, busca de CEP** | Não implementado. O campo de chave Pix aceita CPF ou CNPJ como string, mas não confere os dígitos, e não há autocompletar de endereço. |

Nada disso está atrás de paywall hoje — simplesmente não foi construído.

Se um desses é o muro entre você e uma loja no ar,
[diga qual](https://github.com/neverleans/plug-store/issues/new?template=production_need.yml).
Estamos mapeando em quais muros as pessoas realmente batem antes de construir
qualquer coisa, e a lista acima está na ordem em que acreditamos que importa —
que é exatamente o palpite que gostaríamos de ver corrigido.

## Próximo passo

- [Pagamentos com Pix](./guides/pix.md) — o payload campo a campo, com gerador ao vivo.
- [Checkout](./guides/checkout.md) — os quatro adaptadores e como escrever o seu.
- [Como isto é mantido](./maintenance.md) — o que mantém tudo acima funcionando.
