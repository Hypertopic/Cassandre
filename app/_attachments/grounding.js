$('#add_grounding').on('show.bs.modal', function (event) {
  $("#add_grounding .modal-body").append($('#loading'));
  if (this_type == "graph") refresh = false;
  candidates = [];
  $('#select_grounding').children("option").each(function(){
    var c = $(this).val();
    if (this_type == "graph" && c != $("#select_grounding").children('option').first().text()) c = JSON.parse(c).id;
    if($(this).val() != $("#select_grounding").children('option').first().text()) candidates.push(c);
  })
  var url = "../../memo_attribute/"+diary_id;
  if (this_type == "graph") url = "../../memo_type/"+diary_id+"/diagram";
  if (this_type == "table") url = "../../memo_type/"+diary_id+"/coding";
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
  }).done(function(ground_candidates) {
    for (var i in ground_candidates.rows) {
      var r = ground_candidates.rows[i],
          id = r.value['id'],
          type = '',
          name = r.value['name'];
      if (this_type == "graph") var obj = {'id': id, 'groundings': r.value['groundings'], 'link': r.value['link']};
      if (this_type != "graph") type = r.value['type'];
      if (name.length > 45) name = name.substr(0,45)+'...';
      if(document.getElementById(id) == null && id != this_id && candidates.indexOf(id) < 0) {
        if (["graph","table"].indexOf(this_type) == -1) $('#type_filter select option[value="' + type + '"]').removeAttr("hidden");
        if (this_type == "graph") {
          id = JSON.stringify(obj);
          articulations.push(obj);
        }
        $("#select_grounding").append($('<option>', {
          title: r.value['name'],
          text: name,
          class: type,
          value: id
        }));
      }
    }
    $("#container").after($('#loading'));
    $('#type_filter').removeAttr("hidden");
    $('#select_grounding').removeAttr("hidden");
    switch (this_type) {
      case ('field'):
      case ('transcript'):
      case ('interview'):
        $('#type_filter select option[value="operational"]').prop("selected", true);
        filter('operational');
        break;
      case ('coding'):
        $('#type_filter select option[value="interview"]').prop("selected", true);
        filter('interview');
        break;
      case ('theoretical'):
        $('#type_filter select option[value="coding"]').prop("selected", true);
        filter('coding');
        break;
      case ('operational'):
        $('#type_filter select option[value="theoretical"]').prop("selected", true);
        filter('theoretical');
        break;
      case ('storyline'):
        $('#type_filter select option[value="diagram"]').prop("selected", true);
        filter('diagram');
        break;
      case ('graph'):
        $('#all-articulations').parent().removeAttr("hidden");
        $("#one-articulation").prop("checked", true).trigger("click");
        break;        
    }
  });
})

$('#remove_grounding').on('show.bs.modal', function (event) {
  if (this_type == "graph") refresh = false;
  candidates = [];
  $('#remove_grounding select').children("option").each(function(){
    candidates.push($(this).val());
  })
  $('#groundings').children('li').each(function() {
    var id = ($(this).attr('id')),
        name = ($(this).find('a:first').text());
    addOptions(id, name);
    if (["graph","table"].indexOf(this_type) == -1) $('#'+id).find('.preview a').each(function() {
      var href = $(this).attr('href');
      if (href.includes(id)) addOptions(href, '> '+$(this).text());
    });
  });
  if ($('#groundings li').length < 2) $("#remove_grounding").find('option').eq('1').attr("disabled", "disabled");
  $("#container").after($('#loading'));
});

function addOptions(id, name) {
  var shortname = name;
  if (name.length > 45) shortname = name.substr(0,45)+'...';
  if (this_type == "graph") id = JSON.stringify({'id': id})
  if (candidates.indexOf(id) < 0) {
    $("#remove_grounding").find('select').append($('<option>', {
      value: id,
      title: name,
      text: shortname
    }));
  }
}
