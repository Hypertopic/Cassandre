$('.create-leave').on('click', function() {
  var classlist = $(this)[0].classList;
  create(classlist[classlist.length - 1], $('#leave-name').val().trim(), '', 0);
});

$('.articulate').on('click', function() {
  adapt({link: $(this).attr('id')});
});

function edit_statement() {
  refresh = false;
  $("#write_statement").tooltip('hide');
  $(".statement_text").remove();
  $('#statement .meta').text(name_statement+': ');
  $("#add-leaves").addClass('hidden');
  $("#footer .btn").addClass('hidden');
  $("#statement").find('textarea').removeClass('hidden');
  $('#statement_done').removeClass('hidden');
  $('#reload').removeClass('hidden');
  $('html, body').scrollTop($(document).height());
}

$("#write_statement").click(function () {
  edit_statement()
});

function edit_situation() {
  refresh = false;
  $("#add_situation").tooltip('hide');
  $(".situation_text").remove();
  $('#situation .meta').text(name_situation+': ');
  $("#add-leaves").addClass('hidden');
  $("#footer .btn").addClass('hidden');
  $("#situation").find('input').removeClass('hidden');
  $('#situation_done').removeClass('hidden');
  $('#reload').removeClass('hidden');
  $('html, body').scrollTop($(document).height());
}

$("#add_situation").click(function () {
  edit_situation()
});

function edit_negative_case() {
  refresh = false;
  $("#add_negative-case").tooltip('hide');
  $(".negative_text").remove();
  $('#negative-case .meta').text(name_negative_case+': ');
  $("#add-leaves").addClass('hidden');
  $("#footer .btn").addClass('hidden');
  $("#negative-case").find('input').removeClass('hidden');
  $('#negative-case_done').removeClass('hidden');
  $('#reload').removeClass('hidden');
  $('html, body').scrollTop($(document).height());
}

$("#add_negative-case").click(function () {
  edit_negative_case()
});

$(".dropdown-menu").on('show.bs.dropdown', function () {
  $(".dropdown-toggle").tooltip('hide');
});

$("#situation_done").click(function () {
  adapt({situation: $('#situation').find('input').val().trim()});
});

$("#statement_done").click(function () {
  adapt({statement: $('#statement').find('textarea').val().trim()});
});

$("#negative-case_done").click(function () {
  adapt({negative: $('#negative-case').find('input').val().trim()});
});

$('#statement > textarea').on('keypress', function(key) {
  if (key.which == 13) {
    adapt({statement: $('#statement').find('textarea').val().trim()});
  }
});

$("#situation > input").on('keypress', function(key) {
  if (key.which == 13) {
    adapt({situation: $('#situation').find('input').val().trim()});
  }
});

$('#negative-case > input').on('keypress', function(key) {
  if (key.which == 13) {
    adapt({negative: $('#negative-case').find('input').val().trim()});
  }
});

function adapt(o) {
  refresh = true;
  var gid = [];
  for (var i = 0; i < $('#groundings>li').length; i++) {
    gid.push($('#groundings>li')[i].id);
  }
  $("#dialog").dialog('close');
  var data = {
    'action': o,
    'gid': gid,
    'name': $('#'+gid[0]).find('a').html().trim()
  };
  if (Object.keys(o)[0] == 'grounding') {
    var second = {
      id: o.grounding,
      text: $('#'+o.grounding).text()
    }
  } else if (typeof(gid[1]) !== 'undefined') {
    var second = {
      id: gid[1],
      text: $('#'+gid[1]+' > a').html().trim()
    }
  }
  if (gid[0].localeCompare(second.id) < 0) {
    data.name += ' & '+second.text;
  } else {
    data.name = second.text+' & '+ data.name;
  }
  $.ajax({
    url: '../adapt_diagram/'+this_id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(data)
  }).done(reload)
  .fail(error_alert)
}

