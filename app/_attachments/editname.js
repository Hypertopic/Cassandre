var diagram_leaves = [];
$('h1.editable').on('click', function() {
  refresh = false;
  $(this).hide();
  $('#leaves').find('li').each(function () {
    if ($(this).attr('class').split(' ').pop() == 'diagram')
      diagram_leaves.push($(this).find('a').attr('href').split('/').pop()); 
  });
  $('#sort').addClass('disabled');
  $('#show-activity').remove();
  $('#tasklist-alert').off();
  $('#diaries').prop('disabled', true);
  $('#drawTimeline').prop('disabled', true);
  $('#toggle').prop('disabled', true);
  $('#leave-name').addClass('hidden');
  $('#footer > div > button').prop('disabled', true);
  $('#add-leaves').addClass('hidden');
  $('#kwic').parent().children().addClass('hidden');
  $('a').removeAttr('href');
  $('#diary').addClass('disabled');
  $('#to-register').prop('disabled', true);
  $('#signin').prop('disabled', true);
  $('#signout').prop('disabled', true);
  $('.toast').toast('hide');
  $('#modify_rights').remove();
  $('#renamed').removeClass('hidden');
  $('#renamed').prop('disabled', false);
  $('#name').removeClass('hidden');
});
$('#renamed').on('click', function() {
  rename();
});
$('#name').on('keypress', function(key) {
  if (key.which == 13) rename();
});
function rename() {
  if ($('#name').val().trim() == '') {
    switch(this_type){
      case ('graph'):
        alert(enter_graph_name);
      break;
      case ('operational'):
      case ('field'):
      case ('interview'):
      case ('transcript'):
      case ('coding'):
      case ('table'):
      case ('theoretical'):
      case ('storyline'):
        alert(enter_memo_name);
      break;
      default:
        alert(enter_diary_name)
      break;
    }
  } else {
    renameDiagrams(diagram_leaves,$('#name').val().trim());
  }
};
async function renameDiagrams(ids,name) {
  ids.forEach(async (id) => {
    await renameDiagram(id,name);
  })
  edit_name();
}
function renameDiagram(id,name) {
  $.ajax({
    url: "../../rename_diagram/"+id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify({
     'id': this_id,
     'name': name
    })
  });
}
function edit_name() {
  $.ajax({
    url: '../../edit_name/'+this_id,
    type: 'PUT',
    contentType: 'application/json',
    data: $('#name').val().trim()
  }).fail(error_alert)
  .done(function(){
    refresh = true;
  }).done(reload);
};
