import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";

// You can only pass  one argument to the thunk action creator(refer to postSlice under its createAsyncThunk if you have forgotten what 'thunk action creator is') the one
// returned when createAsyncThunk executes, and whatever is passed will become the first argument of the payload creation callback.
// the second argument to the payload creator callback is a thunkAPI object containing several useful functions and pieces of
// information: some of them are 'dispatch' and 'getState', extra, requiredId, signal, rejectWithValue. check out https://redux.js.org/tutorials/essentials/part-6-performance-normalization#thunk-arguments on what they do or the createAsyncThunk api reference
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    // payload creator callback
    async (_, { getState }) => {
        const allNotifications = selectAllNotifications(getState());
        const [latestNotification] = allNotifications;
        const latestTimeStamp = latestNotification ? latestNotification.date : ''
        const response = await client(`/fakeApi/notifications?since=${latestTimeStamp}`);
        return response;
    },
);

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {

    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.push(...action.payload.data);
                //ordering the notifications so that the latest notification becomes the first element in the array.
                // reminder: array.sort() always mutates the existing array-this is only safe because we're using createSlice and Immmer inside.
                state.sort((notifA, notifB) => notifB.date.localeCompare(notifA.date));
            })
    }
});

export default notificationsSlice.reducer;
export const selectAllNotifications = rootState => rootState.notifications;