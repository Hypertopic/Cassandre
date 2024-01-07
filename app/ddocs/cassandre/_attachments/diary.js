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
