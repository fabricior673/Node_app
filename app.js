const restify = require('restify');

const resultados = {
  pessoas: [{id:1, nome: "Marcelo"}, {id:2, nome: "João"}, {id:3, nome: "Maria"}],
  carros: [{id:1, modelo: "Fusca"}, {id:2, modelo: "Gol"}, {id:3, modelo: "Palio"}],
  animais: [{id:1, nome: "Cachorro"}, {id:2, nome: "Gato"}, {id:3, nome: "Papagaio"}]
};

let cache = {
  pessoas: null,
  carros: null,
  animais: null
};

const server = restify.createServer();

server.use(restify.plugins.queryParser());

server.get('/:tipo', (req, res, next) => {
  const tipo = req.params.tipo;
  if (resultados[tipo]) {
    const dados = resultados[tipo];
    const eTag = JSON.stringify(dados);
    if (cache[tipo] === eTag) {
      res.send(304);
    } else {
      cache[tipo] = eTag;
      res.header('ETag', eTag);
      res.send(200, dados);
    }
  } else {
    res.send(404);
  }
  return next();
});

server.get('/:tipo/:id', (req, res, next) => {
  const tipo = req.params.tipo;
  const id = parseInt(req.params.id, 10);
  const dados = resultados[tipo];
  if (dados) {
    const item = dados.find(item => item.id === id);
    if (item) {
      const eTag = JSON.stringify(item);
      if (cache[tipo + id] === eTag) {
        res.send(304);
      } else {
        cache[tipo + id] = eTag;
        res.header('ETag', eTag);
        res.send(200, item);
      }
    } else {
      res.send(404);
    }
  } else {
    res.send(404);
  }
  return next();
});

server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
