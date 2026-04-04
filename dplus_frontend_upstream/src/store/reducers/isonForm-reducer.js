import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    getisonForm: [],
    usersList: [],
    dbConfigList: [],
    savedQueryList:[],
    runQuery:{},
    tableList:{},
    generatedSqlQuery:{}
}

const isonForm = createSlice({
    name: "isonForm",
    initialState,
    reducers: {
        GET_ISON_FORM: (state, { payload }) => {
            state.getisonForm = payload
        },
        RESET_STATE: (state) => {
            state.databaseList = [];
            state.tableList = {};
            generatedSqlQuery:{}
        }
    }
})

export const { GET_ISON_FORM, TABLES_LIST, GENERATED_SQL_QUERY, RUN_QUERY, USERS_LIST,DB_CONFIG_LIST, SAVED_QUERY_LIST, RESET_STATE } = isonForm.actions
export default isonForm.reducer
