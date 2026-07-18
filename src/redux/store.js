import {configureStore}from "@reduxjs/toolkit";
import teamReducer from "./teamSlice";
import leadReducer from "./allLeadSlice"
import { followupApi } from "./followupApi";

export const store = configureStore({
    reducer:{
        team :teamReducer , 
        lead : leadReducer ,


            [followupApi.reducerPath]:followupApi.reducer,
    },
    middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(followupApi.middleware)
})
