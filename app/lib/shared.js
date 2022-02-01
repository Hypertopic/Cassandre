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
      <button class='btn navbar-btn text-{{>contrastcolor}}' title='{{i18n.i_sign-in}}' id='sign-in'>{{i18n.i_sign-in}}</button>\
      <button class='btn navbar-btn btn-outline-{{>contrastcolor}}' title='{{i18n.i_register}}' id='to-register'>{{i18n.i_register}}</button>\
      <form id='signin' class='form-inline hidden'>\
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
  navbarstyle:"navbar navbar-{{>menucolor}} text-{{>contrastcolor}}",
  readrights:"\
    <p id='authorization'>\
      {{i18n.i_readable-by}} <span class='readers'>\
      {{#readers_fullnames}}{{fullname}} {{/readers_fullnames}}</span>\
    </p>",
  rights:"\
    <div id='authorization'>\
      {{i18n.i_created-by}} {{creator}} <span class='moment'>{{date}}</span><br/>\
      {{i18n.i_editable-by}} <span class='contributors'>\
      {{#contributors_fullnames}}{{fullname}} {{/contributors_fullnames}}</span>\
      </span><br/>\
      {{i18n.i_readable-by}} <span class='readers'>\
      {{#readers_fullnames}}{{fullname}} {{/readers_fullnames}}</span></span>\
      {{#logged}}{{#editable}}\
      <span id='modify_rights' data-toggle='modal' data-target='#modify_rights_dialog' title='{{i18n.i_modify_rights}}'>\
        <img src='../../style/gear.svg' alt='{{i18n.i_modify_rights}}'>\
      </span>\
      {{/editable}}{{/logged}}\
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
                <p>{{fullname}}<button class='remove_contributor' value='{{id}}'>x</button></p>\
              {{/contributors_fullnames}}\
              </div>\
            </td><td>\
              <input id='add_reader' type='search' placeholder='{{i18n.i_add_reader}}'/><br/>\
              <p>{{i18n.i_readable-by}}</p>\
              <div class='readers'>\
              {{#readers_fullnames}}\
                <p>{{fullname}}<button class='remove_reader' value='{{id}}'>x</button></p>\
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
  storing_fullname_dialog:"\
    <div id='storing_fullname_dialog' class='modal fade' role='dialog'>\
      <div class='modal-dialog' role='document'>\
        <div class='modal-content'>\
          <div class='modal-body'>\
            <p><label for='user_fullname'>{{i18n.i_fullname}}</label><br/>\
              <input id='user_fullname' class='form-control input-sm' placeholder='Jack London'/>\
              <small class='form-text text-info'>{{i18n.i_register_prompt.fullname}}</small>\
            </p>\
          </div>\
          <div class='modal-footer'>\
            <button id='storing_fullname' type='button' class='btn btn-secondary'>Ok</button>\
          </div>\
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
    <script src='{{>relpath}}script/layout.js'></script>\
    <script src='{{>relpath}}script/render.js'></script>\
    <script src='{{>relpath}}script/log.js'></script>\
    <script src='{{>relpath}}script/comment.js'></script>\
    <link rel='stylesheet' href='{{>relpath}}style/jquery-ui.min.css' />",
  layoutscript:"\
  {{^list}}\
  var ground = ['{{_id}}'];\
  {{#statements}}\
  ground = [];\
  {{#groundings}};\
    ground.push('{{id}}');\
  {{/groundings}}\
  {{/statements}}\
  {{/list}}\
  {{#list}}\
  $(window).scroll(function(){\
    if ($(window).scrollTop() == $(document).height() - $(window).height()){\
      showMore($('li').last().find('span').attr('id'));\
    }\
  });{{/list}}",
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
    modify_rights('remove_reader', $(this).val());\
  });\
  $('.remove_contributor').on('click', function() {\
    modify_rights('remove_contributor', $(this).val());\
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
  logscript: "\
  const everyone = '{{i18n.i_everyone}}',\
        enter_comment ='{{i18n.i_enter_comment}}',\
        enter_graph_name = '{{i18n.i_enter_graph_name}}',\
        enter_location_date = '{{i18n.i_enter_location_date}}',\
        enter_memo_name = '{{i18n.i_enter_memo_name}}',\
        maintenance = '{{i18n.i_maintenance}}',\
        maintenance_in_progress = '{{i18n.i_maintenance-in-progress}}',\
        memo_already_linked = '{{i18n.i_memo_already_linked}}',\
        on_a_date = '{{i18n.i_on-a-date}}',\
        relpath = '{{>relpath}}',\
        wrong_password = '{{i18n.i_wrong-password}}'.replace('&#39;','\\'');\
  let refresh = true,\
      fullname = null,\
      logged_fullname = '{{logged_fullname}}'.replace('&#39;','\\''),\
      nothing_to_show = '{{i18n.i_nothing-to-show}}';\
  var user = '{{peer}}';\
  {{^list}}\
  var contributors = '{{contributors}}',\
      readers = '{{readers}}';\
  {{/list}}\
  if ('{{logged}}') user = '{{logged}}';\
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
    }).done({{#list}}reload{{/list}})\
    .fail({{#list}}function(data){$('#storing_fullname_dialog').modal('show')}{{/list}});\
  }",
  render: "\
    render();\
    {{^statements}}\
    {{^link}}if (($('#groundings li').length > 1) || ('{{type}}' == 'coding' && $('#groundings li').first().find('.preview').text().indexOf('---') > -1))\
        $('#remove_grounding_btn').removeClass('d-none');{{/link}}\
    {{#type}}{{#logged}}setTimeout(function() {track('{{_id}}')}, 9000);{{/logged}}{{/type}}\
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
