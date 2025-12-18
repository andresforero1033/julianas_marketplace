import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartItemSchema = new Schema(
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
  },
);

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    currency: {
      type: String,
      default: 'COP',
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    totalQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.methods.recalculateTotals = function recalculateTotals() {
  const totals = this.items.reduce(
    (acc, item) => {
      acc.quantity += item.quantity;
      acc.subtotal += item.subtotal;
      return acc;
    },
    { quantity: 0, subtotal: 0 },
  );

  this.totalQuantity = totals.quantity;
  this.totalItems = this.items.length;
  this.subtotal = Number(totals.subtotal.toFixed(2));
};

export default mongoose.model('Cart', cartSchema);
