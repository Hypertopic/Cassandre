var shared = {
  relpath: "{{^flat}}../{{/flat}}../",
  links: "<link rel='icon' type='image/svg' href='{{>relpath}}style/favicon.svg' />\
    <link rel='stylesheet' type='text/css' href='{{>relpath}}style/main.css' />",
  diagramcss: "<link rel='stylesheet' type='text/css' href='{{>relpath}}style/diagram.css' />",
  viscss: "<link rel='stylesheet' type='text/css' href='{{>relpath}}style/vis.min.css' />",
  log: "\
    <div id='logged'>\
    {{^logged}}\
      <form id='signin'>\
        <input type='text' name='name' placeholder='{{i18n.i_username}}'/>\
        <input type='password' name='password' placeholder='{{i18n.i_password}}'/>\
        <button type='submit'>{{i18n.i_sign-in}}</button>\
      </form>\
    {{/logged}}\
    {{#logged}}\
      <span id='username'>{{logged_fullname}}</span>\
      <button id='signout'>{{i18n.i_sign-out}}</button>\
    {{/logged}}\
    </div>",
  comments:"\
    <div id='comments'>\
      {{#comments}}\
      <div class='comment {{checked}}' id='{{id}}' name='{{rev}}'>\
        <span class='meta'><span class='user'>{{user}}</span> (<span class='moment'>{{date}}</span>)</span>:\
        {{#logged}}<div class='checkbox'><input type='checkbox' class='comment_check' {{checked}}></div>{{/logged}}<br/>\
        <span class='comment_text'>{{text}}</span>\
        <input size='80' height='50' type='text' hidden='hidden' class='comment_edit' value='{{text}}'/>\
      </div>\
      {{/comments}}\
      <button type='button' id='comment_create'>{{i18n.i_comment}}</button>\
      <textarea cols='80' rows='5' type='text' hidden='hidden' placeHolder='{{i18n.i_enter_comment}}'></textarea>\
      <button type='button' id='commented' hidden='hidden'>{{i18n.i_done}}</button>\
    </div>\
    <p>&nbsp;</p>", 
  script: "<script src='{{>relpath}}script/jquery.js'></script>\
    <script src='{{>relpath}}script/jquery-ui.min.js'></script>\
    <script src='{{>relpath}}script/moment.min.js'></script>\
    <link rel='stylesheet' href='{{>relpath}}style/jquery-ui.min.css' />",
  layoutscript:"function stickToHeader() {\
    var h = document.getElementById('header').offsetHeight;\
    $('#container>#memo').css({'padding-top': h});\
    $('#groundings').css({'padding-top': h});\
    {{#list}}\
    $('#container>#content h1').css({'padding-top': h+5});\
    $('#container>#content #name').css({'margin-top': h+5});\
    {{/list}}\
    $('#add-leaves').css({'top': h+5});\
    if (h > 36) $('#show-leaves').css({'top': h-36});\
    $('#leaves').css({'top': h});\
  }\
  $(window).resize(function() {\
    stickToHeader();\
  });\
  var reload = function() {\
    if (refresh) location.reload();\
  };\
  {{^list}}\
  $('#show-leaves').click(function () {\
    var option = { direction: 'left' };\
    $('#leaves').toggle('fold');\
  });\
  $('#groundings').find('.toggle').click(function(){\
    $(this).next().slideToggle('fast');\
    $('.preview').not($(this).next()).slideUp('fast');\
  });\
  $('#diary').on('click', function() {\
    self.location = '{{>relpath}}memo/{{diary}}/?by=date';\
  });\
  $('#leave-name').on('keypress', function(key) {\
    if (['coding','diagram'].indexOf('{{type}}') < 0 && key.which == 13) {\
      create($(this)[0].nextElementSibling.className, '{{_id}}', $('#leave-name').val().trim());\
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
          data.name = '{{name}}';\
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
  }\
  {{/list}}",
  editname: "\
  $('h1').on('click', function() {\
    $(this).hide();\
    $('#leave-name').hide();\
    $('#name').show();\
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
            $.when (todos).done(function(){ \
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
    $('#comments').find('textarea').show();\
    $('#commented').show();\
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
      $(this).find('.comment_edit').show();\
      $('#comment_create').remove();\
      $('#commented').remove();\
    }\
  });\
  $('.comment_check').click(function() {\
    var comment_id = $(this).closest('.comment').attr('id'),\
        comment_rev = $(this).closest('.comment').attr('name');\
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
        $.ajax({\
          type: 'PUT',\
          url: '../../'+ comment_id + '?rev=' + comment_rev,\
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
    $.post('/_session', $(this).serialize(), reload);\
  });\
  $('#signout').on('click', function() {\
    $.ajax({\
      type: 'DELETE',\
      url: '/_session',\
      success: reload\
    });\
  });\
  function track(memo) {\
    var obj = {\
      'doc': memo,\
      'date': new Date().toJSON()\
    };\
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
            'activity': [obj]\
          })\
        });\
      },\
      success: function(data) {\
        if (!data.activity) data.activity = [];\
        var i = data.activity.findIndex(e => e.doc === memo);\
        if (i > -1) {\
          data.activity.splice(i, 1, obj);\
        } else {\
          data.activity.push(obj);\
        }\
        $.ajax({\
          type: 'PUT',\
          url: '../../'+user,\
          contentType: 'application/json',\
          data: JSON.stringify(data),\
          error: function(request) {\
            alert(\
              (JSON.parse(request.responseText).reason || request.responseText)\
              + '\\nCode ' + request.status\
            );\
          }\
        });\
      }\
    });\
  }",
  render: "\
    stickToHeader();\
    if ($('#name').val().length > 0) {\
      $('#add').show();\
      $('#leave-name').show();\
    }\
    if ($('#contributors').text().length < 1) {\
      $('#contributors').before('{{i18n.i_everyone}}');\
    }\
    if ($('#readers').text().length < 1) {\
      $('#readers').before('{{i18n.i_everyone}}');\
    }\
    if ($('#leaves li').length > 0) {\
      $('#show-leaves').show();\
    }\
    {{^link}}if ($('#groundings li').length > 1) $('#remove_grounding').show();{{/link}}\
    {{#type}}{{#logged}}track('{{_id}}');{{/logged}}{{/type}}\
  "
}
