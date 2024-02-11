$('#drawChart').on('click', function() {
  $('#drawChart').addClass('disabled');
  $('#cal-heatmap').append('<div id="loading" class="d-flex justify-content-center" title="'+loading+'">\
    <div class="d-none d-sm-inline-flex">'+loading+'</div>\
    <div class="spinner-border spinner-border-sm ml-auto  mr-auto mr-sm-0" role="status" aria-hidden="true"></div></div>');
  $.ajax({
    url: '../activity_chart/'+diary_id+'/',
    type: "GET",
    dataType: "json"
  }).done(function(data) {
    for (u of data.fullnames) {
      if (fullnames[u.user] == null) fullnames[u.user] = u.fullname;
    }
    end = new Date(data.end);
    start = new Date(end.setFullYear(end.getFullYear() - 1));
    for (activity in {created,commented,modified}) {
      if (data['n'+activity].length > 0)
        for (e of data['n'+activity]) {
          var fullname = e.user;
          if (fullnames[e.user] == null) getFullname(e.user);
          if (fullnames[e.user] != null) fullname = fullnames[e.user];
          $('#contributors .'+activity).append(fullname+'&nbsp;('+e.n+') ');
        }
    }
    for (var a of data.activity) {
      var date = a.date;
      if(date > start.toJSON()) {
        all[unix_date(date)] = 1;
        if (a.commented) commented[unix_date(date)] = 1;
        if (a.created)     created[unix_date(date)] = 1;
        if (a.modified)   modified[unix_date(date)] = 1;
      }
    }
  }).done(function() {
    $('#loading').remove();
    $('fieldset').removeClass('d-none');
    cal.init({
      domain: "week",
      subDomain: "day",
      subDomainDateFormat: function(date) {
        return hr_date(date);
      },
      subDomainTitleFormat: {
        filled: "{count} {name}, {date}"
      },
      data: all,
      range: 53,
      start: start,
      end: end,
      itemName: ["contribution", "contributions"],
      domainLabelFormat: ""
    });
  });
});

$('#all-activity').on('click', function() {
  $('#contributors').children().removeClass('d-none');
  $('#contributors .created').addClass('d-none');
  $('#contributors .modified').addClass('d-none');
  $('#contributors .commented').addClass('d-none');
  cal.update(all);
});
$('#only-created').on('click', function() {
  $('#contributors').children().removeClass('d-none');
  $('#contributors .all').addClass('d-none');
  $('#contributors .modified').addClass('d-none');
  $('#contributors .commented').addClass('d-none');
  cal.update(created);
});
$('#only-commented').on('click', function() {
  $('#contributors').children().removeClass('d-none');
  $('#contributors .all').addClass('d-none');
  $('#contributors .created').addClass('d-none');
  $('#contributors .modified').addClass('d-none');
  cal.update(commented);
});
$('#only-modified').on('click', function() {
  $('#contributors').children().removeClass('d-none');
  $('#contributors .all').addClass('d-none');
  $('#contributors .created').addClass('d-none');
  $('#contributors .commented').addClass('d-none');
  cal.update(modified);
});

$('.more').on('click', function() {
  showMore($('li').last().find('span').attr('id'));
});

function showMore(start) {
  $.ajax({
    url: '../activity/'+diary_id+'/'+start,
    type: "GET",
    dataType: "json",
    success: function(data) {
      for (var a of data) {
        var [date, user, user_fullname, type, path] = [a.date, a.user, a.user_fullname, a.modified_type, a.path];
        if (typeof a.commented !== 'undefined') {
          action = verb.commented+'&nbsp;: ';
        }
        if (typeof user_fullname !== 'undefined') fullnames[user] = user_fullname;
        if (typeof user_fullname === 'undefined' && fullnames[user] == null) getFullname(user);
        if (typeof user_fullname === 'undefined' && fullnames[user] !== null) user_fullname = fullnames[user];
        if (typeof user_fullname === 'undefined' && fullnames[user] == null) user_fullname = user;

        if (typeof a.diary_label !== 'undefined') {
          if (typeof a.created   !== 'undefined') action = verb.created+' '+the_diary;
          if (typeof a.modified  !== 'undefined') action = verb.modified+' '+the_diary;
        } else {
          if (typeof a.commented !== 'undefined') action = verb.commented+'&nbsp;: ';
          if (typeof a.created   !== 'undefined') action = verb.created+' ';
          if (typeof a.modified  !== 'undefined') action = verb.modified+' ';
          action += '<a href="../'+path+'/'+a.modified_id+'">'+a.modified_name+'</a>';
        }
        var li = '<li>'
          +'<span id="'+date+'" class="'+date+' moment"></span>, '
          +'<span class="'+user+'">'+user_fullname+'</span> '
          + action + '</li>';
        $("#activities").append(li);
      }
    }
  }).always(function(){
    if ($('#activity ul li').length < 1) {
      $('#alert').text(nothing_to_show);
    } else {
      momentRelative('#activity ul');
      $('#activities li a').html(function(i, text) {
        var md = converter.makeHtml(text.replace(/&gt;/g, '>').replace(/\[([^\]]*)\]\([^\)]*\)/, '$1').trim());
        if (md.substring(0,3) == '<p>') md = md.replace(/<\/?p>/g, '');
        return md;
      });
      $('#alert').remove();
      if (start == 'Z') $('#drawChart').removeClass('disabled');
    }
  });
}
