import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await client.get('fakeApi/users');
        return response.data;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                // Immer lets us update state in two ways: either 'mutating' the existing state value, or returning a new result, but not both at the same time.
                // and since createSlice() is uses immer we can choose either other two.
                // if you return a new value, it will replace the existing state completely
                return action.payload
            })
    },
});

export const selectAllUsers = state => state.users;
export const selectUserById = (state, userId) => state.users.find(user => user.id === userId)

export default usersSlice.reducer;  