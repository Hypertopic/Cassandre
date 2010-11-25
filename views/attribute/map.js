function(o) {
  if (o.name) {
    for (key in o) {
        value = o[key];
        if (key != 'speeches' && key != '_id' && key != '_rev' ) { 
	emit([o.corpus,key], null);
	}
    }
  }
}


