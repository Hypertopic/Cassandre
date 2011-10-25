function(doc, req) {
  if('Accept' in req.headers && req.headers['Accept'].indexOf('json') > 0) {
    return {
        body : JSON.stringify({'service':'Cassandre', 'revision': '2'}),
        headers : { 
          "Content-Type" : "application/json",
        }
    }
  }
  else {
    var html = '<html>';
    html += '<head>';
    html += '<link rel="icon" type="image/png" href="style/favicon.png" />';
    html += '<link rel="stylesheet" type="text/css" href="style/main.css" />';
    html += '<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />';
    html += '</head>';
    html += '<body id="watermark">';
    html += '<div id="container">';
    html += '<div id="content">';
    html += '<div id="center">';
    html += '<h1><a href="text/">Texts Qualitative Analysis</a></h1>';
    html += '</div>';
    html += '</div>';
    html += '<div id="footer"><a href="http://cassandre-qda.sourceforge.net/about.html">Cassandre</a> &nbsp;</div>';
    html += '</div>';
    html += '</body>';
    html += '</html>';
    return {
        body : html,
        headers : { 
          "Content-Type" : "text/html",
        }
    }
  }
}
