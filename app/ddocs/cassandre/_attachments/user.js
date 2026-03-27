$(window).scroll(function(){
  if ($(window).scrollTop() == $(document).height() - $(window).height()){
    showMore(milestone)
  }
})
$('#diaries').on('click', function() {
  self.location = '../diary/'
})
$('#next').on('click', function() {
  showMore(milestone)
})
$('#all-activity').on('click', function() {
  cal.update(all)
})
$('#only-created').on('click', function() {
  cal.update(created)
})
$('#only-commented').on('click', function() {
  cal.update(commented)
})
$('#only-modified').on('click', function() {
  cal.update(modified)
})
$('#search-comments .input-group-text').on('click', function() {
  searchComments()
})
$('#search-comments .form-control').on('keypress', function(key) {
  if (key.which == 13) searchComments()
})
$('body').on('click', '.source2clipboard', function(e) {
  navigator.clipboard.writeText($(this).siblings('.md_source').text())
  alert(source_copied_to_clipboard)
})
const copy_to_clipboard_btn = '<button class="btn source2clipboard" type="button" data-toggle="tooltip" data-placement="top"'
        + 'title="'+copy_source_to_clipboard+'">'
        + '<svg class="bi" width="24" height="24" fill="currentColor">'
        + '<use xlink:href="../style/bootstrap-icons.svg#clipboard"/>'
        + '</svg></button>'
function searchComments() {
  let search_input = $('#search-comments .form-control').val(),
      occurrences = [],
      regex = {"text": {"$regex": search_input}},
      request = {
    "selector": {
      "$and": [
        {"$or": [regex,{"comments": {"$elemMatch": regex}}]},
        {"user": user_id}
      ]
    },
    "fields": ["date", "commented", "text", "comments"],
    "skip": 0,
    "execution_stats": true
  }
  $.ajax({
    url: '../search/'+search_input,
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(request),
  }).done(function(data){
    $("#activities").removeClass('hidden').children('.commented').remove()
    $("#events").remove()
    $("#next").remove()
    if (search_input.length > 0) {
      for (var d of data.docs) {
        if (typeof (d.text) !== 'undefined') {
          occurrences.push({
            'commented': d.commented,
            'date': d.date,
            'text': d.text
          })
        } else {
          if (d.comments) for (var x of d.comments) {
             if (occurrences.map(a => a.date).indexOf(x.date) < 0 && x.text.indexOf(search_input) > -1) occurrences.push({
              'commented': d.commented,
              'date': x.date,
              'text': x.text
            })
          }
        }
      }
      for (var c of occurrences.sort((a, b) => new Date(a.date) - new Date(b.date))) {
        $("#activities").prepend('<li class="commented"><span id="'+c.date+'" class="'+c.date+' moment">'
        +'</span>&nbsp;– <a href="../memo/'+c.commented+'">'+c.text.replace(search_input, '__'+search_input+'__')+'</a>'
        +'<span class="md_source" hidden>'+c.text+'</span>'+copy_to_clipboard_btn+'</li>')
      }
    }
    rendering('#activities')
  })
}
function rendering(o) {
  momentRelative(o)
  $('.commented>a').html(function(i, text) {
    let md = converter.makeHtml(text.replace(/&gt;/g, '>').replace(/\[([^\]]*)\]\([^\)]*\)/, '$1').trim())
    if (md.substring(0,3) == '<p>') md = md.replace(/<\/?p>/g, '')
    return md;
  })
}
var previous_action_id = ''
function showMore(start) {
  if ($("#events").length > 0) $.ajax({
    url: '../user/'+user_id+'/'+start,
    type: "GET",
    dataType: "json"
  }).done(function(data){
    for (var e of data) {
      var li = '<li class="'+e.action+'">'
        +'<span id="'+e.date+'" class="'+e.date+' moment"></span>&nbsp;– '
        +'<a href="../'+e.type+'/'+e.id+'">'+e.name+'</a>'
        +'</li>'
      milestone = e.date
      action_id = e.date.substring(0, 10)+e.action+e.id+e.name
      if (previous_action_id !== action_id) $("#events").append(li)
      previous_action_id = action_id
    }
  }).done(function(){
    rendering('#events')
  }).then(function(){
    if ($('#events li').length == 0) $('#events').text(nothing_to_show)
  })
}
function reporting() {
  var years = Object.keys(report),
      period = years[0]
  if (years.length > 1) period += '-'+years[years.length-1]
  $('#report .modal-title').append(' ('+period+')')
  for (let y of years) {
    var rep = [], unit = '',
        r = '<h3>'+y+'</h3><p>'
    unit = creations
    if (report[y].creations == 1) unit = unit.slice(0, -1)
    if (report[y].creations > 0) rep.push(report[y].creations+'&nbsp;'+unit)
    unit = edits
    if (report[y].edits == 1) unit = unit.slice(0, -1)
    if (report[y].edits > 0) rep.push(report[y].edits+'&nbsp;'+unit)
    unit = comments
    if (report[y].comments == 1) unit.slice(0, -1)
    if (report[y].comments > 0) rep.push(report[y].comments+'&nbsp;'+unit)
    var last = rep.pop()
    if (rep.length > 0) r += rep.join(', ')+' & '
    r += last+'</p>'
    $('#report .modal-body').append(r)
  }
}
function drawChart(array) {
  cal.init({
    domain: "week",
    subDomain: "day",
    subDomainDateFormat: function(date) {
      return hr_date(date)
    },
    subDomainTitleFormat: {
      filled: "{count} {name}, {date}"
    },
    data: array,
    range: 53,
    start: start,
    end: end,
    itemName: ["contribution", "contributions"],
    domainLabelFormat: ""
  })
}
