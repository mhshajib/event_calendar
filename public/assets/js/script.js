// Initializing Angular App
var app = angular.module('event_calendar', ['ngRoute', 'angularMoment']).run(function($rootScope, $location){
  // Setting current year and month at rootscope for global scope variable
  $rootScope.currentYear = moment().format("Y");
  $rootScope.currentMonth = moment().format("M")-1;
  $rootScope.baseUrl = $location.protocol() + '://'+ $location.host() +':'+  $location.port();
});

//Factory for socket client service
app.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }
      socket.on(eventName, wrapper);
      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);

//Route
app.config(function($routeProvider) {
    $routeProvider
        .when('/:year?/:month?', {
            templateUrl : 'pages/calendar.html',
            controller  : 'calendar'
        });
});


// Calendar Controller
app.controller('calendar', function ($scope, socket, $rootScope, $http, $location, $routeParams) {
  $scope.generateCalendar = function(year, month){
    $scope.commonData = {};
    $scope.event = {title: '', description: ''};
    var weeks = [];
    var startWeek = moment([year, month]).startOf('month').week();
    var endWeek = moment([year, month]).endOf('month').week();

    if (month == 11){
      var endWeek = moment([year, month]).subtract((parseInt(year)+1) - moment().format("Y"), 'Y').endOf('month').week();
    }

    for(var week = startWeek; week<=endWeek;week++){
      weeks.push({
        week:week,
        days:Array(7).fill(0).map(function(n, i) {
          var day =  moment([year, month]).week(week).startOf('week').clone().add(n + i, 'day');
          return {"date": day.format("D"), "month": day.format("M"), "year": day.format("Y"), "day": day.format("dddd"), "events": []};
        })
      })
    }

    $scope.commonData.filteredYear = year;
    $scope.commonData.filteredMonth = month;
    $scope.commonData.filteredMonthName = moment([year, month]).format("MMMM");
    $scope.weeks = weeks;
  };

  // First time call for current month's calendar
  if($routeParams.year && $routeParams.month){
    $rootScope.currentYear = $routeParams.year;
    $rootScope.currentMonth = $routeParams.month;
  }
  $scope.generateCalendar($rootScope.currentYear, $rootScope.currentMonth);
  $http.get($rootScope.baseUrl + '/events', {params: {year: $rootScope.currentYear, month: (parseInt($rootScope.currentMonth)+1)}}).then(function(response) {
    if(response.data.status == 2000){
      for(var i=0; i<response.data.data.length; i++){
        $scope.weeks[response.data.data[i].weeksIndex].days[response.data.data[i].dayIndex].events.push(response.data.data[i]);
      }
    }
  });

  // Call for next month's calendar
  $scope.nextMonth = function(){
    var newDate = moment([$scope.currentYear, $scope.currentMonth]).add(1, 'M');
    $rootScope.currentYear = newDate.format("Y");
    $rootScope.currentMonth = newDate.format("M")-1;

    $location.path('/'+$rootScope.currentYear+'/'+$rootScope.currentMonth).replace();
  };

  // Call for previous month's calendar
  $scope.previousMonth = function(){
    var newDate = moment([$scope.currentYear, $scope.currentMonth]).subtract(1, 'M');
    $rootScope.currentYear = newDate.format("Y");
    $rootScope.currentMonth = newDate.format("M")-1;

    $location.path('/'+$rootScope.currentYear+'/'+$rootScope.currentMonth).replace();
  };

  // Call for add event
  $scope.addEvent = function(year, month, date, weeksIndex, dayIndex){
    $scope.event = {title: '', description: ''};
    $scope.triggeredCell = {year: year, month: month, date: date, weeksIndex: weeksIndex, dayIndex: dayIndex};
  };

  // Call for save event
  $scope.saveEvent = function(){
    $scope.triggeredCell.title = $scope.event.title;
    $scope.triggeredCell.description = $scope.event.description;

    $http.post($rootScope.baseUrl + '/events', $scope.triggeredCell).then(function(response) {
      if(response.data.status == 2001){
        $scope.event = {title: '', description: ''};
        jQuery('#createEventModal').modal('hide');
        $.notify(response.data.message, 'success');
        return;
      }
      $.notify(response.data.message, 'error');
    });
  };

  // Call for view event
  $scope.viewEvent = function(title, description){
    $scope.event = {title: title, description: description};
  };

  // Call for edit event
  $scope.editEvent = function(year, month, date, weeksIndex, dayIndex, eventIndex, event_id, title, description){
    $scope.event = {title: title, description: description, _id: event_id};
    $scope.triggeredCell = {year: year, month: month, date: date, weeksIndex: weeksIndex, dayIndex: dayIndex, eventIndex: eventIndex};
  };

  // Call for update event
  $scope.updateEvent = function(){
    $scope.triggeredCell.title = $scope.event.title;
    $scope.triggeredCell.description = $scope.event.description;
    $http.put($rootScope.baseUrl + '/events/'+$scope.event._id, $scope.triggeredCell).then(function(response) {
      if(response.data.status == 2002){
        $scope.event = {title: '', description: ''};
        jQuery('#editEventModal').modal('hide');
        $.notify(response.data.message, 'success');
        return;
      }
      $.notify(response.data.message, 'error');
    });
  };

  // Call for delete event
  $scope.deleteEvent = function(weeksIndex, dayIndex, eventIndex, event_id){
    if(confirm("Are you sure ?")){
      $http.delete($rootScope.baseUrl + '/events/'+event_id, {params: {weeksIndex: weeksIndex, dayIndex: dayIndex, eventIndex: eventIndex}}).then(function(response) {
        if(response.data.status == 2003){
          $.notify(response.data.message, 'success');
          return;
        }
        $.notify(response.data.message, 'error');
      });
    }
  };

  //Initializing socket
   socket.on('create_event', function (data) {
     $scope.weeks[data.weeksIndex].days[data.dayIndex].events.push(data);
   });
  
  socket.on('edit_event', function (data) {
    $scope.weeks[data.weeksIndex].days[data.dayIndex].events[data.eventIndex].title = data.title;
    $scope.weeks[data.weeksIndex].days[data.dayIndex].events[data.eventIndex].description = data.description;
   });

  socket.on('delete_event', function (data) {
    $scope.weeks[data.weeksIndex].days[data.dayIndex].events.splice(data.eventIndex, 1);
   });
});