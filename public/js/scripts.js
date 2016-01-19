console.log("...loaded");

//////// LOG-IN/LOG-OUT FUNCTIONALITY ////////
function login(usernameTry, passwordTry, callback){
  $.ajax({
    method: 'post',
    url: '/users/authenticate',
    data: {username: usernameTry, password: passwordTry},
    success: function(data){
      $.cookie('token', data.token);
      callback();
    }
  });
}

//////// LOG IN EVENT HANDLER ///////
function setLogInFormHandler(){
  $('form#log-in').on('submit', function(e){
    e.preventDefault();
    var usernameField = $(this).find('input[name="username"]');
    var passwordField = $(this).find('input[name="password"]');
    var username = usernameField.val();
    var password = passwordField.val();
    login(username, password, function(){
      console.log('The token is: ', $.cookie('token'));
      getUser();
      getUserMeds();
      getUserFoods();
      getUserAppts();
    });
    $('#log-in').children('input').val('');
  });
}

//////// LOGS OUT THE USER ////////
function logOut(){
  $('#log-out').on('click', function(e){
    e.preventDefault();
    $.removeCookie('token');
    location.reload();
  });
}

//////// RENDER USER ///////
function renderUserProfile(user){
  var $profile = $('#display-profile');
  var birthdate = convertTimeToWords(user.profile[0].birthdate);
  $profile.empty();
  $profile.append($('<h2>').text(user.profile[0].firstName + " " + user.profile[0].lastName));
  $profile.append($('<h4>').text("Birthdate: " + birthdate).addClass('birthdate'));
  $profile.append($('<h4>').text("Gender: " + user.profile[0].gender).addClass('gender'));
  $profile.append($('<h4>').text("Illness: " + user.profile[0].illness).addClass('illness'));
  $profile.append($('<h4>').text("Illness Info: "));
  $profile.append($('<div>').html(user.profile[0].illnessInfo).addClass('illness-info'));
  $profile.append($('<h4>').text("Contact Number: " + user.profile[0].phoneNum).addClass('phoneNum'));

  var $updateProfile = $('<div id="profile-update-form">');
  var $updateProfileForm = $('<form method="patch">').addClass('update-profile');
  var newBirthdate = convertTimeToValue(user.profile[0].birthdate);
  $updateProfileForm.append($('<h3>').addClass('updates').text('Update Profile'));
  $updateProfileForm.append($('<label for="firstName">').text('First Name:'));
  $updateProfileForm.append($('<input type="text" name="firstName" value="' + user.profile[0].firstName + '">'));
  $updateProfileForm.append($('<label for="lastName">').text('Last Name:'));
  $updateProfileForm.append($('<input type="text" name="lastName" value="' + user.profile[0].lastName + '">'));
  $updateProfileForm.append($('<label for="birthdate">').text('D.O.B.:'));
  $updateProfileForm.append($('<input type="date" name="birthdate" value="' + newBirthdate + '">'));
  $updateProfileForm.append($('<label for="gender">').text('Gender:'));

  var $genderSelect = $('<select name="gender">');
  if (user.profile[0].gender === "Not Specified") {
    $genderSelect.append($('<option value="Not Specified" selected="selected">').text('Select One'));
    $genderSelect.append($('<option value="Male">').text('Male'));
    $genderSelect.append($('<option value="Female">').text('Female'));
  } else if (user.profile[0].gender === "Male") {
    $genderSelect.append($('<option value="Not Specified">').text('Select One'));
    $genderSelect.append($('<option value="Male" selected="selected">').text('Male'));
    $genderSelect.append($('<option value="Female">').text('Female'));
  } else {
    $genderSelect.append($('<option value="Not Specified">').text('Select One'));
    $genderSelect.append($('<option value="Male">').text('Male'));
    $genderSelect.append($('<option value="Female" selected="selected">').text('Female'));
  }
  $updateProfileForm.append($genderSelect);
  $updateProfileForm.append($('<label for="illness">').text('Illness:'));
  $updateProfileForm.append($('<input type="text" name="illness" value="' + user.profile[0].illness + '">'));
  $updateProfileForm.append($('<label for="phoneNum">').text('Contact Number:'));
  $updateProfileForm.append($('<input type="tel" name="phoneNum" value="' + user.profile[0].phoneNum + '">'));
  $updateProfileForm.append($('<button data-id="' + user._id + '">').text('Update Profile'));

  $updateProfile.append($updateProfileForm);
  $profile.append($updateProfile);
}

////////GET USER AND RENDER PROFILE ////////
function getUser(){
  $.ajax({
    method: 'get',
    url: '/users',
    success: function(data){
      renderUserProfile(data);
    }
  });
}

//////// UPDATE USER PROFILE ////////
function updateUser(userData, callback){
  console.log(userData);
  $.ajax({
    method: 'patch',
    url: '/users',
    data: {user: userData},
    success: function(){
      callback();
    }
  });
}

//////// UPDATE PROFILE HANDLER ////////
function updateUserProfileHandler(){
  $('#display-profile').on('submit', '.update-profile', function(e){
    e.preventDefault();
    var firstNameField = $('input[name="firstName"]');
    var firstName = firstNameField.val();
    var lastNameField = $('input[name="lastName"]');
    var lastName = lastNameField.val();
    var birthdateField = $('input[name="birthdate"]');
    var birthdate = birthdateField.val();
    var genderField = $('select[name="gender"]');
    var gender = genderField.val();
    var illnessField = $('input[name="illness"]');
    var illness = illnessField.val();
    var phoneNumField = $('input[name="phoneNum"]');
    var phoneNum = phoneNumField.val();
    var userProfile = {firstName: firstName, lastName: lastName, birthdate: birthdate, gender: gender, illness: illness, phoneNum: phoneNum};
    updateUser(userProfile, function(){
      getUser();
    });
  });
}


///////// POPULATES THE USERS DETAILS WHEN SIGNED IN ////////
function onloadgetter(){
  $.ajax({
    method: 'get',
    url: '/users',
    success: function(){
      getUser();
      getUserMeds();
      getUserFoods();
      getUserAppts();
    }
  });
}




$(function(){
  setLogInFormHandler();
  logOut();
  updateUserProfileHandler();
  onloadgetter();

  $('#create-profile').on('submit', function(){
    $('#create-profile').children('input').val('');
  });


  // FUNCTIONING JQUERY GET of CDC
  // $.getJSON('https://tools.cdc.gov/api/v2/resources/media?topic=ovarian%20cancer', function(data){
  //   console.log(data);
  //   var results = data.results;
  //   for (var i = 0; i < 3; i++) {
  //     var $el = $('<li>');
  //     var result = results[i];
  //     $el.append($('<a href='+result.sourceUrl+'>').text(result.name) );
  //     $('#dummy').append($el);
  //   }
  // })

  // $.ajax({
  //   method: 'get',
  //   url: 'https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term=asthma&knowledgeResponseType=application/javascript&callback=?',
  //   dataType: 'jsonp',
  //   success: function(data){
  //
  //   }
  // })
});
