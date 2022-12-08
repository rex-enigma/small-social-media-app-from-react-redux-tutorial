import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import { client } from '../../api/client';



const initialState = {
    posts: [],
    status: 'idle',
    error: null,
};

/// The action creators(pending,fulfilled, rejected) that are generated when AsyncThunk is created, are attached to the actual `fetchPost` function (that wraps thunk function),
/// and can be passed to the `extraReducers` in the slice to listen for those actions.
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
                const { id, title, content } = action.payload;
                const existingPost = state.posts.find(post => post.id === id);

                if (existingPost) {
                    existingPost.title = title;
                    existingPost.content = content;
                }


            },
            addReaction(state, action) {
                const { postId, reaction } = action.payload;
                const existingPost = state.posts.find(post => post.id === postId);
                existingPost.reactions[reaction]++;
            },
        },
        extraReducers(builder) {
            builder
                .addCase(fetchPosts.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(fetchPosts.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.posts = state.posts.concat(action.payload);
                })
                .addCase(fetchPosts.rejected, (state, action) => {
                    state.status = ' rejected';
                    state.posts.error = action.error.message;
                })
                .addCase(addNewPost.fulfilled, (state, action) => {
                    state.posts.push(action.payload);
                })

        }
    },
);

export const selectAllPosts = state => state.posts.posts;
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

export const { addPost, updatePost, addReaction } = postSlice.actions;

export default postSlice.reducer
