import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice";

export function PostAuthor({ userId }) {
    const author = useSelector(rootState => selectUserById(rootState, userId));

    return (
        <span>by {author ? author.name : 'unknown author'}</span>
    );
}