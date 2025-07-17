function version_tab(o){
  let u = o.history[o.history.length-1].user, 
      d = o.history[o.history.length-1].date
  if (!fullnames[u]) getFullname(u)
  let tab_text = o.name.substr(0, 20)+'<br/>'+fullnames[u]+'<br/>'+ hr_time(d)
  return tab_text
}
function getPrevious(rev){
  $.ajax({
    url: '../rev/'+this_id+'/'+rev+'/',
    type: "GET",
    dataType: "json"
  }).done(function(old){
    let text = old.body, n = rev.split('-')[0]
    if (old.editing) {
      $('#tab_'+n).remove()
    } else {
      bodies.push({
        version: n, name: old.name, body: old.body
      })
      $('#tab_'+n).append($('<button>', { class: "btn btn-outline-secondary", html: version_tab(old)}))
      .on('click', function(){showOnly($(this).prop('id').split('_')[1]); });
      $('#v'+n).append($('<h2>', { text: old.name }))
        .append($('<div>').text(text).addClass('content'))
    }
  })
}
function fullDiff(oldText, newText){
  let oldArray = oldText.split(/\r\n|\r|\n/), newArray = newText.split(/\r\n|\r|\n/), coloredDiff = [], output = ''
      all = merge(newArray, oldArray)
  for (let turn of all){
    if (turn.trim().length > 0) {
      let status = ''
      if (oldArray.indexOf(turn) < 0) status = 'addition'
      if (newArray.indexOf(turn) < 0) status = 'deleted'
      coloredDiff.push({'status': status, 'turn': turn})
    }
  }
  for (let p of coloredDiff) {
    if (p.status === 'deleted') output += '<p class="deleted"><span class="bg-danger text-light text-monospace">&nbsp;- </span><del class="alert-danger">&nbsp;'+p.turn+'</del></p>'
    if (p.status === 'addition') output += '<p class"added"><span class="bg-success text-light text-monospace">&nbsp;+ </span> <span class="alert-success">&nbsp;'+p.turn+'</span></p>'
    if (p.status === '') output += '<p class="kept"><span class="alert-secondary text-monospace">&nbsp;=&nbsp;</span><span>'+p.turn+'</span></p>'
  }
  return output
}
function mdownLayout(){
  for (let v of bodies) {
    let body = v.body
    if (this_type == 'interview') {
      body = body.replace(/\n \n/g, '</font></p><p><font>')
    } else {
      body = converter.makeHtml(body.replace(/&gt;/g, '>').trim())
    }
    $('#v'+v.version).children('.content').html(body)
  }
}
function diffLayout(){
  last_content = ''
  let max = bodies.length-1
  for (let i = max; i > -1; i = i-1) {
    let v = bodies[i]
    $('#v'+v.version).children('.content').html(fullDiff(last_content, v.body))
    last_content = v.body
  }
}
function showOnly(n){  
  selected = n
  $('#groundings li button').removeClass('active')
  $('.version').addClass('d-none')
  $('#v'+n).removeClass('d-none')
  $('#tab_'+n+' button').addClass('active')
  if (current == selected) {
    $('#cancel').removeClass('d-none')
    $('#revert').addClass('d-none')
  } else {
    $('#revert').removeClass('d-none')
    $('#cancel').addClass('d-none')
  }
}
$('#cancel').on('click', function() {
  self.location = '../memo/'+this_id
})
$('#revert').on('click', function() {
  reverting()
})
$('#diff').on('click', function() {
  diffLayout()
  $('#diff').addClass('hidden')
  $('#mdown, #only_diff').removeClass('hidden')
})
$('#only_diff').on('click', function() {
  $('#bodies p.kept, #diff, #only_diff').addClass('hidden')
  $('#showNotModified').removeClass('hidden')
})
$('#mdown').on('click', function() {
  mdownLayout()
  $('#mdown, #showNotModified').addClass('hidden')
  $('#diff').removeClass('hidden')
})
$('#showNotModified').on('click', function() {
  $('#bodies p.hidden, #onlydiff').removeClass('hidden')
  $('#showNotModified').addClass('hidden')
})
function reverting() {
  let data = bodies.find(x => x.version === selected)
  delete data.version
  $.ajax({
    url: '../update_memo_content/'+this_id,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(data)
  }).done(function() {
    self.location = '../memo/'+this_id
  })
}
const merge = (a, b, predicate = (a, b) => a === b) => {
  const c = [...a]
  b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
  return c
}
