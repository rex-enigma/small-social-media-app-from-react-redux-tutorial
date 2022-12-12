import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { client } from "../../api/client";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await client.get('fakeApi/users');
        return response.data;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                // setAll will replace the entire list of users with the list of users we fetch from the server.
                usersAdapter.setAll(state, action.payload)
            })
    },
});


export default usersSlice.reducer;

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
} = usersAdapter.getSelectors(rootState => rootState.users);