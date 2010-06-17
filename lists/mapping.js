function(head, req) {

  String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
  }

  send('{rows:[\n');
  var corpus;
  var topics = [{pattern:"a wannabe pattern"}];
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
        send(JSON.stringify(json));
        send(',\n');
        var resource  = '../../_show/text/';
        resource += r.id;
        resource += '#';
        resource += r.value.begin;
        resource += '-';
        resource += r.value.end;
        json = {key: key, value: {resource: resource}};
        send(JSON.stringify(json));
        send(',\n');
        if (r.value.author) {
          json = {key: key, value: {speaker: r.value.author}};
          send(JSON.stringify(json));
          send(',\n');
        }
      }
    }
  }  
  send(']}\n');
}
