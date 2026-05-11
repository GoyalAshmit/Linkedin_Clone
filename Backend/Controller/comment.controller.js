import Post from "../Models/post.model.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      content,
      user: req.userId,
    };

    post.comment.push(newComment);

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "firstName lastName profileImage headline")
      .populate("comment.user", "firstName lastName profileImage");

    return res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Add comment error" });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comment.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.comment.pull(commentId);

    await post.save();

    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Delete comment error" });
  }
};