module.exports = function($scope, socket, sharedData, $location,$sce, toaster, $rootScope){

  $scope.mail = sharedData.get('mail-read');  
  $scope.content = "<center>Loading....</center>";
  if($scope.mail == null){ $location.path('/mail'); return; }
  socket.emit('mailbox/getMailContent', $scope.mail, function(err, data){
    if(err){
      toaster.pop('error', 'Erreur', err);
      $rootScope.$apply();
      return; 
    }
    $scope.content = $sce.trustAsHtml(data);
  });

  $scope.mailbox = null;
  socket.emit('mailbox/get', {_id: $scope.mail.mailbox.id}, function(err, data){
    if(err){
      toaster.pop('error', 'Erreur', err);
      $rootScope.$apply();

      return; 
    }
    $scope.mailbox = data;
  });

  $scope.reply = function(){
    var newSubject = "RE: " + $scope.mail.title;
    var to = $scope.mail.from.address;
    var mailbox = $scope.mailbox != null ? $scope.mailbox :  $scope.mail.mailbox;
    var replyMail = {
      subject: newSubject,
      from: mailbox,
      to: to
    };
    sharedData.set('mail-reply', replyMail);
    $location.path('/mail/send');
  }

  $scope.forward = function(){
    var newSubject = "Fwd: " + $scope.mail.title;
    var to = $scope.mail.from.address;
    var mailbox = $scope.mailbox != null ? $scope.mailbox :  $scope.mail.mailbox;
    var fowardHeader = '---------- Forwarded message --------- \n From: '+ $scope.mail.from.name +' <'+ $scope.mail.from.address +'> \n Date: '+ $scope.mail.date +' \nSubject: '+ $scope.mail.title +' \n';

    var replyMail = {
      subject: newSubject,
      from: mailbox,
      to: '',
      content: fowardHeader + "\n" + $scope.content
    };
    sharedData.set('mail-reply', replyMail);
    $location.path('/mail/send');
  }

}