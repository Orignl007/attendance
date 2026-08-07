/**
 * Cria o formulário "Registro de Foto" (textos em espanhol).
 *
 * Como rodar:
 *   1. Abra https://script.google.com/ (logado na conta Google que deve ser dona do form).
 *   2. "Novo projeto" → cole este arquivo inteiro.
 *   3. Selecione a função criarFormularioRegistroFoto → Executar.
 *   4. Autorize os escopos quando o Google pedir.
 *   5. Veja os links no painel "Registro de execução" (Ctrl+Enter).
 *
 * ATENÇÃO — pergunta 3 ("Foto"):
 *   O Apps Script NÃO consegue criar perguntas do tipo "upload de arquivo".
 *   O enum FormApp.ItemType.FILE_UPLOAD existe apenas para LER itens já
 *   existentes; não há um método addFileUploadItem(). O mesmo vale para a
 *   Google Forms API (fileUploadQuestion não pode ser criada via batchUpdate).
 *   Por isso este script cria as perguntas 1 e 2 e imprime o passo a passo
 *   para você adicionar a pergunta 3 manualmente (leva ~20 segundos).
 */
function criarFormularioRegistroFoto() {
  var form = FormApp.create('Registro de Foto');
  form.setTitle('Registro de Foto');

  // Pergunta 1 — resposta curta, obrigatória
  form.addTextItem()
    .setTitle('Nombre completo')
    .setRequired(true);

  // Pergunta 2 — data, obrigatória
  form.addDateItem()
    .setTitle('Fecha de nacimiento')
    .setRequired(true);

  // Pergunta 3 — upload de arquivo: precisa ser adicionada na interface.

  var editUrl = form.getEditUrl();
  var respondUrl = form.getPublishedUrl();

  Logger.log('=========================================');
  Logger.log('Link de EDIÇÃO:    %s', editUrl);
  Logger.log('Link p/ RESPONDER: %s', respondUrl);
  Logger.log('=========================================');
  Logger.log('Falta a pergunta 3. Abra o link de edição e:');
  Logger.log('  1. Clique em "+" para adicionar pergunta.');
  Logger.log('  2. Título: Foto');
  Logger.log('  3. Tipo: "Carga de archivos" / "Upload de arquivo".');
  Logger.log('  4. Ative "Permitir solo tipos de archivo específicos" e marque');
  Logger.log('     apenas "Imagen" (cobre JPG e PNG).');
  Logger.log('  5. "Número máximo de archivos": 1.');
  Logger.log('  6. Marque a pergunta como obrigatória.');

  return { editUrl: editUrl, respondUrl: respondUrl };
}
