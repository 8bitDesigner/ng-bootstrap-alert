(function() {
  var AlertProvider, Alerts, alertListDirective, pending,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  pending = null;

  AlertProvider = (function() {
    function AlertProvider() {
      pending = [];
    }

    AlertProvider.prototype.queue = function(msg, type, opts) {
      if (opts == null) {
        opts = {};
      }
      return pending.push([msg, type, opts]);
    };

    AlertProvider.prototype.$get = [
      '$timeout', function($timeout) {
        return new Alerts($timeout, pending);
      }
    ];

    return AlertProvider;

  })();

  Alerts = (function() {
    Alerts.prototype.validTypes = ['success', 'info', 'warning', 'danger'];

    Alerts.prototype.typeMap = {
      alert: 'warning',
      notice: 'info',
      error: 'danger'
    };

    function Alerts($timeout, pendingAlerts) {
      this.$timeout = $timeout;
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
      if (alert.dismissAfter) {
        this.$timeout((function(_this) {
          return function() {
            return _this.dismiss(alert);
          };
        })(this), alert.dismissAfter);
      }
      this.queue.push(alert);
      return alert;
    };

    return Alerts;

  })();

  alertListDirective = function(alerts, $sce) {
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
  };

  angular.module("ng-bootstrap-alerts", ['ui.bootstrap.alert', 'template/alert/alert.html']).provider('alerts', AlertProvider).directive('alertList', ['alerts', '$sce', alertListDirective]);

}).call(this);
