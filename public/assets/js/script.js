var app = angular.module('event_calendar', ['ngRoute', 'angularMoment']);
app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/calendar.html',
            controller  : 'calendar'
        });
});

app.controller('calendar', function ($scope, $http) {
  $scope.currentYear = moment().format("Y");
  $scope.currentMonth = moment().format("M")-1;

  $scope.generateCalendar = function(year, month){
    const startWeek = moment([year, month]).startOf('month').week();
    const endWeek = moment([year, month]).endOf('month').week();

    let calendar = [];
    let weeks = [];
    for(var week = startWeek; week<=endWeek;week++){
      weeks.push({
        week:week,
        days:Array(7).fill(0).map(function(n, i) {
          var day =  moment([year, month]).week(week).startOf('week').clone().add(n + i, 'day');
          return {"date": day.format("D"), "month": day.format("M"), "year": day.format("Y"), "day": day.format("dddd")};
        })
      })
    }
    calendar.filteredYear = year;
    calendar.filteredMonth = month;
    calendar.filteredMonthName = moment([year, month]).format("MMMM");
    calendar.weeks = weeks;
    $scope.calendar = calendar;
    //console.log(calendar);
	};
  $scope.generateCalendar($scope.currentYear, $scope.currentMonth);
});
