var io = require('socket.io-client');
var angular = require('angular');
require('angular-route');
require('angular-sanitize');
require('angular-socket-io');
require('angular-animate');
require('angularjs-toaster');

var app = angular.module("dbapp", ['ngRoute', 'btford.socket-io', 'ngSanitize', 'toaster', 'ngAnimate']);

app.config(function($routeProvider){
  $routeProvider.when('/home', {
    templateUrl: "views/home/index.html",
    controller:"HomeController"
  }).when('/mail', {
    templateUrl: "views/mail/index.html",
    controller:"MailController" 
  }).when('/mail/read', {
    templateUrl: "views/mail/read.html",
    controller:"MailReadController" 
  }).when('/mail/send', {
    templateUrl: "views/mail/send.html",
    controller:"MailSendController" 
  }).when('/settings/mailbox', {
    templateUrl: 'views/settings/mailbox/index.html',
    controller:'MailBoxSettingsController'
  }).when('/settings/mailbox/create', {
    templateUrl: 'views/settings/mailbox/create.html',
    controller:'CreateMailBoxSettingsController'
  }).when('/settings/mailbox/edit/:id', {
    templateUrl: 'views/settings/mailbox/create.html',
    controller:'CreateMailBoxSettingsController'
  }).when('/profile', {
    templateUrl: 'views/profile/index.html'
  })

  .otherwise({
        redirectTo: '/home'
      });
});

app.factory('socket', function(socketFactory, $rootScope, toaster){

  var myIoSocket = io.connect();
  myIoSocket.on('globalSettings', function(globalSettings){
    $rootScope.globalSettings = globalSettings;
  });
  myIoSocket.on('server-error', function(msg, error){
    console.log(error, typeof(error), msg);
    toaster.pop('error', 'Erreur', msg);
  });
  myIoSocket.on('disconnect', function(){
    toaster.pop("warning", "Perte de connexion", "Le serveur socket.io n'est plus joignable");
    $rootScope.$apply();
  });
  myIoSocket.on('reconnect', function(){
    toaster.pop("info", "Reconnexion", "Le serveur socket.io est de nouveau joignable");
    $rootScope.$apply();
  });
  return socketFactory({ioSocket:myIoSocket});
});

app.service('sharedData', require('./service/sharedData.js'));

app.run(function($rootScope){
  $rootScope.passport = passport;

});

app.controller('MailController', require('./controller/mail'));
app.controller('MailReadController', require('./controller/readMail'));
app.controller('MailSendController', require('./controller/sendMail'));

app.controller('MainController', function($scope){ $scope.init = true; });
app.controller('HomeController', require('./controller/home'));
app.controller('MailBoxSettingsController', require('./controller/settings/mailbox.js'));
app.controller('CreateMailBoxSettingsController', require('./controller/settings/createMailbox.js'));


app.directive('gravatar', require('./directive/gravatar.js'));



require('./directive/views.js')(app);

angular.element(document).ready(function() {
      angular.bootstrap(document, ['dbapp']);
    });
console.log("angular loaded"); 