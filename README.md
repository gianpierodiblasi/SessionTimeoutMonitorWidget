# SessionTimeoutMonitorWidget
An extension to manage session timeout.

## Description
In general, it is not possible to intercept the session timeout in ThingWorx; this widget "tries" to intercept it with the following logic:
- given a session timeout value (for example 30 minutes), the widget checks every minute if there have been communications between the browser and the server (intercepting all AJAX calls)
- if there have been no communications for 27 minutes (30 - 3 minutes), then the widget displays a message informing the user that the session is about to expire and must therefore reload the page
- if for 28 minutes (30 - 2 minutes) there has not yet been any action by the user, then the widget automatically logs out the user and redirects the browser to another page (for example the login page)

## Properties
- debugMode - BOOLEAN (default = false): if set to true it sends to the browser's JS console a set of information useful for debugging the widget
- redirectMode - BOOLEAN (default = true): if set to true it will perform a redirect on session timeout
- redirect - STRING (default = ''): the URL where to redirect the browser in case of timeout, for example the application login page
- timeout - NUMBER (default = 30): the value (in minutes) of the session timeout

## Services
- SimulateMessage: convenience service to test the look and feel of the widget, text messages, behavior on reload, etc
- SimulateTimeout: convenience service to test the behavior on timeout
- Start: service to initialize the widget, typically bound to the master's Loaded event

## Events
- Started: event to notify that the widget has started
- SessionTimeoutReaching: event to notify that the session timeout is approaching
- SessionTimeoutReached: event to notify that the session timeout has been reached

## LocalizationTables
This extension adds the following localization token (Default and it languages):
- SessionTimeoutMonitorWidget.sessiontimeoutmonitor.title (default = 'Session Timeout')
- SessionTimeoutMonitorWidget.sessiontimeoutmonitor.message (default = 'The session is about to expire, please reload the page.')
- SessionTimeoutMonitorWidget.sessiontimeoutmonitor.button (default = 'Reload')

## Limitations
This widget performs perfectly in almost all tested situations; the only case in which the widget does not act effectively is the case in which an autorefresh widget is present in the mashup, in this case an AJAX call will be generated at each autorefresh that will make the session timeout irrelevant.

Due to a Thingworx bug the widget may not work correctly (the user may remain logged in) when the redirect URL is a form login organization (for example http://localhost:8080/Thingworx/FormLogin/Everyone)

## Donate
If you would like to support the development of this and/or other extensions, consider making a [donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).
