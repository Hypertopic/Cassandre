function(head, req) {

  String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
  }

  if (req.headers.Accept.indexOf("application/json",0) > -1) {
    start({"headers":{"Content-Type" : "application/json;charset=utf-8"}});
  } else {
    start({"headers":{"Content-Type" : "text/plain;charset=utf-8"}});
  }
  send('{"rows":[\n');
  var corpus;
  var topics = [{pattern:"a wannabe pattern"}];
  var first = true;
  while (r = getRow()) {
    var segment = r.key[1].toLowerCase();
    if (r.value.topic) {
      var t = {
          id: r.id,
          pattern: segment,
          highlight: r.value.highlight,
          viewpoint: r.value.viewpoint,
          topic: r.value.topic
      };
      if (segment.startsWith(topics[0].pattern) && r.key[0]==corpus) {
        topics.push(t);
      } else {
	corpus = r.key[0]; 
	topics = [t];
      }
    } else if (!req.query.item || req.query.item==r.id) {
      var p = 0;
      while (
        p<topics.length 
        && segment.startsWith(topics[p].pattern) 
        && r.key[0]==corpus
      ){
        var key = [r.key[0], r.id, r.value.begin, r.value.end];
        var json = { 
          id: topics[p].id,
          key: key, 
          value: {highlight:{
            id: topics[p].highlight,
            viewpoint: topics[p].viewpoint,
            topic: topics[p++].topic, 
            text: r.value.before + r.key[1],
            actor: r.value.actor
          }}
        };
        if (first) {
          first = false;
        } else {
          send(',\n');
        }
        send(JSON.stringify(json));
      }
    }
  }  
  send('\n]}');
}
