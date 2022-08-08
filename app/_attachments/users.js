$('#diaries').on('click', function() {
  self.location = '../diary/';
});

$('#in_cohort .btn-primary').on('click', function() {
  var c = $('#target_cohort').val().trim().replace(/[^0-9A-Za-zÀ-ȕ-]/g, '_')
  if (c.length > 0) move_user_in_cohort(c)
});

$('#target_cohort').on('keypress', function(key) {
  if (key.which == 13) {
    var c = $('#target_cohort').val().trim().replace(/[^0-9A-Za-zÀ-ȕ-]/g, '_')
    if (c.length > 0) move_user_in_cohort(c)
  }
});

function show_user_in_cohort(userid, cohort) {
  $('#'+cohort+' ul').append($('li[id="'+userid+'"]'));
  $('li[id="'+userid+'"] span svg')
    .removeClass('to-cohort')
    .addClass('from-cohort');
  $('li[id="'+userid+'"] span svg use').attr('xlink:href', '../style/bootstrap-icons.svg#box-arrow-up-right');
}

$('div').on('click', '.to-cohort', function(event) {
  let name = $(this).parent().parent().find('a').text();
  id = $(this).parent().parent().attr("id");
  $('#in_cohort').find('.diary').text(name);
  $('#in_cohort').modal('show');
  return false;
});

$('div').on('click', '.from-cohort', function(event) {
  let cohort = $(this).parent().parent().parent().parent().attr("id");
  id = $(this).parent().parent().attr("id");
  $.ajax({
    url: '../user_in_cohort/'+user,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      'user': id,
      'cohort': cohort,
      'remove': 'true'
    })
  }).done(reload);
  return false;
});

function showMore() {}

