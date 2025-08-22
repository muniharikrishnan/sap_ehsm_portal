sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("ehsmportal.controller.Dashboard", {
		onInit: function () {},

		onNavIncidents: function () {
			this.getOwnerComponent().getRouter().navTo("incidents");
		},

		onNavRisks: function () {
			this.getOwnerComponent().getRouter().navTo("risks");
		},

		onLogout: function () {
			// Clear session model
			var oSessionModel = this.getOwnerComponent().getModel("session");
			if (oSessionModel) {
				oSessionModel.setData({ employeeId: null });
			}

			// Best-effort cookie clearing
			try {
				var aCookies = document.cookie.split(";");
				aCookies.forEach(function (c) {
					var eqPos = c.indexOf("=");
					var name = (eqPos > -1 ? c.substr(0, eqPos) : c).trim();
					document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
				});
			} catch (e) {
				// ignore
			}

			MessageToast.show("Logged out");
			this.getOwnerComponent().getRouter().navTo("login");
		}
	});
});


