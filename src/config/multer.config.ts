import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const orginalName = file.originalname;
    const extension = orginalName.split(".").pop()?.toLowerCase();
    const fileNameWithoutExtension = orginalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueName =
      Math.random().toString(36).substring(2, 8) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `ph-health-care/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
    };
  },
});

export const multerUpload = multer({ storage: storage });
