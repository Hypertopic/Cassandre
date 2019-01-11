function(head, req) {
  // !code lib/mustache.js
  // !code lib/shared.js
  start({"headers":{"Content-Type":"text/html;charset=utf-8"}});
  var ledger = [[[]]];
  var news = [[[]]];
  var number = [];
  var previous = {key: '', value: ''};
  var lastvisited = [[[]]];
  var data = [];

  while (row = getRow()) {
    if (row.key[2] == req.userCtx.name || row.key[2] == null) {
      if (row.key[3]) {
        var row_index = row.key[0];
        var row_diary = row.key[3];
        var n = number.map(function(a){return a.diary}).indexOf(row_diary);
        if (n > -1) {
          if (number[n].memos.indexOf(row_index) < 0)
            number[n].memos.push(row_index);
        } else {
          number.push({
            'diary': row_diary,
            'memos': [row_index]
          });
        }
      }
      if (row.key[0] !== previous.key[0] && previous.key[3] && previous.key[3].length > 0) {
        var diary = previous.key[3];
        if (news[diary] > -1) {news[diary] = news[diary] + 1} else {news[diary] = 1}
      }
      var previous = row;
    }
  }

  news.shift();
  for (i in number) {
    var diary = number[i].diary;
    data.push({
      id: diary,
      news: news[diary],
      size: number[i].memos.length
     });
  }
  return send(toJSON(data));
}
