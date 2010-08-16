function(head, req) {
  const url = req.query.resource;
  const resourcePath = url.split("/");
  const last = resourcePath.length-1;
  if (req.headers.Accept.indexOf("application/json",0) > -1) {
    start({"headers":{"Content-Type" : "application/json;charset=utf-8"}});
  } else {
    start({"headers":{"Content-Type" : "text/plain;charset=utf-8"}});
  }
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
