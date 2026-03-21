let easymde, comment_id = '', commented_text = ''
$('#comment_create').click(function () {
  refresh = false
  $("#comment_create").tooltip('hide')
  $('#comment_create').remove()
  $('#footer > div > button').addClass('hidden')
  $('#render').prop('disabled', true)
  $('#leave-name').addClass('hidden')
  $('#kwic').parent().children().addClass('hidden')
  $('#modify_rights').remove()
  $('a').removeAttr('href')
  $('#diary').addClass('disabled')
  $('#header button').prop('disabled', true).tooltip('dispose')
  $('#add-leaves').addClass('hidden')
  $('#toasts').remove()
  let anchor = $('#content>h1').text().trim()
  if ($('#kwic').val()) anchor = $('#kwic').val()
  $('#comment_input').val('> '+anchor+"\n \n")
  show_comment_dialog('create', '#comment_input')
  $('.comment').off('click')
  $('.comment_check').prop('disabled', true)
  $('html, body').scrollTop($(document).height())
})
$('#commented').on('click', function() {
  if (easymde.value().trim().length < 1) {
    alert(enter_comment)
  } else {
    comment()
  }
})
$('.comment').click(function(event) {
  refresh = false
  var user = $(this).find('.user').text(),
      action = 'update'
  comment_id = $(this).closest('.comment').attr('id')
  if (logged_fullname == user && !$(event.target).is('input')) {
    $(this).find('.comment_text').hide()
    $('#comment_input')
      .text($('#'+comment_id).find('.comment_edit').text())
    $('#comment_input')
      .attr('id', 'input'+comment_id)
      .attr('name', 'input'+comment_id)
    if ($('#'+comment_id+' .comment_edit').hasClass('legacy')) action = 'legacy_update'
    show_comment_dialog(action, '#input'+comment_id)
    $('#commented').remove()
    $('#footer > div > button').addClass('hidden')
    $('#add-leaves').addClass('hidden')
    $('#reload').removeClass('hidden')
    $('.comment').off('click')
    $('.comment_check').prop('disabled', true)
    $('#kwic').parent().children().addClass('hidden')
    $('#signout').prop('disabled', true)
    $('#diary').addClass('disabled')
    $('#modify_rights').remove()
    $('#toasts').remove()
    $('#user-menu-btn').prop('disabled', true)
    $('a').removeAttr('href')
  }
})
$('.comment_check').click(function() {
  let doc = id = $(this).closest('.comment').attr('id')
  if (!$('#'+id+' .comment_edit').hasClass('legacy')) doc = this_id+'_'+user
  let data = {
    'id': id,
    'fullname': logged_fullname
  }
  $.ajax({
    url: '../checking_comment/'+doc,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(data)
  }).done(function(){refresh = true})
})
$('#convert_legacy_comment').on('click', function() {
  if (easymde.value().trim().length < 1) {
    alert(enter_comment)
  } else {
    update_legacy_comment(comment_id)
  }
})
$('#comment_updated').on('click', function() {
  if (easymde.value().trim().length < 1) {
    alert(enter_comment)
  } else {
    update_comment(comment_id, commented_text+"\n \n"+easymde.value().trim())
  }
})
$('#delete_comment').on('click', function() {
  update_comment(comment_id, '')
})
$('body').on('click', '#edit_commented_text', function() {
  easymde.value(commented_text+"\n \n"+easymde.value())
  commented_text = ''
  $('#anchor_text').text('')
  $('#edit_commented_text').addClass('hidden')
})
$('body').on('shown.bs.modal', '#comment_dialog', function() {
  let input_id = $(this).find('.modal-body').find('textarea').attr('id')
  enabling_mde('#'+input_id)
})
$('body').on('click', '#comment_dialog .close', function() {
  location.reload()
})
function show_comment_dialog(action, cid) {
  $('head').append('<link rel="stylesheet" href="../style/easymde.min.css" />')
  $('body').append('<script src="../script/easymde.min.js"></script>')
  if (!$("#dialogs").length) $("body").append('<div id="dialogs"></div>')
  if ($("#comment_dialog").length) {
    $('#comment_dialog').modal('show')
  } else {
    var comment_rest
    $(cid).attr('placeHolder', enter_comment)
    $("#dialogs").load("/script/comment_dialog.html", function() {
      $('#comment_dialog .modal-title').html(comment_)
      $('#comment_dialog .modal-body').append($(cid))
      var i = $(cid).val().search(/\n[^>]/g)
      if ($(cid).val().substring(0, 1) === '>') {
        if (i > -1) {
          commented_text = $(cid).val().substring(0, i)
          comment_rest = $(cid).val().substring(i+1).trim()
        } else {
          commented_text = $(cid).val()
        }
        $('#edit_commented_text').removeClass('hidden')
      } else {
        comment_rest = $(cid).val()
      }
      $('#anchor_text').html(commented_text)
      renderComments(converter)
      $(cid).val(comment_rest)
      if(comment_id.length) $('#delete_comment').removeClass('hidden').appendTo($('#comment_dialog .modal-footer'))
      $('#reload')
        .removeClass('navbar-btn btn-sm hidden')
        .addClass('btn-secondary')
        .appendTo($('#comment_dialog .modal-footer'))
      if (action === 'legacy_update') $('#convert_legacy_comment').removeClass('hidden').appendTo($('#comment_dialog .modal-footer'))
      if (action === 'update') $('#comment_updated').removeClass('hidden').appendTo($('#comment_dialog .modal-footer'))
      if (action === 'create') {
        $('#comment_dialog .modal-footer').append($('#commented'))
        $('#commented')
          .prop('disabled', null)
          .removeClass('hidden')
      }
      $('#comment_dialog .modal-footer button')
        .tooltip('dispose')
        .data('placement', 'bottom')
        .tooltip('update')
      $('#comment_dialog').modal('show')
    })
  }
}
function enabling_mde(id) {
  easymde = new EasyMDE({
    element: $(id)[0],
    toolbar: ["bold", "italic", "strikethrough", "|", "unordered-list", "horizontal-rule", "|", "link", "image", "|", "guide"],
    placeholder: enter_comment,
    spellChecker: false
  }), french = {
    bold: 'Gras (ctrl-b)',
    italic: 'Italique (ctrl-i)',
    strikethrough: "Barré",
    'heading-3': "Sous-titre (ctrl-alt-3)",
    'unordered-list': "Liste (ctrl-l)",
    'horizontal-rule': "Insérer une ligne horizontale",
    link: "Créer un lien (ctrl+k)",
    image: "Insérer une image (ctrl-alt-i)",
    guide: "Guide de mise en page (en anglais)"
  }
  if (locale === "fr") {
    for (const [btn, title] of Object.entries(french)) {
      $('.editor-toolbar .'+btn).prop('title', title)
    }
    $('.editor-toolbar .bold').html('<strong>G</strong>')
    $('.editor-toolbar .heading-3').html('T')
    $('.editor-statusbar .words').addClass('words-french')
    $('.editor-statusbar .lines').addClass('lines-french')
  }
}
function show_comment(id, user, date, text, checked, legacy) {
  $('#comments .template').clone(true).attr('id', id).appendTo("#comments")
  if (checked) {
    $('#'+id).addClass('checked')
    $('#'+id+' .checker').text(checked_by+' '+checked)
    $('#'+id).find('.comment_check').prop('checked', true)
  }
  $('#'+id+' .meta .user').text(user)
  $('#'+id+' .meta .moment').removeClass('moment').addClass(date).addClass('moment')
  $('#'+id+' .comment_text').text(text)
  $('#'+id).removeClass('template hidden')
  $('#'+id+' .comment_edit').text(text)
  if (legacy === 'true') {
    $('#'+id+' .comment_edit').addClass('legacy')
  }
}
function create_or_feed_docid(toDoAfter) {
  refresh = false
  var data_text = commented_text+"\n \n"+easymde.value().trim(),
      data_text = data_text.replace(/\n( )*\n>/g, "\n>").trim(),
      comments_docid = this_id+'_'+user
  $.ajax({
    type: 'GET',
    url: '../'+comments_docid,
    dataType: 'json'
  }).done(function(d){
    $.ajax({
      url: '../add_comment/'+comments_docid,
      type: 'PUT',
      contentType: 'application/json',
      data: data_text
    }).done(toDoAfter)
  }).fail(function(){
    var com_data = {
      id: '0-'+Math.floor(Math.random() * 10)+Math.floor(Math.random() * 10),
      date: new Date().toJSON(),
      text: data_text
    }
    var doc_data = {
      commented: this_id,
      diary: diary_id,
      user: user,
      comments: []
    }
    doc_data.comments.push(com_data)
    $.ajax({
      type: 'PUT',
      url: '../'+comments_docid,
      contentType: 'application/json',
      data: JSON.stringify(doc_data)
    }).done(toDoAfter)
  })
}

function update_legacy_comment(legacy_id) {
  var data_text = commented_text+"\n \n"+easymde.value().trim(),
      data_text = data_text.replace(/\n( )*\n>/g, "\n>").trim(),
      comments_docid = this_id+'_'+user,
      toDoAfter = function(){
        delete_legacy_comment(legacy_id)
      }
  create_or_feed_docid(toDoAfter)
}
function update_comment(id, text) {
  refresh = true
  var comments_docid = this_id+'_'+user, 
      o = {
        'id': id,
        'text': text
      }
  $.ajax({
    url: '../comment_content/'+comments_docid,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(o)
  }).done(reload)
}
function delete_legacy_comment(id) {
  refresh = true
  $.ajax({
    url: '../update_comment_content/'+id,
    type: 'PUT',
    async: 'false',
    contentType: 'application/json',
    data: ''
  }).done(reload) 
}
function comment() {
  refresh = true
  var data_text = commented_text+"\n \n"+easymde.value().trim(),
      data_text = data_text.replace(/\n( )*\n>/g, "\n>").trim()
      doc_id = this_id+'_'+user
  create_or_feed_docid(reload)    
}
