import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    databaseList: [],
    usersList: [],
    dbConfigList: [],
    savedQueryList:[],
    runQuery:{},
    tableList:{},
    dboList:[],
    generatedSqlQuery:{}
}

const customQuery = createSlice({
    name: "customQuery",
    initialState,
    reducers: {


        GENERATED_SQL_QUERY: (state, { payload }) => {
            state.generatedSqlQuery = payload
        },

        RUN_QUERY: (state, { payload }) => {
            state.runQuery = payload
        },




        TABLES_LIST: (state, { payload }) => {
            state.tableList = payload
            
        },



        
        USERS_LIST: (state, { payload }) => {
            if(payload.reset){
                state.usersList = payload.dataAll
            }else{
                state.usersList = [...state.usersList, ...payload.dataAll];
            }
        },

        DB_CONFIG_LIST: (state, { payload }) => {

            console.log(payload,"DB_CONFIG_LIST")
            if(payload.reset){
                state.dbConfigList = payload.dataAll
            }else{
                state.dbConfigList = [...state.dbConfigList, ...payload.dataAll];
            }
        },
    

        SAVED_QUERY_LIST: (state, { payload }) => {
            if(payload.reset){
                state.savedQueryList = payload.dataAll
            }else{
                state.savedQueryList = [...state.savedQueryList, ...payload.dataAll];
            }
        },


        DATABASE_LIST: (state, { payload }) => {
            if(payload.reset){
                state.databaseList = payload.dataAll
            }else{
                state.databaseList = [...state.databaseList, ...payload.dataAll];
            }
        },

        DBO_LIST: (state, { payload }) => {
            if(payload.reset){
                state.dboList = payload.dataAll
            }else{
                state.dboList = [...state.databaseList, ...payload.dataAll];
            }
        },
        
        RESET_STATE: (state) => {
            state.databaseList = [];
            state.tableList = {};
            generatedSqlQuery:{}
        }
    }
})

export const { DATABASE_LIST, TABLES_LIST, DBO_LIST, GENERATED_SQL_QUERY, RUN_QUERY, USERS_LIST,DB_CONFIG_LIST, SAVED_QUERY_LIST, RESET_STATE } = customQuery.actions
export default customQuery.reducer
