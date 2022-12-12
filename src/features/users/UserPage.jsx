import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUserById } from "./usersSlice";
import { selectAllPosts, selectPostsByUser } from "../posts/postsSlice";


export function UserPage({ match }) {
    const { userId } = match.params;

    const user = useSelector(rootState => selectUserById(rootState, userId));

    const postsForUser = useSelector(state => selectPostsByUser(state, userId));

    const renderedPosts = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </li>
    ));

    return (
        <section>
            <h2>{user.name}</h2>
            <ul>{renderedPosts}</ul>
        </section>
    );

}