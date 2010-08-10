function(head, req) {
  const url = req.query.resource;
  const resourcePath = url.split("/");
  const last = resourcePath.length-1;
  send('{"rows":[\n');
  if (resourcePath[last-1]=="text") {
    const id = resourcePath[last];
    var found = false;
    while (!found && (r=getRow())) {
      found = (r.value.item==id);
    }  
    if (found) {
      send("{\"key\":[\"");
      send(url);
      send("\"], \"value\":{\"corpus\":\"");
      send(r.value.corpus);
      send("\", \"item\":\"");
      send(id);
      send("\"}}\n");
    }
  }
  send(']}');
}
