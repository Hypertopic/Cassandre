function (doc, req) {
  var properties = doc.name.split('&');
  var obj = JSON.parse(req.body);
  if (doc.groundings[0] === obj.id) {
    doc.name = obj.name+' & '+ properties[1].trim();
  } else {
    doc.name = properties[0].trim() +' & '+obj.name;
  }
  return [doc, 'Diagram renamed']
}
