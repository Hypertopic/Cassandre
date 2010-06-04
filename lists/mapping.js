function(head, req) {

  String.prototype.startsWith = function(prefix) {
      return this.indexOf(prefix) === 0;
  }

  send('[\n');
  var corpus;
  var pattern = "a wannabe pattern";
  while (r = getRow()) {
    if (r.value.broader) {
      corpus = r.key[0]; 
      pattern = r.key[1];
    } else if (r.key[1].startsWith(pattern) && r.key[0]==corpus) {
      var key = [r.key[0], r.id, r.value.begin, r.value.end];
      var json = { key: key, value: {
        topic: pattern, 
        text: r.value.before + r.key[1]
      }};
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
  send(']\n');
}
