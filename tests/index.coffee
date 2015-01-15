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
    expect(provider.pending.length).toBe(1)

    provider.queue('Test message', 'warning')

    expect(provider.pending.length).toBe(2)
    expect(provider.pending[1]).toEqual(['Test message', 'warning', {}])

  it "should populate alerts to the service", ->
    expect(service.queue.length).toBe(1)
    expect(service.queue[0]).toEqual({msg: 'Test message', type: 'info'})

describe "The alert service", ->
  service = null

  beforeEach ->
    module('ng-bootstrap-alerts')
    inject (alerts) -> service = alerts

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

