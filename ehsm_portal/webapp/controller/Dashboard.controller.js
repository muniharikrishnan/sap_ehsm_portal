sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("ehsmportal.controller.Dashboard", {
		onInit: function () {
			this._loadDashboardData();
			
			// Listen for login success events
			var oEventBus = this.getOwnerComponent().getEventBus();
			if (oEventBus) {
				oEventBus.attachEvent("loginSuccess", this.onLoginSuccess, this);
			}
			
			// Also listen for route matched events
			var oRouter = this.getOwnerComponent().getRouter();
			if (oRouter) {
				oRouter.attachRouteMatched(this.onRouteMatched, this);
			}
			
			// Start polling for employee ID updates (as a fallback)
			this._startEmployeeIdPolling();
		},

		onAfterRendering: function() {
			// Ensure employee ID is refreshed after rendering
			console.log("Dashboard: After rendering, refreshing employee ID");
			// Small delay to ensure localStorage is accessible
			setTimeout(function() {
				this.refreshEmployeeId();
			}.bind(this), 50);
		},

		onAfterShow: function(oEvent) {
			// This will be called when the view is shown
			console.log("Dashboard: View shown, refreshing employee ID");
			// Refresh the employee ID to ensure it's up-to-date
			this.refreshEmployeeId();
		},

		onRouteMatched: function(oEvent) {
			// This will be called when the route is matched during navigation
			var sRouteName = oEvent.getParameter("name");
			
			// Only refresh if this is the dashboard route
			if (sRouteName === "dashboard") {
				console.log("Dashboard: Route matched, refreshing employee ID");
				// Refresh the employee ID to ensure it's up-to-date
				this.refreshEmployeeId();
			}
		},

		onBeforeShow: function(oEvent) {
			// This will be called when the view is about to be shown
			console.log("Dashboard: View about to be shown, refreshing employee ID");
			// Refresh the employee ID to ensure it's up-to-date
			this.refreshEmployeeId();
		},

		onLoginSuccess: function(oEvent) {
			// This will be called when login is successful
			var sEmployeeId = oEvent.getParameter("employeeId");
			if (sEmployeeId) {
				console.log("Dashboard: Received login success event with employee ID:", sEmployeeId);
				// Force refresh the employee ID
				this.refreshEmployeeId();
			}
		},

		onExit: function() {
			// Clean up event listeners
			var oEventBus = this.getOwnerComponent().getEventBus();
			if (oEventBus) {
				oEventBus.detachEvent("loginSuccess", this.onLoginSuccess, this);
			}
			
			// Clean up router event listeners
			var oRouter = this.getOwnerComponent().getRouter();
			if (oRouter) {
				oRouter.detachRouteMatched(this.onRouteMatched, this);
			}
			
			// Stop polling
			this._stopEmployeeIdPolling();
		},

		_loadDashboardData: function() {
			// Get employee ID from localStorage
			var sEmployeeId = "";
			try {
				sEmployeeId = localStorage.getItem("ehsm_employee_id") || "";
			} catch (e) {
				console.warn("Could not retrieve employee ID from localStorage:", e);
			}
			
			// If localStorage is empty, try to get from session model as fallback
			if (!sEmployeeId) {
				var oSessionModel = this.getOwnerComponent().getModel("session");
				if (oSessionModel) {
					sEmployeeId = oSessionModel.getProperty("/employeeId") || "";
				}
			}
			
			// Create dashboard model
			var oDashboardModel = new JSONModel({
				employeeId: sEmployeeId,
				welcomeMessage: sEmployeeId ? "Welcome back, Safety Engineer " + sEmployeeId + "!" : "Welcome back, Safety Engineer!",
				incidentStats: {
					activeCases: 0,
					reviewCompleted: 0
				},
				riskStats: {
					highRisks: 8,
					mediumRisks: 15
				}
			});
			
			this.getView().setModel(oDashboardModel, "dashboard");
			
			// Load incident data and calculate counts
			this._loadIncidentData();
		},

		_loadIncidentData: function() {
			// Using the actual incident data from SAP backend
			// In production, this would be an OData call to your SAP backend
			var oIncidentData = {
				"d": {
					"results": [
						{
							"IncidentKey": "005056a3-4e59-1edb-a5a3-a666319058c6",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000002",
							"Title": "PRECHECK IGNORE NEAR-MISS FOR TESTING IN"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a5fc-2d37e3636ecf",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000039",
							"Title": "SAFETY SHOWER LEAKAGE AND PIPE LINE CORR"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a695-7ce7edac5576",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000050",
							"Title": "FIRST AID BOX IS EMPTY ALSO NO SYSTEM FO"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a6ea-87602581e39b",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000077",
							"Title": "FIRE HYDRANTS IN THE COOLING TOWER AREA"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a6ea-d56fd9784473",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000078",
							"Title": "THE SEWAGE COVER IS OPEN, THE PLACE IS N"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a6ec-48046b3c0819",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000081",
							"Title": "CONDENSATE HOSE CROSSING THE ROAD WITHOU"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a6ed-a08e94f78b49",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000082",
							"Title": "CONDENSATE HOSE CROSSING THE ROAD WITHOU"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a88e-2afe5ed2472b",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000124",
							"Title": "H-6101-A FUNDA FILTER A DOME FLANGE HAVI"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a890-8bcfae562df5",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000127",
							"Title": "D/H COLUMN REBOILER CONDENSATE LINE ISOL"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a8d1-e773bec9011b",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000143",
							"Title": "INSTRUMENT AIR COMPRESSOR LOCAL PANEL DA"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a8f4-0e0fc1c97e37",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000161",
							"Title": "MCP-58 BADLY CORRODED AND COVER LOOSE CO"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a8f4-3ed31cefdebf",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000162",
							"Title": "MCP-51 BADLY CORRODED AND COVER LOOSE CO"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a8f4-4d4005429ef9",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000163",
							"Title": "MCP-55 BADLY CORRODED AND COVER LOOSE CO"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a8f4-59e4830a3f28",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000164",
							"Title": "MCP WITHOUT TAG IN SEA WATER MAKE POND A"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a999-1dcb8198c6ee",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000189",
							"Title": "T38003 NEED WALKWAY ON ROOF AS TANKS ARE"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a9cc-50a05958b20b",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000202",
							"Title": "E-827 VIBRATOR FIXING PLATE CRACK"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a9d1-d2ee2ba29fab",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000204",
							"Title": "PIPING CORROSION"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a9e8-83bd3bafdc99",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000209",
							"Title": "FIRE SYSTEM IN HMT PLANT"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-a9fe-e1b3ae4998e1",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000221",
							"Title": "ROOF SHEET OF THE RESIN-1  PLANT ONE PIE"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-aaa7-758da13eca7a",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000229",
							"Title": "CABLE TRAY OF THE LAMP"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-aaef-1263b7254eba",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000246",
							"Title": "INCINERATOR AREA POOR LIGHTING"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-abc9-4bddad2ea44f",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000270",
							"Title": "UNSAFE WORK AREA DUE TO HUGE STEAM LEAKA"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-abe1-65f263b188f1",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000278",
							"Title": "MP--8004 EQUIIPMENT TAG NUMBER INDICATE"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-abf7-d5ab77ae6823",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000287",
							"Title": "FIRE EXTINGUISHING EQUIPMENTS ARE NOT IN"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acc1-53f210105748",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000304",
							"Title": "STAGNANT WATER ON ROAD AT PENTA BOILER A"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acc1-999ea95df809",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000305",
							"Title": "VERY STRONG SMELL OF AMMONIA AT HMT PLAN"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acc2-0c5efeb2d94b",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000306",
							"Title": "HIGH N2 COUNSUMPTION OF T-808 CAUSED OF"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acc2-d9ddb7109bae",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000307",
							"Title": "03-PSV-913 U/S ISOLATION VALVE GLAND LEA"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acc3-33d3cd7c7cbb",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000311",
							"Title": "UPSTREAM ISOLATION VALVE GLAND LEAK OF 0"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acc4-0a3fcfd43f33",
							"IncidentStatus": "VOID",
							"IncidentId": "NM0020000312",
							"Title": "DANGEROUS WOODEN STEP IN FRONT OF CONTRO"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acfe-f232cc3603f0",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000318",
							"Title": "STREAM 1 AND 2 IN DM PLANT NOT EXAUSTING"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-acff-2b66ac714491",
							"IncidentStatus": "CLOSED",
							"IncidentId": "NM0020000319",
							"Title": "STREAM 1 AND 2 SBA CONDUCTIVITY VALUE NO"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-ad95-c3a57954c303",
							"IncidentStatus": "NEW",
							"IncidentId": "NM0020000323",
							"Title": "WOODEN MATERIAL IN SIDE SUBSTATION-2"
						},
						{
							"IncidentKey": "005056a3-4e59-1edb-adb2-f36e7533d490",
							"IncidentStatus": "REVIEW COMPLETE",
							"IncidentId": "NM0020000326",
							"Title": "MA RECYCLE VALVE PASSING"
						}
					]
				}
			};

			// Calculate incident counts
			this._calculateIncidentCounts(oIncidentData);
		},

		_calculateIncidentCounts: function(oIncidentData) {
			var oDashboardModel = this.getView().getModel("dashboard");
			var aIncidents = oIncidentData.d.results;
			
			var iActiveCases = 0;
			var iReviewCompleted = 0;
			
			// Count incidents by status
			aIncidents.forEach(function(oIncident) {
				switch(oIncident.IncidentStatus) {
					case "NEW":
						iActiveCases++;
						break;
					case "REVIEW COMPLETE":
						iReviewCompleted++;
						break;
					// VOID and other statuses are excluded
				}
			});
			
			// Update the dashboard model
			oDashboardModel.setProperty("/incidentStats/activeCases", iActiveCases);
			oDashboardModel.setProperty("/incidentStats/reviewCompleted", iReviewCompleted);
		},

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

			// Clear localStorage
			try {
				localStorage.removeItem("ehsm_employee_id");
			} catch (e) {
				console.warn("Could not clear employee ID from localStorage:", e);
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
		},

		onNewIncident: function () {
			MessageToast.show("New Incident functionality will be updated soon!");
		},

		onRiskReport: function () {
			MessageToast.show("Risk Report functionality will be updated soon!");
		},

		onSafetyAudit: function () {
			MessageToast.show("Safety Audit functionality will be updated soon!");
		},

		// Method to refresh dashboard data (can be called from other controllers or on demand)
		refreshDashboardData: function() {
			this._loadIncidentData();
			this.refreshEmployeeId();
		},

		// Method to refresh employee ID display
		refreshEmployeeId: function() {
			var sEmployeeId = "";
			
			// Try to get from localStorage first
			try {
				sEmployeeId = localStorage.getItem("ehsm_employee_id") || "";
				console.log("Dashboard: Retrieved employee ID from localStorage:", sEmployeeId);
			} catch (e) {
				console.warn("Could not retrieve employee ID from localStorage:", e);
			}
			
			// If localStorage is empty, try to get from session model as fallback
			if (!sEmployeeId) {
				var oSessionModel = this.getOwnerComponent().getModel("session");
				if (oSessionModel) {
					sEmployeeId = oSessionModel.getProperty("/employeeId") || "";
					console.log("Dashboard: Retrieved employee ID from session model:", sEmployeeId);
				}
			}
			
			var oDashboardModel = this.getView().getModel("dashboard");
			if (oDashboardModel) {
				oDashboardModel.setProperty("/employeeId", sEmployeeId);
				oDashboardModel.setProperty("/welcomeMessage", sEmployeeId ? "Welcome back, Safety Engineer " + sEmployeeId + "!" : "Welcome back, Safety Engineer!");
				console.log("Dashboard: Updated model with employee ID:", sEmployeeId);
			} else {
				console.warn("Dashboard: No dashboard model found");
			}
		},

		// Method to force update employee ID from session model
		updateEmployeeIdFromSession: function() {
			var oSessionModel = this.getOwnerComponent().getModel("session");
			if (oSessionModel) {
				var sEmployeeId = oSessionModel.getProperty("/employeeId") || "";
				if (sEmployeeId) {
					// Update localStorage as well
					try {
						localStorage.setItem("ehsm_employee_id", sEmployeeId);
						console.log("Dashboard: Updated localStorage with employee ID:", sEmployeeId);
					} catch (e) {
						console.warn("Could not update localStorage:", e);
					}
					
					// Update dashboard model
					this.refreshEmployeeId();
				}
			}
		},

		// Polling mechanism as a fallback
		_startEmployeeIdPolling: function() {
			var that = this;
			this._iPollingInterval = setInterval(function() {
				that._checkEmployeeIdUpdate();
			}, 500); // Check every 500ms
		},

		_stopEmployeeIdPolling: function() {
			if (this._iPollingInterval) {
				clearInterval(this._iPollingInterval);
				this._iPollingInterval = null;
			}
		},

		_checkEmployeeIdUpdate: function() {
			var sCurrentEmployeeId = "";
			try {
				sCurrentEmployeeId = localStorage.getItem("ehsm_employee_id") || "";
			} catch (e) {
				return;
			}
			
			var oDashboardModel = this.getView().getModel("dashboard");
			if (oDashboardModel) {
				var sModelEmployeeId = oDashboardModel.getProperty("/employeeId") || "";
				if (sCurrentEmployeeId !== sModelEmployeeId && sCurrentEmployeeId) {
					console.log("Dashboard: Polling detected employee ID change:", sModelEmployeeId, "->", sCurrentEmployeeId);
					this.refreshEmployeeId();
				}
			}
		}
	});
});


