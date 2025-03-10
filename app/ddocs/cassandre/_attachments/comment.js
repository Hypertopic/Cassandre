$('#comment_create').click(function () {
  refresh = false;
  $("#comment_create").tooltip('hide')
  $('#comment_create').remove();
  $('#footer > div > button').addClass('hidden');
  $('#render').prop('disabled', true);
  $('#commented').prop('disabled', null);
  $('#leave-name').addClass('hidden');
  $('#kwic').parent().children().addClass('hidden');
  $('#modify_rights').remove();
  $('a').removeAttr('href');
  $('#diary').addClass('disabled');
  $('#header button').prop('disabled', true).tooltip('dispose');
  $('#add-leaves').addClass('hidden');
  $('#toasts').remove()
  $('#comments').append($('#comments').find('textarea'));
  let anchor = $('#content>h1').text().trim();
  if ($('#kwic').val()) anchor = $('#kwic').val();
  $('#comments').find('textarea').val('> '+ anchor+"\n \n");
  $('#comments').find('textarea').removeClass('hidden');
  $('.comment').off('click');
  $('.comment_check').prop('disabled', true);
  $('#commented').removeClass('hidden');
  $('#reload').removeClass('hidden');
  $('html, body').scrollTop($(document).height());
  document.querySelector("textarea").focus();
});
$('#commented').on('click', function() {
  if ($('#comments').find('textarea').val().trim() == '') {
    alert(enter_comment)
  } else {
    comment();
  }
});
var comment_id;
$('.comment').click(function(event) {
  refresh = false;
  var user = $(this).find('.user').text();
  comment_id = $(this).closest('.comment').attr('id');
  if (logged_fullname == user && !$(event.target).is('input')) {
    $(this).find('.comment_text').hide();
    $('#comments').find('textarea').text($('#'+comment_id).find('.comment_edit').text());
    $('#'+comment_id).append($('#comments').find('textarea'));
    $('#comments').find('textarea').attr('id', 'input'+comment_id);
    $('#comments').find('textarea').attr('name', 'input'+comment_id);
    $('#input'+comment_id).removeClass('hidden');
    $('#commented').remove();
    $('#footer > div > button').addClass('hidden');
    $('#add-leaves').addClass('hidden');
    $('#reload').removeClass('hidden');
    $('#comment_updated').removeClass('hidden');
    $('.comment').off('click');
    $('.comment_check').prop('disabled', true);
    $('#kwic').parent().children().addClass('hidden');
    $('#signout').prop('disabled', true);
    $('#diary').addClass('disabled');
    $('#modify_rights').remove();
    $('#toasts').remove()
    $('#user-menu-btn').prop('disabled', true)
    $('a').removeAttr('href');
  }
});
$('.comment_check').click(function() {
  $.ajax({
    url: '../checking_comment/'+$(this).closest('.comment').attr('id'),
    type: 'PUT',
    contentType: 'application/json',
    data: logged_fullname
  }).done(function(){refresh = true});
});
$('#comment_updated').on('click', function() {
  update_comment(comment_id);
});
function show_comment(id, user, date, text, checked) {
  $('#comments .template').clone(true).attr('id', id).appendTo("#comments");
  if (checked) {
    $('#'+id).addClass('checked');
    $('#'+id+' .checker').text(checked_by+' '+checked);
    $('#'+id).find('.comment_check').prop('checked', true);
  }
  $('#'+id+' .meta .user').text(user);
  $('#'+id+' .meta .moment').removeClass('moment').addClass(date).addClass('moment');
  $('#'+id+' .comment_text').text(text);
  $('#'+id).removeClass('template hidden');
  $('#'+id+' .comment_edit').text(text);
}
function update_comment(id) {
  refresh = true;
  $.ajax({
    url: '../update_comment_content/'+id,
    type: 'PUT',
    contentType: 'application/json',
    data: $('#'+id+'>textarea').val().trim()
  }).done(reload)
};
function comment() {
  refresh = true;
  var data = {
    commented: this_id,
    diary: diary_id,
    user: user,
    date: new Date().toJSON(),
    text: $('#comments').find('textarea').val().trim()
  };
  $.ajax({
    type: 'POST',
    url: '../',
    contentType: 'application/json',
    data: JSON.stringify(data)
  }).done(reload)
  .fail(error_alert)
}
