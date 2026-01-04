function (doc, req) {
  var body = JSON.parse(req.body),
      action = body.action,
      connected_nodes = body.connected_nodes,
      diagram = body.diagram
  switch(action) {
    case ('add_grounding'):
      integrate(diagram)
    break
    case ('integrate_everything'):
      for (var i = 0; i < diagram.length; i++) {
        integrate(diagram[i])
      }
    break
    case ('remove_grounding'):
      var i = doc.groundings.indexOf(diagram.id)
      if (i > -1) doc.groundings.splice(i, 1)
    break
    case ('clean_nodes'):
      doc.nodes = doc.nodes.filter(function(a) { if (connected_nodes.indexOf(a.id) > -1) return a;})
      keep_trace = false
    break
  }
  return [doc, 'Graph updated']

  function integrate(diagram) {
      var nodeids = doc.nodes.map(function(a) {return a.id;})
      if (doc.groundings.indexOf(diagram.id) == -1) doc.groundings.push(diagram.id)
      switch (diagram.link) {
        case ('pp'):
        case ('ipp'):
          if(nodeids.indexOf(diagram.groundings[0]) == -1) doc.nodes.push({id: diagram.groundings[0], shape: 'box'})
          if(nodeids.indexOf(diagram.groundings[1]) == -1) doc.nodes.push({id: diagram.groundings[1], shape: 'box'})
          break
        case ('dd'):
        case ('idd'):
          if(nodeids.indexOf(diagram.groundings[0]) == -1) doc.nodes.push({id: diagram.groundings[0], shape: 'diamond'})
          if(nodeids.indexOf(diagram.groundings[1]) == -1) doc.nodes.push({id: diagram.groundings[1], shape: 'diamond'})
          break
        case ('dp'):
          if(nodeids.indexOf(diagram.groundings[0]) == -1) doc.nodes.push({id: diagram.groundings[0], shape: 'box'})
          if(nodeids.indexOf(diagram.groundings[1]) == -1) doc.nodes.push({id: diagram.groundings[1], shape: 'diamond'})
          break
      }
  }
}
