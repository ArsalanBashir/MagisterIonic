angular.module('magister.controllers', [])

.controller('homeCtrl', function($scope) {})

// All Location Setup views are controlled here
.controller('locationCtrl', function($scope, $state, $ionicPopup, $http, $timeout, $ionicLoading) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }
  var header_token = token.split('~()~')[1]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;
  $timeout(function(){
    var myLatlng = new google.maps.LatLng(28.6139, 77.2090);
    var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.map = map;
    $ionicPopup.alert({
        title: 'Select Location',
        template: 'Place marker on your location.'
    });
    });
    $scope.SaveLocation = function(){
      var link = 'http://188.166.222.196/api/location';
      $http.post(link, {pos : $scope.map.getCenter()}).then(function (res){
        var role = token.split('~()~')[2]
        if(role == "tuitor"){
          $state.go('t_menu.teacher_dash');
        }else{
          $state.go('s_menu.student_dash');
        }
      });
    };

    $scope.SkipLocation = function(){
      var link = 'http://188.166.222.196/api/location';
      $http.post(link, {pos : "none"}).then(function (res){
          var role = token.split('~()~')[2]
          if(role == "tuitor"){
            $state.go('t_menu.teacher_dash');
          }else{
            $state.go('s_menu.student_dash');
          }
      });
    };

    $scope.FindMe = function(){
      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
    });
    navigator.geolocation.getCurrentPosition(function(pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function(error) {
        alert('Unable to get location: ' + error.message);
      });
    };
})


// This is complete 100%
.controller('loginCtrl', function($scope, $state, $http, $ionicPopup) {
  $scope.session_data = {};
  $scope.error = false;
  $scope.login = function(){
      var link = 'http://188.166.222.196/api/sessions';
      $http.post(link, {email: $scope.session_data.email, password: $scope.session_data.password}).then(function (res){
          if(res.data.string == "200"){
            window.localStorage.setItem("LOCAL_TOKEN_KEY", res.data.name + '~()~' + res.data.token + '~()~' + res.data.role);
            $http.defaults.headers.common['X-Auth-Token'] = res.data.token;
            if(res.data.unset == 0){
              if(res.data.role == "tuitor"){
                $state.go('t_setup');
              } else {
                $state.go('location_setup');
              }
            } else if(res.data.unset == 1){
                $state.go('location_setup');
            } else if(res.data.unset == 2){
              if(res.data.role == "tuitor"){
                $state.go('t_menu.teacher_dash');
              } else {
                $state.go('s_menu.student_dash');
              }
            }
          } else if(res.data.string == "403") {
            $ionicPopup.alert({
                title: 'Oops!',
                template: 'Incorrect Password!'
            });
            $scope.error = true;
          } else if(res.data.string == "404"){
            $ionicPopup.alert({
                title: 'Oops!',
                template: 'No such user!'
            });
            $scope.error = true;
          }
      });
  };
})

// This is also complete 100%
.controller('signupCtrl', function($scope, $state, $ionicPopup, $http) {
  $scope.data = {};
  $scope.error = false;
  $scope.submit = function(){
      var link = 'http://188.166.222.196/api/user';
      $http.post(link, {fullname : $scope.data.fullname, email: $scope.data.email, phone: $scope.data.phone, address: $scope.data.address, password: $scope.data.password, is_teacher: String($scope.data.is_teacher)}).then(function (res){
          if(res.data.string == "200"){
            $ionicPopup.alert({
                title: 'Sign Up Succesful!',
                template: 'Please log in now!'
            });
            $state.go('login');
          } else {
            $ionicPopup.alert({
                title: 'Oops!',
                template: 'Please try again later!'
            });
            $scope.error = true;
          }
      });
  };
})


.controller('t_setupCtrl', function($scope, $filter, $state, $ionicPopup, $http) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");

  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }

  var header_token = token.split('~()~')[1]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;

  $scope.data = {};
  $scope.av_data = [{label:"Every Saturday", val:false },{label:"Every Sunday", val:false },{label:"Every Monday", val:false },{label:"Every Tuesday", val:false },{label:"Every Wednesday", val:false },{label:"Every Thursday", val:false },{label:"Every Friday", val:false }];
  $scope.sub_data = ["Mathematics","Physics","Chemistry","Biology","Economics","Accountancy","Computer","English"];
  $scope.grades_data = ["Grade 1 to 4","Grade 5 to 8","Grade 9","Grade 10","Grade 11","Grade 12"];

  $scope.ShouldBeDisabled = function(){
    var trues = $filter("filter")( $scope.av_data , {val:true});
    if(!($scope.data.rate) || !($scope.data.hpd) || (trues.length) == 0 || !($scope.data.subject) || !($scope.data.grade)){
      return true;
    }
  }

  $scope.SaveSettings = function(){
    var link = 'http://188.166.222.196/api/settings';
    $http.post(link, {hourly_rate : $scope.data.rate, hours_daily : $scope.data.hpd, days : $scope.av_data, grade : $scope.data.grade, subject : $scope.data.subject}).then(function (res){
        $state.go('location_setup');
    });
  }

  $scope.LogOut = function(){
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem("LOCAL_TOKEN_KEY");
    $state.go('home');
  }
})

