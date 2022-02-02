$('#comment_create').click(function () {
  refresh = false;
  $('#comment_create').remove();
  $('#footer > div > button').prop('disabled', true);
  $('#render').prop('disabled', true);
  $('#commented').prop('disabled', null);
  $('#leave-name').addClass('hidden');
  $('#kwic').parent().children().addClass('hidden');
  $('#modify_rights').remove();
  $('a').removeAttr('href');
  $('#diary').addClass('disabled');
  $('#signout').prop('disabled', true);
  $('#add-leaves').addClass('hidden');
  $('.toast').toast('hide');
  $('#comments').find('textarea').removeClass('hidden');
  $('#commented').removeClass('hidden');
  $('html, body').scrollTop($(document).height());
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
    $('#footer > div > button').prop('disabled', true);
    $('#add-leaves').addClass('hidden');
    $('#comment_updated').removeClass('hidden');
    $('#comment_updated').prop('disabled', false);
    $('.comment').off('click');
    $('#kwic').parent().children().addClass('hidden');
    $('#signout').prop('disabled', true);
    $('#diary').addClass('disabled');
    $('#modify_rights').remove();
    $('.toast').toast('hide');
    $('a').removeAttr('href');
  }
});
$('.comment_check').click(function() {
  $.ajax({
    url: '../../checking_comment/'+$(this).closest('.comment').attr('id'),
    type: 'PUT',
    contentType: 'application/json',
    data: logged_fullname
  }).done(function(){refresh = true});
});
$('#comment_updated').on('click', function() {
  update_comment(comment_id);
});
function update_comment(id) {
  refresh = true;
  $.ajax({
    url: '../../update_comment_content/'+id,
    type: 'PUT',
    contentType: 'application/json',
    data: $('#'+id+'>textarea').val().trim(),
    success: reload
  });
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
    url: '../../',
    contentType: 'application/json',
    data: JSON.stringify(data),
    error: function(request) {
      alert(
        (JSON.parse(request.responseText).reason || request.responseText)
        + '\\nCode ' + request.status
      );
    },
    success: reload
  });
}