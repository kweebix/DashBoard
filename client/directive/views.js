module.exports = function(app){
  app.directive("topBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/topbar/index.html"
    };
  });
  app.directive("sideBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/sidebar/index.html"
    };
  });
  app.directive("controlSideBar", function(){
    return {
      restrict: "E",
      templateUrl: "views/control-sidebar/index.html"
    };
  });
  
  app.directive("appScript", function(){
    return {
      restrict: "E",
      templateUrl: "views/scripts.html"
    };
  });

}

