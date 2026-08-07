# Formulário "Registro de Foto"

Scripts para criar o Google Form com os textos em espanhol:

| # | Título | Tipo | Obrigatória |
|---|--------|------|-------------|
| 1 | `Nombre completo` | resposta curta | sim |
| 2 | `Fecha de nacimiento` | data | sim |
| 3 | `Foto` | upload de arquivo (só imagem, máx. 1) | sim |

## Qual usar

**`registro-foto.gs` (Apps Script) — recomendado.** Não precisa de projeto no
Google Cloud nem de credenciais: você cola no script.google.com, roda, autoriza
e pronto. Os links saem no registro de execução.

**`criar-form-api.js` (Forms API v1)** — use se preferir rodar localmente. Exige
criar credenciais OAuth no Google Cloud primeiro (passo a passo no topo do
arquivo).

## Limitação: a pergunta 3 não pode ser criada por script

O upload de arquivo é o único dos três campos que **nenhuma** das duas vias
consegue criar:

- **Apps Script:** não existe `Form.addFileUploadItem()`. O enum
  `FormApp.ItemType.FILE_UPLOAD` serve apenas para *ler* um item que já existe.
- **Forms API v1:** o schema `FileUploadQuestion` é somente leitura; um
  `batchUpdate` com `fileUploadQuestion` volta com `400 INVALID_ARGUMENT`.

Os dois scripts criam as perguntas 1 e 2 e imprimem as instruções para você
adicionar a 3 na interface (leva uns 20 segundos):

1. Abra o link de edição, clique em **+**.
2. Título: `Foto`.
3. Tipo: **Carga de archivos** / *Upload de arquivo*.
4. Ative *permitir apenas tipos específicos* e marque só **Imagen**
   (a interface agrupa JPG e PNG sob "Imagen"; não há como marcar as duas
   extensões separadamente).
5. **Número máximo de arquivos: 1**.
6. Marque como **obrigatória**.

## Sobre o upload

Como você observou: o campo de upload exige que o formulário esteja no seu
Google Drive (os arquivos vão para uma pasta criada automaticamente lá) e que
quem responde esteja logado numa conta Google. Não funciona em formulários
anônimos nem em Shared Drives.
