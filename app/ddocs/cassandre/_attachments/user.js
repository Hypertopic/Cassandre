$(window).scroll(function(){
  if ($(window).scrollTop() == $(document).height() - $(window).height()){
    showMore($("li").last().find("span").attr('id'));
  }
});
$('#diaries').on('click', function() {
  self.location = '../diary/';
});
$('#next').on('click', function() {
  showMore($("li").last().find("span").attr('id'));
});
$('#all-activity').on('click', function() {
  cal.update(all);
});
$('#only-created').on('click', function() {
  cal.update(created);
});
$('#only-commented').on('click', function() {
  cal.update(commented);
});
$('#only-modified').on('click', function() {
  cal.update(modified);
});
$('#search-comments .input-group-text').on('click', function() {
  searchComments()
})
$('#search-comments .form-control').on('keypress', function(key) {
  if (key.which == 13) searchComments()
})
function searchComments() {
  let search_input = $('#search-comments .form-control').val(),
      request = {
    "selector": {
      "$and": [
        {"text": {"$regex": search_input}},
        {"user": user_id}
      ]
    },
    "fields": ["date", "commented", "text"],
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
      for (var c of data.docs.sort((a, b) => new Date(a.date) - new Date(b.date))) {
        $("#activities").prepend('<li class="commented"><span id="'+c.date+'" class="'+c.date+' moment">'
        +'</span>&nbsp;– <a href="../memo/'+c.commented+'">'+c.text+'</a></li>')
      }
    }
    rendering('#activities')
  })
}
function rendering(o) {
  momentRelative(o)
  $('.commented>a').html(function(i, text) {
    let md = converter.makeHtml(text.replace(/&gt;/g, '>').replace(/\[([^\]]*)\]\([^\)]*\)/, '$1').trim())
    if (md.substring(0,3) == '<p>') md = md.replace(/<\/?p>/g, '');
    return md;
  })
}
function showMore(start) {
  if ($("#events").length > 0) $.ajax({
    url: '../user/'+user_id+'/'+start,
    type: "GET",
    dataType: "json"
  }).done(function(data){
    for (var e of data) {
      $("#events").append('<li class="'+e.action+'">'
        +'<span id="'+e.date+'" class="'+e.date+' moment"></span>&nbsp;– '
        +'<a href="../'+e.type+'/'+e.id+'">'+e.name+'</a>'
        +'</li>');
    }
  }).done(function(){
    rendering('#events')
  }).then(function(){
    if ($('#events li').length == 0) $('#events').text(nothing_to_show);
  });
}

function drawChart(array) {
  cal.init({
    domain: "week",
    subDomain: "day",
    subDomainDateFormat: function(date) {
      return hr_date(date);
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
  });
}
