module.exports.cadastro = (application, req, res) => {
  res.render('cadastro', {validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = (application, req, res) => {
  var dadosForm = req.body;

  req.assert('nome', 'Nome não pode ser vazio').notEmpty();
  req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
  req.assert('senha', 'Senha não pode ser vazio').notEmpty();
  req.assert('casa', 'Casa não pode ser vazio').notEmpty();

  var erros = req.validationErrors();

  if(erros) {
    res.render('cadastro', {validacao: erros, dadosForm: dadosForm});
    return;
  }

  var connection = application.config.dbConnection;
  var UsuariosDAO = new application.app.models.UsuariosDAO;
  var JogoDAO = new application.app.models.JogoDAO;

  UsuariosDAO.inserirUsuario(connection, dadosForm);

  JogoDAO.gerarParametros(connection, dadosForm.usuario);


  res.send("Podemos cadastrar!");

}
