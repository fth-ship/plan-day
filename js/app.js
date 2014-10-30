var plan = getLocalPlanHandler();

function setLocalPlanHandler(plan) {
  localStorage.setItem('plan', JSON.stringify(plan));
}

function getLocalPlanHandler() {
  return JSON.parse(localStorage.getItem('plan') || '[]');
}

function timeHandler(input) {
  var timeRange = [];
  var isHalf = false;

  for (var i = this.min, l = this.max; i < l; i += 1) {
    var current = i + 1;
    if (current === 24) {
      current = '00';
    }

    timeRange.push(current + ':00');
    timeRange.push(current + ':30');
  }

  return timeRange[ input ];
}

function TimeHeaderCtrlHandler($log, $scope) {
  $scope.today = moment().format('DD/MM/YYYY');
}

function TimeInputCtrlHandler($scope, $log, setLocalPlan, getLocalPlan, $rootScope, min, max, $interval) {
  var self = this;

  $scope.min = min;
  $scope.max = max;
  $scope.model = { 
    from: $scope.min,
    to: $scope.max,
  };
  $scope.distractionTime = 30000;

  function saveTimeHandler(model) {
    $log.debug('save time handler');
    model.from = timeHandler.call({ $log: $log, min: min, max: max }, model.from);
    model.to = timeHandler.call({ $log: $log, min: min, max: max }, model.to);
    plan.push(model);
    setLocalPlan(plan);
    plan = getLocalPlan();
    $rootScope.$broadcast('plan', plan);
    $scope.model = { 
      from: $scope.min,
      to: $scope.max,
      shortDescription: ''
    };
    $scope.distractionTime = 30000;
  }
  self.saveTime = saveTimeHandler;

  function timeoutHandler() {
    self.distractionFree = true;
  }
  $interval(timeoutHandler, $scope.distractionTime);
}

function TimeListCtrlHandler($scope, $log, getLocalPlan, setLocalPlan) {
  $scope.plan = plan;

  function planEventHandler(e, data) {
    $scope.plan = data; 
  }
  $scope.$on('plan', planEventHandler);

  function removeTimeHandler(i) {
    $log.debug('remove time handler');
    function planFilterHandler(item, idx) {
      if (i !== idx) {
        return item;
      }
    }
    plan = plan.filter(planFilterHandler);
    setLocalPlan(plan);
    $scope.$broadcast('plan', plan);
  }
  this.removeTime = removeTimeHandler;
}

angular
  .module('plan-day', ['ui-rangeSlider'])
  .value('min', 0)
  .value('max', (24 / .5) - 1)
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
  .controller('TimeHeaderCtrl', TimeHeaderCtrlHandler)
  .controller('TimeInputCtrl', TimeInputCtrlHandler)
  .controller('TimeListCtrl', TimeListCtrlHandler)
  .run(function ($log) {
    $log.debug('Plan day running!');
  });

angular
  .bootstrap(angular.element('body'), ['plan-day']);
