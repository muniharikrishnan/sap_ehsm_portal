sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

			return Controller.extend("ehsmportal.controller.Login", {
		onInit: function() {
			// Initialize password visibility state
			this._bPasswordVisible = false;
		},

		onPasswordToggle: function() {
			var oPasswordInput = this.byId("password");
			var oToggleButton = this.byId("passwordToggle");
			
			// Toggle the password visibility state
			this._bPasswordVisible = !this._bPasswordVisible;
			
			if (this._bPasswordVisible) {
				// Show password
				oPasswordInput.setType("Text");
				oToggleButton.setIcon("sap-icon://hide");
				oToggleButton.setTooltip("Hide Password");
				oToggleButton.setAriaLabel("Hide Password");
			} else {
				// Hide password
				oPasswordInput.setType("Password");
				oToggleButton.setIcon("sap-icon://show");
				oToggleButton.setTooltip("Show Password");
				oToggleButton.setAriaLabel("Show Password");
			}
			
			// Focus back to password input for better UX
			oPasswordInput.focus();
		},

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
							console.log("Login: Stored employee ID in localStorage:", oEntry.employee_id);
						} catch (e) {
							console.warn("Could not store employee ID in localStorage:", e);
						}
						
						// Fire event to notify that login was successful
						var oEventBus = that.getOwnerComponent().getEventBus();
						if (oEventBus) {
							oEventBus.fireEvent("loginSuccess", { employeeId: oEntry.employee_id });
						}
						
						// Small delay to ensure localStorage is properly set before navigation
						setTimeout(function() {
							that.getOwnerComponent().getRouter().navTo("dashboard");
						}, 100);
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


