import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updatePost } from "./postsSlice";
import { selectPostById } from "./postsSlice";


export function EditPostForm({ match }) {
    const { postId } = match.params;

    const post = useSelector(state => selectPostById(state, postId));


    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const dispatch = useDispatch();
    const history = useHistory();

    const onTitleChange = e => setTitle(e.target.value);
    const onContentChange = e => setContent(e.target.value);

    const onSavePostClick = () => {
        if (title && content) {
            dispatch(updatePost({ postId, title, content }));
            history.push(`/posts/${postId}`);
        }
    };

    return (
        <section>
            <h2> Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id='postTitle'
                    name='postTitle'
                    placeholder="update the title"
                    value={title}
                    onChange={onTitleChange}
                />
                <label htmlFor="postContent">Post Title:</label>
                <input
                    type="text"
                    id='postContent'
                    name='postContent'
                    placeholder="update the content"
                    value={content}
                    onChange={onContentChange}
                />
            </form>
            <button type="button" onClick={onSavePostClick}>Updated Post</button>
        </section>
    );


}