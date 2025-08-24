sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ehsmportal.controller.Risks", {
		onInit: function () {
			// Store reference to the table for filtering
			this._oTable = this.byId("tblRisks");
			this._oSearchField = this.byId("riskSearchField");
		},

		onBack: function () {
			this.getOwnerComponent().getRouter().navTo("dashboard");
		},

		onSearchRisk: function (oEvent) {
			var sQuery = oEvent.getParameter("query");
			var oTable = this._oTable;
			var oBinding = oTable.getBinding("rows");

			if (sQuery && sQuery.trim() !== "") {
				// Use EQ (equals) filter for exact Node ID match
				var oFilter = new Filter("NodeId", FilterOperator.EQ, sQuery);
				oBinding.filter([oFilter]);
			} else {
				// Clear filter if search is empty
				oBinding.filter([]);
			}
		},

		onClearRiskSearch: function () {
			// Clear the search field
			this._oSearchField.setValue("");
			
			// Clear the table filter
			var oTable = this._oTable;
			var oBinding = oTable.getBinding("rows");
			oBinding.filter([]);
		}
	});
});


