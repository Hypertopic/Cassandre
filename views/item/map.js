function(o) {

  function isReserved(key) {
    switch (key) {
      case "_id":
      case "_rev":
      case "corpus":
      case "speeches":
      case "highlights": return true;
    }
    return false;
  }

  if (o.name && o.corpus) {
    for (var key in o) {
      if (!isReserved(key)) {
        var entry = {};
        entry[key] = o[key];
        emit([o.corpus, o._id], entry);
      }
    }
  }
}
