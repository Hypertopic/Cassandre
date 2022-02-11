function stickToHeader() {
  var h = document.getElementById('header').offsetHeight;
  $('#container>#memo').css({'padding-top': h});
  $('#container>#content>h1').css({'padding-top': h+5});
  $('#container>#content #name').css({'margin-top': h+5});
  $('#top-right').css({'top': h+5});
  if (h > 36) $('#show-leaves').css({'top': h-36});
  $('.mytooltip .preview').css({'top': h});
}
$(window).resize(function() {
  stickToHeader();
});
$('#navbarSupportedContent').on('hidden.bs.collapse', function () {
  stickToHeader();
});
$('#navbarSupportedContent').on('shown.bs.collapse', function () {
  stickToHeader();
});
var reload = function() {
  if (typeof (this_id) !== 'undefined') self.location = this_id;
  if (typeof (anchor) !== 'undefined' && anchor > 0) self.location += '#'+anchor;
  if (refresh) location.reload();
};
var error_alert = function(qhr) {
  alert(
    (JSON.parse(qhr.responseText).reason || qhr.responseText)
    + "\nCode " + qhr.status
  );
}
String.prototype.trimLeft = String.prototype.trimLeft || function() {
  return this.replace(/^\s+/,'');
};
$('#content').on('mouseup', function() {
  $('#kwic').val(
    document.getSelection().toString().trimLeft()
  );
});
$('.search').on('click', function() {
  if ($('#kwic').val().length > 0) {
    self.location = relpath+'kwic/'+diary_id+'/' + $('#kwic').val().toLowerCase();
  }
});
$('#kwic').on('keypress', function(key) {
  if (key.which == 13) {
    self.location = relpath+'kwic/'+diary_id+'/' + $('#kwic').val().toLowerCase();
  }
});
  
$('.groundings')
  .on('hidden.bs.collapse', function() {
    $('#toggle-groundings').removeClass('d-none');
    stickToHeader();
  })
  .on('shown.bs.collapse', function() {
    $('#toggle-groundings').addClass('d-none');
    stickToHeader();
});
$('#show-leaves').click(function () {
  $('#leaves').removeClass('invisible d-lg-none');
  $('#leaves').addClass('d-sm-block d-md-block d-lg-block');
  $('#show-leaves').removeClass('d-sm-block d-lg-block');
  $('#show-leaves').addClass('d-xl-none');
});
$('#leaves > .close').on('click', function() {
  $('#leaves').addClass('invisible d-lg-none');
  $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block');
  $('#show-leaves').addClass('d-sm-block d-lg-block');
  $('#show-leaves').removeClass('d-xl-none');
});
$('#groundings').find('.toggle').click(function(){
  $(this).next().slideToggle('fast');
  $('.preview').not($(this).next()).slideUp('fast');
});
$('#diary').on('click', function() {
  self.location = relpath+'memo/'+diary_id+'/';
});

