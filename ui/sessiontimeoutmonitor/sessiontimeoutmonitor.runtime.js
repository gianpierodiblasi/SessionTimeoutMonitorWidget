/* global TW */
TW.Runtime.Widgets.sessiontimeoutmonitor = function () {
  var thisWidget = this;
  var timeoutID;
  var toRedirect = false;

  this.runtimeProperties = function () {
    return {
      'needsDataLoadingAndError': false
    };
  };

  this.renderHtml = function () {
    var html = '';
    html = '<div class="widget-content widget-sessiontimeoutmonitor" style="display:none;"></div>';
    return html;
  };

  this.serviceInvoked = function (serviceName) {
    if (serviceName === 'Start') {
      $(document).off('ajaxComplete.sessiontimeoutmonitorwidget_sessionTimeoutMonitor');

      $(document).on('ajaxComplete.sessiontimeoutmonitorwidget_sessionTimeoutMonitor', function (event, xhr, options) {
        var date = new Date();
        date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
        document.cookie = "sessionTimeoutMonitorLastAjax=" + new Date().toUTCString() + ";expires=" + date.toUTCString() + ";path=/Thingworx";
      });

      timeoutID = setInterval(function () {
        var value;
        var name = "sessionTimeoutMonitorLastAjax=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var split = decodedCookie.split(';');
        for (var index = 0; index < split.length; index++) {
          var row = split[index].trim();
          if (row.startsWith(name)) {
            value = row.substring(name.length);
          }
        }

        if (value) {
          var timeout = thisWidget.getProperty('timeout');
          var debugMode = thisWidget.getProperty('debugMode');

          var now = new Date();
          var sessionTimeoutMonitorLastAjax = new Date(value);

          if (debugMode) {
            console.log("Session Timeout Monitor -> timeout = " + timeout + ", sessionTimeoutMonitorLastAjax = " + sessionTimeoutMonitorLastAjax.toLocaleString() + ", now = " + now.toLocaleString());
          }

          var diff = now - sessionTimeoutMonitorLastAjax - timeout * 60 * 1000;
          if (toRedirect || diff >= -2 * 60 * 1000) {
            thisWidget.redirect();
          } else if (diff >= -3 * 60 * 1000) {
            toRedirect = true;
            thisWidget.showPopup();
          }
        }
      }, 60 * 1000);

      thisWidget.jqElement.triggerHandler("Started");
    } else if (serviceName === 'SimulateMessage') {
      thisWidget.showPopup();
    } else if (serviceName === 'SimulateTimeout') {
      thisWidget.redirect();
    }
  };

  this.redirect = function () {
    thisWidget.jqElement.triggerHandler("SessionTimeoutReached");

    if (thisWidget.getProperty('redirectMode')) {
      var iemode = TW.Environment.queryIEMode();
      var url = thisWidget.getProperty('redirect');

      var invoked = function () {
        if (iemode) {
          document.execCommand("ClearAuthenticationCache");
        }
        window.location = url;
      };

      var logoutInvoker = new ThingworxInvoker({
        entityType: "Server",
        entityName: "*",
        apiMethod: "POST",
        characteristic: "Services",
        target: "Logout"
      });

      logoutInvoker.invokeService(invoked, invoked);
    }
  };

  this.showPopup = function () {
    thisWidget.jqElement.triggerHandler("SessionTimeoutReaching");

    var title = TW.Runtime.convertLocalizableString("[[SessionTimeoutMonitorWidget.sessiontimeoutmonitor.title]]", "Session Timeout");
    var message = TW.Runtime.convertLocalizableString("[[SessionTimeoutMonitorWidget.sessiontimeoutmonitor.message]]", "The session is about to expire, please reload the page.");
    var button = TW.Runtime.convertLocalizableString("[[SessionTimeoutMonitorWidget.sessiontimeoutmonitor.button]]", "Reload");

    var html =
            "<div class='widget-sessiontimeoutmonitor-popup'>" +
            "  <img class='widget-sessiontimeoutmonitor-image' src='../Common/extensions/SessionTimeoutMonitorWidget/ui/sessiontimeoutmonitor/window.png'/>" +
            "  <div class='widget-sessiontimeoutmonitor-text'>" +
            "    <div class='widget-sessiontimeoutmonitor-title'>" + title + "</div>" +
            "    <div class='widget-sessiontimeoutmonitor-message'>" + message + "</div>" +
            "  </div>" +
            "  <div class='widget-sessiontimeoutmonitor-button'>" + button + "</div>" +
            "</div>" +
            "<div class='widget-sessiontimeoutmonitor-background'></div>";

    $(html).appendTo('body');

    $(".widget-sessiontimeoutmonitor-button").click(() => location.reload());
  };

  this.updateProperty = function (updatePropertyInfo) {
    var properties = [
      "timeout", "debugMode", "redirect", "redirectMode"
    ];

    if (properties.indexOf(updatePropertyInfo.TargetProperty) !== -1) {
      this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
    }
  };

  this.beforeDestroy = function () {
    clearInterval(timeoutID);

    try {
      console.log("Session Timeout Monitor -> Remove ajax complete event");
      TW.log.info("Session Timeout Monitor -> Remove ajax complete event");
      $(document).off('ajaxComplete.sessiontimeoutmonitorwidget_sessionTimeoutMonitor');
    } catch (err) {
      TW.log.error('Session Timeout Monitor Before Destroy Error', err);
    }
  };
};