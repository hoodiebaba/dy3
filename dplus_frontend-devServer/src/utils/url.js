const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const toFlag = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
};

const defaultBaseUrl = "http://192.168.0.102:8060";
const envBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || defaultBaseUrl);
const envAssetUrl = trimTrailingSlash(import.meta.env.VITE_ASSET_BASE_URL || envBaseUrl);
const envSocketUrl = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || envBaseUrl);

export const baseUrl = envBaseUrl;
export const baseassetUrl = envAssetUrl;
export const socketUrl = envSocketUrl;
export const isReadOnlyFrontendMode = toFlag(import.meta.env.VITE_READ_ONLY_MODE, false);
export const shouldBlockSocketEmit = toFlag(import.meta.env.VITE_BLOCK_SOCKET_EMIT, isReadOnlyFrontendMode);

/** Superset embedded dashboards: UI origin (no trailing slash) + backend URL that mints guest tokens. */
const defaultSupersetUiOrigin = "http://192.168.0.100:8088";
const defaultSupersetGuestTokenUrl = "http://192.168.0.100:8089/api/superset/guest-token";
export const supersetUiOrigin = trimTrailingSlash(
    import.meta.env.VITE_SUPERSET_UI_ORIGIN || defaultSupersetUiOrigin
);
export const supersetGuestTokenUrl = trimTrailingSlash(
    import.meta.env.VITE_SUPERSET_GUEST_TOKEN_URL || defaultSupersetGuestTokenUrl
);

export const Urls={
    login:"/login",
    logout:"/logout",
    /** Current user + role-based sidebar menu (`GET /me`). Profile save tries `PATCH /me` when supported. */
    me:"/me",
    setupConf:"/setupConf",
    admin_userList:"/admin/users",
    admin_roleList:"/admin/roles",
    querybuilder_userList:"/userList",
    querybuilder_getDatabase:"/querybuilder/getDatabase",
    querybuilder_getTables:"/querybuilder/getTables",
    querybuilder_getdbo:"/querybuilder/getdbo",
    querybuilder_DBConfig:"querybuilder/DBConfig",
    querybuilder_testDBConfig:"querybuilder/testDBConfig",
    querybuilder_sqlQueryGenerator:"/querybuilder/sqlQueryGenerator",
    querybuilder_runQuery:"/querybuilder/runQuery",
    querybuilder_downloadQuery:"/querybuilder/downloadQuery",
    querybuilder_saveQuery:"/querybuilder/saveQuery",
    querybuilder_getSavedQuery:"/querybuilder/getSavedQuery",
    powerBI_tokenCreator:"/powerBI/tokenCreator",
    alertConfiguration_configureAlert:"/alertConfiguration/configureAlert",
    alertConfiguration_schedulerAlert:"/alertConfiguration/schedulerAlert",
    mtandaoComplaints:"/mtandaoComplaints",
    isonForm:"/isonForm",
    nokiaprepost:"/nokiaprepost",
    
    proRules:"/proRules",
    proRulesOutput:"/proRulesOutput",
    cellProRulesOutput:"/cellProRulesOutput",
    
    networkAnalyticsPro:"/networkAnalyticsPro",
    sitenetworkAnalyticsPro:"/sitenetworkAnalyticsPro",
    cellnetworkAnalyticsPro:"/cellnetworkAnalyticsPro",
    PrePostBulkUpload:"/BulkUpload/PrePost",
    map_getmarker:"/map/getMarker",
    map_getChart:"/map/getChart",
    techwithband:"/techwithband",
    getAllFilterList:"/allFilterList",
    uniquePhysicalId:"/uniquePhysicalId",
    uniquecellname:"/uniquecellname",
    uniquecellid:"/uniquecellid",
    map_savelatlong:"/setupConf",

    telecom_getCells: "/telecom/cells",
    multiVendor: "/map/multiVendor",
    towers: "/map/towers",
    
    boundary_groups: "/map/boundary-groups",
    boundaries: "/map/boundaries",
    drive_test: "/map/drive-test",

    rf_prediction_filters: "/map/rf-predictions/filters",
    rf_prediction_data: "/map/rf-predictions/data",

    gis_ta: "/kpi/multi-vendor/gis-ta",
    cell_pro_rules: "/kpi/multi-vendor/cell-pro-rules",

    cxix_scripting:"/cxix_scripting",
    cxix_audit:"/cxix_audit",
    cxix_scripting_form:"/cxix_scripting_form",
    dbUpdate:"/cxix_scripting/dbUpdate",
    cxix_audit_form:"/cxix_audit_form",
    
    cxix_scripting_getdata:"/cxix_scripting/getdata",
    cxix_audit_getdata:"/cxix_audit/getdata",
    
}

export const WebSocketUrls={
    siteAnalytics:"siteanalytics",
    proRules:"proRules"
}
