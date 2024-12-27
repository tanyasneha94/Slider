import { useState, useEffect } from "react";
import axios from "axios";

const useFetchPosts = (url) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [url]);

  return { posts, loading, error, fetchPosts };
};

export default useFetchPosts;
