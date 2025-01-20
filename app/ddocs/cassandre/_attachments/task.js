let $datepicker = $('#when')
$(".datepicker").datepicker({
  beforeShowDay: $.datepicker.noWeekends,
})

$.datepicker.regional['fr'] = {
    prevText: 'Précédent',
    nextText: 'Suivant',
    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthNamesShort: ['jan', 'fév', 'mar', 'avr', 'mai', 'jui', 'jui', 'aoû', 'sep', 'oct', 'nov', 'déc'],
    dayNamesMin: ['dim','lun', 'mar', 'mer', 'jeu', 'ven', 'sam' ],
    dateFormat: 'yy-mm-dd',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
}
if (locale === "fr") $.datepicker.setDefaults($.datepicker.regional['fr'])

$('#create_task').on('click', function() {
  create_task()
})
$('#who, #when').on('change', function (e) {
  enabling_task_creation()
})
$('#what').on('input', function() {
  enabling_task_creation()
})
$('#save_task').on('click', function() {
  let t = {
     'user': $('#who option:selected').val(),
     'action': $('#what').val(),
     'date': $('#when').val()
  }
  if ($('#id').val().length > 3) t.id = $('#id').val()
  save_task(t)
})
$(".form-check-input").change(function() {
  let t = {'id': this.id}
  if (this.checked) t.completed = new Date().toJSON()  
  save_task(t)
})
$('#tasklist').on('click', function() {
  self.location = '../tasklist/' + diary_id
})
function save_task(t) {
  $.ajax({
    url: '../task_update/'+diary_id+'_tasklist',
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(t)
  }).done(function(){
    self.location = '../tasklist/' + diary_id
  }).fail(error_alert)
}

function enabling_task_creation() {
  if ($('#who option:selected').val().length > 0 && $('#what').val().length > 0 && $('#when').val().length > 9) $('#save_task').attr("disabled", false)
}
function populate_task_plan(usernames, assigned_user) {
  if (assigned_user.length > 0 && usernames.indexOf(assigned_user) < 0) usernames.push(assigned_user)
  for (const u of usernames) {
    let option = {
      title: getFullname(u),
      text: getFullname(u),
      value: u
    }
    if (u === assigned_user) option.selected = 'selected'
    $("#who").append($('<option>', option))
  }
  $("#who").prepend($('<option>', {
    text: 'select',
    disabled: 'disabled'
  }))
}
function populate_and_render_tasklist() {
  let payload = '',
      nComments = 0, 
      converter = new showdown.Converter({strikethrough: 'true'})
  $.ajax({
    url: '../comments/'+diary_id,
    type: "GET",
    dataType: "json",
    success: function(d) {
      $('#diary').attr('title',d.diary_name)
      $('title').prepend(d.diary_name)
      nComments = d.comments.length
      let data = d.comments
      for (let c of data) {
        payload += "<li class='unchecked-comment'>"
          +'<span class="'+c.date+' moment"></span>&nbsp;– '
          +"<a href='../"+c.type+"/"+c.id+"'>"+c.name+"</a>"
          +'</li>'
      }
    }
  }).done(function(){
    if (nComments > 0) $('#todo').append('<h2 id="unchecked-comment">'+unchecked_comment+'</h2><ul>'+payload+'</ul>')
    $('.unchecked-comment a').html(function(i, text) {
      let md = converter.makeHtml(text.replace(/&gt;/g, '>').trim())
      if (md.substring(0,3) == '<p>') md = md.replace(/<\/?p>/g, '')
      return md
    })
    stickToHeader()
  }).then(function(){
    if ($('.deadline').length + $('.expired').length + $('.unchecked-todo').length + $('.unchecked-comment').length + $('.editing').length + $('.unarticulated').length + $('.unnamed').length + $('.ungrounded').length + $('.unchecked-todo').length + $('.deadend').length == 0) {
      $('#todo').text(nothing_to_show)
    } else {
      for (let c of ['unchecked-comment', 'unchecked-todo', 'editing', 'deadline', 'expired', 'completed', 'unarticulated', 'unnamed', 'ungrounded']) {
        if (['unchecked-comment', 'deadline', 'expired', 'completed'].indexOf(c) > -1 && $('.'+c).length < 2) $('h2#'+c).text($('h2#'+c).text().replace(/s /g, ' '))
        if ($('.'+c).length > 0) $('#'+c).removeClass('hidden')
      }
      momentRelative('#todo')
      getAllFullnames()
      if ($('.deadline').length + $('.expired').length > 0) {
        $('#create_task').removeClass('hidden')
      } else {
        $.ajax({
          url: '../'+diary_id+'_tasklist',
          type: "GET",
          dataType: "json"
        }).done(function(){
          $('#create_task').removeClass('hidden')
        })
      }      
    }
  })
}
