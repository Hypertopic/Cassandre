function render(){
  announceMaintenance(maintenance, maintenance_in_progress);
  renderLeaves()
  momentRelative('')
  $('#memo_creator')
    .append($('#creator>.username').text().split(" ").map((n) => n[0]).join('').toUpperCase())
    .attr('title', $('#creator').text())
    .removeClass('hidden')
  stickToHeader()
  let refresh = true;
}
function renderLeaves(){
  if ($('#name').val().length > 0) {
    $('#add').removeClass('hidden');
    $('.input-group-append > #create').removeClass('hidden');
    $('.input-group-append > #create-table').removeClass('hidden');
    $('#leave-name').removeClass('hidden');
  }
  if ($('#leaves li').length > 0) {
    $('#show-leaves').removeClass('invisible');
  } else {
    $('#leaves').addClass('invisible d-lg-none');
    $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block');
  }
}
