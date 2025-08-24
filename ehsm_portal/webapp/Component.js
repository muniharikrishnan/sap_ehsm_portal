sap.ui.define([
    "sap/ui/core/UIComponent",
    "ehsmportal/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("ehsmportal.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // session model to store login state
            this.setModel(new JSONModel({ employeeId: null }), "session");
            
            // Create a custom event bus for communication between controllers
            this._oEventBus = new sap.ui.base.EventProvider();

            // enable routing
            this.getRouter().initialize();
            
            // Attach to route matched events to handle employee ID updates
            this.getRouter().attachRouteMatched(this.onRouteMatched, this);
        },

        onRouteMatched: function(oEvent) {
            var sRouteName = oEvent.getParameter("name");
            
            // If navigating to dashboard, ensure employee ID is refreshed
            if (sRouteName === "dashboard") {
                var that = this;
                // Multiple attempts to ensure the dashboard controller is ready
                var iAttempts = 0;
                var iMaxAttempts = 10;
                
                var fnTryRefresh = function() {
                    iAttempts++;
                    try {
                        var oDashboardController = that.getRouter().getRoute("dashboard").getTargets().getTarget("Dashboard").getController();
                        if (oDashboardController && oDashboardController.refreshEmployeeId) {
                            oDashboardController.refreshEmployeeId();
                            console.log("Component: Successfully refreshed dashboard employee ID on attempt", iAttempts);
                        } else if (iAttempts < iMaxAttempts) {
                            setTimeout(fnTryRefresh, 100);
                        }
                    } catch (e) {
                        if (iAttempts < iMaxAttempts) {
                            setTimeout(fnTryRefresh, 100);
                        }
                    }
                };
                
                // Start trying after a short delay
                setTimeout(fnTryRefresh, 50);
            }
        },

        // Getter for the event bus
        getEventBus: function() {
            return this._oEventBus;
        }
    });
});