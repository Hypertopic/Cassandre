$('#add').on('click', function() {
  var classlist = $(this)[0].classList
  create(classlist[classlist.length - 1], $('#leave-name').val().trim(), '', 0)
})

$('#vis').on('click', function() {
  destroyGraphViz()
  $('#graph').removeClass('d-none')
  var data = {
    nodes: nodes,
    edges: edges
  }
  var options = {
    nodes: {
      color: {
        border: 'black',
        background: 'white',
        highlight:{
          border: 'black',
          background: 'white'
        }
      }
    },
    interaction: {
      navigationButtons: true,
      keyboard: true
    },
    layout: {
      randomSeed: 1,
      improvedLayout: true
    },
    physics: {
      barnesHut: {
        avoidOverlap: 1
      },
      repulsion: {
        nodeDistance: 100
      },
      solver: 'repulsion',
    }
  }
  var network = new vis.Network(container, data, options)
  network.on('click', function (selected) {
    if (typeof selected.nodes[0] === "undefined" && selected.edges[0].length == 32) {
      self.location = "../diagram/"+selected.edges[0]
    } else if (selected.nodes[0].length == 32) {
      self.location = "../memo/"+selected.nodes[0]
    } else {}
  })
  $('#graphviz').removeClass('disabled')
  $('#vis').addClass('disabled')
})

$('#graphviz').on('click', function() {
  drawGraphViz()
  $('#graph').addClass('d-none')
})

$('.dropdown').on('show.bs.dropdown', function () {
  $('#render').tooltip('hide')
})

$('#all-articulations').on('click', function() {
  $('#integrate_all-articulations').removeClass('d-none')
  $('#loading').addClass('hidden')
  $('#select_grounding').addClass('d-none')
})

$('#one-articulation').on('click', function() {
  $('#select_grounding').removeClass('d-none')
  $('#integrate_all-articulations').addClass('d-none')
})

$('#integrate_all-articulations').on('click', function() {
  record('integrate_everything', JSON.stringify(articulations))
})

function drawGraphViz() {
  destroyGraphViz()
  var viz = new Viz(),
      graphviz = 'digraph "'+graph_name+'" {overlap=false; graph [fontname = "helvetica"]; bgcolor="transparent"; node [fontname = "helvetica" style="filled" fillcolor="white"]; edge [fontname = "helvetica", dir=none];'
  for (var n of nodes) {
    graphviz += 'node'+n.id + '[label="' + n.label.replace(/['"]/g, '\'').replace(/\n/g, '\\n') + '", shape='+n.shape+']; '
  }
  for (var e of edges) {
    if (nodes.findIndex(x => x.id === e.to) > -1 && nodes.findIndex(x => x.id === e.from) > -1) {
      var option = ''
      if (e.arrows) switch(e.arrows) {
        case 'to':
          option = ', dir=forward '
        break
        case 'from':
          option = ', dir=back '
        break
      }
      let ecolor = e.color
      if (e.color === 'green') ecolor = 'darkgreen'
      if (e.dashes == null) {
        graphviz += 'node'+e.from + ' -> ' + 'node'+e.to + '[color=' +ecolor+option+ ']; '
      } else {
        graphviz += 'node'+e.from + ' -> ' + 'node'+e.to + '[style=dashed, fontcolor='+ecolor+', color='+ecolor+',label="' +e.label.replace(/['"]/g, '\'').replace(/\n/g, '\\n')+ '"]; '
      }
    }
  }
  graphviz += '}'
  exporting.dot = graphviz
  var options = {
    engine: 'neato',
    format: 'svg'
  }
  viz.renderSVGElement(graphviz, options)
  .then(function(element) {
    main.insertBefore(element, container)
    if($('#content svg').attr('width').slice(0, -2) > 300)
      $('#content svg').removeAttr('width').removeAttr('height')
  })
  .catch(error => {
    viz = new Viz()
     console.error(error)
  })
  .then(function() {
    exporting.svg = $("main>svg").get(0).outerHTML
    $('#graphviz').addClass('disabled')
    $('#vis').removeClass('disabled')
  })
}

function wrap(t) {
  t = t.trim().replace(/&#39;/g, '\'').replace(/&quot;/g, '"')
  return t.substring(0, 12)+t.substring(12, 30).replace(/\s/,"\n")+t.substring(30, 50).replace(/\s/,"\n")
}

function destroyGraphViz() {
  var context = document.getElementById("content"),
      svg = context.getElementsByTagName("svg")
  if (svg.length > 0) main.removeChild(svg[0])
}

function record(action, diagram) {
  $('#'+action+' .modal-body').append($('#loading').removeClass('hidden'))
  if (diagram !== '') diagram = JSON.parse(diagram)
  var data = {
    'action': action,
    'connected_nodes': connected_nodes,
    'diagram': diagram
  }
  $.ajax({
    type: "PUT",
    url: '../adapt_graph/'+this_id,
    contentType: "application/json",
    data: JSON.stringify(data)
  }).done(function () {
    refresh = true
    location.replace(this_id)
  }).fail(error_alert)
}

function download(filename, text) {
  var a = document.createElement('a')
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  a.setAttribute('download', filename)
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
  
$('#exportSVG').on('click', function(e) {
  download(this_id+'.svg', exporting.svg)
})

$('#exportDOT').on('click', function(e) {
  download(this_id+'.dot', exporting.dot)
})
