var ObjectID = require('mongodb').ObjectId;

function JogoDAO() {

}

JogoDAO.prototype.gerarParametros = (connection, usuario) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("jogo", (err, collection) => {
      collection.insert({
        usuario: usuario,
        moeda: 15,
        suditos: 10,
        temor: Math.floor(Math.random() * 1000),
        sabedoria: Math.floor(Math.random() * 1000),
        comercio: Math.floor(Math.random() * 1000),
        magia: Math.floor(Math.random() * 1000)
      });

      mongoclient.close();
    })
  });
}

JogoDAO.prototype.iniciaJogo = (connection, usuario, casa, res, msg) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("jogo", (err, collection) => {
      collection.find({ usuario: usuario }).toArray((err, result) => {

        res.render('jogo', { img_casa: casa, jogo: result[0], msg: msg });

        mongoclient.close();
      })
    });
  });
}

JogoDAO.prototype.acao = (connection, acao) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("acao", (err, collection) => {

      var date = new Date();

      var tempo = null;

      switch (parseInt(acao.acao)) {
        case 1: tempo = 1 * 60 * 60000; break;
        case 2: tempo = 2 * 60 * 60000; break;
        case 3: tempo = 5 * 60 * 60000; break;
        case 4: tempo = 5 * 60 * 60000; break;
      }

      acao.acao_termina_em = date.getTime() + tempo; //Termina no milisegundo tal
      collection.insert(acao);
    })

    mongoclient.collection("jogo", (err, collection) => {
      var moedas = null;

      switch (parseInt(acao.acao)) {
        case 1: moedas = -2 * acao.quantidade; break;
        case 2: moedas = -3 * acao.quantidade; break;
        case 3: moedas = -1 * acao.quantidade; break;
        case 4: moedas = -1 * acao.quantidade; break;
      }

      collection.update({usuario: acao.usuario} , { $inc: {moeda: moedas} });

      mongoclient.close();
    })
  });
}

JogoDAO.prototype.getAcoes = (connection, usuario, res) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("acao", (err, collection) => {
      var date = new Date;
      var momento_atual = date.getTime();

      collection.find({ usuario: usuario, acao_termina_em: {$gt : momento_atual} }).toArray((err, result) => {

        res.render('pergaminhos', {acoes: result})

        mongoclient.close();
      })
    });
  });
}

JogoDAO.prototype.revogarAcao = (connection, _id, res) => {
  connection().open((err, mongoclient) => {
    mongoclient.collection("acao", (err, collection) => {
      collection.remove({ _id: ObjectID(_id) }, (err, result) => {
        res.redirect('jogo?msg=D'); //"D" para ação revogada
        mongoclient.close();
      })
    });
  });
}

module.exports = () => {
  return JogoDAO;
}
