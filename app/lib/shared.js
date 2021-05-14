const diacritics = [
    {char: 'A', base: /[\300-\306]/g},
    {char: 'a', base: /[\340-\346]/g},
    {char: 'E', base: /[\310-\313]/g},
    {char: 'e', base: /[\350-\353]/g},
    {char: 'I', base: /[\314-\317]/g},
    {char: 'i', base: /[\354-\357]/g},
    {char: 'O', base: /[\322-\330]/g},
    {char: 'o', base: /[\362-\370]/g},
    {char: 'U', base: /[\331-\334]/g},
    {char: 'u', base: /[\371-\374]/g},
    {char: 'N', base: /[\321]/g},
    {char: 'n', base: /[\361]/g},
    {char: 'C', base: /[\307]/g},
    {char: 'c', base: /[\347]/g}
  ];

var shared = {
  relpath: "{{^flat}}../{{/flat}}../",
  links: "<meta charset='utf-8'>\
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>\
    <link rel='icon' type='image/svg' href='{{>relpath}}style/favicon.svg' />\
    <link rel='apple-touch-icon' type='image/png' href='{{>relpath}}style/apple-touch-icon-precomposed.png' />\
    <link rel='stylesheet' href='{{>relpath}}style/bootstrap.min.css' />\
    <link rel='stylesheet' type='text/css' href='{{>relpath}}style/main.css' />",
  diagramcss: "<link rel='stylesheet' type='text/css' href='{{>relpath}}style/diagram.css' />",
  viscss: "<link rel='stylesheet' type='text/css' href='{{>relpath}}style/vis.min.css' />",
  log: "\
    <ul class='navbar-nav'><li class='form-inline justify-content-between'>\
      {{#diary}}\
      <div class='input-group input-group-sm pl-1'>\
        <input id='kwic' type='search' class='form-control' placeholder='{{i18n.i_search}}' />\
        <div class='input-group-append'>\
          <span class='input-group-text kwic search'>?</span>\
        </div>\
      </div>\
      {{/diary}}\
    <div id='logged' class='order-3 justify-content-end pl-1'>\
      {{^logged}}\
      <form id='signin' class='form-inline'>\
        <div class='input-group input-group-sm'>\
          <div class='input-group-prepend'>\
            <span class='input-group-text'><img src='{{>relpath}}style/person.svg' alt='' /></span>\
          </div>\
          <input class='form-control' type='text' autocapitalize='none' name='name' placeholder='{{i18n.i_username}}'/>\
        </div>\
        <div class='input-group input-group-sm'>\
          <div class='input-group-prepend'>\
            <span class='input-group-text'><img src='{{>relpath}}style/lock.svg' alt='' /></span>\
          </div>\
          <input class='form-control' type='password' name='password' placeholder='{{i18n.i_password}}'/>\
        </div>\
        <button class='btn navbar-btn' title='{{i18n.i_sign-in}}' type='submit'>\
          <img class='d-block d-sm-none' src='{{>relpath}}style/sign-in.svg' alt='{{i18n.i_sign-in}}'>\
          <span class='d-none d-sm-block text-{{>contrastcolor}}'>{{i18n.i_sign-in}}</span>\
        </button>\
      </form>\
      {{/logged}}\
      {{#logged}}\
      <span id='username' class='navbar-text ml-2'>\
        {{#logged_fullname}}{{logged_fullname}}{{/logged_fullname}}\
        {{^logged_fullname}}{{logged}}{{/logged_fullname}}\
      </span>\
      <button class='btn navbar-btn' title='{{i18n.i_sign-out}}' id='signout'>\
        <span class='d-none d-sm-block text-{{>contrastcolor}}'>{{i18n.i_sign-out}}</span>\
        <img class='d-block d-sm-none' src='{{>relpath}}style/sign-out.svg' alt='{{i18n.i_sign-out}}'>\
      </button>\
      {{/logged}}\
    </div></li></ul>",
  menucolor:"dark",
  contrastcolor:"light",
  navbarstyle:"navbar navbar-{{>menucolor}} bg-{{>menucolor}} text-{{>contrastcolor}}",
  readrights:"\
    <p id='authorization'>\
      {{i18n.i_readable-by}} <span class='readers'>{{readers_fullnames}}</span>\
    </p>",
  rights:"\
    <div id='authorization'>\
      {{i18n.i_created-by}} {{creator}} <span class='moment'>{{date}}</span><br/>\
      {{i18n.i_editable-by}} <span class='contributors'>{{contributors_fullnames}}</span><br/>\
      {{i18n.i_readable-by}} <span class='readers'>{{readers_fullnames}}</span>\
      {{#logged}}\
      <span id='modify_rights' data-toggle='modal' data-target='#modify_rights_dialog' title='{{i18n.i_modify_rights}}'>\
        <img src='../../style/gear.svg' alt='{{i18n.i_modify_rights}}'>\
      </span>\
      {{/logged}}\
    </div>",
  modify_rights_dialog:"\
    <div id='modify_rights_dialog' class='modal fade' role='dialog'>\
      <div class='modal-dialog' role='document'>\
        <div class='modal-content'>\
          <div class='modal-header'>{{#editable}}{{i18n.i_modify_rights}}{{/editable}}{{^editable}}{{i18n.i_reader_unsubscribe}}{{/editable}}</div>\
          <div class='modal-body'>\
            {{#editable}}\
            <table><tr><th>{{i18n.i_contributors}}</th><th>{{i18n.i_readers}}</th></tr><tr><td>\
              <input id='add_contributor' type='search' placeholder='{{i18n.i_add_contributor}}'/><br/>\
              <p>{{i18n.i_editable-by}}</p>\
              <div class='contributors'>\
              {{#contributors_fullnames}}\
                <p>{{.}}<button class='remove_contributor' value='{{.}}'>x</button></p>\
              {{/contributors_fullnames}}\
              </div>\
            </td><td>\
              <input id='add_reader' type='search' placeholder='{{i18n.i_add_reader}}'/><br/>\
              <p>{{i18n.i_readable-by}}</p>\
              <div class='readers'>\
              {{#readers_fullnames}}\
                <p>{{.}}<button class='remove_reader' value='{{.}}'>x</button></p>\
              {{/readers_fullnames}}\
              </div>\
            </td></tr></table>\
            {{/editable}}\
            {{^editable}}\
            <div class='alert alert-danger' role='alert'>{{i18n.i_irreversible}}</div>\
            {{/editable}}\
          </div>\
          {{^editable}}\
          <div class='modal-footer'>\
            <button type='button' class='btn btn-primary' data-dismiss='modal'>{{i18n.i_cancel}}</button>\
            <button id='unsubscribe' type='button' class='btn btn-secondary linkLeaf'>{{i18n.i_reader_unsubscribe}}</button>\
          </div>\
          {{/editable}}\
        </div>\
      </div>\
    </div>",
  comments:"\
    <div id='comments'>\
      {{#comments}}\
      <div class='comment {{#checked}}checked{{/checked}}' id='{{id}}'>\
        <span class='meta'><span class='user'>{{user}}</span> (<span class='moment'>{{date}}</span>)</span>:\
        {{#logged}}<span class='meta checker d-none d-sm-inline'>{{#checked}}{{i18n.i_checked_by}} {{checked}}{{/checked}}</span><div class='checkbox'><input type='checkbox' class='form-check-input position-static comment_check' {{#checked}}checked{{/checked}}></div>{{/logged}}<br/>\
        <span class='comment_text'>{{text}}</span>\
        <div class='comment_edit hidden'>{{text}}</div>\
      </div>\
      {{/comments}}\
      <textarea rows='5' type='text' class='form-control hidden' autocomplete='off' placeHolder='{{i18n.i_enter_comment}}'></textarea>\
    </div>",
  commentsbtn:"\
    <button class='btn navbar-btn btn-outline-{{>contrastcolor}} btn-sm' id='comment_create' title='{{i18n.i_comment}}'>\
      <span class='d-block d-sm-none'><img src='../../style/comment.svg' alt='{{i18n.i_comment}}'></span>\
      <span class='d-none d-sm-block'>{{i18n.i_comment}}</span>\
    </button>\
    <button class='btn navbar-btn btn-outline-{{>contrastcolor}} btn-sm hidden' type='button' id='commented'>{{i18n.i_save}}</button>\
    <button class='btn navbar-btn btn-outline-{{>contrastcolor}} btn-sm hidden' type='button' id='comment_updated'>{{i18n.i_save}}</button>\
    <button class='btn navbar-btn btn-outline-{{>contrastcolor}} btn-sm hidden' type='button' id='renamed'>{{i18n.i_save}}</button>",
  script: "<script src='{{>relpath}}script/jquery.js'></script>\
    <script src='{{>relpath}}script/jquery-ui.min.js'></script>\
    <script src='{{>relpath}}style/bootstrap.min.js'></script>\
    <script src='{{>relpath}}script/moment.min.js'></script>\
    <script src='{{>relpath}}script/showdown.min.js'></script>\
    <link rel='stylesheet' href='{{>relpath}}style/jquery-ui.min.css' />",
  layoutscript:"function stickToHeader() {\
    var h = document.getElementById('header').offsetHeight;\
    $('#container>#memo').css({'padding-top': h});\
    $('#container>#content>h1').css({'padding-top': h+5});\
    $('#container>#content #name').css({'margin-top': h+5});\
    $('#top-right').css({'top': h+5});\
    if (h > 36) $('#show-leaves').css({'top': h-36});\
    $('.mytooltip .preview').css({'top': h});\
  }\
  $(window).resize(function() {\
    stickToHeader();\
  });\
  $('#navbarSupportedContent').on('hidden.bs.collapse', function () {\
    stickToHeader();\
  });\
  $('#navbarSupportedContent').on('shown.bs.collapse', function () {\
    stickToHeader();\
  });\
  var reload = function() {\
    var here = '{{_id}}';\
    if (anchor > 0) here += '#'+anchor;\
    self.location = here;\
    if (refresh) location.reload();\
  };\
  String.prototype.trimLeft = String.prototype.trimLeft || function() {\
    return this.replace(/^\s+/,'');\
  };\
  $('#content').on('mouseup', function() {\
    $('#kwic').val(\
      document.getSelection().toString().trimLeft()\
    );\
  });\
  $('.search').on('click', function() {\
    if ($('#kwic').val().length > 0) {\
      self.location = '{{>relpath}}kwic/{{diary}}/' + $('#kwic').val().toLowerCase();\
    }\
  });\
  $('#kwic').on('keypress', function(key) {\
    if (key.which == 13) {\
      self.location = '{{>relpath}}kwic/{{diary}}/' + $('#kwic').val().toLowerCase();\
    }\
  });\
  {{^list}}\
  $('.groundings')\
    .on('hidden.bs.collapse', function() {\
      $('#toggle-groundings').removeClass('d-none');\
      stickToHeader();\
  })\
    .on('shown.bs.collapse', function() {\
      $('#toggle-groundings').addClass('d-none');\
      stickToHeader();\
  });\
  $('#show-leaves').click(function () {\
    $('#leaves').removeClass('invisible d-lg-none');\
    $('#leaves').addClass('d-sm-block d-md-block d-lg-block');\
    $('#show-leaves').removeClass('d-sm-block d-lg-block');\
    $('#show-leaves').addClass('d-xl-none');\
  });\
  $('#leaves > .close').on('click', function() {\
    $('#leaves').addClass('invisible d-lg-none');\
    $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block');\
    $('#show-leaves').addClass('d-sm-block d-lg-block');\
    $('#show-leaves').removeClass('d-xl-none');\
  });\
  $('#groundings').find('.toggle').click(function(){\
    $(this).next().slideToggle('fast');\
    $('.preview').not($(this).next()).slideUp('fast');\
  });\
  $('#diary').on('click', function() {\
    self.location = '{{>relpath}}memo/{{diary}}/';\
  });\
  var ground = ['{{_id}}'];\
  {{#statements}}\
  ground = [];\
  {{#groundings}};\
    ground.push('{{id}}');\
  {{/groundings}}\
  {{/statements}}\
  $('#leave-name').on('keypress', function(key) {\
    if (['coding','diagram'].indexOf('{{type}}') < 0 && key.which == 13) {\
      var classlist = $(this)[0].nextElementSibling.childNodes[1].nextElementSibling.classList;\
      create(classlist[classlist.length - 1], $('#leave-name').val().trim(), $('#kwic').val());\
    }\
  });\
  function create(type, name, highlight, anchor) {\
    $('.spinner').removeClass('d-none');\
    name = name.replace(/\t/g, ' ');\
    if (name.replace(/[ ,]/g, '') == '' && type != 'diagram') {\
      $('.spinner').addClass('d-none');\
      switch (type) {\
        case 'transcript':\
        case 'field':\
          alert('{{i18n.i_enter_location_date}}');\
        break;\
        case 'graph':\
          alert('{{i18n.i_enter_graph_name}}');\
        break;\
        default:\
          alert('{{i18n.i_enter_memo_name}}');\
        break;\
      }\
    } else {\
      let i = 0;\
      $.ajax({\
        url: '{{>relpath}}memo_attribute/{{diary}}',\
        type: 'GET',\
        dataType: 'json',\
      }).done(function(existing_memos) {\
        if (type == 'diagram') {\
          i = -1;\
        } else {\
          i = existing_memos.rows.map(function(e) { return e.value.name; }).indexOf(name);\
        }\
        if (i != -1) {\
          if(existing_memos.rows[i].value.groundings.indexOf('{{_id}}') != -1 && highlight.length < 1) {\
            $('.spinner').addClass('d-none');\
            alert('{{i18n.i_memo_already_linked}}');\
          } else {\
            leaf_type = existing_memos.rows[i].value.type,\
            leaf_id = existing_memos.rows[i].value.id;\
            if (['diagram','graph','table'].indexOf(leaf_type) > -1) $('.linkLeaf').addClass('d-none');\
            $('#existing_memo').modal('show');\
          }\
        } else {\
          var data = {\
            groundings: ground,\
            history: [{\
              'user': user,\
              'date': new Date().toJSON(),\
              'name': name\
            }],\
            name: name\
          };\
          var contributors = '{{contributors}}';\
          if (contributors.length > 0) {\
            data.contributors = contributors.split(',');\
          } else if ('{{logged}}') {\
            data.contributors = ['{{logged}}'];\
          }\
          var readers = '{{readers}}';\
          if (readers.length > 0) {\
            data.readers = readers.split(',');\
          }\
          var destination = '{{>relpath}}';\
          switch (type) {\
            case 'transcript':\
              destination += 'editable_text/';\
              data.corpus = '{{diary}}',\
              data.speeches = [{actor:'',text:''}];\
            break;\
            case 'table':\
              destination += 'table/{{diary}}/';\
              data.cells = [{'...':[{'{{_id}}':'...'}]}];\
              data.diary = '{{diary}}';\
              data.type = type;\
            break;\
            case 'diagram':\
              destination += 'diagram/{{diary}}/';\
              data.diary = '{{diary}}';\
              data.name = name;\
              data.link = 'pp';\
              data.type = type;\
            break;\
            {{#link}}\
            case 'graph':\
              destination += 'graph/{{diary}}/';\
              data.diary = '{{diary}}';\
              data.type = type;\
              var nodes = [];\
              var from = $('#groundings').children('li').first().attr('id');\
              var to = $('#groundings').children('li').last().attr('id');\
              switch ('{{link}}') {\
                case ('pp'):\
                case ('ipp'):\
                  nodes.push({id: from, shape: 'box'});\
                  nodes.push({id: to, shape: 'box'});\
                  break;\
                case ('dd'):\
                case ('idd'):\
                  nodes.push({id: from, shape: 'diamond'});\
                  nodes.push({id: to, shape: 'diamond'});\
                  break;\
                case ('dp'):\
                  nodes.push({id: from, shape: 'box'});\
                  nodes.push({id: to, shape: 'diamond'});\
                  break;\
              }\
              data.nodes = nodes;\
            break;\
            {{/link}}\
            default:\
              destination += 'editable_memo/';\
              data.diary = '{{diary}}',\
              data.body = '';\
              data.editing = {\
                'user': user,\
                'date': new Date().toJSON()\
              };\
              if (type == 'coding' && highlight.length > 0) {\
                if (anchor > 0) highlight = '['+highlight+']({{_id}}#'+anchor+')';\
                data.body += '> '+highlight+'\\n \\n';\
              }\
              data.type = type;\
          }\
          if (type) {\
            $.ajax({\
              url: '{{>relpath}}',\
              type: 'POST',\
              dataType: 'json',\
              contentType: 'application/json',\
              data: JSON.stringify(data),\
              success: function(data) {\
                self.location = destination+data.id;\
              }\
            });\
          }\
        }\
      });\
    }\
  }\
  function inform(type, msg){\
    $('#toasts').append('<div class=\"toast\" role=\"alert\">'\
      + '<div class=\"toast-body alert-'+type+'\">'\
      + '<button type=\"button\" class=\"close\" data-dismiss=\"toast\">×</button>'+ msg +'</div></div>');\
    $('.toast').toast({autohide: false});\
    $('.toast').toast('show');\
  }\
  {{/list}}\
  function poller(what, since) {\
    $.ajax({\
      url: '{{>relpath}}changes/'+what+'/{{_id}}/'+since\
    }).done(function(data){\
      if (data.results.length && refresh == true) {\
        reload();\
      } else {\
        $.ajax({\
          url: '{{>relpath}}memo_update_seq/{{_id}}'\
        }).done(function(o){\
          var memo_seq = JSON.parse(o);\
          poller(what, memo_seq.update_seq);\
        });\
      }\
    });\
  }\
  function renderComments(converter){\
    $('.comment_text').html(function(i, text) {\
      var md = converter.makeHtml(text.replace(/&gt;/g, '>').trim());\
      if (md.substring(0,3) == '<p>') md = md.substring(3);\
      if (md.substring(md.length - 4, md.length) == '</p>') md = md.substring(0, md.length - 4);\
      md = md.replace(/<blockquote>\\s+<p>/g, '<blockquote>');\
      md = md.replace(/<\\/blockquote>\\s+<p>/g, '<\\/blockquote>');\
      md = md.replace(/<\\/ol>\\s+<p>/g, '<\\/ol>');\
      md = md.replace(/<\\/ul>\\s+<p>/g, '<\\/ul>');\
      md = md.replace(/<\\/p>\\s+<\\/blockquote>/g, '<\\/blockquote>');\
      md = md.replace(/<\\/?p>/g, '<br/>');\
      return md;\
    });\
  };\
  function renderPreviews(converter){\
    $('.preview').html(function(i, text) {\
      var md = converter.makeHtml(text.replace(/&gt;/g, '>').trim());\
      md = md.replace(/<\\/?p>/g, '');\
      return md;\
    });\
  };\
  {{#list}}\
  $(window).scroll(function(){\
    if ($(window).scrollTop() == $(document).height() - $(window).height()){\
      showMore($('li').last().find('span').attr('id'));\
    }\
  });\
  function momentRelative(what) {\
    let now = moment(),\
        moments = $(what+' .moment');\
    moments.each(function() {\
      var jstime = $(this).attr('id');\
      var jstime = $(this).attr('class').split(' ');\
      jstime = jstime[0];\
      var mmtime = moment(jstime);\
      if(now.diff(mmtime, 'days') <= 2) {\
        $(this).text(mmtime.fromNow());\
      } else if(now.diff(mmtime, 'years') < 1) {\
        $(this).text('{{i18n.i_on-a-date}}'+' '+mmtime.format('Do MMMM'));\
      } else {\
        $(this).text('{{i18n.i_on-a-date}}'+' '+mmtime.format('Do MMMM YYYY'));\
      }\
    });\
    let items = $(what+' li .moment'),\
        n = items.length / 30;\
    if (n !== parseInt(n, 10)) $('#next').prop('disabled', true);\
    items.each(function() {\
      $(this).text($(this).text().replace(/./, function(x) { return x.toUpperCase(); }));\
    });\
  }{{/list}}",
  editname: "\
  $('h1').on('click', function() {\
    refresh = false;\
    $(this).hide();\
    $('#leave-name').addClass('hidden');\
    $('#footer > div > button').prop('disabled', true);\
    $('#add-leaves').addClass('hidden');\
    $('#kwic').parent().children().addClass('hidden');\
    $('a').removeAttr('href');\
    $('#diary').addClass('disabled');\
    $('#signout').prop('disabled', true);\
    $('.toast').toast('hide');\
    $('#modify_rights').remove();\
    $('#renamed').removeClass('hidden');\
    $('#renamed').prop('disabled', false);\
    $('#name').removeClass('hidden');\
  });\
  $('#renamed').on('click', function() {\
    rename();\
  });\
  $('#name').on('keypress', function(key) {\
    if (key.which == 13) rename();\
  });\
  function rename() {\
    if ($('#name').val().trim() == '') {\
      {{^link}}\
        {{^list}}alert('{{i18n.i_enter_memo_name}}');{{/list}}\
        {{#list}}alert('{{i18n.i_enter_diary_name}}');{{/list}}\
      {{/link}}\
      {{#link}}\
        alert('{{i18n.i_enter_graph_name}}');\
      {{/link}}\
    } else {\
      var todos = [];\
      {{#type}}\
      if ('{{type}}' == 'coding') {\
        {{#leaves}}\
        if ('{{type}}' == 'diagram') {\
          todos.push(renameDiagram('{{href}}'.split('/').pop(),$('#name').val().trim()));\
        }\
        {{/leaves}}\
      }{{/type}}\
      $.when(...todos).then(function(){\
        $.ajax({\
          url: '../../edit_name/{{_id}}',\
          type: 'PUT',\
          contentType: 'application/json',\
          data: $('#name').val().trim(),\
          error: function(request) {\
            alert(\
              (JSON.parse(request.responseText).reason || request.responseText)\
              + '\\nCode ' + request.status\
            );\
          }\
        }).done(function(){\
          refresh = true;\
          reload;\
        });\
      });\
    }\
  };",
  rightsscript: "\
  $('#add_contributor').on('keypress', function(key) {\
    if (key.which == 13) {\
      modify_rights('add_contributor', $('#add_contributor').val().trim().toLowerCase());\
    }\
  });\
  $('#add_contributor').autocomplete({\
    minLength: 3,\
    appendTo: '#modify_rights_dialog',\
    source: function(request, response) {\
      $.getJSON('../../userlist/' + request.term, function (data) {\
        response($.map(data.rows, function (value, key) {\
          if ('{{contributors}}'.split(',').concat(userids).indexOf(value.id) == -1) {\
            userids.push(value.id);\
            return {\
              label: value.value.fullname,\
              value: value.id\
            };\
          }\
        }));\
        userids = [];\
      });\
    },\
    select: function (event, ui) {\
      modify_rights('add_contributor', ui.item.value);\
    }\
  });\
  $('#add_reader').on('keypress', function(key) {\
    if (key.which == 13) {\
      modify_rights('add_reader', $('#add_reader').val().trim().toLowerCase());\
    }\
  });\
  $('#add_reader').autocomplete({\
    minLength: 3,\
    appendTo: '#modify_rights_dialog',\
    source: function(request, response) {\
      $.getJSON('../../userlist/' + request.term, function (data) {\
        response($.map(data.rows, function (value, key) {\
          if ('{{readers}}'.split(',').concat(userids).indexOf(value.id) == -1) {\
            userids.push(value.id);\
            return {\
              label: value.value.fullname,\
              value: value.id\
            };\
          }\
        }));\
        userids = [];\
      });\
    },\
    select: function (event, ui) {\
      modify_rights('add_reader', ui.item.value);\
    }\
  });\
  $('.remove_reader').on('click', function() {\
    var i = '{{readers_fullnames}}'.split(',').indexOf($(this).val());\
    modify_rights('remove_reader', '{{readers}}'.split(',')[i]);\
  });\
  $('.remove_contributor').on('click', function() {\
    var i = '{{contributors_fullnames}}'.split(',').indexOf($(this).val());\
    modify_rights('remove_contributor', '{{contributors}}'.split(',')[i]);\
  });\
  $('#unsubscribe').on('click', function() {\
    $.ajax({\
      url: '../../reader_unsubscribe/{{_id}}',\
      type: 'PUT',\
      contentType: 'application/json'\
    });\
  });\
  function modify_rights(action, value) {\
    $.ajax({\
      url: '../../modify_rights/{{_id}}',\
      type: 'PUT',\
      contentType: 'application/json',\
      data: JSON.stringify({\
       'action': action,\
       'value': value\
      }),\
      error: function(request) {\
        alert(\
          (JSON.parse(request.responseText).reason || request.responseText)\
          + '\\nCode ' + request.status\
        );\
      }\
    });\
  }",
  commentsscript: "\
  $('#comment_create').click(function () {\
    refresh = false;\
    $('#comment_create').remove();\
    $('#footer > div > button').prop('disabled', true);\
    $('#render').prop('disabled', true);\
    $('#commented').prop('disabled', null);\
    $('#leave-name').addClass('hidden');\
    $('#kwic').parent().children().addClass('hidden');\
    $('#modify_rights').remove();\
    $('a').removeAttr('href');\
    $('#diary').addClass('disabled');\
    $('#signout').prop('disabled', true);\
    $('#add-leaves').addClass('hidden');\
    $('.toast').toast('hide');\
    $('#comments').find('textarea').removeClass('hidden');\
    $('#commented').removeClass('hidden');\
    $('html, body').scrollTop($(document).height());\
  });\
  $('#commented').on('click', function() {\
    if ($('#comments').find('textarea').val().trim() == '') {\
      alert('{{i18n.i_enter_comment}}')\
    } else {\
      comment();\
    }\
  });\
  var comment_id;\
  $('.comment').click(function(event) {\
    refresh = false;\
    var user = $(this).find('.user').text();\
    comment_id = $(this).closest('.comment').attr('id');\
    if ('{{logged_fullname}}'.replace('&#39;','\\'') == user && !$(event.target).is('input')) {\
      $(this).find('.comment_text').hide();\
      $('#comments').find('textarea').text($('#'+comment_id).find('.comment_edit').text());\
      $('#'+comment_id).append($('#comments').find('textarea'));\
      $('#comments').find('textarea').attr('id', 'input'+comment_id);\
      $('#comments').find('textarea').attr('name', 'input'+comment_id);\
      $('#input'+comment_id).removeClass('hidden');\
      $('#commented').remove();\
      $('#footer > div > button').prop('disabled', true);\
      $('#add-leaves').addClass('hidden');\
      $('#comment_updated').removeClass('hidden');\
      $('#comment_updated').prop('disabled', false);\
      $('.comment').off('click');\
      $('#kwic').parent().children().addClass('hidden');\
      $('#signout').prop('disabled', true);\
      $('#diary').addClass('disabled');\
      $('#modify_rights').remove();\
      $('.toast').toast('hide');\
      $('a').removeAttr('href');\
    }\
  });\
  $('.comment_check').click(function() {\
    $.ajax({\
      url: '../../checking_comment/'+$(this).closest('.comment').attr('id'),\
      type: 'PUT',\
      contentType: 'application/json',\
      data: '{{logged_fullname}}'.replace('&#39;','\\'')\
    }).done(function(){refresh = true});\
  });\
  $('#comment_updated').on('click', function() {\
    update_comment(comment_id);\
  });\
  function update_comment(id) {\
    refresh = true;\
    $.ajax({\
      url: '../../update_comment_content/'+id,\
      type: 'PUT',\
      contentType: 'application/json',\
      data: $('#'+id+'>textarea').val().trim(),\
      success: reload\
    });\
  };\
  function comment() {\
    refresh = true;\
    var data = {\
      commented: '{{_id}}',\
      diary: '{{diary}}',\
      user: user,\
      date: new Date().toJSON(),\
      text: $('#comments').find('textarea').val().trim()\
    };\
    $.ajax({\
      type: 'POST',\
      url: '../../',\
      contentType: 'application/json',\
      data: JSON.stringify(data),\
      error: function(request) {\
        alert(\
          (JSON.parse(request.responseText).reason || request.responseText)\
          + '\\nCode ' + request.status\
        );\
      },\
      success: reload\
    });\
  }",
  logscript: "\
  var refresh = true;\
  var user = '{{peer}}';\
  if ('{{logged}}') user = '{{logged}}';\
  $('#signin').on('submit', function(e) {\
    e.preventDefault();\
    $(this).find('input').first().val($(this).find('input').first().val().toLowerCase());\
    $.ajax({\
      url: '/_session',\
      type: 'POST',\
      data: $(this).serialize(),\
      success: reload,\
      error: function() {alert('{{i18n.i_wrong-password}}')}\
    });\
  });\
  $('#signout').on('click', function() {\
    $.ajax({\
      type: 'DELETE',\
      url: '/_session',\
      success: reload\
    });\
  });\
  function track(memo) {\
    $.ajax({\
      {{^list}}\
      url: '../../track_memo/'+user,\
      {{/list}}\
      {{#list}}\
      url: '../../save_diary_order/'+user,\
      {{/list}}\
      type: 'PUT',\
      contentType: 'application/json',\
      {{^list}}\
      data: memo,\
      {{/list}}\
      {{#list}}\
      data: JSON.stringify({\
        'diary': '{{diary}}',\
        'by': memo\
      }),\
      {{/list}}\
    }).done({{#list}}reload{{/list}});\
  }",
  render: "\
    $.ajax({\
      type: 'GET',\
      url: '{{>relpath}}maintenance',\
      dataType: 'json'\
    }).done(function(data){\
      var maintenance_start = new Date(data.date);\
      var maintenance_end = moment(maintenance_start).add(30, 'm').toDate();\
      if (maintenance_start > new Date(Date.now())) {\
        inform('danger', '{{i18n.i_maintenance}} '+moment(data.date).calendar().toLowerCase());\
      } else if (maintenance_end > new Date(Date.now())) {\
        inform('danger', '{{i18n.i_maintenance-in-progress}} '+moment(data.date).add(30, 'm').fromNow());\
      }\
    });\
    stickToHeader();\
    if ($('#name').val().length > 0) {\
      $('#add').removeClass('hidden');\
      $('#leave-name').removeClass('hidden');\
    }\
    if ($('.contributors').text().trim().length < 1) {\
      $('.contributors').before('{{i18n.i_everyone}}');\
    }\
    if ($('.readers').text().trim().length < 1) {\
      $('.readers').before('{{i18n.i_everyone}}');\
      {{^editable}}$('#modify_rights').remove();{{/editable}}\
    }\
    if ($('#leaves li').length > 0) {\
      $('#show-leaves').removeClass('invisible');\
    } else {\
      $('#leaves').addClass('invisible d-lg-none');\
      $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block');\
    }\
    let refresh = true;\
    {{^statements}}\
    {{^link}}if ($('#groundings li').length > 1) $('#remove_grounding_btn').removeClass('d-none');{{/link}}\
    {{#type}}{{#logged}}track('{{_id}}');{{/logged}}{{/type}}\
    {{/statements}}\
  "
};

function dSort(array, locale){
  array.sort(function(a,b){
    return replaceDiacritics(a.name).localeCompare(replaceDiacritics(b.name), locale);
  });
  return array;
};

function replaceDiacritics(str){
  diacritics.forEach(function(letter){
    str = str.replace(letter.base, letter.char);
  });
  return str;
};
