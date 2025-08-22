sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ehsmportal.controller.Incidents", {
		onInit: function () {},

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("dashboard");
		}
	});
});


