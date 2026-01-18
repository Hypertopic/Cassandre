$('#sign-in').on('click', function() {
  $('#signin').removeClass('hidden')
  $('#signin').children().removeClass('hidden')
  $('#sign-in')
    .tooltip('hide')
    .addClass('hidden')
  $('#to-register').addClass('hidden')
  $('#diaries').parent().children().addClass('hidden')
  $('#render').parent().addClass('hidden')
  $('#diary, #source2clipboard, #lexical').addClass('hidden')  
  $('#modify_rights').addClass('hidden')
  $('#revert').addClass('hidden')
  $('#show-activity').addClass('hidden')
  $('#toggle-groundings').addClass('hidden')
  $('#comment_create').addClass('hidden')
  $('#search-icon').addClass('hidden')
  $('#header .creator').addClass('hidden')
  $('#show_delete').addClass('hidden')
  $('#signin').append($('#reload'))
  $('#reload').removeClass('hidden')
  $('#logged').parent().parent('.nav-fill').removeClass('hidden')
  if ($('#signin').find('input').first().val().length > 0) $('#signin button').removeAttr('disabled')
})
$('#search-button').on('click', function() {
  $('#header .btn').addClass('disabled')
  $('#search-comments').removeClass('hidden')
  $('#search-button').addClass('hidden')
})
$('#search-icon').on('click', function() {
  $('#header .btn').addClass('disabled')
  $('#search-input').parent().append($('#reload'))
  $('#search-input').removeClass('hidden')
  $('#reload').removeClass('hidden')
  $('#reload').addClass('ml-0')
  $('#header .dropdown').remove()
  $('#header .creator').remove()
  $('#footer').remove()
  $('#diary').remove()
  $('#show-activity').addClass('hidden')
  $('#toggle-groundings').remove()
  $('#drawTimeline').parent().remove()
  $('#drawChart').parent().remove()
  $('#diaries').remove()
  $('#revert').remove()
  $('#lexical').parent().remove()
  $('#logged').remove()
  $('a').removeAttr('href')
  $('.toast').toast('hide')
  $('.close').remove()
  $('#modify_rights').remove()
  $('#tasklist-alert').off()
  $('h1').off()
  $('#show-activity').off()
  $('#search-icon').parent().parent().parent().parent().addClass('w-100')
  $('#search-icon').parent().parent().parent().addClass('w-100')
  $('#search-icon').parent().parent().addClass('w-100')
  $('#search-icon').parent().addClass('nav-fill w-100')
  $('#search-icon').tooltip('hide')
  $('#search-icon').addClass('hidden')
  stickToHeader()
})

$('#to-register').on('click', function() {
  self.location = relpath+'register/'
})
$('#signin').on('submit', function(e) {
  e.preventDefault()
  $(this).find('input').first().val($(this).find('input').first().val().toLowerCase())
  var username = $(this).find('input').first().val().toLowerCase()
  $.ajax({
    url: '/_session',
    type: 'POST',
    data: $(this).serialize(),
    contentType: 'application/x-www-form-urlencoded',
  }).done(reload)
  .fail(function(request) {
      var mismatch = wrong_password
      alert(mismatch)
    }
  )
})
$('#signin').find('input').first().on('input', function() {
  if ($(this).val().length > 0) $('#signin button').removeAttr('disabled')
})
$('#header').on('click', '#signout, #signout-small', function() {
  $.ajax({
    type: 'DELETE',
    url: '/_session'
  }).done(reload)
})
$('#storing_fullname').on('click', function() {
  toUserDoc()
})
$('#user_fullname').on('keypress', function(key) {
  if (key.which == 13) toUserDoc()
})

function toUserDoc() {
  fullname = $('#user_fullname').val().trim()
  $.ajax({
    type: 'GET',
    url: relpath+'config',
    dataType: 'json'
  }).done(function(data){
    if (fullname.length > 0) { 
      createUserDoc(user, data.sponsors.ldap, reload, updateUserDoc)
    } else alert($('#user_fullname').siblings('.text-info').text())
  })
}

function updateTooltip(id, content) {
  $('#'+id)
    .tooltip('dispose')
    .attr('title', content)
    .tooltip({ trigger: 'hover', offset: "0, 8" })
}

function track_memo(user, memoid) {
  var uri = '../'+diary_id+'_'+user
  $.ajax({
    url: uri,
    type: 'GET'
  }).done(function(u){
    u = JSON.parse(u)
    var obj = {
      'doc': memoid,
      'date': new Date().toJSON()
    }
    var i = -1, j = 0
    for (j = 0; j < u.user_activity.length; j++) {
      if (u.user_activity[j].doc === memoid) i = j
    }
    if (i > -1) {
      u.user_activity.splice(i, 1, obj)
    } else {
      u.user_activity.push(obj)
    }
    $.ajax({
      url: '../'+uri+'?batch=ok',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(u),
    })
  })
}

function createUserDoc(user, sponsor, success, error) {
  $.ajax({
    url: relpath+'userfullname/'+fullname,
    type: 'GET'
  }).done(function(u){
    if (u.rows.length > 0) fullname += ' ('+user+')'
    var obj = {
      '_id': user,
      'activity': [],
      'contributors': [user],
      'fullname': fullname,
      'order': []
    }
    if (sponsor && sponsor.length > 0) obj.readers = sponsor
    $.ajax({
      url: relpath+user,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(obj)
    }).done(success)
    .fail(error)
  })
}

var updateUserDoc = function() {
  $.ajax({
    url: relpath+'username/'+user,
    type: 'PUT',
    contentType: 'application/json',
    data: fullname
  }).done(reload)
}
