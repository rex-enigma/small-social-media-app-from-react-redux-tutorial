import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addPost, addNewPost } from "./postsSlice";

export function AddPostForm() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const dispatch = useDispatch();

    const users = useSelector(state => state.users);

    const onTitleChange = e => setTitle(e.target.value);
    const onContentChange = e => setContent(e.target.value);
    const onAuthorChange = e => setUserId(e.target.value);

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const onSavePostClick = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                ////just assuming how the thunk function works internally, i might have gone off the rails a little bit.
                // dispatch will call the async thunk function returned from addNewPost, initiating the async request to add a new post to the database,
                // the async thunk function returned will first dispatch an action object with "type" field containing the 'posts/addNewPost/pending' value to the store,
                // then try to initial the async 'addnewpost' request, when the request returns data, try block of thunk function will dispatch an action object with 'type' field 
                // containing 'posts/addNewPost/fulfilled' value and a "payload" field containing the data, after that, thunk try block will also return a Promise
                // completed with the action object({type: 'posts/addNewPost/fulfilled', payload: data}) that was dispatched to the store. If the request returns an 
                // error, Thunk function will catch it and the catch block dispatch an action object with the 'type' field containing 'posts/addNewPost/rejected' value and 
                // an 'error' field holding the error data, after that, thunk catch block will also return a Promise completed with the action object 
                // ({type: 'posts/addNewPost/rejected', error: err.message})

                //The thunk function eventually return a Promise that completed either with a fulfilled action if its succeeded, or the rejected action if it failed.
                // We can await that Promise here to know when the thunk has finished its request. Redux toolkit adds a .unwrap() function the the returned Promise,
                // which will return a new Promise that either has the actual 'action.payload' value from a fulfilled action, or throws an error if it's the rejected action.
                // This lets us handle success or failure at this component level(in this component in this case) using normal 'try/catch' logic.
                await dispatch(addNewPost({ title, content, user: userId })).unwrap();
                setTitle('');
                setContent('');
                setUserId('');

            } catch (err) {
                console.error('Failed to save the post', err);
            } finally {
                setAddRequestStatus('idle');
            }


            setTitle('');
            setContent('');
        }
    };



    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ));

    return (
        <section>
            <h2>Add a New post</h2>
            <form>
                <label htmlFor="postTitle"> Post Title:</label>
                <input
                    type="text"
                    id='postTitle'
                    name='postTitle'
                    value={title}
                    onChange={onTitleChange}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChange}>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">content:</label>
                <textarea
                    type="text"
                    id='postContent'
                    name='postContent'
                    value={content}
                    onChange={onContentChange}
                />
                <button type='button' onClick={onSavePostClick} disabled={!canSave} >Save Post </button>
            </form>
        </section>
    );
}