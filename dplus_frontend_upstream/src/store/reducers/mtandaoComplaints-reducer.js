import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mtandaoComplaintsList: [],
    usersList: [],
    dbConfigList: [],
    savedQueryList:[],
    runQuery:{},
    tableList:{},
    generatedSqlQuery:{}
}

const mtandaoComplaints = createSlice({
    name: "mtandaoComplaints",
    initialState,
    reducers: {
        MTANDAO_COMPLAINTS_LIST: (state, { payload }) => {
            if(payload.reset){
                state.mtandaoComplaintsList = payload.dataAll
            }else{
                state.mtandaoComplaintsList = [...state.mtandaoComplaintsList, ...payload.dataAll];
            }

            
            
        },
        RESET_STATE: (state) => {
            state.databaseList = [];
            state.tableList = {};
            generatedSqlQuery:{}
        }
    }
})

export const { MTANDAO_COMPLAINTS_LIST, TABLES_LIST, GENERATED_SQL_QUERY, RUN_QUERY, USERS_LIST,DB_CONFIG_LIST, SAVED_QUERY_LIST, RESET_STATE } = mtandaoComplaints.actions
export default mtandaoComplaints.reducer
