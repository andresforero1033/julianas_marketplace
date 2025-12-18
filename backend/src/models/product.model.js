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

const variantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    color: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: undefined,
    },
    price: {
      type: Number,
      min: 0,
      validate: priceValidator,
    },
    salePrice: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          if (typeof value === 'undefined' || value === null) return true;
          if (typeof this.price === 'number') {
            return value < this.price;
          }
          return true;
        },
        message: 'El precio en oferta de la variante debe ser menor al precio base.',
      },
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
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
    variants: {
      type: [variantSchema],
      default: [],
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

productSchema.methods.recalculateStock = function recalculateStock() {
  if (this.variants && this.variants.length) {
    this.stock = this.variants.reduce((acc, variant) => acc + (variant.stock || 0), 0);
  }
};

productSchema.pre('save', function handleStock(next) {
  this.recalculateStock();
  next();
});

export default mongoose.model('Product', productSchema);
