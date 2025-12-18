import mongoose from 'mongoose';

const { Schema } = mongoose;

const socialLinksSchema = new Schema(
  {
    website: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
  },
  { _id: false },
);

const policySchema = new Schema(
  {
    shipping: { type: String, trim: true },
    returns: { type: String, trim: true },
  },
  { _id: false },
);

const vendorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    policies: {
      type: policySchema,
      default: () => ({}),
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Vendor', vendorSchema);
