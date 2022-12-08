import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Navbar } from './app/Navbar';
import { PostsList } from './features/posts/PostsList.jsx';
import { AddPostForm } from './features/posts/AddPostForm.jsx';
import { SinglePostPage } from './features/posts/SinglePostPage.jsx';
import { EditPostForm } from './features/posts/EditPostForm.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />
          {/* we are telling the route to parse the second part of the URL as a variable named `postId` */}
          <Route exact path='/posts/:postId' component={SinglePostPage} />
          <Route exact path='/editPost/:postId' component={EditPostForm} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
