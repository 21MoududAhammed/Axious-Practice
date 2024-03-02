import { useEffect, useState } from "react";
import "./App.css";
import AddPost from "./components/AddPost.jsx";
import EditPost from "./components/EditPost.jsx";
import Posts from "./components/Posts";
import { api } from "./api/api.js";

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
      const response = await api.post(`/posts`, nextPost);
      if (response.data) {
        setPosts([...posts, response.data]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      if (confirm("Are you sure you want to delete the post?")) {
        const nextPosts = posts.filter((post) => post.id !== postId);
        // delete from server
        await api.delete(`/posts/${postId}`);
        setPosts(nextPosts);
      } else {
        console("You chose not to delete the post!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      const response = await api.patch(`/posts/${updatedPost.id}`, updatedPost);

      const updatedPosts = posts.map((post) =>
        post.id === updatedPost.id ? response.data : post
      );
      if (response.data) {
        setPosts(updatedPosts);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // fetch posts by axious
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/posts`);
        if (response && response.data) {
          setPosts(response.data);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div>
        <h1>Axios Request with axios</h1>
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
