import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cxix_scripting_list: [],
    cxix_scripting_data_list:[],
    uniquePhysicalId: [],
    networkAnalyticsPro:{},
    networkAnalyticsProSorter:{},
    dbUpdateList:[]
}

const cxix = createSlice({
    name: "cxix",
    initialState,
    reducers: {
        GET_ISON_FORM: (state, { payload }) => {
            state.getisonForm = payload
        },

        
        DB_UPDATE_LIST: (state, { payload }) => {
            if(payload.reset){
                state.dbUpdateList = payload.dataAll
            }else{
                state.dbUpdateList = [...state.dbUpdateList, ...payload.dataAll];
            }
        },
        CXIX_SCRIPTING_LIST: (state, { payload }) => {
            if(payload.reset){
                state.cxix_scripting_list = payload.dataAll
            }else{
                state.cxix_scripting_list = [...state.cxix_scripting_list, ...payload.dataAll];
            }
        },
        CXIX_SCRIPTING_FORM: (state, { payload }) => {
            if(payload.reset){
                state.cxix_scripting_form = payload.dataAll
            }else{
                state.cxix_scripting_form = [...state.cxix_scripting_form, ...payload.dataAll];
            }
        },
        CXIX_SCRIPTING_DATA_LIST: (state, { payload }) => {
            if(payload.reset){
                state.cxix_scripting_data_list = payload.dataAll
            }else{
                state.cxix_scripting_data_list = [...state.cxix_scripting_data_list, ...payload.dataAll];
            }
        },
        GET_UNIQUE_PHYSICAL_ID: (state, { payload }) => {
            if(payload.reset){
                state.uniquePhysicalId = payload.dataAll
            }else{
                state.uniquePhysicalId = [...state.uniquePhysicalId, ...payload.dataAll];
            }
        },
        GET_NETWORK_ANALYTICS_PRO: (state, { payload }) => {
            if(payload.reset){
                state.networkAnalyticsPro = payload.dataAll
            }else{
                state.networkAnalyticsPro = [...state.networkAnalyticsPro, ...payload.dataAll];
            }
        },
        GET_NETWORK_ANALYTICS_PRO_SORTER: (state, { payload }) => {
            if(payload.reset){
                state.networkAnalyticsProSorter = payload.dataSorter
            }else{
                state.networkAnalyticsProSorter = {...state.networkAnalyticsProSorter, ...payload.dataSorter};
            }
        },

        
        GET_NETWORK_ANALYTICS_SHOW_COLS: (state, { payload }) => {
            if(payload.reset){
                state.showCols = payload.showCols
            }else{
                state.showCols = [...state.showCols, ...payload.showCols];
            }
        },
        
        RESET_STATE: (state) => {
            state.databaseList = [];
            state.tableList = {};
            generatedSqlQuery:{}
        }
    }
})

export const { CXIX_SCRIPTING_LIST,CXIX_SCRIPTING_FORM,CXIX_SCRIPTING_DATA_LIST,DB_UPDATE_LIST } = cxix.actions
export default cxix.reducer
