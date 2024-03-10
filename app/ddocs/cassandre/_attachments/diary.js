$('#header')
  .on('click', '#diaries', function() {
    self.location = '.';
  })
  .on('click', '#drawTimeline', function() {
    self.location = '../network/'+diary_id;
  })
  .on('click', '#patterns', function() {
    self.location = '../kwic/'+diary_id;
  });

$('#footer')
  .on('click', '#show_delete', function() {
    $("#network").addClass("hidden");
    $("#memos>li>input").removeClass("hidden");
    $("#cancel").removeClass("hidden");
    $("#delete").removeClass("hidden");
    $(".custom-switch").removeClass("hidden");
    $("#show_delete").tooltip('hide');
    $("#show_delete").addClass("hidden");
    $("#footer .more").addClass("hidden");
  })
  .on('click', '#toggle', function() {
    var checked = $("#toggle").is(":checked");
    $("input:enabled[type='checkbox']").each(function() {
      $(this).prop("checked", checked);
    });
  })
  .on('click', '#delete', function() {
    var checked = $("input.deletable:checked");
    var countdown = checked.length;
    if (!countdown) {
      resetUI();
    }
    checked.each(function() {
      var memo = $(this).closest(".memo");
      $.ajax({
        type: "DELETE",
        url: "../" + $(this).attr("id") + "?rev=" + $(this).attr("name"),
        success: function() {
          countdown--;
          if (countdown<1) {
            location.reload();
          }
        }
      });
    });
  });

$('.dropdown').on('show.bs.dropdown', function () {
  $('#sort').tooltip('hide');
})

$('#tasklist-alert').on('click', function() {
  self.location = '../tasklist/'+diary_id;
});

$('#show-activity').on('click', function() {
  self.location = '../activity/'+diary_id;
});

let action = action_name = candidate_id = candidate_fullname = '',
    userids = []
$('body').on('click', '#add_reader_right, #add_contributor_right, #remove_reader_right, #remove_contributor_right', function() {
  action = $(this).attr("id").replace('_right', '')
  action_name = eval('text.'+$(this).attr("id")).replace('&#39;', "'")
  $('#candidate_username').prop('placeholder', text.to_whom+' '+action_name.toLowerCase())
  $('#modify_rights_dialog .modal-title').html(action_name)
  if (action) {
    $('#who').removeClass('hidden')
    $('#modify_rights_dialog #loading').addClass('hidden')
    if (candidate_id) {
      $('#all_memos').prop('disabled', false)
      $('#modify').html(action_name+to+candidate_fullname)
    }
  }
});

$('body').on('change', '#all_memos', function() {
  if ($(this).is(':checked') && action && candidate_id) {
    $('#modify').prop('disabled', false)
  } else {
    $('#modify').prop('disabled', true)
  }
});

