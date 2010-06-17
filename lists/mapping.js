function(head, req) {

  String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
  }

  send('{"rows":[\n');
  var corpus;
  var topics = [{pattern:"a wannabe pattern"}];
  var first = true;
  while (r = getRow()) {
    var segment = r.key[1].toLowerCase();
    if (r.value.notion) {
      var t = {
          id: r.id,
          pattern: segment,
          viewpoint: r.value.viewpoint,
          notion: r.value.notion
      };
      if (segment.startsWith(topics[0].pattern)  && r.key[0]==corpus) {
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
        var key = [r.key[0], r.id, r.value.begin, r.value.end];
        var json = { 
          id: topics[p].id,
          key: key, 
          value: {
            viewpoint: topics[p].viewpoint,
            topic: topics[p++].notion, 
            text: r.value.before + r.key[1]
          }
        };
        if (first) {
          first = false;
        } else {
          send(',\n');
        }
        send(JSON.stringify(json));
        var resource  = '../text/';
        resource += r.id;
        resource += '#';
        resource += r.value.begin;
        resource += '-';
        resource += r.value.end;
        json = {key: key, value: {resource: resource}};
        send(',\n');
        send(JSON.stringify(json));
        if (r.value.author) {
          json = {key: key, value: {speaker: r.value.author}};
          send(',\n');
          send(JSON.stringify(json));
        }
      }
    }
  }  
  send(']}\n');
}
