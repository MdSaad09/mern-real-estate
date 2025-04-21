
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();

// Define the storage engine (local storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads'; // Folder to store the images
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath); // Create uploads folder if it doesn't exist
    }
    cb(null, uploadPath); // Store the file in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames
    cb(null, Date.now() + '-' + file.originalname); // Append timestamp for uniqueness
  }
});

// Multer setup to accept multiple images (up to 6)
const upload = multer({ storage }).array('images', 6);

// Handle image upload and return local URLs
export const uploadImages = async (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message }); // Handle multer errors
    }

    try {
      const imageUrls = req.files.map(file => {
        // Generate the local URL of the uploaded file
        return `${req.protocol}://localhost:3000/uploads/${file.filename}`;
      });

      // Return the array of image URLs
      res.status(200).json({ imageUrls });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Failed to upload images' });
    }
  });
};