$('#modify_rights').on('click', function() {
  $("body").append("<div id='modify_rights_dialog' class='modal fade' role='dialog'>\
    <div class='modal-dialog' role='document'>\
      <div class='modal-content'>\
        <div class='modal-header'>\
          <h5 class='modal-title'>"+text.modify_rights+"</h5>\
          <button type='button' class='close' data-dismiss='modal' aria-label='Close'>\
            <span aria-hidden='true'>×</span>\
          </button>\
        </div>\
        <div class='modal-body'>\
          <div class='form-check form-check-inline'>\
            <input class='form-check-input' type='radio' name='action' id='add_reader_right' value='field' autocomplete='off' required>\
            <label class='form-check-label' for='add_reader_right'>"+text.add_reader_right+"</label>\
          </div>\
          <div class='form-check form-check-inline'>\
            <input class='form-check-input' type='radio' name='action' id='remove_reader_right' value='field' autocomplete='off' required>\
            <label class='form-check-label' for='remove_reader_right'>"+text.remove_reader_right+"</label>\
          </div>\
          <div class='form-check form-check-inline'>\
            <input class='form-check-input' type='radio' name='action' id='add_contributor_right' value='field' autocomplete='off' required>\
            <label class='form-check-label' for='add_contributor_right'>"+text.add_contributor_right+"</label>\
          </div>\
          <div class='form-check form-check-inline'>\
            <input class='form-check-input' type='radio' name='action' id='remove_contributor_right' value='field' autocomplete='off' required>\
            <label class='form-check-label' for='remove_contributor_right'>"+text.remove_contributor_right+"</label>\
          </div>\
        </div>\
        <div id='who' class='modal-body justify-content-center hidden'>\
        </div>\
        <div id='check' class='modal-body justify-content-center'>\
          <div class='form-check'>\
            <input class='form-check-input' type='checkbox' id='all_memos' autocomplete='off' disabled>\
            <label class='form-check-label' for='all_memos'>"+text.apply_to_all_memos+"</label><br/>\
          </div>\
        </div>\
        <div class='modal-footer hidden'>\
          <button type='button' class='btn btn-secondary' data-dismiss='modal'>"+text.cancel+"</button>\
          <button id='modify' type='button' class='btn btn-primary' disabled>Ok</button>\
          <div id='loading' class='' title='"+text.loading+"'><span class='spinner spinner-border spinner-border-sm' role='status'></span></div>\
        </div>\
      </div>\
    </div>\
  </div>")
  if (!$('#candidate_username').length)
  $("<input id='candidate_username' class='form-control' type='search' placeholder='' autocomplete='off'/>")
  .appendTo($('#who'))
  .autocomplete({
    minLength: 3,
    appendTo: '#modify_rights_dialog',
    source: function(request, response) {
      $.getJSON('../userlist/' + request.term, function (data) {
        response($.map(data.rows, function (value, key) {
          let concerned = action_name.replace('add_','')+'s'
          if (userids.indexOf(value.id) == -1) {
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
      candidate_id = ui.item.value
      candidate_fullname = ui.item.label
      $('#all_memos').prop('disabled', false)
      $('#modify_rights_dialog .modal-footer').removeClass('hidden')
      $('#who').addClass('hidden')
      $('#modify')
        .html(action_name+to+candidate_fullname)
        .prop('disabled', true)
    }
  })
  $('#modify_rights_dialog').modal('show')
});

$('body').on('click', '#modify', function() {
  $('#loading').removeClass('hidden')
  let last_memo = memos[memos.length - 1]
  last_memo = last_memo.id
  for (let m of memos) {
    $.ajax({
      url: '../modify_rights/'+m.id,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
       'action': action,
       'value': candidate_id
      })
    }).always(function(){
      if (last_memo === m.id) {
        $('#loading').addClass('hidden')
        reload()
      }
    })
  }
});

function resetUI() {
  $("#memos>li>input").addClass("hidden");
  $("#footer .form-check-inline").children().not('#modify_rights').addClass("hidden");
  $("#show_delete").removeClass("hidden");
  $("#footer .more").removeClass("hidden");
}

function taskreport(task, count) {
  if (count > 0) {
    $("#tasklist-alert").append($('<div>', {
      id: task,
      class: "list-group-item list-group-item-action list-group-item-secondary d-flex justify-content-between align-items-center",
      text: text[task],
      title: text[task]
    }));
    $('#'+task).append($('<span>', {
      class: "badge badge-pill badge-info",
      text: count
    }));
  }
  number = number + count;
}

$('.more').on('click', function() {
  includePublic();
});

function showMore() {
  includePublic();
};
  
async function getMore(coord) {
  if (ready == true) return new Promise((resolve, reject) => {
    ready = false; 
    $.ajax({
      url: '../memos/'+diary_id+'/'+by+'/'+coord,
      type: "GET",
      dataType: "json",
      success: function(data) {
        list = list.concat(data);
        if (data.length > 0) {
          resolve(data[data.length-1].sortkey);
        } else {
          if (list.length > 0) {
            resolve(list[list.length-1].sortkey);
          } else {
            resolve(horizon);
          }
        }
      }
    });
  });
}

function informingUser() {
  refresh = false;
  $("#content").append($('<div>', {
    text: text.patience_during_conversion,
    class: "alert alert-primary justify-content-between",
    role: "alert"
  }));
  $('a').removeAttr('href');
  $('.btn').addClass('disabled');
  $('button').prop('disabled', true).tooltip('dispose');
  $('#tasklist-alert').remove();
  $('#content>.alert').append($('.spinner-border'));
}

function cleaningUserDoc(d) {
  d = JSON.parse(d);
  var b = d.user_activity.filter(function(m) {
    var p = memos.map(function(a){return a.id}).indexOf(m.doc);
    return p > -1;
  });
  var data = {
    'memos': b.map(function(a){return a.doc})
  };
  if (d.memo_order && d.memo_order.length > 0) data.order = diary_id
  $.ajax({
    type: "PUT",
    url: '../clean_user_activity/'+user,
    contentType: "application/json",
    data: JSON.stringify(data)
  })
}

function creatingDiaryUserDoc(by) {
  var user_activity = [],
      obj = {
    'diary': diary_id,
    'user': user,
    'memo_order': by,
    'user_activity': [],
    'contributors': [user],
    'readers': [user]
  };
  $.ajax({
    url: '../'+user,
    type: "GET",
    dataType: "json"
  }).done(function(u) {
    if(u.activity && u.activity.length > 0) {
      user_activity = u.activity.filter(function(m) {
        var p = memos.map(function(a){return a.id}).indexOf(m.doc);
        return p > -1 && memos[p].date < m.date;
      });
    }
    obj.user_activity = user_activity
    $.ajax({
      url: relpath+diary_id+'_'+user,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(obj)
    }).done(function() {
      refresh = true;
      reload();
    })
  });
}

function relocateActivity(by) {
  $.ajax({
    url: relpath+diary_id+'_'+user,
    type: 'GET'
  }).done(function(d){
    cleaningUserDoc(d);
  }).fail(function(){
    informingUser()
    creatingDiaryUserDoc(by)
  });
}
function setDiaryName(dn) {
  if (dn) {
    $('h1').prepend(dn);
    $('h1 .spinner-border').addClass("d-none");
    $('#name').val(dn);
    $('title').prepend(dn);
  }
}
