import mongoose from 'mongoose';

const { Schema } = mongoose;

export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const orderItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unitSalePrice: {
      type: Number,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    variantName: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
    timestamps: false,
  },
);

const vendorSummarySchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    itemsCount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const statusHistorySchema = new Schema(
  {
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    buyerProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'BuyerProfile',
    },
    buyerSnapshot: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    shippingAddress: {
      recipientName: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      country: { type: String, required: true, trim: true },
      postalCode: { type: String, trim: true },
      notes: { type: String, trim: true },
    },
    paymentMethod: {
      type: {
        type: String,
        default: 'manual',
        trim: true,
        lowercase: true,
      },
      provider: { type: String, trim: true },
      reference: { type: String, trim: true },
    },
    currency: {
      type: String,
      default: 'COP',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    totalItems: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
      index: true,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    vendors: {
      type: [vendorSummarySchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Order', orderSchema);
