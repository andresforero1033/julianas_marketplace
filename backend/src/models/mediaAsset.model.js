import mongoose from 'mongoose';

const { Schema } = mongoose;

const ownerTypes = ['product', 'vendor', 'user', 'general'];

const mediaAssetSchema = new Schema(
  {
    ownerType: {
      type: String,
      enum: ownerTypes,
      default: 'general',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    originalFileName: {
      type: String,
      trim: true,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      min: 0,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    storageProvider: {
      type: String,
      trim: true,
      default: 'mock-storage',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    tags: {
      type: [String],
      default: [],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

mediaAssetSchema.index({ ownerType: 1, ownerId: 1, createdAt: -1 });

export default mongoose.model('MediaAsset', mediaAssetSchema);
export { ownerTypes as MEDIA_OWNER_TYPES };
