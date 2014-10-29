var plan = getLocalPlanHandler();

function setLocalPlanHandler(plan) {
  localStorage.setItem('plan', JSON.stringify(plan));
}

function getLocalPlanHandler() {
  return JSON.parse(localStorage.getItem('plan') || '[]');
}

function timeHandler(input) {
  var timeRange = [];

  return input;
}

function TimeInputCtrlHandler($scope, $log, setLocalPlan, getLocalPlan, $rootScope, min, max) {
  $scope.min = min;
  $scope.max = max;
  $scope.model = { 
    from: $scope.min,
    to: $scope.max,
  };

  function saveTimeHandler(model) {
    $log.debug('save time handler');
    plan.push(model);
    setLocalPlan(plan);
    plan = getLocalPlan();
    $rootScope.$broadcast('plan', plan);
    $scope.model = { 
      from: $scope.min,
      to: $scope.max,
      shortDescription: ''
    };
  }
  this.saveTime = saveTimeHandler;
}

function TimeListCtrlHandler($scope, $log, getLocalPlan) {
  $scope.plan = plan;

  function planEventHandler(e, data) {
    $scope.plan = data; 
  }
  $scope.$on('plan', planEventHandler);
}

angular
  .module('plan-day', ['ui-rangeSlider'])
  .value('min', 0)
  .value('max', (24 / .5))
  .factory('setLocalPlan', function () {
    return setLocalPlanHandler;
  })
  .factory('getLocalPlan', function () {
    return getLocalPlanHandler;
  })
  .filter('time', function ($log, min, max) {
    return timeHandler.bind({
      $log: $log,
      min: min,
      max: max
    });
  })
  .controller('TimeInputCtrl', TimeInputCtrlHandler)
  .controller('TimeListCtrl', TimeListCtrlHandler)
  .run(function ($log) {
    $log.debug('Plan day running!');
  });

angular
  .bootstrap(angular.element('body'), ['plan-day']);
