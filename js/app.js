var plan = getLocalPlanHandler() || [];

function setLocalPlanHandler(plan) {
  localStorage.setItem('plan', JSON.stringify(plan));
}

function getLocalPlanHandler() {
  return JSON.parse(localStorage.getItem('plan')) || (plan || []);
}

function TimeInputCtrl($scope, $log, setLocalPlan, getLocalPlan) {
  $scope.min = 0;
  $scope.max = 24 / .5;
  $scope.model = { 
    from: $scope.min,
    to: $scope.max,
  };

  function saveTimeHandler(model) {
    $log.debug('save time handler');
    plan.push(model);
    setLocalPlan(plan);
    TimeListCtrl.plan = getLocalPlan();
    $scope.model = {};
  }
  this.saveTime = saveTimeHandler;
}

function TimeListCtrl($scope, $log, getLocalPlan) {
  $scope.plan = getLocalPlan();
}

angular
  .module('plan-day', ['ui-rangeSlider'])
  .factory('setLocalPlan', function () {
    return setLocalPlanHandler;
  })
  .factory('getLocalPlan', function () {
    return getLocalPlanHandler;
  })
  .controller('TimeInputCtrl', TimeInputCtrl)
  .controller('TimeListCtrl', TimeListCtrl)
  .run(function ($log) {
    $log.debug('Plan day running!');
  });

angular
  .bootstrap(angular.element('body'), ['plan-day']);
