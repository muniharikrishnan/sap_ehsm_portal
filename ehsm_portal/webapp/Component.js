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

            // enable routing
            this.getRouter().initialize();
        }
    });
});