function draw_diagram(content1, content2, link, situation, negative_case) {
  var shape1 = shape2 = articulated = negative = negative_color = connection_color = '';
  switch (link) {
    case 'pp':
    case 'ipp':
      shape1 = '<rect x="15" y="1" width="170" height="294" stroke="black" fill="transparent" stroke-width="2"/>';
      shape2 = '<rect x="319" y="1" width="170" height="294" stroke="black" fill="transparent" stroke-width="2"/>';
      content1 = '<foreignObject x="15" y="3" width="170" height="290">'
        +  '<div style="text-align: center; padding-top: 15px">1</div>'
        +  '<div style="display: table; height: 215px; overflow: hidden;  margin: 0 auto">'
        +    '<p xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; vertical-align: middle; text-align: center;">'
        +      content1
        +    '</p></div>'
        +    '<div style="text-align: center;">0</div>'
        +'</foreignObject>'
      content2 = '<foreignObject x="319" y="3" width="170" height="290">'
        +  '<div style="text-align: center; padding-top: 15px">1</div>'
        +  '<div style="display: table; height: 215px; overflow: hidden;  margin: 0 auto">'
        +    '<p xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; vertical-align: middle; text-align: center;">'
        +      content2
        +    '</p></div>'
        +  '<div class="molarity" style="text-align: center;">0</div>'
        +'</foreignObject>';
    break;
    case 'dd':
      shape1 = '<polygon points="5,1 235,1 235,294" fill="transparent" style="stroke:black;stroke-width:2" />';
      shape2 = '<polygon points="259,1 494,1 259,294" fill="transparent" style="stroke:black;stroke-width:2" />';
      content1 = '<foreignObject x="50" y="13" width="170" height="185">'
        +  '<div style="display: table; height: 185px; overflow: hidden;  margin: 0 auto">'
        +    '<p xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; vertical-align: top; text-align: right;">'
        +      content1
        +    '</p></div>'
        +'</foreignObject>'
      content2 = '<foreignObject x="274" y="13" width="170" height="185">'
        +  '<div style="display: table; height: 185px; overflow: hidden;  margin: 0 auto">'
        +    '<p xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; vertical-align: top; text-align: left;">'
        +      content2
        +    '</p></div>'
        +'</foreignObject>';
    break;
    case 'idd':
      shape1 = '<polygon points="15,1 489,1 15,274" fill="transparent" style="stroke:black;stroke-width:2" />'
      shape2 = '<polygon points="489,21 489,294 15,294" fill="transparent" style="stroke:black;stroke-width:2" />'
      content1 = ''
        +'<foreignObject x="30" y="13" width="250" height="185">'
        +  '<div style="display: table; height: 185px; overflow: hidden;  margin: 0 auto">'
        +    '<p xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; vertical-align: top; text-align: left;">'
        +      content1
        +    '</p></div>'
        +'</foreignObject>'
      content2 = ''
        +'<foreignObject x="224" y="100" width="250" height="185">'
        +  '<div style="display: table; height: 185px; overflow: hidden;  margin: 0 auto">'
        +    '<p xmlns="http://www.w3.org/1999/xhtml" style="display: table-cell; vertical-align: bottom; text-align: right;">'
        +      content2
        +    '</p></div>'
        +'</foreignObject>';
    break;
  }
  if (link == 'pp') {
    articulated = '<path id="basic_connection" d="M170 30 H 330" stroke="green" stroke-width="2"/>'
      +'<path d="M170 270 H 330" stroke="green" stroke-width="2"/>';
    negative = '<path stroke-dasharray="10,10" d="M170 30 330 270" stroke="red" stroke-width="2"/>'
    +'<path id="negative-case_situation" stroke-dasharray="10,10" d="M170 270 330 30" stroke="red" stroke-width="2"/>';
    connection_color = 'green';
    negative_color = 'red';
  }
  if (link == 'ipp') {
    articulated = '<path id="basic_connection" d="M170 30 330 270" stroke="red" stroke-width="2"/>'
      +'<path d="M170 270 330 30" stroke="red" stroke-width="2"/>';
    negative = '<path id="negative-case_situation" stroke-dasharray="10,10"  d="M170 30 H 330" stroke="green" stroke-width="2"/>'
      +'<path stroke-dasharray="10,10" d="M170 270 H 330" stroke="green" stroke-width="2"/>';
    connection_color = 'red';
    negative_color = 'green';
  }
  if (negative_case) {
    articulated += negative
    +'<text fill="'+negative_color+'"><textPath href="#negative-case_situation" startOffset="50%" text-anchor="middle">'+negative_case+'</textPath></text>';
  }
  if (situation) {
    articulated += '<text fill="'+connection_color+'"><textPath href="#basic_connection" startOffset="50%" text-anchor="middle">'+situation+'</textPath></text>';
  }
  if ($('#groundings>li').length == 1) shape2 = content2 = '';
  $('#diagram').html(shape1+content1+shape2+content2+articulated);
}


