$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var firstName=$("input#first-name");
var lastName=$("input#last-name");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      firstName:firstName.val().trim(),
      lastName:lastName.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if ( !userData.firstName || !userData.lastName || !userData.email || !userData.password) {
      swal("", "All fields are required.", "error");
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    firstName.val("");
    lastName.val("");
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(userData) {
    $.post("/api/signup", {
      firstName:userData.firstName,
      lastName:userData.lastName,
      email: userData.email,
      password: userData.password
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
