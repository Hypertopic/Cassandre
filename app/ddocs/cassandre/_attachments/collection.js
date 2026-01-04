let source = []

$('#target_collection').autocomplete({
  minLength: 1,
  appendTo: '#in_collection',
  select: function (event, ui) {
    save_diary_collection(ui.item.value)
  },
  source: source.sort()
})

function save_diary_collection (collection) {
  var origin_collection = $('#'+id).parent().parent().parent().attr("id")
  $.ajax({
    url: '../save_diary_collection/'+user,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      'diary': id,
      'collection': collection
    })
  }).done(function(){
    $('#in_collection').modal('hide')
    if (collection.length > 0) {
      if (document.getElementById(collection) == null) {
        $("#content").append("<h3 class='collection'>"+collection+"</h3><div id='"+collection+"' class='card-columns'></div>")
        source.push(collection)
      }
      $('#'+collection).append($('#'+id).parent().parent())
    } else {
      $('h1').next().prepend($('#'+id).parent().parent())
    }
  }).done(function(){
    if($('#'+origin_collection).children().length < 1 && origin_collection !== collection) {
      $('#'+origin_collection).prev().remove()
      $('#'+origin_collection).remove()
      source.splice(source.indexOf(origin_collection), 1)
    }
  })
}

$('#target_collection').on('keypress', function(key) {
  if (key.which == 13) {
    save_diary_collection($('#target_collection').val().trim().replace(/[^0-9A-Za-zÀ-ȕ-]/g, '_'))
  }
})

$('#in_collection .btn-primary').on('click', function() {
  save_diary_collection($('#target_collection').val().trim().replace(/[^0-9A-Za-zÀ-ȕ-]/g, '_'))
})

$('div').on('click', '.in-collection', function(event) {
  let name = $(this).parent().find('a').text()
  id = $(this).parent().find('span').attr("id")
  $('#in_collection').find('.diary').text(name)
  $('#in_collection').modal('show')
  return false
})