$('#leave-name').on('keypress', function(key) {
  if (['coding','diagram'].indexOf(this_type) < 0 && key.which == 13) {
    var classlist = $(this)[0].nextElementSibling.childNodes[1].nextElementSibling.classList;
    create(classlist[classlist.length - 1], $('#leave-name').val().trim(), $('#kwic').val(), anchor);
  }
});
$('#link_leaf').on('click', function() {
  $.ajax({
    url: "../../adapt_memo/"+leaf_id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
     'action': 'add_grounding',
     'highlight': $('#kwic').val(),
     'anchor': anchor,
     'value': this_id
    })
  }).done(reload)
  .fail(error_alert)
});
function create(type, name, highlight, anchor) {
  $('.spinner').removeClass('d-none');
  name = name.replace(/\t/g, ' ');
  if (name.replace(/[ ,]/g, '') == '' && type != 'diagram') {
    $('.spinner').addClass('d-none');
    switch (type) {
      case 'transcript':
      case 'field':
        alert(enter_location_date);
      break;
      case 'graph':
        alert(enter_graph_name);
      break;
      default:
        alert(enter_memo_name);
      break;
    }
  } else {
    let i = 0;
    $.ajax({
      url: relpath+'memo_attribute/'+diary_id+'',
      type: 'GET',
      dataType: 'json',
    }).done(function(existing_memos) {
      if (type == 'diagram') {
        i = -1;
      } else {
        i = existing_memos.rows.map(function(e) { return e.value.name; }).indexOf(name);
      }
      if (i != -1) {
        if(existing_memos.rows[i].value.groundings.indexOf(this_id) != -1 && highlight.length < 1) {
          $('.spinner').addClass('d-none');
          alert(memo_already_linked);
        } else {
          leaf_type = existing_memos.rows[i].value.type,
          leaf_id = existing_memos.rows[i].value.id;
          if (['diagram','graph','table'].indexOf(leaf_type) > -1) $('.linkLeaf').addClass('d-none');
          $('#existing_memo').modal('show');
        }
      } else {
        if (anchor > 0) ground = [{'_id': this_id, 'preview':[{'text': highlight, 'anchor': anchor}]}];
        var data = {
          groundings: ground,
          history: [{
            'user': user,
            'date': new Date().toJSON(),
            'name': name
          }],
          name: name
        };
        if (contributors.length > 0) {
          data.contributors = contributors.split(',');
        } else if (user) {
          data.contributors = [user];
        }
        if (readers.length > 0) {
          data.readers = readers.split(',');
        }
        var destination = relpath;
        switch (type) {
          case 'transcript':
            destination += 'editable_text/';
            data.corpus = diary_id,
            data.speeches = [{actor:'',text:''}];
          break;
          case 'table':
            destination += 'table/'+diary_id+'/';
            var obj = {};
            obj[this_id] = '...';
            data.cells = [{'...':[obj]}];
            data.diary = diary_id;
            data.type = type;
          break;
          case 'diagram':
            destination += 'diagram/'+diary_id+'/';
            data.diary = diary_id;
            data.name = name;
            data.link = 'pp';
            data.type = type;
          break;
          case 'graph':
            destination += 'graph/'+diary_id+'/';
            data.diary = diary_id;
            data.type = type;
            var nodes = [];
            var from = $('#groundings').children('li').first().attr('id');
            var to = $('#groundings').children('li').last().attr('id');
            switch (link) {
              case ('pp'):
              case ('ipp'):
                nodes.push({id: from, shape: 'box'});
                nodes.push({id: to, shape: 'box'});
                break;
              case ('dd'):
              case ('idd'):
                nodes.push({id: from, shape: 'diamond'});
                nodes.push({id: to, shape: 'diamond'});
                break;
              case ('dp'):
                nodes.push({id: from, shape: 'box'});
                nodes.push({id: to, shape: 'diamond'});
                break;
            }
            data.nodes = nodes;
          break;
          default:
            destination += 'editable_memo/';
            data.diary = diary_id,
            data.body = '';
            data.editing = {
              'user': user,
              'date': new Date().toJSON()
            };
            if (type == 'coding' && highlight.length > 0) {
              if (anchor > 0) highlight = '['+highlight+']('+this_id+'#'+anchor+')';
              data.body += '> '+highlight+"\n \n";
            }
            data.type = type;
        }
        if (type) {
          $.ajax({
            url: relpath,
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
              self.location = destination+data.id;
            }
          });
        }
      }
    });
  }
}
function inform(type, msg){
  $('#toasts').append('<div class="toast" role="alert">'
    + '<div class="toast-body alert-'+type+'">'
    + '<button type="button" class="close" data-dismiss="toast">×</button>'+ msg +'</div></div>');
  $('.toast').toast({autohide: false});
  $('.toast').toast('show');
}

function poller(what, since) {
  $.ajax({
    url: relpath+'changes/'+what+'/'+this_id+'/'+since
  }).done(function(data){
    if (data.results.length && refresh == true) {
      reload();
    } else {
      $.ajax({
        url: relpath+'memo_update_seq/'+this_id
      }).done(function(o){
        var memo_seq = JSON.parse(o);
        poller(what, memo_seq.update_seq);
      });
    }
  });
}
function renderComments(converter){
  $('.comment_text').html(function(i, text) {
    var md = converter.makeHtml(text.replace(/&gt;/g, '>').trim());
    if (md.substring(0,3) == '<p>') md = md.substring(3);
    if (md.substring(md.length - 4, md.length) == '</p>') md = md.substring(0, md.length - 4);
    md = md.replace(/<blockquote>\s+<p>/g, '<blockquote>');
    md = md.replace(/<\/blockquote>\s+<p>/g, '<\/blockquote>');
    md = md.replace(/<\/ol>\s+<p>/g, '<\/ol>');
    md = md.replace(/<\/ul>\s+<p>/g, '<\/ul>');
    md = md.replace(/<\/p>\s+<\/blockquote>/g, '<\/blockquote>');
    md = md.replace(/<\/?p>/g, '<br/>');
    return md;
  });
};
function renderPreviews(converter){
  $('.preview').html(function(i, text) {
    var md = converter.makeHtml(text.replace(/&gt;/g, '>').trim());
    md = md.replace(/<\/?p>/g, '');
    return md;
  });
};
function momentRelative(what) {
  let now = moment(),
      moments = $(what+' .moment');
  moments.each(function() {
    var jstime = $(this).attr('id');
    var jstime = $(this).attr('class').split(' ');
    jstime = jstime[0];
    var mmtime = moment(jstime);
    if(now.diff(mmtime, 'days') <= 2) {
      $(this).text(mmtime.fromNow());
    } else if(now.diff(mmtime, 'years') < 1) {
      $(this).text(on_a_date+' '+mmtime.format('Do MMMM'));
    } else {
      $(this).text(on_a_date+' '+mmtime.format('Do MMMM YYYY'));
    }
  });
  if (what != '') {
    let items = $(what+' li .moment'),
        n = items.length / 30;
    if (n !== parseInt(n, 10)) $('#next').prop('disabled', true);
    items.each(function() {
      $(this).text($(this).text().replace(/./, function(x) { return x.toUpperCase(); }));
    });
  }
}
