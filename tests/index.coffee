describe "The alert provider", ->
  provider = null
  service = null

  beforeEach ->
    angular.module('test.config', []).config (alertsProvider) ->
      provider = alertsProvider
      provider.queue('Test message', 'info')

    module('ng-bootstrap-alerts', 'test.config')
    inject (alerts) -> service = alerts

  it "should let you queue alerts during config", ->
    expect(service.queue.length).toBe(1)
    expect(service.queue[0]).toEqual({msg: 'Test message', type: 'info'})

describe "The alert service", ->
  service = null
  timeout = null

  beforeEach ->
    module('ng-bootstrap-alerts')
    inject (alerts, $timeout) ->
      timeout = $timeout
      service = alerts

  it "should maintain a queue of alerts", ->
    expect(service.queue.length).toBe(0)

    service.create('Oh hallo')
    service.create('Bai')

    expect(service.queue.length).toBe(2)
    expect(service.queue[0]).toEqual({msg: 'Oh hallo', type: 'info'})

  it "should coerce common Rails types into Bootstrap types", ->
    types =
      alert: 'warning'
      notice: 'info'
      error: 'danger'
      warning: 'warning'
      danger: 'danger'
      info: 'info'
      success: 'success'

    Object.keys(types).forEach (type) ->
      alert = service.create('Message', type)
      expect(alert.type).toBe(types[type])

  it "should allow you to dismiss an alert", ->
    expect(service.queue.length).toBe(0)
    alert = service.create('Message')
    expect(service.queue.length).toBe(1)
    service.dismiss(alert)
    expect(service.queue.length).toBe(0)

  it "should allow you to automatically close an alert after a delay", ->
    service.create('Message', 'info', {dismissAfter: 3000})
    expect(service.queue.length).toBe(1)

    timeout.flush(3001)
    expect(service.queue.length).toBe(0)

  it "should fail silently if you dismiss an alert before its delay triggers", ->
    alert = service.create('Message', 'info', {dismissAfter: 3000})
    expect(service.queue.length).toBe(1)
    service.dismiss(alert)

    timeout.flush(3001)
    expect(service.queue.length).toBe(0)

describe "The alertList directive", ->
  beforeEach ->
    module('ng-bootstrap-alerts')

  factory = (inner, otherClasses = '') ->
    service = null
    el = undefined
    inject ($compile, $rootScope, alerts) ->
      service = alerts
      el = $compile("<alert-list></alert-list>")($rootScope)
      $rootScope.$digest()
    return [el, service]

  it "should output a list of alerts", ->
    [el, service] = factory()

    el.scope().$apply -> service.create('oh hai')
    expect(el.children().length).toBe(1)

