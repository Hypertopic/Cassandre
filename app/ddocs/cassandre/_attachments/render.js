function render(){
  announceMaintenance(maintenance, maintenance_in_progress);
  renderLeaves()
  momentRelative('')
  $('#memo_creator')
    .append($('#creator>.username').text().split(/[ -]+/).map((n) => n[0]).join('').toUpperCase())
    .attr('title', $('#creator').text())
    .removeClass('hidden')
  coloringInitials($('#creator>.username').text())
  stickToHeader()
  let refresh = true;
}
function coloringInitials(fullname){
  let initials = fullname.split(/[ -]+/).map((n) => n[0]),
      rgb = [];
  for (i of initials) rgb.push((i.charCodeAt() - 60) * 16)
  if (initials.length === 2) rgb.splice(1, 0, fullname.length * 7)
  $('#memo_creator').css('background-color', 'rgb('+rgb.join(',')+')')
  if (rgb.reduce((a, b) => a + b, 0) > 600)
    $('#memo_creator')
      .addClass('text-dark')
      .addClass('border-dark')
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
