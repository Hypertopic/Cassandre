var user = fullname = "";

function register() {
  if($("#password").val() == $("#confirm").val()) {
    try {
      $("#submit").attr("disabled", "disabled");
      user = $("#login").val();
      fullname = $("#fullname").val()
      $.ajax({
        type: "PUT",
        url: "../../create_user/" + user,
        contentType: "application/json",
        data: JSON.stringify({
          name: user,
          password: $("#password").val(),
          fullname: $("#fullname").val(),
          email: $("#email").val(),
          roles: [],
          type: "user"
        })
      }).done(onRegistred).fail(registerFail);
    } catch(err) {
      $("#submit").removeAttr("disabled");
      onError(err);
    }
  } else {
    onError("{{i18n.i_unmatch-password}}");
  }
}

function onError(message) {
  $("#message").addClass("alert-danger");
  $("#message").html(message);
}

function registerFail(message) {
  $("#submit").removeAttr("disabled");
  onError(message.status == 409 ? "\"" + $("#login").val() + "\"" + " username already exists." 
    : "Your request produced an error. " + message.responseText);
}

function onRegistred() {
  $("#submit").hide();
  $("#message").html("Your account has been created.");
  $("#message").removeClass("alert-danger");
  $("#message").addClass("alert-success");
  $.ajax({
    url: '../../'+user,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      '_id': user,
      'fullname': fullname
    })
  });
  $("#register").find("fieldset").slideUp();
}
