import { uploadOnCloudinary } from "../Config/cloudinary.js";
import Post from "../Models/post.model.js";


// CREATE POST
export const createPost = async (req, res) => {
  try {

    let { description } = req.body;

    let newPost;

    if (req.file) {

      let image = await uploadOnCloudinary(req.file.path);

      newPost = await Post.create({
        author: req.userId,
        description,
        image,
      });

    } else {

      newPost = await Post.create({
        author: req.userId,
        description,
      });

    }

    const populatedPost = await Post.findById(newPost._id)
      .populate(
        "author",
        "firstName lastName profileImage headline"
      );

    return res.status(201).json(populatedPost);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Create Post error",
    });

  }
};


// GET POSTS
export const getPost = async (req, res) => {
  try {

    let posts = await Post.find()

      .populate(
        "author",
        "firstName lastName profileImage headline"
      )

      .populate(
        "comment.user",
        "firstName lastName profileImage"
      )

      .sort({ createdAt: -1 });

    return res.status(200).json(posts);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Get posts error",
    });

  }
};


// TOGGLE LIKE
export const toggleLike = async (req, res) => {
  try {

    const { postId } = req.params;

    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {

      return res.status(404).json({
        message: "Post not found",
      });

    }

    const isLiked = post.like.includes(userId);

    if (isLiked) {

      // REMOVE LIKE
      post.like.pull(userId);

    } else {

      // ADD LIKE
      post.like.push(userId);

    }

    await post.save();

    return res.status(200).json({
      message: isLiked ? "Post unliked" : "Post liked",
      likes: post.like.length,
      post,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Like error",
    });

  }
};


// ADD COMMENT
export const addComment = async (req, res) => {
  try {

    const { postId } = req.params;

    const { content } = req.body;

    if (!content || content.trim() === "") {

      return res.status(400).json({
        message: "Comment is required",
      });

    }

    const post = await Post.findById(postId);

    if (!post) {

      return res.status(404).json({
        message: "Post not found",
      });

    }

    const newComment = {
      content,
      user: req.userId,
    };

    post.comment.push(newComment);

    await post.save();

    const updatedPost = await Post.findById(postId)

      .populate(
        "author",
        "firstName lastName profileImage headline"
      )

      .populate(
        "comment.user",
        "firstName lastName profileImage"
      );

    return res.status(201).json(updatedPost);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Add comment error",
    });

  }
};


// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {

    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {

      return res.status(404).json({
        message: "Post not found",
      });

    }

    const comment = post.comment.id(commentId);

    if (!comment) {

      return res.status(404).json({
        message: "Comment not found",
      });

    }

    // ONLY COMMENT OWNER CAN DELETE
    if (comment.user.toString() !== req.userId) {

      return res.status(403).json({
        message: "Unauthorized",
      });

    }

    post.comment.pull(commentId);

    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Delete comment error",
    });

  }
};


// DELETE POST
export const deletePost = async (req, res) => {
  try {

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {

      return res.status(404).json({
        message: "Post not found",
      });

    }

    // ONLY POST OWNER CAN DELETE
    if (post.author.toString() !== req.userId) {

      return res.status(403).json({
        message: "Unauthorized",
      });

    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Delete post error",
    });

  }
};


// EDIT POST
export const editPost = async (req, res) => {
  try {

    const { postId } = req.params;

    const { description } = req.body;

    const post = await Post.findById(postId);

    if (!post) {

      return res.status(404).json({
        message: "Post not found",
      });

    }

    // ONLY OWNER CAN EDIT
    if (post.author.toString() !== req.userId) {

      return res.status(403).json({
        message: "Unauthorized",
      });

    }

    post.description = description;

    await post.save();

    const updatedPost = await Post.findById(postId)

      .populate(
        "author",
        "firstName lastName profileImage headline"
      )

      .populate(
        "comment.user",
        "firstName lastName profileImage"
      );

    return res.status(200).json(updatedPost);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Edit post error",
    });

  }
};