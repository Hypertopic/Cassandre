function render(){
  announceMaintenance(maintenance, maintenance_in_progress);
  renderLeaves()
  momentRelative('')
  showCreator()
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
