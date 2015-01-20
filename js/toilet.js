
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

  $scope.add = function($event, name) {
    $event.preventDefault();
    //name = name || $scope.name;
    if(!name) {
      return;
    }

    api.set(name);
    loadPeople();
    $scope.name = '';
  };

  $scope.remove = function($event, person) {
    $event.preventDefault();
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
        fromNow = moment($scope.time).fromNow();
        if(!$scope.fromNow || fromNow !== $scope.fromNow) {
          el.text(fromNow);
          $scope.fromNow = fromNow;
        }
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
  var weight = function(name) {
    return ~~(1/Math.log((name.charCodeAt(0) - 63) * name.length) * 1000);
  };
  
  var team = [
    {name: "Christoffer"},
    {name: "Dr. Luukkainen"},
    {name: "Ezku"},
    {name: "Harri"},
    {name: "Henri"},
    {name: "Jesse"},
    {name: "Juha"},
    {name: "JuhQ"},
    {name: "Matti"},
    {name: "Marko"},
    {name: "Mevi"},
    {name: "Nate"},
    {name: "Petrus"},
    {name: "Rafael"},
    {name: "Satu"},
    {name: "Sampo"},
    {name: "Tomi"}
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
      var person = {name: name, time: new Date().getTime()};
      
      people.push(person);
      
      // Increment weight to gradually move more frequent users to top of list
      for (var i in people) {
        if (people[i].name == name) {
          if (!people[i].weight) {
            people[i].weight = 0;
          }
          people[i].weight += weight(name);
        }
      }

      window.localStorage.setItem("people", JSON.stringify(people));
    },
    remove: function(name) {
      var people = getPeople();
      var newList = [];
      var timeDiff;
      for(var i in people) {
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
