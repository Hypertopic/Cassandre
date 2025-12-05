function version_tab(o){
  let u = o.history[o.history.length-1].user, 
      d = o.history[o.history.length-1].date
  if (!fullnames[u]) getFullname(u)
  let tab_text = o.name.substr(0, 20)+'<br/>'+fullnames[u]+'<br/>'+ hr_time(d)
  return tab_text
}
function user_rgb(u){
  if (!fullnames[u]) getFullname(u)
  let initials = getInitials(fullnames[u]),
      rgb = initialsToRGB(initials)
  return rgb
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
      let user_color_array = user_rgb(old.history[old.history.length-1].user),
          user_color = 'rgb('+ user_color_array.join(',')+')',
          contrast = 'light'
      if (user_color_array.reduce((a, b) => a + b, 0) > 600) contrast = 'dark'
      $('#tab_'+n).append($('<button>', {
        class: 'btn btn-outline-light active',
        style: 'color:'+user_color+'; border-color:'+user_color,
        html: version_tab(old)
      })).on('click', function(){showOnly($(this).prop('id').split('_')[1]); });
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
    if (p.status === 'addition') output += '<p class="added"><span class="bg-success text-light text-monospace">&nbsp;+ </span> <span class="alert-success">&nbsp;'+p.turn+'</span></p>'
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
function diff_buttons(){
  let a = $('.version:not(.d-none) .added').length,
      d = $('.version:not(.d-none) .deleted').length,
      k = $('.version:not(.d-none) .kept').length,
      h = $('.version:not(.d-none) .hidden').length,
      m = a+d,
      t = a+d+k
  if (t > 0 && h > 0) {
    $('#showNotModified').removeClass('hidden')
  } else {
    if (!$('#showNotModified').hasClass('hidden')) $('#showNotModified').addClass('hidden')
  }
  if (m > 0 && k > 0 && h < 1) {
    $('#only_diff').removeClass('hidden')
  } else {
    if (!$('#only_diff').hasClass('hidden')) $('#only_diff').addClass('hidden')
  }
}
function showOnly(n){  
  selected = n
  $('#groundings li button').each(function() {
    let color = $(this).css('border-color')
    $(this).removeClass('active').removeClass('text-dark').removeClass('text-light').css('color', color+' !important').css('border-color', color).css('background-color', '')
  })
  $('.version').addClass('d-none')
  $('#v'+n).removeClass('d-none')
  diff_buttons()
  let active_color = $('#tab_'+n+' button').css('border-color')
  $('#tab_'+n+' button').addClass('active').css('background-color', active_color).css('color', 'white')
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
  $('#mdown').removeClass('hidden')
  diff_buttons()
})
$('#only_diff').on('click', function() {
  $('#bodies p.kept, #diff, #only_diff').addClass('hidden')
  diff_buttons()
})
$('#mdown').on('click', function() {
  mdownLayout()
  $('#mdown, #showNotModified').addClass('hidden')
  if (!$('#only_diff').hasClass('hidden')) $('#only_diff').addClass('hidden')
  $('#diff').removeClass('hidden')
})
$('#showNotModified').on('click', function() {
  $('#bodies p.hidden').removeClass('hidden')
  $('#showNotModified').addClass('hidden')
  diff_buttons()
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
