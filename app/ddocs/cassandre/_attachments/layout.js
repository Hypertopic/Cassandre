function stickToHeader() {
  var h = document.getElementById('header').offsetHeight;
  $('#container>#memo').css({'padding-top': h});
  $('#content').css({'padding-top': h+5});
  $('#top-right').css({'top': h+5});
  if (h > 36) $('#show-leaves').css({'top': h-36});
  $('.mytooltip .preview').css({'top': h});
  $(function () {
    $('#header span').tooltip({ trigger: 'hover', offset: "0, 17" })
    $('.create-leave').tooltip({ trigger: 'hover', offset: "0, 10" })
    $('#footer span').tooltip({ trigger: 'hover', offset: "0, 14" })
    $('#header a').tooltip({ trigger: 'hover', offset: "0, 8" })
    $('a').tooltip({ trigger: 'hover', offset: "0, 11" })
    $('#footer button').tooltip({ trigger: 'hover', offset: "0, 10" })
    $('.editor-toolbar button').tooltip({ trigger: 'hover', offset: "0, 14" })
    $('button').tooltip({ trigger: 'hover', offset: "0, 8" })
  })
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
  if (refresh) {
    if (typeof (this_id) !== 'undefined') self.location = this_id
    if (typeof (anchor) !== 'undefined' && anchor > 0) self.location = this_id+'#'+anchor;
    location.reload()
  }
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
    self.location = '../kwic/'+diary_id+'/' + $('#kwic').val().toLowerCase();
  }
});
$('#kwic').on('keypress', function(key) {
  if (key.which == 13) {
    self.location = '../kwic/'+diary_id+'/' + $('#kwic').val().toLowerCase();
  }
});
$("#reload").on('click', function() {
  refresh = true;
  reload();
});
$("#cancel").on('click', function() {
  refresh = true;
  reload();
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
  self.location = '../diary/'+diary_id;
});

