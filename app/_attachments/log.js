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
    success: reload,
    error: function(request) {
      var mismatch = wrong_password;
      alert(mismatch);
    }
  });
});
$('#signout').on('click', function() {
  $.ajax({
    type: 'DELETE',
    url: '/_session',
    success: reload
  });
});
