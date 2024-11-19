function highlight(p) {
  $('.post').children().eq(p-1).addClass('highlight');
  var prev = document.querySelector(".highlight").previousSibling;
  if (p == '0' || p == '1') {
    prev = document.getElementById('name')
  } else if (this_type != 'interview') prev = prev.previousSibling;
  prev.scrollIntoView({ behavior: 'smooth', block: 'center'});
  $('.highlight').addClass('fadeout');
}

$('#edit').on('click', function() {
  refresh = false;
  if (this_type == 'transcript') {
    self.location = '../editable_text/' + this_id;
  } else {
    $.ajax({
      url: "../start_editing_memo/" + this_id,
      type: "PUT",
      contentType: "application/json"
    }).done(function(){
      self.location = '../editable_memo/' + this_id;
    });
  }
});

$('#add').on('click', function() {
  var classlist = $(this)[0].classList,
      ground = this_id,
      type = classlist[classlist.length - 1];
  if (['field', 'interview'].indexOf(type) > -1) {
    $("#field-leaf").prop("checked", true).trigger("click");
    $('#field_title_dialog').modal('show');
  } else {
    create(type, $('#leave-name').val().trim(), $('#kwic').val(), anchor);
  }
});

$('#leave-name').on('keypress', function(key) {
  if (['interview', 'field', 'transcript'].indexOf(this_type) > -1) {
    $('#leave-name').autocomplete({
      minLength: 3,
      appendTo: '#add-leaves',
      open: function(event, ui) {
        $('ul.ui-autocomplete').prepend('<li><div class="pl-1 header">'+reuse+'</div></li>');
        var p = $(event.target).autocomplete("widget").height();
        $(event.target).autocomplete("widget").css('top', '-'+p+'px');
      },
      source: function(request, response) {
        $.getJSON('../codes/'+diary_id+'/'+request.term, function (data) {
          response($.map(data.rows, function (value, key) {
            if([this_id,diary_id].indexOf(value.id) < 0) return {
              key: value.id,
              title: value.value.name,
              value: value.value.name
            };
          }));
        });
      },
      select: function (event, ui) {
        create($('#add').attr('class').split(' ').pop(), ui.item.value, $('#kwic').val(), anchor);
      }
    });
  }
});

$('#revert').on('click', function() {
  self.location = '../revert/' + this_id;
});

$('#content').on('mouseup', function() {
  if (window.getSelection().anchorNode !== null) {
    var posts = document.getElementsByClassName('post'),
        selected = window.getSelection().anchorNode.parentNode,
        p = 1 + ([].indexOf.call(posts[0].childNodes, selected))/2;
    if (this_type == 'interview') p = [].indexOf.call(posts[0].childNodes, selected.parentNode);
    if (p > -1 && Number.isInteger(p)) anchor = p;
    if ($("#add").length > 0 && ['interview', 'field'].indexOf(this_type) > -1 && document.getSelection().toString().length > 0) {
      $('.post').children().eq(p-1)
        .removeClass('highlight fadeout')
        .addClass('coding-candidate');
    }
  }
});

$('#content').on('mousedown', function() {
  $('.coding-candidate').removeClass('coding-candidate');
});

$('#create').on('click', function() {
  var name = $('#leave-name').val().trim(),
      classlist = $(this)[0].classList,
      highlight = $('#kwic').val(),
      type = classlist[classlist.length - 1];
  if (type == 'diagram') name = $('#name').val().trim(); 
  if (type == 'interview') {
    $("#transcript-leaf").prop("checked", true).trigger("click");
    $('#field_title_dialog').modal('show');
  } else {
    create(type, name, highlight, anchor);
  }
});

$('#create_field-memo').on('click', function() {
  $('#create_field-memo').append($('<span>', {
    class: 'spinner-border spinner-border-sm ml-1',
    role: 'status'
  }));
  var name = $('#location').val().trim() + ', ' + $('#date').val().trim(),
      highlight = $('#kwic').val(),
      type = $('input[name="type-of-field-memo"]:checked').val();
  if (type != 'field') name = $('#pseudonym').val().trim() + ', ' + name;
  if ([$('#location').val().trim(), $('#date').val().trim()].indexOf('') > -1) {
    alert(enter_location_date);
  } else {
    create(type, name, highlight);
  }
});

$('#field-leaf').on('click', function() {
  $('.pseudonym').addClass('d-none');
  $('#create_field-memo').html(help['field']['create']);
  $('#location').attr("placeHolder", help['field']['location']);
  $('#date').attr("placeHolder", help['field']['date']);
});

$('#transcript-leaf').on('click', function() {
  $('.pseudonym').removeClass('d-none');
  $('#create_field-memo').html(help['transcript']['create']);
  $('#location').attr("placeHolder", help['transcript']['location']);
  $('#date').attr("placeHolder", help['transcript']['date']);
});

$('#create-table').on('click', function() {
  var classlist = $(this)[0].classList;
      type = classlist[classlist.length - 1];
  create(type, $('#leave-name').val().trim(), $('#kwic').val());
});

function filter(type) {
  $('#select_grounding option').each(function() {
    $(this).prop("hidden", false);
    if (!$(this).hasClass(type)) $(this).prop("hidden", true);
  });
}

function record(action, value) {
  $('#'+action+' .modal-body').append($('#loading').removeClass('hidden'));
  $.ajax({
    url: "../adapt_memo/" + this_id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
     'action': action,
     'value': value
    })
  }).done(reload)
  .fail(error_alert)
}

function toColor(metrics) {
  var grayLevel = Math.floor(255*(1-metrics)).toString(16);
  return '#' + grayLevel + grayLevel + grayLevel;
}

$('#clear_highlights').on('click', function() {
  $('font').each(function() {
    $(this).removeAttr('color');
  });
});

$('.highlight_words').on('click', function() {
  var type = this.id;
  $('font').each(function() {
    $(this).attr('color', toColor(wordMetrics(metrics, $.trim($(this).text()), type)));
  });
});

$('#repeated').on('click', function() {
  var words = [];
  $('font').each(function(i) {
    words[i] = {text: $.trim($(this).text()).toLowerCase()};
  });
  words[0].count = 0;
  words[1].count = 0;
  var max = 0;
  for (w=0; w<words.length-2; w++) {
    var nb = trigrams[[words[w].text, words[w+1].text, words[w+2].text]];
    if (!nb) nb = 1;
    words[w].count = Math.max(words[w].count, nb);
    words[w+1].count = Math.max(words[w+1].count, nb);
    words[w+2].count = nb;
    max = Math.max(max, words[w].count);
  }
  $('font').each(function(i) {
    $(this).attr('color', toColor(words[i].count/max));
  });
});

function wordMetrics(metrics, word, type) {
  var w = metrics[word.toLowerCase()];
  return (w)?w[type]:.05;
}

function codeToGraph(c) {
  let par = c.parentElement,
      dot = c.innerText,
      first = dot.split(' ')[0]
  dot = dot.replace(/{/, '{overlap = false; splines = true; node [fontname="Helvetica,Arial,sans-serif"]; ')
  if( first === 'graph') dot = dot.replace(/{/, '{layout = neato ')
  if (['graph', 'digraph'].indexOf(first) > -1) {
    d3.select(par).append('div').graphviz().renderDot(dot)
    d3.select(c).style('display', 'none')
  }
}
