var app = angular.module('event_calendar', ['ngRoute', 'angularMoment']).run(function($rootScope){
  $rootScope.currentYear = moment().format("Y");
  $rootScope.currentMonth = moment().format("M")-1;
});
app.config(function($routeProvider) {
    $routeProvider
        .when('/:year?/:month?', {
            templateUrl : 'pages/calendar.html',
            controller  : 'calendar'
        });
});

app.controller('calendar', function ($scope, $rootScope, $http, $location, $routeParams) {
  $scope.generateCalendar = function(year, month){
    $scope.commonData = {};
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
          return {"date": day.format("D"), "month": day.format("M"), "year": day.format("Y"), "day": day.format("dddd")};
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

  // Call for next month's calendar
  $scope.nextMonth = function(){
    var newDate = moment([$scope.currentYear, $scope.currentMonth]).add(1, 'M');
    $rootScope.currentYear = newDate.format("Y");
    $rootScope.currentMonth = newDate.format("M")-1;

    $location.path('/'+$rootScope.currentYear+'/'+$rootScope.currentMonth).replace();
  }

  // Call for previous month's calendar
  $scope.previousMonth = function(){
    var newDate = moment([$scope.currentYear, $scope.currentMonth]).subtract(1, 'M');
    $rootScope.currentYear = newDate.format("Y");
    $rootScope.currentMonth = newDate.format("M")-1;

    $location.path('/'+$rootScope.currentYear+'/'+$rootScope.currentMonth).replace();
  }
});