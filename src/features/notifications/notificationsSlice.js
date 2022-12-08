import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../api/client";


export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
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
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.push(...action.payload);
                //ordering the notifications so that the latest notification becomes the first element in the array.
                // reminder: array.sort() always mutates the existing array-this is only safe because we're using createSlice and Immmer inside.
                state.sort((notifA, notifB) => notifB.date.localeCompare(notifA.date));
            })
    }
});

export default fetchNotifications.reducer;
export const selectAllNotifications = state => state.notifications;