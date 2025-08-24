sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("ehsmportal.controller.App", {
        onInit() {
            // Get the router and attach to route pattern matched events
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.attachRoutePatternMatched(this.onRoutePatternMatched, this);
        },

        onRoutePatternMatched: function(oEvent) {
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
                        var oDashboardController = that.getOwnerComponent().getRouter().getRoute("dashboard").getTargets().getTarget("Dashboard").getController();
                        if (oDashboardController && oDashboardController.refreshEmployeeId) {
                            oDashboardController.refreshEmployeeId();
                            console.log("App: Successfully refreshed dashboard employee ID on attempt", iAttempts);
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
        }
    });
});