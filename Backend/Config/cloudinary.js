import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

export const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      return null;
    }

    // Check if Cloudinary is configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      const uploadResult = await cloudinary.uploader.upload(filePath);
      fs.unlinkSync(filePath);
      return uploadResult.secure_url;
    } else {
      // Local fallback
      const fileName = Date.now() + "-" + path.basename(filePath);
      const destDir = "./uploads";
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      const destPath = path.join(destDir, fileName);
      fs.renameSync(filePath, destPath);

      // Return local URL
      const port = process.env.PORT || 5000;
      return `http://localhost:${port}/uploads/${fileName}`;
    }
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.log("Upload Error:", error);
    return null;
  }
};
