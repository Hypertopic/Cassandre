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

function resetUI() {
  $("#memos>li>input").addClass("hidden");
  $("#footer .form-check-inline").children().addClass("hidden");
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
