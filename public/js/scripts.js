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
  })
}

function setLogInFormHandler(){
  $('form#log-in').on('submit', function(e){
    e.preventDefault();
    var usernameField = $(this).find('input[name="username"]');
    var passwordField = $(this).find('input[name="password"]');
    var username = usernameField.val();
    var password = passwordField.val();
    login(username, password, function(){
      console.log('The token is: ', $.cookie('token') );
    });
  });
}

function logOut(){
  $('#log-out').on('click', function(e){
    e.preventDefault();
    $.removeCookie('token');
  })
}
// render update function
// get '/', will get req.user and respond with is
function renderUser(user){
  console.log(user);
  var dummy = $('#dummy');
  dummy.empty();
  var $el = $('<h2>');
  $el.text(user.profile[0].firstName);
  dummy.append($el);
}





//////// RENDER USER ////////
function getUser(){
  $.ajax({
    method: 'get',
    url: '/users',
    success: function(data){
      console.log(data)
      renderUser(data);
    }
  })
}

//////// UPDATE USER FUNCTIONALITY ////////

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

function updateUserProfileHandler(){
  $('form#update-profile').on('submit', function(e){
    e.preventDefault();
    var firstNameField = $('input[name="firstName"]')
    var firstName = firstNameField.val();
    var lastNameField = $('input[name="lastName"]')
    var lastName = lastNameField.val();
    var userProfile = {firstName: firstName, lastName: lastName}
    updateUser(userProfile, function(){
      // RENDER USER INFO HERE
      getUser();
    })
  })
}


$(function(){
  setLogInFormHandler();
  logOut();
  updateUserProfileHandler();

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
