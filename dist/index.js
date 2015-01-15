(function() {
  var AlertProvider, Alerts,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  AlertProvider = (function() {
    function AlertProvider() {
      this.$get = __bind(this.$get, this);
      this.pending = [];
    }

    AlertProvider.prototype.queue = function(msg, type, opts) {
      if (opts == null) {
        opts = {};
      }
      return this.pending.push([msg, type, opts]);
    };

    AlertProvider.prototype.$get = function() {
      return new Alerts(this.pending);
    };

    return AlertProvider;

  })();

  Alerts = (function() {
    Alerts.prototype.validTypes = ['success', 'info', 'warning', 'danger'];

    Alerts.prototype.typeMap = {
      alert: 'warning',
      notice: 'info',
      error: 'danger'
    };

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

    Alerts.prototype.create = function(msg, type, opts) {
      var alert;
      if (opts == null) {
        opts = {};
      }
      alert = angular.extend({
        msg: msg
      }, opts);
      if (this.typeMap[type]) {
        alert.type = this.typeMap[type];
      } else if (__indexOf.call(this.validTypes, type) < 0) {
        alert.type = 'info';
      } else {
        alert.type = type;
      }
      this.queue.push(alert);
      return alert;
    };

    return Alerts;

  })();

  angular.module("ng-bootstrap-alerts", ['ui.bootstrap.alert', 'template/alert/alert.html']).provider('alerts', AlertProvider).directive('alertList', function(alerts, $sce) {
    return {
      link: function(scope) {
        scope.alerts = alerts;
        return scope.trust = function(alert) {
          return $sce.trustAsHtml(alert.msg);
        };
      },
      restrict: 'E',
      template: "<alert\n  ng-repeat=\"alert in alerts.queue\"\n  type=\"{{alert.type}}\"\n  close=\"alerts.dismiss(alert)\"\n>\n  <div class=\"container\" ng-bind-html=\"trust(alert)\"></div>\n</alert>"
    };
  });

}).call(this);
