module.exports.jogo = (application, req, res) => {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

  if(req.session.autorizado !== true) {
    res.send('User precisa fazer login!');
    return;
  }

  var msg = '';
  if(req.query.msg != ''){
    msg = req.query.msg;
  }

  var usuario = req.session.usuario;
  var casa = req.session.casa;

  var connection = application.config.dbConnection;
  var JogoDAO = new application.app.models.JogoDAO;

  JogoDAO.iniciaJogo(connection, usuario, casa, res, msg);

}

module.exports.sair = (application, req, res) => {
  req.session.destroy((err) => {
    res.render('index', {validacao: {}, dadosForm: {}})
  });
}

module.exports.suditos = (application, req, res) => {
  if(req.session.autorizado !== true) {
    res.send('User precisa fazer login!');
    return;
  }

  res.render('aldeoes', {validacao: {}})
}

module.exports.pergaminhos = (application, req, res) => {
  if(req.session.autorizado !== true) {
    res.send('User precisa fazer login!');
    return;
  }

  //Recuperar as ações inseridas no banco de dados
  var connection = application.config.dbConnection;
  var JogoDAO = new application.app.models.JogoDAO;

  var usuario = req.session.usuario;
  JogoDAO.getAcoes(connection, usuario, res);

}

module.exports.ordenar_acao_sudito = (application, req, res) => {
  if(req.session.autorizado !== true) {
    res.send('User precisa fazer login!');
    return;
  }

  var dadosForm = req.body;

  req.assert("acao", "Ação deve ser informada").notEmpty();
  req.assert("quantidade", "Quantidade deve ser informada").notEmpty();

  var erros = req.validationErrors();

  if(erros) {
    res.redirect('jogo?msg=A'); //"A" => existe erro
    return;
  }

  var connection = application.config.dbConnection;
  var JogoDAO = new application.app.models.JogoDAO;

  dadosForm.usuario = req.session.usuario;
  JogoDAO.acao(connection, dadosForm);

  res.redirect('jogo?msg=B'); //"B" => Não existe erro
}

module.exports.revogar_acao = (application, req, res) => {
  var url_query = req.query;

  var connection = application.config.dbConnection;
  var JogoDAO = new application.app.models.JogoDAO;

  var _id = url_query.id_acao;
  JogoDAO.revogarAcao(connection, _id, res);
}
