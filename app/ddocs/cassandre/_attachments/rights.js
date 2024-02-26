let action = ''
$('#add_contributor, #add_reader').on('keypress', function(key) {
  if (key.which == 13) {
    action = $(this).attr("id")
    modify_rights(action, $('#'.action).val().trim().toLowerCase());
  }
});
$('#add_contributor, #add_reader').autocomplete({
  minLength: 3,
  appendTo: '#modify_rights_dialog',
  source: function(request, response) {
    action = this.element[0].getAttribute('id')
    $.getJSON('../userlist/' + request.term, function (data) {
      response($.map(data.rows, function (value, key) {
        let concerned = action.replace('add_','')+'s'
        if (eval(concerned).split(',').concat(userids).indexOf(value.id) == -1) {
          userids.push(value.id);
          return {
            label: value.value.fullname,
            value: value.id
          };
        }
      }));
      userids = [];
    });
  },
  select: function (event, ui) {
    modify_rights(action, ui.item.value);
  }
});
$('.remove_reader, .remove_contributor').on('click', function() {
  modify_rights($(this).attr("class"), $(this).val());
});
$('#unsubscribe').on('click', function() {
  $.ajax({
    url: '../reader_unsubscribe/'+this_id,
    type: 'PUT',
    contentType: 'application/json'
  }).done(reload)
});
$('#modify_rights_dialog').on('show.bs.modal', function () {
  $('#modify_rights').tooltip('hide');
})
function modify_rights(action, value) {
  $('#modify_rights_dialog .modal-body').append($('#loading').removeClass('hidden'));
  $.ajax({
    url: '../modify_rights/'+this_id,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
     'action': action,
     'value': value
    })
  }).done(reload)
  .fail(error_alert)
}
