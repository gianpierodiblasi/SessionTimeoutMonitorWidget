/* global TW */
TW.IDE.Widgets.sessiontimeoutmonitor = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/SessionTimeoutMonitorWidget/ui/sessiontimeoutmonitor/timeout.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'SessionTimeoutMonitor',
      'description': 'Widget to manage session timeout',
      'category': ['Common'],
      'iconImage': 'timeout.png',
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 200
        },
        'Height': {
          'description': 'height',
          'defaultValue': 28
        },
        'timeout': {
          'isVisible': true,
          'baseType': 'NUMBER',
          'isBindingTarget': true,
          'isEditable': true,
          'description': 'The session timeout (in minutes)',
          "defaultValue": 30
        },
        'redirectMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': true,
          'description': 'true to redirect on session timeout'
        },
        'redirect': {
          'isVisible': true,
          'baseType': 'STRING',
          'isBindingTarget': true,
          'isEditable': true,
          'description': 'The redirect URL on session timeout'
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        }
      }
    };
  };

  this.widgetServices = function () {
    return {
      'Start': {
        'warnIfNotBound': true
      },
      'SimulateMessage': {
        'warnIfNotBound': true
      },
      'SimulateTimeout': {
        'warnIfNotBound': true
      }
    };
  };

  this.widgetEvents = function () {
    return {
      'Started': {},
      'SessionTimeoutReaching': {},
      'SessionTimeoutReached': {}
    };
  };

  this.renderHtml = function () {
    return '<div class="widget-content widget-sessiontimeoutmonitor">' + '<span class="sessiontimeoutmonitor-property">Session Timeout Monitor</span>' + '</div>';
  };
};