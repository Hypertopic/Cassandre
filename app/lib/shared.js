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
          <span class='d-none d-sm-block text-light'>{{i18n.i_sign-in}}</span>\
        </button>\
      </form>\
      {{/logged}}\
      {{#logged}}\
      <span id='username' class='navbar-text ml-2'>\
        {{#logged_fullname}}{{logged_fullname}}{{/logged_fullname}}\
        {{^logged_fullname}}{{logged}}{{/logged_fullname}}\
      </span>\
      <button class='btn navbar-btn' title='{{i18n.i_sign-out}}' id='signout'>\
        <span class='d-none d-sm-block text-light'>{{i18n.i_sign-out}}</span>\
        <img class='d-block d-sm-none' src='{{>relpath}}style/sign-out.svg' alt='{{i18n.i_sign-out}}'>\
      </button>\
      {{/logged}}\
    </div></li></ul>",
  navbarstyle:"navbar navbar-dark bg-dark",
  readrights:"\
    <p id='authorization'>\
      {{i18n.i_readable-by}} <span class='readers'>{{readers_fullnames}}</span>\
    </p>",
  rights:"\
    <div id='authorization'>\
      {{i18n.i_created-by}} {{creator}} <span class='moment'>{{date}}</span><br/>\
      {{i18n.i_editable-by}} <span class='contributors'>{{contributors_fullnames}}</span><br/>\
      {{i18n.i_readable-by}} <span class='readers'>{{readers_fullnames}}</span>\
      {{^link}}{{^cells}}{{^edges}}\
        {{#editable}}\
        <span id='modify_rights' data-toggle='modal' data-target='#modify_rights_dialog' title='{{i18n.i_modify_rights}}'>\
          <img src='../../style/gear.svg' alt='{{i18n.i_modify_rights}}'>\
        </span>\
        {{/editable}}\
      {{/edges}}{{/cells}}{{/link}}\
    </div>",
  comments:"\
    <div id='comments'>\
      {{#comments}}\
      <div class='comment {{checked}}' id='{{id}}' name='{{rev}}'>\
        <span class='meta'><span class='user'>{{user}}</span> (<span class='moment'>{{date}}</span>)</span>:\
        {{#logged}}<div class='checkbox'><input type='checkbox' class='form-check-input position-static comment_check' {{checked}}></div>{{/logged}}<br/>\
        <span class='comment_text'>{{text}}</span>\
        <input size='80' height='50' type='text' class='form-control comment_edit hidden' value='{{text}}'/>\
      </div>\
      {{/comments}}\
      <textarea rows='5' type='text' class='form-control hidden' placeHolder='{{i18n.i_enter_comment}}'></textarea>\
    </div>",
  commentsbtn:"\
    <button class='btn navbar-btn btn-outline-light btn-sm' id='comment_create' title='{{i18n.i_comment}}'>\
      <span class='d-block d-sm-none'><img src='../../style/comment.svg' alt='{{i18n.i_comment}}'></span>\
      <span class='d-none d-sm-block'>{{i18n.i_comment}}</span>\
    </button>\
    <button class='btn navbar-btn btn-outline-light btn-sm hidden' type='button' id='commented'>{{i18n.i_done}}</button>",
  script: "<script src='{{>relpath}}script/jquery.js'></script>\
    <script src='{{>relpath}}script/jquery-ui.min.js'></script>\
    <script src='{{>relpath}}style/bootstrap.min.js'></script>\
    <script src='{{>relpath}}script/moment.min.js'></script>\
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
  $('#leave-name').on('keypress', function(key) {\
    if (['coding','diagram'].indexOf('{{type}}') < 0 && key.which == 13) {\
      var classlist = $(this)[0].nextElementSibling.childNodes[1].classList;\
      create(classlist[classlist.length - 1], '{{_id}}', $('#leave-name').val().trim());\
    }\
  });\
  function create(type, grounding, name) {\
    if (name == '' && type != 'diagram') {\
      if (type != 'graph') {\
        alert('{{i18n.i_enter_memo_name}}');\
      } else {\
        alert('{{i18n.i_enter_graph_name}}');\
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
          alert('{{i18n.i_memo_already_exists}}');\
        } else {\
          var data = {\
            groundings: [grounding],\
            history: [{\
              'user': user,\
              'date': new Date().toJSON()\
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
          switch (type) {\
            case 'transcript':\
              var destination = '../../editable_text/';\
              data.corpus = '{{diary}}',\
              data.speeches = [{actor:'',text:''}];\
            break;\
            case 'table':\
              var destination = '../../table/{{diary}}/';\
              data.cells = [{'...':[{'{{_id}}':'...'}]}];\
              data.diary = '{{diary}}';\
              data.type = type;\
            break;\
            case 'diagram':\
              var destination = '../../diagram/{{diary}}/';\
              data.diary = '{{diary}}';\
              data.name = name;\
              data.link = 'pp';\
              data.type = type;\
            break;\
            {{#link}}\
            case 'graph':\
              var destination = '../../graph/{{diary}}/';\
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
              var destination = '../../editable_memo/';\
              data.diary = '{{diary}}',\
              data.body = '';\
              data.type = type;\
          }\
          if (type) {\
            $.ajax({\
              url: '../../',\
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
  {{/list}}\
  function poller(what) {\
    $.ajax({\
      url: '../../changes/'+what+'/{{_id}}/{{update_seq}}'\
    }).done(function(data){\
      if (data.results.length) {\
        reload();\
      } else {\
        poller(what);\
      }\
    });\
  }\
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
    $(this).hide();\
    $('#leave-name').addClass('hidden');\
    $('#add').addClass('hidden');\
    $('#create').addClass('hidden');\
    $('#add-table').addClass('hidden');\
    $('#name').removeClass('hidden');\
  });\
  $('#name').on('keypress', function(key) {\
    if (key.which == 13) {\
      if ($('#name').val().trim() == '') {\
        {{^link}}\
          {{^list}}alert('{{i18n.i_enter_memo_name}}');{{/list}}\
          {{#list}}alert('{{i18n.i_enter_diary_name}}');{{/list}}\
        {{/link}}\
        {{#link}}\
          alert('{{i18n.i_enter_graph_name}}');\
        {{/link}}\
      } else {\
        $.ajax({\
          url: '../../{{_id}}',\
          type: 'GET',\
          dataType: 'json',\
          success: function(data) {\
            if (typeof data.name !== 'undefined') {\
              data.name = $('#name').val().trim();\
            } else if (typeof data.diary_name !== 'undefined') data.diary_name = $('#name').val().trim();\
            if (!data.history) data.history = [];\
            data.history.push({\
              'user': user,\
              'date': new Date().toJSON()\
            });\
            var todos = [];\
            {{#type}}\
            if ('{{type}}' == 'coding') {\
              {{#leaves}}\
              if ('{{type}}' == 'diagram') {\
                todos.push(renameDiagram('{{href}}'.split('/').pop(),data.name));\
              }\
              {{/leaves}}\
            }{{/type}}\
            $.when(...todos).then(function(){\
              $.ajax({\
                type: 'PUT',\
                url: '../../{{_id}}',\
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
            });\
          }\
        });\
      }\
    }\
  });",
  commentsscript: "\
  $('#comment_create').click(function () {\
    refresh = false;\
    $('#comment_create').remove();\
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
  $('.comment').click(function(event) {\
    refresh = false;\
    var user = $(this).find('.user').text();\
    if ('{{logged_fullname}}' == user && !$(event.target).is('input')) {\
      $(this).find('.comment_text').hide();\
      $(this).find('.comment_edit').removeClass('hidden');\
      $('#comment_create').remove();\
      $('#commented').remove();\
    }\
  });\
  $('.comment_check').click(function() {\
    var comment_id = $(this).closest('.comment').attr('id');\
    $.ajax({\
      url: '../../'+ comment_id,\
      type: 'GET',\
      dataType: 'json',\
      success: function(data) {\
        if (!data.checked || data.checked == '') {\
          data.checked = 'checked';\
        } else {\
          data.checked = '';\
        }\
        refresh = true;\
        $.ajax({\
          type: 'PUT',\
          url: '../../'+ comment_id + '?rev=' + data._rev,\
          contentType: 'application/json',\
          data: JSON.stringify(data),\
          success: reload\
        });\
      }\
    });\
  });\
  $('.comment_edit').on('keypress', function(key) {\
    if (key.which == 13) {\
      refresh = true;\
      var data = {\
        commented: '{{_id}}',\
        diary: '{{diary}}',\
        user: user,\
        date: new Date().toJSON(),\
        text: $(this).val().trim()\
      };\
      $.ajax({\
        type: 'PUT',\
        url: '../../'+ $(this).closest('.comment').attr('id') + '?rev=' + $(this).closest('.comment').attr('name'),\
        contentType: 'application/json',\
        data: JSON.stringify(data),\
        success: reload\
      });\
    }\
  });\
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
    {{^list}}\
    var obj = {\
      'doc': memo,\
      'date': new Date().toJSON()\
    };\
    {{/list}}\
    {{#list}}\
    var obj = {\
      'diary': '{{diary}}',\
      'by': memo\
    };\
    {{/list}}\
    $.ajax({\
      url: '../../'+user,\
      type: 'GET',\
      dataType: 'json',\
      error: function() {\
        $.ajax({\
          url: '../../'+user,\
          type: 'PUT',\
          dataType: 'json',\
          data: JSON.stringify({\
            '_id': user,\
            'activity': [obj],\
            'contributors': [user]\
          })\
        });\
      },\
      success: function(data) {\
        if (!data.contributors) data.contributors = [user];\
        if (!data.activity) data.activity = [];\
        {{^list}}\
        var i = data.activity.findIndex(e => e.doc === memo);\
        if (i > -1) {\
          data.activity.splice(i, 1, obj);\
        } else {\
          data.activity.push(obj);\
        }\
        {{/list}}\
        {{#list}}\
        if (!data.order) data.order = [];\
        var i = data.order.findIndex(e => e.diary === '{{diary}}');\
        if (i > -1) {\
          data.order.splice(i, 1, obj);\
        } else {\
          data.order.push(obj);\
        }\
        {{/list}}\
        $.ajax({\
          type: 'PUT',\
          url: '../../'+user,\
          contentType: 'application/json',\
          data: JSON.stringify(data)\
        }).done({{#list}}reload{{/list}});\
      }\
    });\
  }",
  render: "\
    $.ajax({\
      type: 'GET',\
      url: '{{>relpath}}maintenance',\
      dataType: 'json'\
    }).done(function(data){\
      if (new Date(data.date) > new Date(Date.now())) {\
        $('main').append('\
          <div class=\"toast\"  style=\"position: absolute; top: 1%; right: 3%;\" role=\"alert\">\
            <div class=\"toast-body alert-danger\">\
            <button type=\"button\" class=\"close\" data-dismiss=\"toast\">×</button>\
            {{i18n.i_maintenance}} '+moment(data.date).calendar().toLowerCase()+'\
            </div>\
          </div>');\
          $('.toast').toast({autohide: false});\
          $('.toast').toast('show');\
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
    }\
    if ($('#leaves li').length > 0) {\
      $('#show-leaves').removeClass('invisible');\
    } else {\
      $('#leaves').addClass('invisible d-lg-none');\
      $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block');\
    }\
    {{^link}}if ($('#groundings li').length > 1) $('#remove_grounding_btn').removeClass('d-none');{{/link}}\
    {{#type}}{{#logged}}track('{{_id}}');{{/logged}}{{/type}}\
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
