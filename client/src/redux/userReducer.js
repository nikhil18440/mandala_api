import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: JSON.parse(sessionStorage.getItem('user')) || null ,
        isFetching: false,
        error: false
    },
    reducers: {

        userFetchStart: (state) => {
            state.user = null
            state.isFetching = true
            state.error = false
        },
        userFetchSuccess: (state,action) => {
            state.user = action.payload
            state.isFetching = false
            state.error = false
        },
        userFetchFailure: (state) => {
            state.user = null
            state.isFetching = false
            state.error = true
        }

    }
})

export const {userFetchStart,userFetchSuccess,userFetchFailure} = userSlice.actions
export default userSlice.reducer