$('#leave-name').on('keypress', function(key) {
  if (['coding','diagram'].indexOf(this_type) < 0 && key.which == 13) {
    var classlist = $(this)[0].nextElementSibling.childNodes[1].nextElementSibling.classList;
    create(classlist[classlist.length - 1], $('#leave-name').val().trim(), $('#kwic').val(), anchor);
  }
});
$('#link_leaf').on('click', function() {
  add_leaf(this_id, leaf_id, $('#kwic').val(), anchor)
});
function add_leaf(grounding, leaf, highlight, anchor) {
  $.ajax({
    url: "../adapt_memo/"+leaf,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
     'action': 'add_grounding',
     'highlight': highlight,
     'anchor': anchor,
     'value': grounding
    })
  }).done(reload)
  .fail(error_alert)
}
$('#existing_memo').on('hidden.bs.modal', function () {
  $('.spinner').addClass('d-none');
})
function create(type, name, highlight, anchor) {
  $('.spinner').removeClass('d-none');
  name = name.replace(/\t/g, ' ').trim();
  name = name.substr(0,1).toUpperCase()+name.substr(1);
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
    let i = -1;
    $.ajax({
      url: '../memo_attribute/'+diary_id+'',
      type: 'GET',
      dataType: 'json',
    }).done(function(existing_memos) {
      if (type == 'diagram') {
        i = -1;
      } else {
        for (let j in existing_memos.rows) {
          if (existing_memos.rows[j].key[4] === name) {
            i = j;
          }
        }
      }
      if (i != -1) {
        if(existing_memos.rows[i].value.groundings.indexOf(this_id) != -1 && highlight.length < 1) {
          $('.spinner').addClass('d-none');
          alert(memo_already_linked);
        } else {
          leaf_type = existing_memos.rows[i].value.type,
          leaf_id = existing_memos.rows[i].value.id;
          if (['diagram','graph','table'].indexOf(leaf_type) > -1 
           || typeof (existing_memos.rows[i].value.initial) !== 'undefined') {
            $('.linkLeaf').addClass('d-none');
            $('#existing_memo').modal('show');
          } else {
            add_leaf(this_id, leaf_id, $('#kwic').val(), anchor)
          }
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
        var destination = '../';
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
            url: '../',
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
  var t = '<div class="toast" role="alert">',
      body = '<div class="toast-body alert-'+type+'">',
      close = '<button type="button" class="ml-auto mr-1 mb-1 close" data-dismiss="toast">&times;</button>', 
      header = '<div class="toast-header bg-'+type+'"><span class="text-light">'
    + '<svg class="bi mr-1 ml-auto" width="20" height="20" fill="currentColor"><use xlink:href="../style/bootstrap-icons.svg#cone-striped"/></svg></span>'
    + '<strong class="mr-auto text-light">Maintenance</strong>'+close+'</div>';
  if (type == 'danger') {
    t += header + body;
  } else {
    t += body + close;
  }
  t += msg +'</div></div>';
  $('#toasts').append(t);
  $('#top-right').append(t);
  $('.toast').toast({autohide: false});
  switch (type) {
    case 'danger':
    case 'warning':
      $('#toasts').prepend($('.toast>.alert-'+type).parent());
      $('.toast>.alert-'+type).parent().toast('show');
    break;
    default:
      setTimeout(() => {
        $('.toast').toast('show');
      }, 30000);
    break;
  }
}

function poller(what, since) {
  $.ajax({
    url: '../changes/'+what+'/'+this_id+'/'+since
  }).done(function(data){
    if (data && data.results.length && refresh == true) {
      reload();
    } else {
      $.ajax({
        url: '../memo_update_seq/'+this_id
      }).done(function(o){
        var memo_seq = JSON.parse(o);
        poller(what, memo_seq.update_seq);
      });
    }
  });
}
var getSatellites = function(logged, toDoAfter){
  $.ajax({
    url:  '../satellites/'+diary_id+'/'+ this_id, 
    type: "GET",
    dataType: "json"
  }).done(function(data){
    for (var c of data.comments) {
      show_comment(c.id, c.user, c.date, c.text, c.checked);
    }
    if (logged.length > 0) {
      if (data.logged_fullname) {
        logged_fullname = data.logged_fullname;
        if (!fullnames[logged]) fullnames[logged] = logged_fullname;
      } else {
        if (!fullnames[logged]) getFullname(logged)
        logged_fullname = fullnames[logged];
      }
      $('#signout').attr('title', sign_out+'<br/>'+logged_fullname);
    }
    if (data.diary_name) {
      $('#diary').attr('title', data.diary_name)
      $('title').prepend(data.diary_name);
    }
    for (var [i, g] of data.groundings.entries()) {
      show_grounding(i, g.id, g.type, g.name, g.href, g.preview);
    }
    for (var l of data.leaves) $('#leaves').append('<li class="d-inline d-sm-block '+l.type+'"><a href="'+l.href+'">'+l.name+'</a></li>')
    var modify_rights_details = "<p><strong>"+editable_by+"</strong><br/>";
    for (var c of data.contributors_fullnames) {
      modify_rights_details += c.fullname+'<br/>';
      if (!fullnames[c.id]) fullnames[c.id] = c.fullname;
    }
    if(data.contributors_fullnames.length == 0) modify_rights_details += everyone;
    modify_rights_details += "</p><p><strong>"+readable_by+"</strong><br/>";
    for (var r of data.readers_fullnames) {
      modify_rights_details += r.fullname+'<br/>';
      if (!fullnames[r.id]) fullnames[r.id] = r.fullname;
    }
    if(data.readers_fullnames.length == 0) modify_rights_details += everyone;
    var t = $('#modify_rights').attr('title') + modify_rights_details+'</p>'
    $('#modify_rights').attr('title', t)
  }).done(function(){
    $('.username').each(function() {
      var f = $(this).attr('class').split(' ').pop()
      if (f.length > 0) {
        if (!fullnames[f]) getFullname(f)
        if (fullnames[f]) $(this).text(fullnames[f]);
      }
    });
    renderPreviews(converter);
    renderComments(converter);
    toDoAfter()
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
function announceMaintenance(before, during){
  $.ajax({
    type: 'GET',
    url: '../config',
    dataType: 'json'
  }).done(function(data){
    var maintenance_start = new Date(data.maintenance.date),
        maintenance_end = new Date(maintenance_start.getTime() + (60000* data.maintenance.duration));
    if (maintenance_start > new Date(Date.now())) {
      inform('danger', before.replace('@duration', data.maintenance.duration).replace('@moment', '<span class="'+data.maintenance.date+' moment"></span>'));
    } else if (maintenance_end > new Date(Date.now())) {
      inform('danger', during+' <span class="'+new Date(maintenance_end).toJSON()+' moment"></span>');
    }
    momentRelative('')
  });
}
function unix_date(d) {
  return Math.floor(new Date(d).getTime() / 1000);
}
function hr_date(d) {
  return new Date(d).toLocaleDateString(locale, {year: 'numeric', month: 'long', day: 'numeric'});
}
function hr_time(t) {
  return new Intl.DateTimeFormat(locale, {year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric"}).format(new Date(t));
}
function momentRelative(what) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  let moments = $(what+' .moment');
  moments.each(function() {
    var jstime = $(this).attr('id');
    var jstime = $(this).attr('class').split(' ');
    jstime = jstime[0];
    var mmtime = new Date(jstime);
    var delta = mmtime.getTime() - new Date(Date.now()).getTime();
    var daydiff = delta / (1000 * 60 * 60 * 24);  
    if(daydiff >= 0 && (delta / (1000 * 60 * 60)) > 1.2) { 
      $(this).text(on_a_date+' '+hr_time(mmtime));
    } else if(daydiff >= 0 && (delta / (1000 * 60 * 60)) <= 1.2) { 
      $(this).text(rtf.format(Math.round(delta / (1000 * 60)), 'minute'));
      $(this).wrap("<strong></strong>");
    } else if(daydiff >= -1) { 
      $(this).text(rtf.format(Math.round(delta / (1000 * 60 * 60)), 'hour'));
    } else if(daydiff >= -3) { 
      $(this).text(rtf.format(Math.round(daydiff), 'day'));
    } else {
      $(this).text(on_a_date+' '+hr_date(mmtime));
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
function getFullname(o) {
  $.ajax({
    url: "../userlist/"+o,
    type: "GET",
    async: false,
    dataType: "json"
  }).done(data => fullnames[data.rows[0].id] = data.rows[0].value.fullname);
}
