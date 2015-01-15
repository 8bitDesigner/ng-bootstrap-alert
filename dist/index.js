(function() {
  var AlertProvider, Alerts,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  AlertProvider = (function() {
    function AlertProvider() {
      this.$get = __bind(this.$get, this);
      this.pending = [];
    }

    AlertProvider.prototype.flashTypeMap = {
      alert: 'warning',
      notice: 'info'
    };

    AlertProvider.prototype.queue = function(msg, type, opts) {
      if (opts == null) {
        opts = {};
      }
      if (this.flashTypeMap[type]) {
        type = this.flashTypeMap[type];
      } else {
        type;
      }
      return this.pending.push([
        msg, angular.extend({
          type: type
        }, opts)
      ]);
    };

    AlertProvider.prototype.$get = function() {
      return new Alerts(this.pending);
    };

    return AlertProvider;

  })();

  Alerts = (function() {
    function Alerts(pendingAlerts) {
      if (pendingAlerts == null) {
        pendingAlerts = [];
      }
      this.queue = [];
      pendingAlerts.forEach((function(_this) {
        return function(input) {
          return _this.create.apply(_this, input);
        };
      })(this));
    }

    Alerts.prototype.dismiss = function(alert) {
      return this.queue.splice(this.queue.indexOf(alert), 1);
    };

    Alerts.prototype.create = function(msg, opts) {
      var alert;
      if (opts == null) {
        opts = {};
      }
      alert = angular.extend({
        msg: msg
      }, opts);
      alert.type = alert.type || 'info';
      return this.queue.push(alert);
    };

    return Alerts;

  })();

  angular.module("ng-bootstrap-alerts", []).provider('alerts', AlertProvider).directive('alertList', function(alerts) {
    return {
      link: function(scope) {
        return scope.alerts = alerts;
      },
      restrict: 'E',
      template: "<alert\n  ng-repeat=\"alert in alerts.queue\"\n  type=\"{{alert.type}}\"\n  close=\"alerts.dismiss(alert)\"\n>{{alert.msg}}</alert>"
    };
  });

}).call(this);
