# Ofertas periódicas por e-mail

O diretório `backend/`, anteriormente vazio, executa Cloud Functions v2 no mesmo projeto Firebase do frontend. Não há servidor Express paralelo nem automação no navegador. `src/server.ts` exporta `sendPeriodicOffers` (Cloud Scheduler) e `unsubscribeOffers` (HTTPS público com token assinado).

## Fluxo e compatibilidade

- O formulário exige e-mail válido, normaliza com `trim().toLowerCase()` e oferece consentimento opcional, desmarcado inicialmente.
- A validação pura em `src/domain/email.ts` é compartilhada com formulário, edição, serviços e processador. O Vite só libera esse arquivo externo no servidor de desenvolvimento.
- Documentos antigos sem e-mail continuam editáveis. `subscribedToOffers` ausente significa **não inscrito**; não há migração automática nem presunção de consentimento.
- O painel pode cancelar a assinatura. Alterar o endereço cancela o consentimento anterior; editar outros dados não reativa uma assinatura cancelada por um link enquanto o modal estava aberto. Reinscrição exige novo consentimento, não uma marcação administrativa silenciosa.
- Só `NOVO` e `EM_CONTATO` são elegíveis. Histórico inválido, endereço inválido, opt-out, `CONVERTIDO`, `PERDIDO` e status desconhecidos bloqueiam envio. Uma data explicitamente nula, contador inválido ou contador positivo sem data também bloqueiam: corrija o histórico a partir de evidências do provedor antes de retomar. Ausência de ambos os campos continua compatível com o primeiro envio.
- A função roda a cada hora, mas exige **30 dias completos desde `lastOfferSentAt`** para cada lead. O primeiro envio pode ocorrer na próxima execução após o cadastro com consentimento.
- A consulta busca apenas assinantes, em páginas de 50. Um cursor persistente retoma a varredura após o limite de seis minutos; um lease global evita sobreposição. A região é `southamerica-east1` e o fuso é `America/Sao_Paulo`.

## Entrega, falhas e idempotência

`offerDeliveries/{leadId}` é privado e mantém o ciclo atual, destinatário, mensagem imutável, UUID da requisição, lease de dois minutos e resultado. Uma transação decide quem pode processá-lo. O provider é chamado **fora** da transação, com o UUID no cabeçalho `Idempotency-Key`. Retries usam exatamente o mesmo conteúdo, mesmo se nome, oferta ou configuração mudarem.

Após a confirmação com ID pelo Resend, outra transação marca `accepted` e atualiza juntos `lastOfferSentAt` (Timestamp) e `offersSentCount`. Falhas HTTP, respostas inválidas e timeouts deixam `pending`, sem incrementar o contador. Se a confirmação do Firestore falhar depois do envio, a próxima tentativa reutiliza a chave. A resposta do provedor significa **aceitação para entrega**, não comprovação de chegada à caixa de entrada; bounces e reclamações devem ser acompanhados no provedor.

