import React, { useContext, useState } from "react";

import { FaRegThumbsUp } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

import axios from "axios";

import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";

function Post({ post }) {

  const { serverUrl } = useContext(authDataContext);

  const { userData, getPost } = useContext(userDataContext);

  const [liked, setLiked] = useState(
    post.like?.some((id) => id.toString() === userData?._id)
  );

  const [likeCount, setLikeCount] = useState(post.like?.length || 0);

  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState("");

  const [editing, setEditing] = useState(false);

  const [editText, setEditText] = useState(post.description);

  // LIKE POST
  const handleLike = async () => {

    if (loading) return;

    setLoading(true);

    try {

      const res = await axios.put(
        `${serverUrl}/api/post/like/${post._id}`,
        {},
        { withCredentials: true }
      );

      setLiked(!liked);

      setLikeCount(res.data.likes);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // ADD COMMENT
  const handleComment = async () => {

    if (!comment.trim()) return;

    try {

      await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { content: comment },
        { withCredentials: true }
      );

      setComment("");

      getPost();

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE POST
  const handleDeletePost = async () => {

    try {

      await axios.delete(
        `${serverUrl}/api/post/delete/${post._id}`,
        { withCredentials: true }
      );

      getPost();

    } catch (error) {

      console.log(error);

    }
  };

  // EDIT POST
  const handleEditPost = async () => {

    try {

      await axios.put(
        `${serverUrl}/api/post/edit/${post._id}`,
        { description: editText },
        { withCredentials: true }
      );

      setEditing(false);

      getPost();

    } catch (error) {

      console.log(error);

    }
  };

  // DELETE COMMENT
  const handleDeleteComment = async (commentId) => {

    try {

      await axios.delete(
        `${serverUrl}/api/post/comment/${post._id}/${commentId}`,
        { withCredentials: true }
      );

      getPost();

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="bg-white p-4 rounded-xl shadow-md mb-4">

      {/* AUTHOR */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <img
            src={post?.author?.profileImage}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />

          <div>

            <h3 className="font-semibold">
              {post?.author?.firstName} {post?.author?.lastName}
            </h3>

            <p className="text-sm text-gray-500">
              {post?.author?.headline}
            </p>

          </div>

        </div>

        {/* OWNER ACTIONS */}
        {
          post.author._id === userData._id && (

            <div className="flex gap-3 text-xl">

              <FaEdit
                className="cursor-pointer hover:text-blue-600"
                onClick={() => setEditing(!editing)}
              />

              <MdDelete
                className="cursor-pointer hover:text-red-600"
                onClick={handleDeletePost}
              />

            </div>

          )
        }

      </div>

      {/* DESCRIPTION */}
      {
        editing ? (

          <div className="mt-3">

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border p-2 rounded-lg outline-none"
            />

            <button
              onClick={handleEditPost}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>

          </div>

        ) : (

          <p className="mt-3 text-gray-800">
            {post?.description}
          </p>

        )
      }

      {/* IMAGE */}
      {
        post?.image && (

          <img
            src={post?.image}
            alt="post"
            className="w-[85%] max-h-[400px] object-cover mx-auto mt-3 rounded-lg"
          />

        )
      }

      {/* ACTIONS */}
      <div className="flex justify-around text-gray-600 pt-3 mt-3 border-t">

        {/* LIKE */}
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

        {/* COMMENT */}
        <button className="cursor-pointer flex items-center gap-2 hover:text-blue-600">

          <FaRegCommentDots />

          Comment ({post.comment?.length || 0})

        </button>

      </div>

      {/* COMMENT INPUT */}
      <div className="flex gap-2 mt-4">

        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 outline-none"
        />

        <button
          onClick={handleComment}
          className="px-4 py-2 bg-blue-600 text-white rounded-full"
        >
          Post
        </button>

      </div>

      {/* COMMENTS */}
      <div className="mt-4 flex flex-col gap-3">

        {
          post.comment?.map((c) => (

            <div
              key={c._id}
              className="bg-gray-100 p-3 rounded-xl"
            >

              <div className="flex justify-between items-center">

                <div className="flex items-center gap-2">

                  <img
                    src={c.user?.profileImage}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div>

                    <h1 className="text-sm font-semibold">
                      {c.user?.firstName} {c.user?.lastName}
                    </h1>

                    <p className="text-xs text-gray-500">
                      {c.user?.headline}
                    </p>

                  </div>

                </div>

                {
                  c.user?._id === userData._id && (

                    <MdDelete
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteComment(c._id)}
                    />

                  )
                }

              </div>

              <p className="mt-2 text-sm">
                {c.content}
              </p>

            </div>

          ))
        }

      </div>

    </div>
  );
}

export default Post;