$('#sign-in').on('click', function() {
  $('#signin').removeClass('hidden');
  $('#sign-in').addClass('hidden');
  $('#to-register').addClass('hidden');
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
