module.exports = function($scope, socket, $location, $routeParams){
  $scope.submitValue = "Create";
  if($routeParams.id != null){
    $scope.submitValue = "Edit";
    socket.emit('mailbox/get', {'_id': $routeParams.id}, function(err, mailbox){
      if(err) return;
      $scope.data = mailbox;
    })
  }

  $scope.create = function(){
    console.log($scope.data);
    $scope.data.color = document.querySelector('.colorpicker').value;
    $scope.data.secure = document.querySelector('#secure').checked;
    socket.emit('mailbox/save', $scope.data, function(err, data){
      if(!err)
        $location.path('/settings/mailbox')
      else
        console.log(err);
    });
  }

  $scope.switchPassword = function(){
    var passwdInput = document.querySelector('#password');
    if(passwdInput.type =='password'){
      passwdInput.type = 'text';
    }else{
      passwdInput.type = 'password';
    }
  }

}