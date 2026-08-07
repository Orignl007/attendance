#!/usr/bin/env node
/**
 * Alternativa ao Apps Script: cria o formulário "Registro de Foto" via
 * Google Forms API v1, autenticando com OAuth na sua conta Google.
 *
 * Setup (uma vez):
 *   1. https://console.cloud.google.com → crie/selecione um projeto.
 *   2. Ative a "Google Forms API" e a "Google Drive API".
 *   3. APIs e serviços → Credenciais → Criar credenciais → ID do cliente OAuth
 *      → tipo "App para computador". Baixe o JSON como credentials.json
 *      nesta pasta.
 *   4. Na tela de consentimento OAuth, adicione seu e-mail como usuário de teste.
 *
 * Rodar:
 *   npm install googleapis @google-cloud/local-auth
 *   node criar-form-api.js
 *
 * O primeiro run abre o navegador para você logar; o token fica em token.json.
 *
 * ATENÇÃO — pergunta 3 ("Foto"): a Forms API não permite CRIAR perguntas de
 * upload de arquivo. O schema FileUploadQuestion existe só para leitura; um
 * batchUpdate com "fileUploadQuestion" é rejeitado. Veja o final do arquivo.
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');

const SCOPES = [
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/drive.file',
];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

async function autorizar() {
  if (fs.existsSync(TOKEN_PATH)) {
    const saved = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    return google.auth.fromJSON(saved);
  }
  const client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
  if (client.credentials) {
    const keys = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const key = keys.installed || keys.web;
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    }));
  }
  return client;
}

async function main() {
  const auth = await autorizar();
  const forms = google.forms({ version: 'v1', auth });

  // O create só aceita o título; o resto vai por batchUpdate.
  const { data: form } = await forms.forms.create({
    requestBody: { info: { title: 'Registro de Foto' } },
  });

  await forms.forms.batchUpdate({
    formId: form.formId,
    requestBody: {
      requests: [
        {
          createItem: {
            location: { index: 0 },
            item: {
              title: 'Nombre completo',
              questionItem: {
                question: {
                  required: true,
                  textQuestion: { paragraph: false }, // resposta curta
                },
              },
            },
          },
        },
        {
          createItem: {
            location: { index: 1 },
            item: {
              title: 'Fecha de nacimiento',
              questionItem: {
                question: {
                  required: true,
                  dateQuestion: { includeTime: false, includeYear: true },
                },
              },
            },
          },
        },
        // --- Pergunta 3 NÃO É POSSÍVEL VIA API ---
        // O bloco abaixo é o que "deveria" funcionar, mas a API responde
        // 400 INVALID_ARGUMENT porque fileUploadQuestion é somente leitura:
        //
        // {
        //   createItem: {
        //     location: { index: 2 },
        //     item: {
        //       title: 'Foto',
        //       questionItem: {
        //         question: {
        //           required: true,
        //           fileUploadQuestion: {
        //             folderId: '<pasta do Drive>',
        //             types: ['IMAGE'],
        //             maxFiles: 1,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },
      ],
    },
  });

  const editUrl = `https://docs.google.com/forms/d/${form.formId}/edit`;
  console.log('=========================================');
  console.log('Link de EDIÇÃO:    ' + editUrl);
  console.log('Link p/ RESPONDER: ' + form.responderUri);
  console.log('=========================================');
  console.log('Falta a pergunta 3 ("Foto") — adicione no link de edição:');
  console.log('  tipo "Carga de archivos", só "Imagen", máximo 1, obrigatória.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
