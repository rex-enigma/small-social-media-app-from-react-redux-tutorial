import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from "./ReactionButtons";
import { selectAllPosts, fetchPosts } from './postsSlice';
import { Spinner } from '../../components/Spinner'


export function PostsList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  // we want to order the post, we can't use array.sort() directly on the posts since it will mutate the posts state (as you know it shouldn't{only reducers should do that immutably})
  // so we create a shallow copy with slice and sort it in a reverse chronological order by datetime string.
  const orderedPosts = posts.slice().sort(
    (postA, postB) => postB.date.localeCompare(postA.date)
  );

  const postStatus = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === 'loading') {
    content = <Spinner text='Loading..' />
  } else if (postStatus === 'succeeded') {
    content = orderedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)
  } else if (postStatus === 'rejected') {
    content = <div>{error}</div>
  }


  return (
    <section className='posts-list'>
      <h2>Posts</h2>
      {content}
    </section>
  );

}

function PostExcerpt({ post }) {
  return (
    <article className='post-excerpt' key={post.id}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <p className='post-content'>{post.content.substring(0, 100)}</p>
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className='button muted-button'>View post</Link>
    </article>
  );
}
