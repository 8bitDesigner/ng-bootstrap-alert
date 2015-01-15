class AlertProvider
  constructor: ->
    @pending = []

  flashTypeMap:
    alert: 'warning'
    notice: 'info'

  queue: (msg, type, opts = {}) ->
    if @flashTypeMap[type]
      type = @flashTypeMap[type]
    else
      type

    @pending.push([msg, angular.extend({type: type}, opts)])

  $get: =>
    new Alerts(@pending)

class Alerts
  constructor: (pendingAlerts = []) ->
    @queue = []
    pendingAlerts.forEach (input) => @create.apply(@, input)

  dismiss: (alert) ->
    @queue.splice(@queue.indexOf(alert), 1)

  create: (msg, opts = {}) ->
    alert = angular.extend({msg: msg}, opts)
    alert.type = alert.type || 'info'
    @queue.push(alert)

angular.module("ng-bootstrap-alerts", [])
  .provider 'alerts', AlertProvider

  .directive 'alertList', (alerts) ->
    link: (scope) -> scope.alerts = alerts
    restrict: 'E'
    template: """
      <alert
        ng-repeat="alert in alerts.queue"
        type="{{alert.type}}"
        close="alerts.dismiss(alert)"
      >{{alert.msg}}</alert>
    """

