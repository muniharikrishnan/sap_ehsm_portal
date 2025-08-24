sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("ehsmportal.controller.Login", {
		onLogin: function () {
			var oView = this.getView();
			var sEmpId = oView.byId("empId").getValue();
			var sPassword = oView.byId("password").getValue();

			if (!sEmpId || !sPassword) {
				MessageBox.warning("Please enter Employee ID and Password");
				return;
			}

			var oModel = this.getOwnerComponent().getModel();
			var sEmpPadded = String(sEmpId).trim().padStart(8, "0");
			var sPwd = String(sPassword).trim();
			var sKey = oModel.createKey("z48_ehsm_login", {
				p_employee_id: sEmpPadded,
				p_password: sPwd
			});
			var sPath = "/" + sKey + "/Set";
			var that = this;
			oView.setBusy(true);
			oModel.read(sPath, {
				urlParameters: { "$format": "json" },
				success: function (oData) {
					oView.setBusy(false);
					var oEntry = oData && (Array.isArray(oData.results) ? oData.results[0] : (oData && oData.d && Array.isArray(oData.d.results) ? oData.d.results[0] : oData));
					if (oEntry && oEntry.message === "SUCCESS") {
						var oSessionModel = that.getOwnerComponent().getModel("session");
						if (oSessionModel) {
							oSessionModel.setData({ employeeId: oEntry.employee_id });
						}
						
						// Store employee ID in localStorage for dashboard access
						try {
							localStorage.setItem("ehsm_employee_id", oEntry.employee_id);
						} catch (e) {
							console.warn("Could not store employee ID in localStorage:", e);
						}
						
						that.getOwnerComponent().getRouter().navTo("dashboard");
					} else {
						MessageBox.error("Invalid credentials");
					}
				},
				error: function (oError) {
					oView.setBusy(false);
					MessageBox.error("Login failed");
				}
			});
		}
	});
});


