
var app = angular.module('toilet', ['toiletModel']);

app.controller('queue', function($scope, api) {

  $scope.team = api.getTeam();

  var loadPeople = function() {
    $scope.queue = api.get();
    var times = api.getTime();

    var totalTimes = times.length;

    var avg = 0;
    for(i in times) {
      avg += times[i];
    }

    avg /= totalTimes;
    $scope.averageLength = moment.duration(avg, 'milliseconds').humanize();
  };

  $scope.add = function(name) {
    name = name || $scope.name;
    if(!name) {
      return;
    }

    api.set(name);
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
  var getTime = function() {
    var data = window.localStorage.getItem("time");
    if(!data) {
      return [];
    }
    return JSON.parse(data);
  };
  var addTime = function(time) {
    var times = getTime();
    times.push(time)
    window.localStorage.setItem("time", JSON.stringify(times));
  };

  var team = [
    {name: "JuhQ"},
    {name: "Juha"},
    {name: "Matti"},
    {name: "Mevi"},
    {name: "Eevert"},
    {name: "Jesse"},
    {name: "Henri"},
    {name: "Marko"},
    {name: "Dr. Luukkainen"},
    {name: "Varya"},
    {name: "Harri"},
    {name: "Petrus"},
    {name: "Tomi"},
    {name: "Nate"},
    {name: "Satu"},
    {name: "Rafael"},
    {name: "Sampo"},
    {name: "Christoffer"}
  ];

  return {
    getTeam: function() {
      return team;
    },
    get: function() {
      var people = getPeople();
      return people;
    },
    getTime: function() {
      var time = getTime();
      return time;
    },
    addTime: addTime,
    set: function(name) {
      var people = getPeople();
      people.push({name: name, time: new Date().getTime()});

      window.localStorage.setItem("people", JSON.stringify(people));
    },
    remove: function(name) {
      var people = getPeople();
      var newList = [];
      var timeDiff;
      for(i in people) {
        if(people[i].name !== name) {
          newList.push(people[i])
        } else {
          if(!timeDiff) {
            timeDiff = new Date().getTime() - people[i].time;
            addTime(timeDiff);
          }
        }
      }

      window.localStorage.setItem("people", JSON.stringify(newList));
    }
  };
});
