angular.module('magister.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('t_setup', {
    url: '/teacher/setup',
    templateUrl: 'templates/teachersetup.html',
    controller: 't_setupCtrl'
  })

  .state('t_setup_lat', {
    url: '/teacher/setup_lat',
    templateUrl: 'templates/teachersetup_lat.html',
    controller: 't_setupCtrl_lat'
  })

  .state('location_setup', {
    url: '/location/setup',
    templateUrl: 'templates/location.html',
    controller: 'locationCtrl'
  })

  .state('t_menu', {
    url: '/t_menu',
    templateUrl: 'templates/t_menu.html',
    controller: 'menuCtrl',
    abstract:true
  })

  .state('t_menu.teacher_dash', {
    url: '/teacher/dash',
    views: {
      't_menu': {
        templateUrl: 'templates/teacher_dash.html',
        controller: 't_dash'
      }
    }
  })

  .state('s_menu', {
    url: '/s_menu',
    templateUrl: 'templates/s_menu.html',
    controller: 'menuCtrl',
    abstract:true
  })

  .state('s_menu.student_dash', {
    url: '/student/dash',
    views: {
      's_menu': {
        templateUrl: 'templates/student_dash.html',
        controller: 's_dash'
      }
    }
  })

  .state('subject_view', {
    url: '/subject/:subjectname/:subnum',
    templateUrl: 'templates/search_res.html',
    controller: 'searchCtrl'
  })

  .state('personal_teacher', {
    url: '/teacher/:teacherid',
    templateUrl: 'templates/teacher_personal.html',
    controller: 'tpCtrl'
  })

  .state('payment_page', {
    url: '/pay/:amount/:day/:teacherid',
    templateUrl: 'templates/paymentPage.html',
    controller: 'paymentCtrl'
  })

  .state('s_menu.thread_view', {
    url: '/messages/student/all',
    views: {
      's_menu': {
        templateUrl: 'templates/threadsPage.html',
        controller: 'threadCtrl'
      }
    }
  })

  .state('t_menu.thread_view', {
    url: '/messages/teacher/all',
    views: {
      't_menu': {
        templateUrl: 'templates/threadsPage.html',
        controller: 'threadCtrl'
      }
    }
  })

  .state('chat', {
    url: '/chat/:fromid/:toid/:toname',
    templateUrl: 'templates/chatPage.html',
    controller: 'chatCtrl'
  })

$urlRouterProvider.otherwise('/home')

});
