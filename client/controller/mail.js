module.exports = function($scope, socket, sharedData, $location, $filter, $timeout, toaster, $rootScope){

  var mailsByUID = {};
  $scope.mails = [];
  $scope.mailsMarked = {};
  $scope.unReadMailCount = 0;
  $scope.mailCount = 0;
  $scope.mailboxes = [];
  $scope.currentMailbox = undefined;
  $scope.mailboxUnReadMailCount = {};
  $scope.messageFilterData = {read:false};


  var updateData = function(){
    var unReadMailCount = 0;
    for(var i in $scope.mails){
      var mail = $scope.mails[i];
      var style = {};
      mail.read = true;
      if(mail.flags.indexOf('\\Seen') == -1){
        mail.read = false;
        style['font-weight'] ="bold";
        unReadMailCount++;
        if($scope.mailboxUnReadMailCount[mail.mailbox.id] == null){
          $scope.mailboxUnReadMailCount[mail.mailbox.id] = 1;
        }else{
          $scope.mailboxUnReadMailCount[mail.mailbox.id] += 1
        }
      }
      mail.style = style;
      $scope.mails[i] = mail;
    }
    $scope.mailCount = $scope.mails.length;
    $scope.unReadMailCount = unReadMailCount;
  }

  $scope.readMail = function(mail){
    sharedData.set('mail-read', mail);
    $location.path('/mail/read')
  }

  $scope.changeCurrentMailBox = function(mailbox){
    if(mailbox != null){
      $scope.messageFilterData.mailbox = mailbox;
    }else{
      $scope.messageFilterData.mailbox = undefined;
    }
  };

  $scope.selectAll = function(){
    var mails = $filter('filter')($scope.mails, $scope.messageFilterData)
    var tmpMailsMarked = {};
    if(Object.keys($scope.mailsMarked).length != mails.length){
      for(var i in mails){
        tmpMailsMarked[mails[i].UID] = true;
      }
    }
    $scope.mailsMarked = tmpMailsMarked;
  }

  socket.emit('mailbox/list', function(err, mailboxes){
    if(err){
      toaster.put('error', 'Erreur', err);
      return; 
    }
    $scope.mailboxes = mailboxes;
    for(var i in mailboxes){
      var _mailbox = mailboxes[i];
      (function(mailbox){
        socket.emit('mails/request', mailbox, function(err, mails){
          if(err){
            toaster.pop('error', 'Erreur', err);
            $rootScope.$apply();
            return;
          }
          for(var i in mails){
            var mail = mails[i];
            mail.mailbox = {
              name: mailbox.name, 
              id: mailbox._id,
              color: mailbox.color,
            };
            mailsByUID[mail.UID] = mail;
            $scope.mails.push(mail);
          }
          updateData();
        })
      })(_mailbox);
    }
  });

  $scope.messageFilter =function(type){
    $scope.messageFilterData = type;
  }


  $scope.markRead = function(){
    var mailsMarked = [];
    for(var uid in $scope.mailsMarked){
      if($scope.mailsMarked[uid]){
        mailsMarked.push(mailsByUID[uid]);
      }
    }
    socket.emit('mailbox/markRead', mailsMarked, function(errors, mailsFlags){
      if(errors.length > 0){
        for(var i in errors){
          var err = errors[i];
          toaster.pop('error', 'Erreur', err);
          $rootScope.$apply();

        }
        return; 
      }
      for(var uid in mailsFlags){
        mailsByUID[uid].flags = mailsFlags[uid];
      }
      $scope.mails = Object.keys(mailsByUID).map(function(k){return mailsByUID[k]});
      updateData();
    });
  }

};