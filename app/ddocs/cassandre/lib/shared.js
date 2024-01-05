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
  links: "<meta charset='utf-8'>\
    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>\
    <link rel='icon' type='image/svg' href='../style/favicon.svg' />\
    <link rel='apple-touch-icon' type='image/png' href='../style/apple-touch-icon-precomposed.png' />\
    <link rel='stylesheet' href='../style/bootstrap.min.css' />\
    <link rel='stylesheet' type='text/css' href='../style/main.css' />",
  diagramcss: "<link rel='stylesheet' type='text/css' href='../style/diagram.css' />",
  viscss: "<link rel='stylesheet' type='text/css' href='../style/vis.min.css' />",
  log: "\
    <ul class='mr-0 ml-auto navbar-nav nav-fill'><li class='form-inline justify-content-between'>\
      {{#type}}{{^statements}}\
      <button id='memo_creator' class='btn btn-outline-{{>contrastcolor}} hidden' disabled></button>\
      {{/statements}}{{/type}}\
      {{#diary}}\
      {{>rights}}\
      <button id='search-icon' class='btn' title='{{i18n.i_search}}'>\
        <svg class='bi' width='24' height='24' fill='currentColor'>\
          <use xlink:href='../style/bootstrap-icons.svg#search'/>\
        </svg>\
      </button>\
      <div id='search-input' class='input-group flex-grow-1 mr-1 hidden'>\
        <input id='kwic' type='search' class='form-control' placeholder='{{i18n.i_search}}' />\
        <div class='input-group-append'>\
          <span class='input-group-text kwic search'>?</span>\
        </div>\
      </div>\
      {{/diary}}\
    <div id='logged' class='order-3 justify-content-end pl-1'>\
      {{^logged}}\
      <button class='btn navbar-btn' title='{{i18n.i_sign-in}}' id='sign-in'>\
        <svg class='bi' width='24' height='24' fill='currentColor'>\
          <use xlink:href='../style/bootstrap-icons.svg#box-arrow-in-left'/>\
        </svg>\
      </button>\
      <button class='btn navbar-btn' title='{{i18n.i_register}}' id='to-register'>\
        <svg class='bi' width='24' height='24' fill='currentColor'>\
          <use xlink:href='../style/bootstrap-icons.svg#person-plus'/>\
        </svg>\
      </button>\
      <form id='signin' class='form-inline hidden'>\
        <div class='input-group input-group'>\
          <div class='input-group-prepend'>\
            <span class='input-group-text'>\
              <svg class='bi' width='24' height='24' fill='currentColor'>\
                <use xlink:href='../style/bootstrap-icons.svg#person'/>\
              </svg>\
            </span>\
          </div>\
          <input class='form-control' type='text' autocapitalize='none' name='name' placeholder='{{i18n.i_username}}'/>\
        </div>\
        <div class='input-group input-group'>\
          <div class='input-group-prepend'>\
            <span class='input-group-text'>\
              <svg class='bi' width='24' height='24' fill='currentColor'>\
                <use xlink:href='../style/bootstrap-icons.svg#lock'/>\
              </svg>\
            </span>\
          </div>\
          <input class='form-control' type='password' name='password' placeholder='{{i18n.i_password}}'/>\
        </div>\
        <button class='btn navbar-btn ml-1' title='{{i18n.i_sign-in}}' type='submit' disabled>\
          <svg class='bi' width='24' height='24' fill='currentColor'>\
            <use xlink:href='../style/bootstrap-icons.svg#check-lg'/>\
          </svg>\
        </button>\
      </form>\
      {{/logged}}\
      {{#logged}}\
      <button class='btn navbar-btn' data-html='true' title='{{i18n.i_sign-out}}<br/>{{#logged_fullname}}{{logged_fullname}}{{/logged_fullname}}' id='signout'>\
        <svg class='bi' width='24' height='24' fill='currentColor'>\
          <use xlink:href='../style/bootstrap-icons.svg#person-circle'/>\
        </svg>\
      </button>\
      {{/logged}}\
    </div></li></ul>",
  menucolor:"dark",
  contrastcolor:"light",
  navbarstyle:"navbar navbar-{{>menucolor}} text-{{>contrastcolor}}",
  creator:"\
    <div class='hidden' id='creator'>\
      {{i18n.i_created-by}} <span class='username {{creator}}'>{{creator}}</span> <span class='{{date}} moment'></span>\
    </div>",
  rights:"\
      {{#type}}{{#authorized}}{{^statements}}\
      <button class='btn hidden {{#public}}{{#logged}}text-dark bg-warning{{/logged}}{{/public}}' id='modify_rights' data-html='true' title='\
        {{#rights}}{{^editing}}<h5>{{i18n.i_modify_rights}}</h5>{{/editing}}{{/rights}}\
        {{#eager}}<p><strong>{{i18n.i_editable-by}}</strong><br/>{{#contributors_fullnames}}{{fullname}}<br/>{{/contributors_fullnames}}\
        {{^contributors_fullnames}}{{i18n.i_everyone}}{{/contributors_fullnames}}</p>\
        <p><strong>{{i18n.i_readable-by}}</strong><br/>{{#readers_fullnames}}{{fullname}}<br/>{{/readers_fullnames}}\
        {{^readers_fullnames}}{{i18n.i_everyone}}{{/readers_fullnames}}{{/eager}}\
        {{#public}}{{#logged}}<h5 class=\"text-warning\">{{i18n.i_public_memo}}</h5>{{/logged}}{{/public}}'>\
        <span {{#rights}}{{^editing}}data-toggle='modal' data-target='#modify_rights_dialog'{{/editing}}{{/rights}}>\
          <svg class='bi' width='24' height='24' fill='currentColor'>\
            <use xlink:href='../style/bootstrap-icons.svg#{{^public}}key{{/public}}{{#public}}unlock{{/public}}'/>\
          </svg>\
        </span>\
      </button>\
      {{/statements}}{{/authorized}}{{/type}}",
  sponsor_rights:"\
    <p id='authorization'>\
      {{i18n.i_readable-by}} <span class='readers'>\
      {{#readers_fullnames}}{{fullname}} {{/readers_fullnames}}</span>\
    </p>",
  existing_memo_dialog:"\
    <div id='existing_memo' class='modal fade' role='dialog'>\
      <div class='modal-dialog' role='document'>\
        <div class='modal-content'>\
          <div class='modal-body'>\
            <p>{{i18n.i_memo_already_exists}}</p>\
            <p class='linkLeaf'>{{i18n.i_link_leaf}}</p>\
            <div class='modal-footer'>\
              <button type='button' class='btn btn-primary' data-dismiss='modal'>{{i18n.i_cancel}}</button>\
              <button id='link_leaf' type='button' class='btn btn-secondary linkLeaf'>{{i18n.i_ground}}</button>\
            </div>\
          </div>\
        </div>\
      </div>\
    </div>",
  modify_rights_dialog:"\
    <div id='loading'  title='{{i18n.i_loading}}' class='spinner-border spinner-border-sm ml-auto mr-auto mr-sm-0 hidden' role='status' aria-hidden='true'></div>\
    <div id='modify_rights_dialog' class='modal fade' role='dialog'>\
      <div class='modal-dialog' role='document'>\
        <div class='modal-content'>\
          <div class='modal-header'>\
            <h5 class='modal-title'>{{#editable}}{{i18n.i_modify_rights}}{{/editable}}{{^editable}}{{i18n.i_reader_unsubscribe}}{{/editable}}</h5>\
            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
              <span aria-hidden='true'>×</span>\
            </button>\
          </div>\
          <div class='modal-body'>\
            {{#editable}}\
            <table><tr><th>{{i18n.i_contributors}}</th><th>{{i18n.i_readers}}</th></tr><tr><td>\
              <input id='add_contributor' type='search' placeholder='{{i18n.i_add_contributor}}'/><br/>\
              <p>{{i18n.i_editable-by}}</p>\
              <div class='contributors'>\
              {{#contributors_fullnames}}\
                <p><span class='username {{id}}'>{{fullname}}</span><button class='remove_contributor' value='{{id}}'>x</button></p>\
              {{/contributors_fullnames}}\
              {{^contributors_fullnames}}{{i18n.i_everyone}}{{/contributors_fullnames}}\
              </div>\
            </td><td>\
              <input id='add_reader' type='search' placeholder='{{i18n.i_add_reader}}'/><br/>\
              <p>{{i18n.i_readable-by}}</p>\
              <div class='readers'>\
              {{#readers_fullnames}}\
                <p><span class='username {{id}}'>{{fullname}}</span><button class='remove_reader' value='{{id}}'>x</button></p>\
              {{/readers_fullnames}}\
              {{^readers_fullnames}}{{i18n.i_everyone}}{{/readers_fullnames}}\
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
        <span class='meta'><span class='user'>{{user}}</span> (<span class='{{date}} moment'></span>)</span>:\
        {{#logged}}<span class='meta checker d-none d-sm-inline'>{{#checked}}{{i18n.i_checked_by}} {{checked}}{{/checked}}</span><div class='checkbox'><input type='checkbox' class='form-check-input position-static comment_check' {{#checked}}checked{{/checked}}></div>{{/logged}}<br/>\
        <span class='comment_text'>{{text}}</span>\
        <div class='comment_edit hidden'>{{text}}</div>\
      </div>\
      {{/comments}}\
      <div class='template comment hidden'>\
        <span class='meta'><span class='user'></span> (<span class='moment'></span>)</span>:\
        {{#logged}}<span class='meta checker d-none d-sm-inline'></span><div class='checkbox'><input type='checkbox' class='form-check-input position-static comment_check'></div>{{/logged}}<br/>\
        <span class='comment_text'></span>\
        <div class='comment_edit hidden'></div>\
      </div>\
      <textarea rows='5' type='text' class='form-control hidden' autocomplete='off' placeHolder='{{i18n.i_enter_comment}}'></textarea>\
    </div>",
  commentsbtn:"\
    <button class='btn navbar-btn btn-sm' id='comment_create' data-toggle='tooltip' data-placement='top' title='{{i18n.i_comment}}'>\
      <svg class='bi' width='24' height='24' fill='currentColor'>\
        <use xlink:href='../style/bootstrap-icons.svg#chat-right-text'/>\
      </svg>\
    </button>\
    <button class='btn navbar-btn btn-sm hidden' type='button' id='commented' data-toggle='tooltip' data-placement='top' title='{{i18n.i_save}}'>\
      <svg class='bi' width='24' height='24' fill='currentColor'>\
        <use xlink:href='../style/bootstrap-icons.svg#check-lg'/>\
      </svg>\
    </button>\
    <button class='btn navbar-btn btn-sm hidden' type='button' id='comment_updated' data-toggle='tooltip' data-placement='top' title='{{i18n.i_save}}'>\
      <svg class='bi' width='24' height='24' fill='currentColor'>\
        <use xlink:href='../style/bootstrap-icons.svg#check-lg'/>\
      </svg>\
    </button>\
    <button class='btn navbar-btn btn-sm hidden' type='button' id='renamed' data-toggle='tooltip' data-placement='top' title='{{i18n.i_save}}'>\
      <svg class='bi' width='24' height='24' fill='currentColor'>\
        <use xlink:href='../style/bootstrap-icons.svg#check-lg'/>\
      </svg>\
    </button>\
    <button class='btn navbar-btn btn-sm hidden' type='button' id='reload' data-toggle='tooltip' data-placement='top' title='{{i18n.i_cancel}}'>\
      <svg class='bi' width='24' height='24' fill='currentColor'>\
        <use xlink:href='../style/bootstrap-icons.svg#x-lg'/>\
      </svg>\
    </button>",
  script: "<script src='../script/jquery.js'></script>\
    <script src='../script/jquery-ui.min.js'></script>\
    <script src='../script/popper.min.js'></script>\
    <script src='../style/bootstrap.min.js'></script>\
    <script src='../script/showdown.min.js'></script>\
    <script src='../script/editname.js'></script>\
    <script src='../script/layout.js'></script>\
    <script src='../script/log.js'></script>\
    {{^list}}\
    <script src='../script/render.js'></script>\
    <script src='../script/rights.js'></script>\
    <script src='../script/comment.js'></script>\
    {{/list}}\
    <link rel='stylesheet' href='../style/jquery-ui.min.css' />",
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
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100){\
      showMore($('li').last().find('span').attr('id'));\
    }\
  });{{/list}}",
  logscript: "\
  const checked_by = '{{i18n.i_checked_by}}',\
        editable_by = '{{i18n.i_editable-by}}',\
        everyone = '{{i18n.i_everyone}}',\
        enter_comment ='{{i18n.i_enter_comment}}',\
        enter_diary_name ='{{i18n.i_i18n.i_enter_diary_name}}',\
        enter_graph_name = '{{i18n.i_enter_graph_name}}',\
        enter_location_date = '{{i18n.i_enter_location_date}}',\
        enter_memo_name = '{{i18n.i_enter_memo_name}}',\
        locale = '{{locale}}',\
        maintenance = '{{i18n.i_maintenance}}',\
        maintenance_in_progress = '{{i18n.i_maintenance-in-progress}}',\
        memo_already_linked = '{{i18n.i_memo_already_linked}}',\
        name_negative_case = '{{i18n.i_name.negative-case}}',\
        name_situation = '{{i18n.i_name.situation}}',\
        name_statement = '{{i18n.i_name.statement}}',\
        on_a_date = '{{i18n.i_on-a-date}}',\
        reuse = '{{i18n.i_reuse}}',\
        readable_by = '{{i18n.i_readable-by}}',\
        relpath = '../',\
        sign_out = '{{i18n.i_sign-out}}',\
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
    {{^list}}track_memo(user, memo){{/list}}\
    {{#list}}\
    $.ajax({\
      url: '../save_diary_order/'+user,\
      type: 'PUT',\
      contentType: 'application/json',\
      data: JSON.stringify({\
        'diary': '{{diary}}',\
        'by': memo\
      }),\
    }).done(reload)\
    .fail(function(data){$('#storing_fullname_dialog').modal('show')});\
    {{/list}}\
  }",
  render: "\
    render();\
    {{^statements}}\
    {{^link}}if (($('#groundings>li[id]').length > 1) || ('{{type}}' == 'coding' && $('#groundings li').first().find('.preview a').length > 1))\
        $('#remove_grounding_btn').removeClass('d-none');{{/link}}\
    {{#type}}{{#logged}}track('{{_id}}'){{/logged}}{{/type}}\
    {{/statements}}\
  "
};

function type2path(type) {
  switch (type) {
    case 'table':
    case 'graph':
    case 'diagram':
      return type;
    default:
      return 'memo';
  }
}

function dSort(array, locale){
  array.sort(function(a,b){
    return replaceDiacritics(a.name).localeCompare(replaceDiacritics(b.name), locale);
  });
  return array;
}

function replaceDiacritics(str){
  diacritics.forEach(function(letter){
    str = str.replace(letter.base, letter.char);
  });
  return str;
}
