module.exports = function($scope, socket, sharedData, $location,$sce){
  $scope.mailboxes = [];
  var mailData = null;
  if(sharedData.get('mail-reply')){
    mailData = sharedData.get('mail-reply');
    $scope.subject = mailData.subject;
    $scope.to = mailData.to;
    if(mailData.content != null){
      $scope.content = mailData.content;
    }
    sharedData.set('mail-reply',null);
  }

  socket.emit('mailbox/list', function(err, mailboxes){
    if(!err){
      $scope.$apply(function(){
        $scope.mailboxes = mailboxes;      
        $scope.mailbox = mailboxes[0];
         if(mailData){
          $scope.mailbox = mailData.from;
          $scope.$digest();
         }
      });
    }
  });

  

  $scope.send = function(){
    var mailbox = $scope.mailbox;
    var subject = $scope.subject;
    var body = $scope.content;
    var to = $scope.to;
    var mail = {
      subject: subject,
      body: body,
      to: to,
      from: mailbox.name
    };
    socket.emit('mailbox/send', mailbox, mail, function(err, data){
      console.log(err, data);
    });
    $location.path('/mail');
  }

}