import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface Post {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
}

export default function WallPage() {
  const { username } = useParams<{ username: string }>();
  const { user, token, logout } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const isOwnWall = user?.username === username;

  useEffect(() => {
    async function loadPosts() {
      setIsLoadingPosts(true);
      const response = await fetch(`http://localhost:4000/api/posts/wall/${username}`);
      const data = await response.json();
      setPosts(data);
      setIsLoadingPosts(false);
    }

    loadPosts();
  }, [username]);

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newPostContent }),
    });

    const newPost = await response.json();
    setPosts([newPost, ...posts]);
    setNewPostContent("");
  }

  return (
    <div>
      <h1>{username}'s Wall</h1>

      {user && (
        <button onClick={logout}>Log Out</button>
      )}

      {isOwnWall && (
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <button type="submit">Post</button>
        </form>
      )}

      {isLoadingPosts ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
            <p>{post.content}</p>
            <small>{new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
