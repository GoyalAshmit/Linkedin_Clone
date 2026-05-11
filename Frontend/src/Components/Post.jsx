import React, { useContext, useState } from "react";
import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";

function Post({ post }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData, getPost } = useContext(userDataContext);

  // ✅ Check if current user already liked
  const [liked, setLiked] = useState(
    post.like?.some((id) => id.toString() === userData?._id)
  );

  const [likeCount, setLikeCount] = useState(post.like?.length || 0);
  const [loading, setLoading] = useState(false);

  // ✅ Handle Like
  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.put(
        `${serverUrl}/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      // 🔥 Optimistic UI update
      setLiked(!liked);
      setLikeCount(res.data.likes);

      // Optional (sync all posts)
      // getPost();

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-4">

      {/* Author Section */}
      <div className="flex items-center gap-3">
        <img
          src={post?.author?.profileImage}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
        />
        <div>
          <h3 className="font-semibold cursor-default">
            {post?.author?.firstName} {post?.author?.lastName}
          </h3>
          <p className="text-sm text-gray-500 cursor-default">
            {post?.author?.headline}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-gray-800">{post?.description}</p>

      {/* Post Image */}
      {post?.image && (
        <img
          src={post?.image}
          alt="post"
          className="w-[85%] max-h-[400px] object-cover mx-auto mt-3 rounded-lg"
        />
      )}

      {/* Actions */}
      <div className="flex justify-around text-gray-600 pt-3 mt-3 border-t">

        {/* LIKE BUTTON */}
        <button
          onClick={handleLike}
          disabled={loading}
          className={`cursor-pointer flex items-center gap-2 transition ${
            liked ? "text-blue-600" : "hover:text-blue-600"
          }`}
        >
          <FaRegThumbsUp />
          {liked ? "Liked" : "Like"} ({likeCount})
        </button>

        {/* COMMENT BUTTON */}
        <button className="cursor-pointer flex items-center gap-2 hover:text-blue-600">
          <FaRegCommentDots />
          Comment
        </button>

      </div>
    </div>
  );
}

export default Post;