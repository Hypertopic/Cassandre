function(head, req) {
  // !code lib/mustache.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var ledger = [[[]]];
  var news = [[[]]];
  var previous = {key: '', value: ''};
  var lastvisited = [[[]]];
  var data = [];
  while (row = getRow()) {
    if (row.key[2] == req.userCtx.name || row.key[2] == null) {
      if (row.key[0] !== previous.key[0] && previous.key[3] && previous.key[3].length > 0) {
        var diary = previous.key[3];
        if (news[diary] > -1) {news[diary] = news[diary] + 1} else {news[diary] = 1}
      }
      var previous = row;
    }
  }

  news.shift();
  for (i in news) {
    data.push({
      id: i,
      news: news[i]
     });
  }
  return send(toJSON(data));
}
