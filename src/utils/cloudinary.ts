import {v2 as cloudinary} from 'cloudinary';
import 'dotenv/config.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUNARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export default cloudinary