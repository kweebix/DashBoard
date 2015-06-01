module.exports = function($scope, socket, $location, toaster){
  $scope.mailboxes = []

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.put('error', 'Erreur', err);
      return; 
    }
    $scope.$apply(function(){
      console.log(mailboxes);
      $scope.mailboxes = mailboxes;      
    });
  });

  $scope.edit = function(id){
    $location.path('/settings/mailbox/edit/'  + id);

  }

}