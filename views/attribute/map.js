function(o) {

  function isReserved(key) {
    return key.charAt(0)=='_'
      || key=='name'
      || key=='corpus'
      || key=='speeches';
  }

  if (o.corpus) {
    for (key in o) {
      if (!isReserved(key)) {
        emit([o.corpus, key, o[key]], {item:{id:o._id, name:o.name}});
      }
    }
  }

}
