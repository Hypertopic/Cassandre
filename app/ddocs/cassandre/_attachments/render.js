function render(){
  if (localStorage.getItem(user+'_align')) justify()
  announceMaintenance(maintenance, maintenance_in_progress)
  renderLeaves()
  momentRelative('')
  showCreator()
  stickToHeader()
  if (localStorage.getItem(user+'_tips-off')) {
    $('#tips-off').addClass('hidden')
    $('#tips-on').removeClass('hidden')
  }
  if (localStorage.getItem(user+'_icons')) {
    $('#icons-inline').addClass('hidden')
    $('#icons-offline').removeClass('hidden')
  }
  let refresh = true
}
function renderLeaves(){
  if ($('#name').val().length > 0) {
    $('#add').removeClass('hidden')
    $('.input-group-append > #create').removeClass('hidden')
    $('.input-group-append > #create-table').removeClass('hidden')
    $('#leave-name').removeClass('hidden')
  }
  if ($('#leaves li').length > 0) {
    $('#show-leaves').removeClass('invisible')
  } else {
    $('#leaves').addClass('invisible d-lg-none')
    $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block')
  }
}
