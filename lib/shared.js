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
      {{logged}}\
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
    $('#container>#content #diary_name').css({'margin-top': h+5});\
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
  };",
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
  });"
}

