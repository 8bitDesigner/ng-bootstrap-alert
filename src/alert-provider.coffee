class AlertProvider
  pending: []

  queue: (msg, type, opts = {}) ->
    @pending.push(angular.extend(opts, {msg: msg, type: type}))

  $get: =>
    new Alerts(@pending)

class Alerts
  constructor: (pendingAlerts = []) ->
    @queue = []
    pendingAlerts.forEach (alert) => @create(alert)

  dismiss: (alert) ->
    @queue.splice(@queue.indexOf(alert), 1)

  create: (msg, opts = {}) ->
    alert = angular.extend({}, opts)
    alert.type = alert.type || 'info'
    @queue.push(alert)

angular.module("ng-bootstrap-alerts")
  .provider 'alerts', AlertProvider

  .directive 'alertView', (alerts) ->
    link: (scope) -> scope.alerts = alerts
    restrict: 'E'
    template: """
      <alert
        ng-repeat="alert in alerts.queue"
        type="{{alert.type}}"
        close="alerts.dismiss(alert)"
      >{{alert.msg}}</alert>
    """

