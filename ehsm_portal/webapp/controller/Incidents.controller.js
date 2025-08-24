sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ehsmportal.controller.Incidents", {
		onInit: function () {
			// Store reference to the table for filtering
			this._oTable = this.byId("tblIncidents");
			this._oSearchField = this.byId("incidentSearchField");
		},

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("dashboard");
		},

		onSearchIncident: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			var oTable = this._oTable;
			var oBinding = oTable.getBinding("rows");

			if (sQuery && sQuery.trim() !== "") {
				// Create filter for Incident ID
				var oFilter = new Filter("IncidentId", FilterOperator.Contains, sQuery.trim());
				oBinding.filter([oFilter]);
			} else {
				// If search is empty, clear all filters
				oBinding.filter([]);
			}
		},

		onClearSearch: function () {
			// Clear the search field
			this._oSearchField.setValue("");
			
			// Clear all filters from the table
			var oTable = this._oTable;
			var oBinding = oTable.getBinding("rows");
			oBinding.filter([]);
		}
	});
});