.controller('t_setupCtrl_lat', function($scope, $filter, $state, $ionicPopup, $http) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");

  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }

  var header_token = token.split('~()~')[1]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;

  $scope.data = {};
  $scope.av_data = [{label:"Every Saturday", val:false },{label:"Every Sunday", val:false },{label:"Every Monday", val:false },{label:"Every Tuesday", val:false },{label:"Every Wednesday", val:false },{label:"Every Thursday", val:false },{label:"Every Friday", val:false }];
  $scope.sub_data = ["Mathematics","Physics","Chemistry","Biology","Economics","Accountancy","Computer","English"];
  $scope.grades_data = ["Grade 1 to 4","Grade 5 to 8","Grade 9","Grade 10","Grade 11","Grade 12"];

  $scope.ShouldBeDisabled = function(){
    var trues = $filter("filter")( $scope.av_data , {val:true});
    if(!($scope.data.rate) || !($scope.data.hpd) || (trues.length) == 0 || !($scope.data.subject) || !($scope.data.grade)){
      return true;
    }
  }

  $scope.SaveSettings = function(){
    var link = 'http://188.166.222.196/api/settings';
    $http.post(link, {hourly_rate : $scope.data.rate, hours_daily : $scope.data.hpd, days : $scope.av_data, grade : $scope.data.grade, subject : $scope.data.subject}).then(function (res){
        $state.go('location_setup');
    });
  }
})

.controller('menuCtrl', function($scope, $http, $state) {
  $scope.LogOut = function(){
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem("LOCAL_TOKEN_KEY");
    $state.go('home');
  }
})

.controller('t_dash', function($scope, $http, $ionicPopup) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }
  var header_token = token.split('~()~')[1]
  $scope.name = token.split('~()~')[0].split(' ')[0]

  $http.defaults.headers.common['X-Auth-Token'] = header_token;
  var link = 'http://188.166.222.196/api/teacher/requests';
  $http.get(link, {p1: "p1"}).then(function (res){
      $scope.estimate = res.data.estimate;
  });
})

.controller('s_dash', function($scope, $http, $ionicPopup) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }
  var header_token = token.split('~()~')[1]

  $scope.name = token.split('~()~')[0].split(' ')[0]
  $scope.sub_data = ["Mathematics","Physics","Chemistry","Biology","Economics","Accountancy","Computer","English"];

  $http.defaults.headers.common['X-Auth-Token'] = header_token;

  var link = 'http://188.166.222.196/api/student/subjects';
  $http.get(link, {p1: "p1"}).then(function (res){
      $scope.subs = res.data.sub_dict;
  });
})

.controller('searchCtrl', function($scope, $timeout, $http, $ionicPopup, $stateParams) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }
  $scope.subjectname = $stateParams.subjectname;

  var header_token = token.split('~()~')[1]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;

  var link = 'http://188.166.222.196/api/student/subjectdata';
  var image_self = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/green.png';
  var image_teach = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/red.png';

  $http.post(link, {subject: $scope.subjectname}).then(function (res){
    $timeout(function(){
      var myLatlng = new google.maps.LatLng(28.6139, 77.2090);
      var mapOptions = {
            center: myLatlng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          };
      var map = new google.maps.Map(document.getElementById("sub-map"), mapOptions);
      $scope.map = map;
      $scope.tuitors = res.data.tuitors;
      var self_marker = new google.maps.Marker({
        position: new google.maps.LatLng(res.data.user_coords[0], res.data.user_coords[1]),
        map: map,
        icon: image_self
      });
      for (var i = 0; i < res.data.coords.length; i++) {
        var i = new google.maps.Marker({
          position: new google.maps.LatLng(res.data.coords[i][0], res.data.coords[i][1]),
          map: map,
          icon: image_teach
        });
      }
      });
  });
})

