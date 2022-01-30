function render(){
  announceMaintenance(maintenance, maintenance_in_progress);
  renderRights()
  renderLeaves()
  stickToHeader()
  let refresh = true;
}
function announceMaintenance(before, during){
  $.ajax({
    type: 'GET',
    url: '/maintenance',
    dataType: 'json'
  }).done(function(data){
    var maintenance_start = new Date(data.date);
    var maintenance_end = moment(maintenance_start).add(30, 'm').toDate();
    if (maintenance_start > new Date(Date.now())) {
      inform('danger', before+' '+moment(data.date).calendar().toLowerCase());
    } else if (maintenance_end > new Date(Date.now())) {
      inform('danger', during+' '+moment(data.date).add(30, 'm').fromNow());
    }
  });
}
function renderRights(){
  if ($('.contributors').text().trim().length < 1) {
    $('.contributors').before(everyone);
  }
  if ($('.readers').text().trim().length < 1) {
    $('.readers').before(everyone);
  }
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
