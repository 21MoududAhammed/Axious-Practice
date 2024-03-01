import { useEffect, useState } from "react";
import "./App.css";
import AddPost from "./components/AddPost.jsx";
import EditPost from "./components/EditPost.jsx";
import Posts from "./components/Posts";
import axios from "axios";
// import initialPosts from "./data/db.js";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null); // post I am editing
  const [error, setError] = useState(null);

  const handleAddPost = async (newPost) => {
    try {
      const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;
      const nextPost = {
        ...newPost,
        id: id.toString(),
      };
      // It post a element then return it
      const response = await axios.post(
        `http://localhost:8000/posts`,
        nextPost
      );
      console.log(response);
      if (response.data) {
        setPosts([...posts, response.data]);
      }
    } catch (err) {
      if (err.response) {
        setError(`Server Error Status: ${err.status} Message: ${err.message}`);
      } else {
        setError(err.message);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (confirm("Are you sure you want to delete the post?")) {
        const nextPosts = posts.filter((post) => post.id !== postId);
        // delete from server
        await axios.delete(`http://localhost:8000/posts/${postId}`);
        setPosts(nextPosts);
      } else {
        console("You chose not to delete the post!");
      }
    } catch (err) {
      if (err.response) {
        setError(`Server Error Status: ${err.status} Message: ${err.message}`);
      } else {
        setError(err.message);
      }
    }
  };

  const handleEditPost = (updatedPost) => {
    const updatedPosts = posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );

    setPosts(updatedPosts);
  };

  // fetch posts by axious
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/posts`);
        if (response && response.data) {
          setPosts(response.data);
        }
      } catch (err) {
        // if server is not running err dosen't contain response
        if (err.response) {
          setError(
            `Server Error Status: ${err.status} Message: ${err.message}`
          );
        } else {
          setError(err.message);
        }
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div>
        <h1>API Request with Axios</h1>
        <hr />

        <div>
          <Posts
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditClick={setPost}
          />

          <hr />

          {!post ? (
            <AddPost onAddPost={handleAddPost} />
          ) : (
            <EditPost post={post} onEditPost={handleEditPost} />
          )}
          {error && (
            <>
              <hr />
              <div>{error}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
