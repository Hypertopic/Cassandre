$('#add_contributor').on('keypress', function(key) {
  if (key.which == 13) {
    modify_rights('add_contributor', $('#add_contributor').val().trim().toLowerCase());
  }
});
$('#add_contributor').autocomplete({
  minLength: 3,
  appendTo: '#modify_rights_dialog',
  source: function(request, response) {
    $.getJSON('../../userlist/' + request.term, function (data) {
      response($.map(data.rows, function (value, key) {
        if (contributors.split(',').concat(userids).indexOf(value.id) == -1) {
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
    modify_rights('add_contributor', ui.item.value);
  }
});
$('#add_reader').on('keypress', function(key) {
  if (key.which == 13) {
    modify_rights('add_reader', $('#add_reader').val().trim().toLowerCase());
  }
});
$('#add_reader').autocomplete({
  minLength: 3,
  appendTo: '#modify_rights_dialog',
  source: function(request, response) {
    $.getJSON('../../userlist/' + request.term, function (data) {
      response($.map(data.rows, function (value, key) {
        if (readers.split(',').concat(userids).indexOf(value.id) == -1) {
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
    modify_rights('add_reader', ui.item.value);
  }
});
$('.remove_reader').on('click', function() {
  modify_rights('remove_reader', $(this).val());
});
$('.remove_contributor').on('click', function() {
  modify_rights('remove_contributor', $(this).val());
});
$('#unsubscribe').on('click', function() {
  $.ajax({
    url: '../../reader_unsubscribe/'+this_id,
    type: 'PUT',
    contentType: 'application/json'
  }).done(reload)
});
function modify_rights(action, value) {
  $.ajax({
    url: '../../modify_rights/'+this_id,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
     'action': action,
     'value': value
    }),
    error: function(request) {
      alert(
        (JSON.parse(request.responseText).reason || request.responseText)
        + '\\nCode ' + request.status
      );
    }
  }).done(reload)
}
