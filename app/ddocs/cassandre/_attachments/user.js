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
$('#avatar').on('click', function() {
  $('#avatar_dialog').modal('show');
});
$('#avatar_dialog button').children().on('click', function() {
  let avatar = $(this).parent().attr('id')
  $.ajax({
    url: "../avatar/" + user_id,
    type: "PUT",
    contentType: "application/json",
    data: avatar
  }).done(function(){
    localStorage.setItem(user_id+'_avatar', avatar)
  }).then(reload)
  .fail(error_alert)
  
});
function showMore(start) {
  $.ajax({
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
    momentRelative('#events');
    $('.commented>a').html(function(i, text) {
      var md = converter.makeHtml(text.replace(/&gt;/g, '>').replace(/\[([^\]]*)\]\([^\)]*\)/, '$1').trim())
      if (md.substring(0,3) == '<p>') md = md.replace(/<\/?p>/g, '');
      return md;
    });
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

