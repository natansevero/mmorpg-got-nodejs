//Importar o modulo do crypto
var crypto = require('crypto');

function UsuariosDAO() {

}

UsuariosDAO.prototype.inserirUsuario = (connection, usuario) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("usuarios", (err, collection) => {
      /*
        O método createHash() espera um parametro que é um string informando qual é o metodo
        de cryptografia.
        No update(), passa-se a string a ser criptografada
        O disgest() vai "digerir" as informações passada anteriormente. Ela espera por
        parametro uma forma de "output", uma forma de cuspir esta informação. No caso do
        md5, o parametro "hex" de hexadecimal
      */
      var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
      usuario.senha = senha_criptografada;

      collection.insert(usuario);

      mongoclient.close();
    })
  });
}

UsuariosDAO.prototype.autenticar = (connection, usuario, req, res) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("usuarios", (err, collection) => {

      var senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex");
      usuario.senha = senha_criptografada;

      /*
        O find() retorna um cursor, então precismos converter o cursor para uma estrutura que possamos
        trabalhar em nossa aplicação.
        Usamos em a funçao toArray() recupera o cursor e retorna dentro de um callback um array
        que podemos utilizar dentro da nossa aplicação
      */
      collection.find(usuario).toArray((err, result) => {
        if(result[0] != undefined){
          /*
            Criar a var de sessão. Essas variaveis vão se manter mesmo com a mudança das rotas.
            Podemos usar ela como pametro para controlar o acesso a outras rotas.
          */
          req.session.autorizado = true;

          /*
            Tbm podemos criar variaveis para usar em todo a aplicação, sem ter que fazer varias
            consultas para obter os mesmos dados
          */
          req.session.usuario = result[0].usuario;
          req.session.casa = result[0].casa;
        }

        if(req.session.autorizado) {
          res.redirect('jogo');
        } else {
          res.render('index', {validacao: {}, dadosForm: {invalido: true, usuario: usuario.usuario}});
        }
      });

      mongoclient.close();
    })
  });
}

module.exports = () => {
  return UsuariosDAO;
}
