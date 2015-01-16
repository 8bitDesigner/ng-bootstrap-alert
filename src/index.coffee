pending = null

# Config-time class, allows feeding in alerts on boot
class AlertProvider
  constructor: ->
    pending = []

  queue: (msg, type, opts = {}) ->
    pending.push([msg, type, opts])

  $get: ($timeout) ->
    new Alerts($timeout, pending)

# Runtime class, provides a queue of alerts and a means of creating/dismissing alerts
class Alerts
  validTypes: [
    'success'
    'info'
    'warning'
    'danger'
  ]

  typeMap:
    alert: 'warning'
    notice: 'info'
    error: 'danger'

  constructor: (@$timeout, pendingAlerts = []) ->
    @queue = []
    pendingAlerts.forEach (input) => @create.apply(@, input)

  dismiss: (alert) ->
    @queue.splice(@queue.indexOf(alert), 1)

  create: (msg, type, opts = {}) ->
    alert = angular.extend({msg: msg}, opts)

    # Coerce common Rails types into Bootstrap types
    if @typeMap[type]
      alert.type = @typeMap[type]

    # Defaulting to 'info'
    else if type not in @validTypes
      alert.type = 'info'
    else
      alert.type = type

    if alert.dismissAfter
      @$timeout =>
        @dismiss(alert)
      , alert.dismissAfter

    @queue.push(alert)
    return alert

angular.module("ng-bootstrap-alerts", ['ui.bootstrap.alert', 'template/alert/alert.html'])
  .provider 'alerts', AlertProvider

  .directive 'alertList', (alerts, $sce) ->
    link: (scope) ->
      scope.alerts = alerts
      scope.trust = (alert) -> $sce.trustAsHtml(alert.msg)
    restrict: 'E'
    template: """
      <alert
        ng-repeat="alert in alerts.queue"
        type="{{alert.type}}"
        close="alerts.dismiss(alert)"
      >
        <div class="container" ng-bind-html="trust(alert)"></div>
      </alert>
    """

