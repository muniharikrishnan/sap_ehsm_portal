## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>Wed Aug 20 2025 08:51:17 GMT+0000 (Coordinated Universal Time)|
|**App Generator**<br>SAP Fiori Application Generator|
|**App Generator Version**<br>1.18.5|
|**Generation Platform**<br>SAP Business Application Studio|
|**Template Used**<br>Basic V2|
|**Service Type**<br>SAP System (ABAP On-Premise)|
|**Service URL**<br>http://azktlds5cp.kcloud.com:8000/sap/opu/odata/sap/Z48_EHSM_BINDING|
|**Module Name**<br>ehsm_portal|
|**Application Title**<br>EHS_Management_Portal|
|**Namespace**<br>|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.120.14|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|

## ehsm_portal

An SAP Fiori application.

### Run and Deploy

- Mock backend: `npm run start-mock`
- Local ABAP proxy: `npm run start-local`
- Build: `npm run build`
- Deploy (after deploy-config): `npm run deploy`

### OData collections

- Incidents: `/z48_EHSM_INC`
- Risks: `/z48_EHSM_RISK`
- Login Set: `/z48_ehsm_login(p_employee_id='<id>',p_password='<pw>')/Set`

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  To launch the generated application, run the following from the generated application root folder:

```
    npm start
```

- It is also possible to run the application using mock data that reflects the OData Service URL supplied during application generation.  In order to run the application with Mock Data, run the following from the generated app root folder:

```
    npm run start-mock
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)