.controller('tpCtrl', function($scope, $http, $state, $timeout, $ionicPopup, $stateParams) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });
  }
  $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
  };

  var header_token = token.split('~()~')[1]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;
  $scope.teacher_id = $stateParams.teacherid;
  var link = 'http://188.166.222.196/api/teacher/info';

  $http.post(link, {teacher_id: $scope.teacher_id}).then(function (res){
    $scope.teacher_name = res.data.name;
    $scope.my_id = res.data.my_id;
    $scope.days = res.data.days;
    $scope.p_data = {};
    $scope.hours = res.data.hours;
    $timeout(function(){
      var myLatlng = new google.maps.LatLng(res.data.user_location[0], res.data.user_location[1]);
      var mapOptions = {
            center: myLatlng,
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          };
      var map = new google.maps.Map(document.getElementById("per-map"), mapOptions);
      $scope.map = map;
      var image_self = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/green.png';
      var image_teach = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/red.png';
        var self_marker = new google.maps.Marker({
          position: new google.maps.LatLng(res.data.user_location[0], res.data.user_location[1]),
          map: map,
          icon: image_self
        });
        var tuitor_marker = new google.maps.Marker({
          position: new google.maps.LatLng(res.data.point[0], res.data.point[1]),
          map: map,
          icon: image_teach
        });
      });
      $scope.to_pay = function(){
        if($scope.p_data.hours && $scope.p_data.day){
          var amount = ($scope.p_data.hours * res.data.rate) + 50;
          $state.go('payment_page', {amount: amount, day: $scope.p_data.day, teacherid: $scope.teacher_id})
        }
      }
  })
})

.controller('paymentCtrl', function($scope, $stateParams, $http, $ionicPopup) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });}
  var header_token = token.split('~()~')[1]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;

  $scope.amount = $stateParams.amount;
  $scope.teacherid = $stateParams.teacherid;
  $scope.day = $stateParams.day;

  // other payment stuff

})

.controller('threadCtrl', function($scope, $stateParams, $http, $ionicPopup) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });}
  var header_token = token.split('~()~')[1]
  var role = token.split('~()~')[2]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;
  $scope.threads = [];
  $scope.nums = Object.keys($scope.threads).length;

  var link = 'http://188.166.222.196/api/threads';
  $http.post(link, {'role': role}).then(function (res){
    $scope.threads = res.data.threads;
    $scope.nums = Object.keys($scope.threads).length;
  });
})

.controller('chatCtrl', function($scope, $stateParams, $http, $ionicPopup, $timeout, $ionicScrollDelegate, socket) {
  var token = window.localStorage.getItem("LOCAL_TOKEN_KEY");
  if(token == undefined){
    $state.go('login');
    $ionicPopup.alert({
        title: 'Oops!',
        template: 'Please log in first!'
    });}
  var header_token = token.split('~()~')[1]
  $scope.role = token.split('~()~')[2]
  $http.defaults.headers.common['X-Auth-Token'] = header_token;

  $scope.to_id = $stateParams.toid;
  $scope.from_id = $stateParams.fromid;
  $scope.to_name = $stateParams.toname;

  $scope.hideTime = true;

  var alternate, isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function() {
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

    $scope.messages.push({
      userId: $scope.from_id,
      text: $scope.data.message,
      time: d
    });
    $ionicScrollDelegate.scrollBottom(true);
    var new_message = {text: $scope.data.message, toID: $scope.to_id, token: header_token};
    socket.emit("new_message", new_message);
    delete $scope.data.message;
  };

  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);
  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };

  setInterval(function() {
    $scope.messages = [];
    var link = 'http://188.166.222.196/api/messages';
    $http.post(link, {'to_id': $scope.to_id}).then(function (res){
      for (var i = 0; i < Object.keys(res.data.messages).length; i++) {
        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        if(res.data.messages[i]['from'] != $scope.role){
          $scope.messages.push({
            userId: $scope.to_id,
            text: res.data.messages[i]['message'],
            time: d
          });
        } else {
          $scope.messages.push({
            userId: $scope.from_id,
            text: res.data.messages[i]['message'],
            time: d
          });
        }
        $ionicScrollDelegate.scrollBottom(true);
      }
    });
  }, 5000);

  $scope.data = {};
  $scope.messages = [];
  var link = 'http://188.166.222.196/api/messages';
  $http.post(link, {'to_id': $scope.to_id}).then(function (res){
    for (var i = 0; i < Object.keys(res.data.messages).length; i++) {
      var d = new Date();
      d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
      if(res.data.messages[i]['from'] != $scope.role){
        $scope.messages.push({
          userId: $scope.to_id,
          text: res.data.messages[i]['message'],
          time: d
        });
      } else {
        $scope.messages.push({
          userId: $scope.from_id,
          text: res.data.messages[i]['message'],
          time: d
        });
      }
      $ionicScrollDelegate.scrollBottom(true);
    }
  });
})
