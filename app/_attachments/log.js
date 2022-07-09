$('#sign-in').on('click', function() {
  $('#signin').removeClass('hidden');
  $('#signin').children().removeClass('hidden');
  $('#sign-in')
    .tooltip('hide')
    .addClass('hidden');
  $('#to-register').addClass('hidden');
  $('#diaries').parent().children().addClass('hidden');
  $('#render').parent().addClass('hidden');
  $('#diary').addClass('hidden');
  $('#lexical').addClass('hidden');
  $('#modify_rights').addClass('hidden');
  $('#show-activity').addClass('hidden');
  $('#toggle-groundings').addClass('hidden');
  $('#comment_create').addClass('hidden');
  $('#search-icon').addClass('hidden');
  $('#show_delete').addClass('hidden');
  $('#signin').append($('#reload'));
  $('#reload').removeClass('hidden');
});
$('#search-icon').on('click', function() {
  $('#header .btn').addClass('disabled');
  $('#search-input').parent().append($('#reload'));
  $('#search-input').removeClass('hidden');
  $('#reload').removeClass('hidden');
  $('#reload').addClass('ml-0');
  $('#header .dropdown').remove();
  $('#footer').remove();
  $('#diary').remove();
  $('#show-activity').addClass('hidden');
  $('#toggle-groundings').remove();
  $('#drawTimeline').parent().remove();
  $('#drawChart').parent().remove();
  $('#diaries').remove();
  $('#revert').remove();
  $('#lexical').parent().remove();
  $('#logged').remove();
  $('a').removeAttr('href');
  $('.toast').toast('hide');
  $('.close').remove();
  $('#modify_rights').remove();
  $('#tasklist-alert').off();
  $('h1').off();
  $('#show-activity').off();
  $('#search-icon').parent().parent().parent().parent().addClass('w-100');
  $('#search-icon').parent().parent().parent().addClass('w-100');
  $('#search-icon').parent().parent().addClass('w-100');
  $('#search-icon').parent().addClass('nav-fill w-100');
  $('#search-icon').tooltip('hide');
  $('#search-icon').addClass('hidden');
  stickToHeader();
});

$('#to-register').on('click', function() {
  self.location = relpath+'register/';
});
$('#signin').on('submit', function(e) {
  e.preventDefault();
  $(this).find('input').first().val($(this).find('input').first().val().toLowerCase());
  var username = $(this).find('input').first().val().toLowerCase();
  $.ajax({
    url: '/_session',
    type: 'POST',
    data: $(this).serialize(),
    contentType: 'application/x-www-form-urlencoded',
  }).done(reload)
  .fail(function(request) {
      var mismatch = wrong_password;
      alert(mismatch);
    }
  );
});
$('#signout').on('click', function() {
  $.ajax({
    type: 'DELETE',
    url: '/_session',
    success: reload
  });
});
$('#storing_fullname').on('click', function() {
  toUserDoc();
});
$('#user_fullname').on('keypress', function(key) {
  if (key.which == 13) toUserDoc();
});

function toUserDoc() {
  fullname = $('#user_fullname').val().trim();
  $.ajax({
    type: 'GET',
    url: relpath+'config',
    dataType: 'json'
  }).done(function(data){
    if (fullname.length > 0) 
      createUserDoc(user, data.sponsors.ldap, reload, updateUserDoc);
  });
}

function createUserDoc(user, sponsor, success, error) {
  $.ajax({
    url: relpath+'userfullname/'+fullname,
    type: 'GET'
  }).done(function(u){
    if (u.rows.length > 0) fullname += ' ('+user+')';
    var obj = {
      '_id': user,
      'contributors': [user],
      'fullname': fullname
    };
    if (sponsor && sponsor.length > 0) obj.readers = sponsor;
    $.ajax({
      url: '../../'+user,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(obj)
    }).done(success)
    .fail(error)
  });
}

var updateUserDoc = function() {
  $.ajax({
    url: relpath+'username/'+user,
    type: 'PUT',
    contentType: 'application/json',
    data: fullname
  }).done(reload)
};
