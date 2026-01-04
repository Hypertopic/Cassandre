$('#show').on('click', function() {
  $(".badge").removeClass('d-none')
  $.ajax({
    url: "../news/",
    type: "GET",
    dataType: "json",
    success: function(data) {
      for (var n of data) {
        $('#'+n.id).text(n.size)
        if (n.news) {
          $('#'+n.id).prepend(n.news+' / ')
          $('#'+n.id).parent().parent().removeClass('bg-light')
          $('#'+n.id).parent().parent().addClass('alert-success')
          $('#'+n.id).parent().parent().attr("title", updated_diary)
          $('#'+n.id).removeClass('badge-secondary')
          $('#'+n.id).addClass('badge-success')
          $('#'+n.id).attr("title", memos_number)
          if (typeof n.lastvisit !== 'undefined') {
            $("<br/><span class='lastvisit'>"+last_visit+" <span class='"+n.lastvisit+" moment'></span></span>").insertAfter('#'+n.id)
          }
        }
      }
    }
  }).done(function(){
    $("#show").addClass('d-none')
    momentRelative('.card-columns')
    $(".progress-bar-striped").removeClass('progress-bar progress-bar-striped progress-bar-animated')
  })
})

$('#my_diary').on('keypress', function(key) {
  if ($('#my_diary').val().length > 0) {
    $('a').removeAttr('href')
    $('.in-collection').remove()
    $('#signout').prop('disabled', true)
    $('#show').prop('disabled', true)
    $('#show').remove()
    $('#reload').removeClass("hidden")
    $('#create_diary').removeClass("d-none")
  }
  if (key.which == 13) {
    createDiary($('#my_diary').val().trim())
  }
})

$('#create_diary').on('click', function() {
  createDiary($('#my_diary').val().trim())
})

function createDiary(diary_name) {
  if (diary_name == '') {
    alert(enter_diary_name)
  } else {
    var diary = {
      diary_name: diary_name,
      history: [{
        "user": user,
        "date": new Date().toJSON(),
        "name": diary_name
      }]
    }
    var data = {
      contributors: [],
      readers: [],
      type: 'theoretical',
      initial: true,
      history: [{
        "user": user,
        "date": new Date().toJSON()
      }],
      editing: {
        "user": user,
        "date": new Date().toJSON()
      },
      name: name_theoretical,
      body: ""
    }
    if (logged) {
      data.contributors.push(logged)
      data.readers.push(logged)
    }
    $.ajax({
      url: "../",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(diary),
      success: function(diary) {
        data.diary = diary.id
        $.ajax({
          url: "../",
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(data),
          success: function(data) {
            location.replace('../editable_memo/'+data.id)
          }
        })
      }
    })
  }
}
