var app = require('express')(),
  proxy = require('express-http-proxy'),
  logger = require('morgan'),
  url = require('url'),
  http = require('http'),
  async = require('async');

var frontend = 80,
  backend_host = 'couchdb',
  backend_port = 5984,
  backend_path = '/cassandre/_design/cassandre/';

function getJSON(url, callback) {
  http.get({
    host: backend_host,
    port: backend_port,
    path: url,
    headers: {accept:'application/json'}
  }, function(response) {
    var body = '';
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
      callback(JSON.parse(body));
    });
  });
}

app.use(logger('dev'));

function path(module, key, pattern) {
  var encodedPattern = encodeURIComponent(pattern);
  return backend_path + module + '?' + (pattern?
    'startkey=["' + key + '","' + encodedPattern + '"]&endkey=["' + key + '","'+ encodedPattern +'\\ufff0"]'
    :'key="'+key+'"');
}

/**
 * Join corpus keywords with occurrences (which cannot be done with CouchDB MapReduce).
 * Note: The `/item/:corpus/:item` API is currently disabled in Cassandre.
 */
app.get(['/corpus/:corpus', '/item/:corpus/:item'], function(request, response) {
  var corpus = request.params.corpus,
    item = request.params.item,
    key = item || corpus;
  getJSON(path('_view/corpus_pattern', corpus), function(patterns) {
    async.concat(patterns.rows, function(r, callback) {
      getJSON(path('_rewrite/kwic', key, r.value.text), function(occurrences) {
        var data = [];
        for (var k of occurrences) {
          item = item || k.id;
          data.push({
            key: [corpus, item, r.value.highlight + '|' + k.match],
            value: {
              coordinates: [k.begin, k.end],
              topic: {
                viewpoint: r.value.viewpoint,
                id: r.value.topic
              },
              text: JSON.stringify(k.context)
            }
          });
        }
        callback(null, data);
      });
    }, function(err, results) {
      response.json(results);
    });
  });
});

/**
 * URI rewriting to hide CouchDB prefix.
 */
app.use(proxy(backend_host + ':' + backend_port, {
  parseReqBody: false,
  proxyReqPathResolver: (request) => backend_path + '_rewrite' + request.url
}));

/**
 * Error handler
 */
app.use(function(error, request, response, next) {
  var message = error;
  switch (error.code) {
    case 'ECONNREFUSED':
      message = 'CouchDB not found on ' + backend_host + ':' + backend_port + '!';
      break;
  }
  console.error(message);
  response.status(500).send(message);
});

app.listen(frontend, function() {
  console.log('Listening on ' + frontend);
}).on('error', function() {
  console.error('Cannot listen on ' + frontend + '!');
});
