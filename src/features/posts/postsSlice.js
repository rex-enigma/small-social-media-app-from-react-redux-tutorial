import { createAsyncThunk, createSlice, nanoid, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client';

// an entity adapter object will be  returned
const postsAdapter = createEntityAdapter({
    sortComparer: (postA, postB) => postB.date.localeCompare(postA),
});

// getInitialState accepts additional state fields apart from id and entities field it create
const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null,
});

// When createAsyncThunk function executes it will return a function that creates action creators(pending,fulfilled, rejected) 
// and thunk function, that function returned is dabbled 'thunk action creator', i think because the function creates both the 
// action creators and thunk function which it will return  

// The action creators(pending,fulfilled, rejected) that are generated, are attached to the thunk action creator in this case (`fetchPost`) function,
// and can be passed to the `extraReducers` in the slice to listen for those actions.
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const response = await client.get('/fakeApi/posts');
        return response.data;
    },
);

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial {title, content, user}
    async newPost => {
        // We send the newPost data to the fake API server
        const response = await client.post('fakeApi/posts', newPost);
        // The response includes the complete post object, including unique ID
        return response.data;
    }
);

const postSlice = createSlice(
    {
        name: 'posts',
        initialState,
        reducers: {
            addPost: {
                reducer(state, action) {
                    state.posts.push(action.payload);
                },
                // we are describing how the action object should look like because: we
                // might need to dispatch the same object from diff component or le logic for preparing the payload is complicated.
                // This slice will take care of putting it together the right way and generating the action creator with the name addPost.
                prepare(title, content, userId) {
                    return {
                        payload: {
                            id: nanoid(),
                            // actions/states should only contain pain js values: no class instances,functions or other non-serializable values.
                            // and in this case the date instance is converted into a string.
                            date: new Date().toISOString(),
                            title,
                            content,
                            user: userId,
                            reactions: {
                                thumbsUp: 0,
                                hooray: 0,
                                heart: 0,
                                rocket: 0,
                                eyes: 0
                            },
                        }
                    };
                }
            },
            updatePost(state, action) {
                const { postId, title, content } = action.payload;
                const existingPost = state.entities[postId];

                if (existingPost) {
                    existingPost.title = title;
                    existingPost.content = content;
                }


            },
            addReaction(state, action) {
                const { postId, reaction } = action.payload;
                const existingPost = state.entities[postId];
                if (existingPost) {
                    existingPost.reactions[reaction]++;
                }

            },
        },
        extraReducers(builder) {
            builder
                .addCase(fetchPosts.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(fetchPosts.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    // Add any fetched posts to the postsState
                    // Use the 'upsertMany' reducer as a mutating update utility
                    // if there's any items in action.payload that already exist in our state, the 'upsertMany' function will merge them together based on matching IDs.
                    postsAdapter.upsertMany(state, action.payload);
                })
                .addCase(fetchPosts.rejected, (state, action) => {
                    state.status = ' rejected';
                    state.error = action.error.message;
                })
                .addCase(addNewPost.fulfilled, (state, action) => {
                    // Use 'addOne' reducer or the fulfilled case.
                    // you can also use this adapter reducer utility directly as the second argument of this 'addCase' function.
                    postsAdapter.addOne(state, action.payload);
                })

        }
    },
);

//export the customized selectors for this adapter using `getSelectors`;
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
} = postsAdapter.getSelectors(rootState => rootState.posts);

//check some quick explanation at https://redux.js.org/tutorials/essentials/part-6-performance-normalization#memoizing-selector-functions
// if selectPostsByUser(state, userId) is called multiple times, it will only re-run the output selector if either
// posts(state.posts) or userId has changed
export const selectPostsByUser = createSelector(
    //input selectors
    [selectAllPosts, (state, userId) => userId],
    //output selector
    (posts, userId) => posts.filter(post => post.user === userId), //should be updated
);

export const { addPost, updatePost, addReaction } = postSlice.actions;

export default postSlice.reducer


