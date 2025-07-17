$('#edit-local').on('click', function() {
  leaveChoice()
})
$('#edit-remote').on('click', function() {
  leaveChoice()
  easymde.clearAutosavedValue()
  easymde.value(remote_text)
})
$('#diff').on('click', function() {
  diffLayout()
  $('#diff').addClass('hidden')
  $('#mdown').removeClass('hidden')
})
$('#mdown').on('click', function() {
  mdownLayout()
  $('#mdown').addClass('hidden')
  $('#diff').removeClass('hidden')
})
$('#double').on('click', function() {
  double()
})
$('#cancel').on('click', function() {
  save(false, toDoAfter)
})
$('#done').on('click', function() {
  save(true, toDoAfter)
})
function double() {
  easymde.value(easymde.value().replace(/\n/g, "\n \n"))
}
function cherrypick(){
  $('#groundings, #content, #done, #cancel, #double, .editor-toolbar').addClass('hidden')
  $('#local').attr("rows", local_content.length + 2)
  $('#remote').attr("rows", remote_content.length + 2)
  $("#local").val(easymde.value())
  $("#cherrypick").removeClass('d-none')
  $("#diff, #edit-local, #edit-remote").removeClass('hidden')
  mdownLayout()
}
function mdownLayout(){
  if (this_type == 'interview') {
    $("#diff").addClass('hidden')
    diffLayout()
  } else {
    $("#local_diff").html(converter.makeHtml(local_text.replace(/&gt;/g, '>').trim()))
    $("#remote_diff").html(converter.makeHtml(remote_text.replace(/&gt;/g, '>').trim()))
    $("#cherrypick a").removeAttr("href")
  }
}
function diffLayout(){
  $("#local_diff").html(createDiff(local_content, remote_content, 'success'))
  $("#remote_diff").html(createDiff(remote_content, local_content, 'info'))
}
function createDiff(arrayOne, arrayTwo, color) {
  let diff = ''	
  for (let j in arrayOne) {
    let turn = arrayOne[j], style = ''
   if (turn.trim().length > 0) {
     if (arrayTwo.indexOf(turn) < 0) {
      turn = '<p class"added"><span class="bg-'+color+' text-light text-monospace">&nbsp;+ </span> <span class="alert-'+color+'">&nbsp;'+turn+'</span></p>'
      } else {
      turn = '<p class="kept"><span class="alert-secondary text-monospace">&nbsp;=&nbsp;</span><span>'+turn+'</span></p>'
      }
    }
    diff += turn
  }
  return diff
}
function leaveChoice() {
  $('#groundings, #content, #done, #cancel, #double, .editor-toolbar').removeClass('hidden')
  $('#diff, #mdown, #showNotModified, #edit-local, #edit-remote').addClass('hidden')
  $("#cherrypick").addClass('d-none')
}
function save(modify, toDoAfter) {
  warning = false
  var data = {
    name: 'false',
    body: 'false'
  }
  if (modify) data.body = easymde.value().replace(/ *\n/g, " \n")
  $.ajax({
    url: '../update_memo_content/'+this_id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(data)
  }).done(toDoAfter)
  .fail(function(request) {
    if (request.status == 401) alert(lost_connection.replace(/&#39;/g,"'").replace(/&quot;/g,'"'))
    self.location = '../memo/'+this_id
  })
}
var toDoAfter = function() {
  easymde.clearAutosavedValue()
  self.location = '../memo/'+this_id
}
