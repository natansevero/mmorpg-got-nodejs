//Importar o MongoDB
var mongo = require('mongodb');

var connMongoDB = () => {
  /*
    Espera 3 parametros.
      1: String do nome do DB.
      2: Objeto de conexão com o Server
      3: Objeto de config adicionais que são opcionais
  */
  var db = new mongo.Db(
    'got',
    new mongo.Server(
        'localhost', //String contendo o endereço do sevidor
        27017, //Porta de conexão padrão
        {} //Objeto com opções de config do server
    ),
    {}
  );

  return db;
}

module.exports = () => {
  return connMongoDB;
}
