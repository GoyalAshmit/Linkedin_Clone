import { uploadOnCloudinary } from "../Config/cloudinary.js";
import User from "../Models/user.model.js";
import Notification from "../Models/notification.model.js";

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {

    let id = req.userId;

    const user = await User.findById(id)
      .select("-password")
      .populate(
        "connections connectionRequests sentRequests",
        "firstName lastName userName profileImage headline"
      );

    if (!user) {
      return res.status(400).json({
        message: "No user found!"
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Get current user error"
    });
  }
};



// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {

    let {
      firstName,
      lastName,
      userName,
      email,
      headline,
      location,
      gender,
    } = req.body;

    let skills = req.body.skills
      ? JSON.parse(req.body.skills)
      : [];

    let education = req.body.education
      ? JSON.parse(req.body.education)
      : [];

    let experience = req.body.experience
      ? JSON.parse(req.body.experience)
      : [];

    let profileImage;
    let coverImage;

    // PROFILE IMAGE
    if (req.files && req.files.profileImage) {

      profileImage = await uploadOnCloudinary(
        req.files.profileImage[0].path
      );
    }

    // COVER IMAGE
    if (req.files && req.files.coverImage) {

      coverImage = await uploadOnCloudinary(
        req.files.coverImage[0].path
      );
    }

    // FIND USER
    let existingUser = await User.findById(req.userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // UPDATE USER
    let user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        email,
        headline,
        skills,
        education,
        location,
        gender,
        experience,

        profileImage:
          profileImage || existingUser.profileImage,

        coverImage:
          coverImage || existingUser.coverImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Upload server error"
    });
  }
};



// SEND CONNECTION REQUEST
export const sendConnectionRequest = async (req, res) => {
  try {

    const senderId = req.userId;

    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot connect with yourself"
      });
    }

    const sender = await User.findById(senderId);

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // already connected
    if (sender.connections.includes(receiverId)) {
      return res.status(400).json({
        message: "Already connected"
      });
    }

    // already requested
    if (sender.sentRequests.includes(receiverId)) {
      return res.status(400).json({
        message: "Request already sent"
      });
    }

    // add request
    sender.sentRequests.push(receiverId);

    receiver.connectionRequests.push(senderId);

    await sender.save();

    await receiver.save();

    // CREATE NOTIFICATION
    await Notification.create({
      sender: senderId,
      receiver: receiverId,
      type: "request",
      message: "sent you a connection request",
    });

    return res.status(200).json({
      message: "Connection request sent"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Send request error"
    });
  }
};



// ACCEPT CONNECTION REQUEST
export const acceptConnectionRequest = async (req, res) => {
  try {

    const currentUserId = req.userId;

    const senderId = req.params.id;

    const currentUser = await User.findById(currentUserId);

    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found"
      });
    }

    // remove request
    currentUser.connectionRequests.pull(senderId);

    sender.sentRequests.pull(currentUserId);

    // add connections
    currentUser.connections.push(senderId);

    sender.connections.push(currentUserId);

    await currentUser.save();

    await sender.save();

    // CREATE NOTIFICATION
    await Notification.create({
      sender: currentUserId,
      receiver: senderId,
      type: "accept",
      message: "accepted your connection request",
    });

    return res.status(200).json({
      message: "Connection request accepted"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Accept request error"
    });
  }
};



// REMOVE CONNECTION
export const removeConnection = async (req, res) => {
  try {

    const currentUserId = req.userId;

    const otherUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);

    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    currentUser.connections.pull(otherUserId);

    otherUser.connections.pull(currentUserId);

    await currentUser.save();

    await otherUser.save();

    return res.status(200).json({
      message: "Connection removed"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Remove connection error"
    });
  }
};



// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({
      _id: { $ne: req.userId }
    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Get users error"
    });
  }
};
// GET USER PROFILE
export const getUserProfile = async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Get profile error"
    });
  }
};
// SEARCH USERS
export const searchUsers = async (req, res) => {

  try {

    const keyword = req.query.keyword;

    const users = await User.find({

      $or: [

        {
          firstName: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          lastName: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          userName: {
            $regex: keyword,
            $options: "i"
          }
        },

        {
          headline: {
            $regex: keyword,
            $options: "i"
          }
        }

      ]

    }).select("-password");

    return res.status(200).json(users);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Search user error"
    });
  }
};