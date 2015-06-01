var gravatar = require("gravatar");

module.exports = function() {
  return {
    restrict: 'A',
    scope:{
       'gravatar': '='
    },
    link: function(scope, element, attr){
      if(scope.gravatar != null){
        var email = gravatar.url(scope.gravatar, {s:100});
        element[0].src = email;
      }
    }
    }
};