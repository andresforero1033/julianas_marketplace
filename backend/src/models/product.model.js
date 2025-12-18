import mongoose from 'mongoose';

const { Schema } = mongoose;

const priceValidator = {
  validator(value) {
    if (typeof value === 'undefined' || value === null) return true;
    return value >= 0;
  },
  message: 'El valor debe ser mayor o igual a 0.',
};

const salePriceValidator = {
  validator(value) {
    if (typeof value === 'undefined' || value === null) return true;
    if (typeof this.price === 'number') {
      return value < this.price;
    }
    return true;
  },
  message: 'El precio en oferta debe ser menor al precio base.',
};

const productSchema = new Schema(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: priceValidator,
    },
    salePrice: {
      type: Number,
      min: 0,
      validate: salePriceValidator,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Product', productSchema);
