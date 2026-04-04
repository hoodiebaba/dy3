import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    configureAlertList: [],
    schedulerAlertList:[],
    usersList: [],
    dbConfigList: [],
    savedQueryList:[],
    runQuery:{},
    tableList:{},
    generatedSqlQuery:{}
}

const alertConfiguration = createSlice({
    name: "alertConfiguration",
    initialState,
    reducers: {


        RUN_QUERY: (state, { payload }) => {
            state.runQuery = payload
        },
        
        GENERATED_SQL_QUERY: (state, { payload }) => {
            state.generatedSqlQuery = payload
        },
        CONFIGURE_ALERT_LIST: (state, { payload }) => {
            if(payload.reset){
                state.configureAlertList = payload.dataAll
            }else{
                state.configureAlertList = [...state.configureAlertList, ...payload.dataAll];
            }
        },
        SCHEDULER_ALERT_LIST: (state, { payload }) => {
            if(payload.reset){
                state.schedulerAlertList = payload.dataAll
            }else{
                state.schedulerAlertList = [...state.schedulerAlertList, ...payload.dataAll];
            }
        },
        TABLES_LIST: (state, { payload }) => {
            if(payload.reset){
                state.tableList = payload.dataAll
            }else{
                state.tableList = [...state.tableList, ...payload.dataAll];
            }
        },
    
        RESET_STATE: (state) => {
            state.databaseList = [];
            state.tableList = {};
            generatedSqlQuery:{}
        }
    }
})

export const { CONFIGURE_ALERT_LIST,SCHEDULER_ALERT_LIST, TABLES_LIST, GENERATED_SQL_QUERY, RUN_QUERY, USERS_LIST,DB_CONFIG_LIST, SAVED_QUERY_LIST, RESET_STATE } = alertConfiguration.actions
export default alertConfiguration.reducer