O Resend [retém chaves por 24 horas](https://resend.com/docs/dashboard/emails/idempotency-keys). Para evitar um segundo envio após expiração, um ciclo incerto com 23 horas passa a `review` e **nunca é reenviado automaticamente**, nem no mês seguinte. Isso privilegia não duplicar em detrimento de recuperar automaticamente toda falha. Opt-out ou troca de destinatário durante um ciclo incerto também bloqueiam a retomada. Uma mudança ocorrida depois da última verificação, quando a chamada externa já está em voo, não pode recolher uma mensagem já aceita.

Reconciliação de `review`: um operador autorizado deve consultar o Resend usando a chave/ID do ciclo. Se houver aceitação confirmada, registrar `accepted` e atualizar histórico/contador juntos via Admin SDK, uma única vez; usar horário da reconciliação é conservador para o próximo intervalo. Somente com confirmação de que não houve aceitação pode-se liberar esse ciclo para uma nova tentativa. **Não apague ciclos incertos, não remova o histórico e não troque a chave apenas para forçar retry.** Não há promessa de entrega exatamente uma vez entre dois sistemas independentes.

O job persiste contagens em `offerJobs/monthlyOffers`. Logs contêm contagens e eventos, não e-mails, mensagens, chaves ou tokens. Consulte `lastError` no documento privado para o código HTTP sanitizado. Configure alerta para `offers_require_reconciliation`, `offers_batch_partial_failure` e `offers_pending_retry` (tentativas pendentes, sem confirmação de aceitação). Leads que cancelaram a assinatura deixam de participar da consulta, portanto seus ciclos pendentes também devem ser considerados na revisão operacional.

## Oferta e provider

Não havia provider de e-mail nem fonte confiável de ofertas vigentes. O adapter usa `fetch` para a API HTTPS do Resend, com timeout de 15 segundos, sem adicionar SDK. O template usa nome, modelo de interesse e unidade do lead, escapa HTML e inclui descadastro em HTML/texto e cabeçalhos de one-click unsubscribe. Os preços estáticos da landing page **não** são enviados como uma promoção válida.

Forneça texto comercial aprovado em `OFFERS_SUBJECT`/`OFFERS_BODY` e URL HTTPS em `OFFERS_URL`. `renderOffer` é a fronteira para uma futura fonte de catálogo; não altere mensagens de ciclos pendentes.

## Configuração e implantação

Requisitos externos: projeto Firebase com faturamento/Cloud Functions e Cloud Scheduler habilitados, permissões de deploy, conta Resend, domínio de envio verificado e oferta aprovada. [Documentação do agendamento Firebase](https://firebase.google.com/docs/functions/schedule-functions).

1. Instale Node 22 (runtime de produção) e pnpm 10.33.2. Execute `pnpm install --frozen-lockfile` em `backend/` e `frontend/`.
2. Crie `backend/.env.<projectId>` baseado em `.env.example`. Mantenha `OFFERS_ENABLED=false` até concluir a configuração. Nunca versione esse arquivo.
3. Configure parâmetros:

   | Nome | Conteúdo |
   | --- | --- |
   | `OFFERS_ENABLED` | `false` inicialmente; `true` só após validação |
   | `OFFERS_FROM` | Endereço simples de remetente verificado, sem nome de exibição |
   | `OFFERS_SUBJECT` | Assunto aprovado, sem quebras de linha |
   | `OFFERS_BODY` | Texto aprovado; quebras de linha são permitidas |
   | `OFFERS_URL` | Página HTTPS da oferta vigente |
   | `OFFERS_UNSUBSCRIBE_URL` | `https://<hosting-domain>/offers/unsubscribe` |

4. A partir da raiz do repositório, configure secrets no Secret Manager, sem colocá-los na linha de comando ou no frontend:

   ```sh
   firebase functions:secrets:set RESEND_API_KEY --project <projectId>
   firebase functions:secrets:set UNSUBSCRIBE_SECRET --project <projectId>
   ```

   Use segredo aleatório de alta entropia com pelo menos 32 bytes para `UNSUBSCRIBE_SECRET`. A assinatura HMAC autoriza apenas cancelar aquele lead/endereço; um ID isolado não autoriza nada. GET exibe confirmação sem mutação; POST cancela de modo idempotente. Não expire/rotacione o segredo sem planejar a validade dos links já enviados. Não registre URLs completas desse endpoint em analytics; restrinja/redija os query strings nos logs de infraestrutura.

5. **Antes de publicar as regras**, atribua `crmStaff: true` aos usuários internos autorizados com Firebase Admin SDK em ambiente confiável, preservando outras custom claims. Exemplo de operação administrativa (não executada automaticamente):

   ```js
   const user = await getAuth().getUser(uid);
   await getAuth().setCustomUserClaims(uid, { ...user.customClaims, crmStaff: true });
   ```

   Os usuários devem renovar o token (sair e entrar novamente). Sem essa claim, o Firestore nega acesso ao painel. Autenticar ou criar uma conta por API não concede acesso comercial. Compare as regras aqui com regras eventualmente configuradas apenas no console antes de publicar; não havia regras versionadas no repositório anterior.

6. Valide e publique a partir da raiz do repositório, após revisão:

   ```sh
   npm --prefix frontend run build
   firebase deploy --only functions:offers,firestore:rules,hosting --project <projectId>
   ```

   O `firebase.json` da raiz unifica Functions, Firestore e Hosting; o CLI não permite que a pasta de Functions fique fora da raiz da configuração. O CLI compila `backend/` no predeploy. `frontend/firebase.json` mantém o deploy isolado do Hosting, caso necessário. A identidade gerenciada da função acessa Firestore; não é usado nenhum JSON de service account. O diretório `credentials`, arquivos `.env*` e `.secret*` são excluídos do pacote das Functions. O scheduler usa autenticação gerenciada do Firebase; não há endpoint público para disparar ofertas. Só o descadastro é público. [Secrets e parâmetros do Firebase](https://firebase.google.com/docs/functions/config-env).

7. Verifique o link de descadastro e faça um envio controlado para um endereço de teste consentido. Então defina `OFFERS_ENABLED=true` e publique novamente as Functions. Alterações em parâmetros/secrets exigem novo deploy. Nenhum deploy ou envio real é executado pelos testes.

As regras permitem criação pública validada e negam leitura pública, alterações de contadores/histórico e qualquer acesso cliente a `offerDeliveries`/`offerJobs`. Não há double opt-in nem proteção anti-bot nova; a criação pública já existente continua podendo ser abusada. Para operação de maior volume, adote App Check e confirmação de titularidade do e-mail como evolução separada.

## Validação local

Não é necessário provedor real para testar. Os testes usam `node:test`, sem framework adicional. Use Java 21+ para o emulador e Firebase CLI.

```sh
# backend/
npm run typecheck
npm test

# frontend/
npx tsc --noEmit -p tsconfig.app.json
npm run lint
npm run build
# raiz do repositório/
firebase emulators:exec --only firestore --project demo-crm-offers "npm --prefix backend run test:integration && npm --prefix frontend run test:integration"
```

O projeto `demo-crm-offers` e a exigência explícita de `FIRESTORE_EMULATOR_HOST` impedem os testes de integração de operar em produção. Eles exercitam Firestore real emulado: regras, gravação por serviços do frontend, concorrência, falhas parciais, timeout ambíguo, periodicidade, cursor e descadastro. Unitários cobrem validação, elegibilidade, provider, escape de template e assinatura de token.
