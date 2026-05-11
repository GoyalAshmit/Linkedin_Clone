import { uploadOnCloudinary } from "../Config/cloudinary.js";
import Post from "../Models/post.model.js";

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
    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Create Post error" });
  }
};

export const getPost = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate("author", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "get posts error" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.like.includes(userId);

    if (isLiked) {
      // remove like
      post.like.pull(userId);
    } else {
      // add like
      post.like.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: isLiked ? "Post unliked" : "Post liked",
      likes: post.like.length,
      post
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Like error" });
  }
};