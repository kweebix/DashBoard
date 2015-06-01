module.exports = function($scope, socket, toaster){

  $scope.mailboxes = {};

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.put('error', 'Error', err);
      $scope.$apply();
      return;
    }
    //$scope.mailboxes = mailboxes;
    $scope.$apply();
    for(var i in mailboxes){
      (function(mailbox){
        socket.emit('mailbox/get',mailbox, function(err, mails){
          if(err){
            toaster.put('error', 'Error', err);
            $scope.$apply();
            return;
          }
          var unreadCount = 0;
          for(var j in mails){
            var mail = mails[j];
            if(mail.flags && mail.flags.indexOf("\\Seen") == -1)
              unreadCount++;
          }
          mailbox.unreadCount = unreadCount;
          $scope.mailboxes[mailbox._id] = mailbox;

        });
      })(mailboxes[i]);
    }
  })

}