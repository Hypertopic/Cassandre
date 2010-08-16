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
    if (
      r.value.topic
      && req.query.viewpoint==r.value.viewpoint 
      && (req.query.topic? req.query.topic==r.value.topic : true)
    ) {
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
    } else {
      var p = 0;
      while (
        p<topics.length 
        && segment.startsWith(topics[p].pattern) 
        && r.key[0]==corpus
      ){
        var json = {
          id: r.key[0],
          key: [topics[p].viewpoint, topics[p].topic],
          value: {highlight:{
            id: topics[p++].highlight,
            corpus: r.key[0],
            item: r.id, 
            coordinates: [r.value.begin, r.value.end],
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
