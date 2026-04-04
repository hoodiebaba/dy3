import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    PrePostData: [],
    uniquePhysicalId: [],
    proRules: [],
    proRulesOutput: [],
    cellproRulesOutput:[],
    uniqueCellId:[],
    networkAnalyticsPro:{},
    networkAnalyticsProSorter:{}
}

const nokiaPrePost = createSlice({
    name: "nokiaPrePost",
    initialState,
    reducers: {
        GET_ISON_FORM: (state, { payload }) => {
            state.getisonForm = payload
        },
        GET_NOKIA_PRE_POST: (state, { payload }) => {
            if(payload.reset){
                state.PrePostData = payload.dataAll
            }else{
                state.PrePostData = [...state.PrePostData, ...payload.dataAll];
            }
        },
        GET_PRO_RULES: (state, { payload }) => {
            if(payload.reset){
                state.proRules = payload.dataAll
            }else{
                state.proRules = [...state.proRules, ...payload.dataAll];
            }
        },
        GET_PRO_RULES_OUTPUT: (state, { payload }) => {
            if(payload.reset){
                state.proRulesOutput = payload.dataAll
            }else{
                state.proRulesOutput = [...state.proRulesOutput, ...payload.dataAll];
            }
        },
        GET_CELL_PRO_RULES_OUTPUT: (state, { payload }) => {
            if(payload.reset){
                state.cellproRulesOutput = payload.dataAll
            }else{
                state.cellproRulesOutput = [...state.cellproRulesOutput, ...payload.dataAll];
            }
        },
        GET_UNIQUE_PHYSICAL_ID: (state, { payload }) => {
            if(payload.reset){
                state.uniquePhysicalId = payload.dataAll
            }else{
                state.uniquePhysicalId = [...state.uniquePhysicalId, ...payload.dataAll];
            }
        },

        GET_UNIQUE_CELL_NAME: (state, { payload }) => {
            if(payload.reset){
                state.uniquePhysicalId = payload.dataAll
            }else{
                state.uniquePhysicalId = [...state.uniquePhysicalId, ...payload.dataAll];
            }
        },
        
        GET_UNIQUE_CELL_ID: (state, { payload }) => {
            if(payload.reset){
                state.uniqueCellId = payload.dataAll
            }else{
                state.uniqueCellId = [...state.uniqueCellId, ...payload.dataAll];
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

export const { GET_NOKIA_PRE_POST,GET_PRO_RULES,GET_PRO_RULES_OUTPUT,GET_CELL_PRO_RULES_OUTPUT,GET_UNIQUE_PHYSICAL_ID,GET_UNIQUE_CELL_ID,GET_UNIQUE_CELL_NAME,GET_NETWORK_ANALYTICS_PRO,GET_NETWORK_ANALYTICS_PRO_SORTER,GET_NETWORK_ANALYTICS_SHOW_COLS, RESET_STATE } = nokiaPrePost.actions
export default nokiaPrePost.reducer
