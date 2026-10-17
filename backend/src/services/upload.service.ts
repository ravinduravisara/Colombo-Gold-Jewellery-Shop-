import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary";
import { ENV } from "../config/env";
import { logger } from "../utils/logger";

export interface UploadResult {
  url: string;
  publicId?: string;
  format: string;
  size: number;
}

export class UploadService {
  static async uploadFile(
    file: Express.Multer.File,
    folder: string = "colombo-gold-covering"
  ): Promise<UploadResult> {
    const isCloudinaryConfigured = !!(
      ENV.CLOUDINARY.CLOUD_NAME &&
      ENV.CLOUDINARY.API_KEY &&
      ENV.CLOUDINARY.API_SECRET
    );

    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: `colombo-gold-covering/${folder}`,
          resource_type: "auto",
        });

        // Delete temporary local file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        return {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
        };
      } catch (error) {
        logger.error("[Cloudinary Upload Error] Falling back to local storage:", error);
      }
    }

    // Local storage fallback
    const relativeUrl = `/uploads/${file.filename}`;
    return {
      url: relativeUrl,
      publicId: file.filename,
      format: path.extname(file.originalname).replace(".", ""),
      size: file.size,
    };
  }

  static async deleteFile(publicIdOrUrl: string): Promise<boolean> {
    if (!publicIdOrUrl) return false;

    // Cloudinary deletion
    if (publicIdOrUrl.startsWith("http") && publicIdOrUrl.includes("cloudinary.com")) {
      try {
        const match = publicIdOrUrl.match(/\/v\d+\/(.+)\.\w+$/);
        const publicId = match ? match[1] : publicIdOrUrl;
        await cloudinary.uploader.destroy(publicId);
        return true;
      } catch (err) {
        logger.warn("[Cloudinary Delete Error]", err);
        return false;
      }
    }

    // Local file deletion
    try {
      const filename = path.basename(publicIdOrUrl);
      const filePath = path.resolve(__dirname, "../../uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
    } catch (err) {
      logger.warn("[Local File Delete Error]", err);
    }
    return false;
  }
}

