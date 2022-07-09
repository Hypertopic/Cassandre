function render(){
  announceMaintenance(maintenance, maintenance_in_progress);
  renderLeaves()
  momentRelative('')
  stickToHeader()
  let refresh = true;
}
function announceMaintenance(before, during){
  $.ajax({
    type: 'GET',
    url: relpath+'config',
    dataType: 'json'
  }).done(function(data){
    var maintenance_start = new Date(data.maintenance.date),
        maintenance_end = new Date(maintenance_start.getTime() + (60000* data.maintenance.duration));
    if (maintenance_start > new Date(Date.now())) {
      inform('danger', before.replace('@duration', data.maintenance.duration).replace('@moment', '<span class="'+data.maintenance.date+' moment"></span>'));
    } else if (maintenance_end > new Date(Date.now())) {
      inform('danger', during+' <span class="'+new Date(maintenance_end).toJSON()+' moment"></span>');
    }
    momentRelative('')
  });
}
function renderLeaves(){
  if ($('#name').val().length > 0) {
    $('#add').removeClass('hidden');
    $('#leave-name').removeClass('hidden');
  }
  if ($('#leaves li').length > 0) {
    $('#show-leaves').removeClass('invisible');
  } else {
    $('#leaves').addClass('invisible d-lg-none');
    $('#leaves').removeClass('d-sm-block d-md-block d-lg-block d-xl-block');
  }
}
