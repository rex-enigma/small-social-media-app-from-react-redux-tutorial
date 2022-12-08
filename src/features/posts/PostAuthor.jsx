import React from "react";
import { useSelector } from "react-redux";

export function PostAuthor({ userId }) {
    const author = useSelector(state => state.users.find(user => user.id === userId));

    return (
        <span>by {author ? author.name : 'unknown author'}</span>
    );
}