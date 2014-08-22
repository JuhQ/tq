
var app = angular.module('toilet', ['toiletModel']);

app.controller('queue', function($scope, api) {

  var loadPeople = function() {
    $scope.queue = api.get();
  };
  $scope.save = function() {
    api.set($scope.name);
    loadPeople();
    $scope.name = '';
  };

  $scope.remove = function(person) {
    api.remove(person.name)
    loadPeople();
  };

  loadPeople();
});


app.directive("timeago", function($interval) {
  return {
    restrict: 'A',
    scope: {
      time: "=timeago"
    },
    link: function($scope, el, attrs) {
      var renderTime = function() {
        el.text(moment($scope.time).fromNow());
      };
      renderTime();
      $interval(renderTime, 1000);
    }
  };
});

var module = angular.module('toiletModel', []);

module.factory('api', function() {
  var getPeople = function() {
    var data = window.localStorage.getItem("people");
    if(!data) {
      return [];
    }
    return JSON.parse(data);
  };

  return {
    get: function() {
      var people = getPeople();
      return people;
    },
    set: function(name) {
      var people = getPeople();
      people.push({name: name, time: new Date().getTime()});

      window.localStorage.setItem("people", JSON.stringify(people));
    },
    remove: function(name) {
      var people = getPeople();
      var newList = [];
      for(i in people) {
        if(people[i].name !== name) {
          newList.push(people[i])
        }
      }

      window.localStorage.setItem("people", JSON.stringify(newList));
    }
  };
});
