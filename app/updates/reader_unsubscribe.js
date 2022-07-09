function (doc, req) {
  if (doc.readers) {
    switch (doc.readers.length) {
      case 0:
      break;
      case 1:
        if (doc.readers[0] == req.userCtx.name) {
          if (doc.contributors[0] !== 'undefined') {
            doc.readers = [doc.contributors[0]];
          } else if (typeof doc.history[0].user !== 'undefined' && doc.history[0].user !== req.userCtx.name){
            doc.readers = [doc.history[0].user];
          }
        }
      break;
      default:
        doc.readers.splice(doc.readers.indexOf(req.userCtx.name), 1);
      break;
    }
  }
  return [doc, 'User removed']
}
