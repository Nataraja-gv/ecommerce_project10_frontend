export default function ProductCard({ product }) {
  const {
    product_name,
    product_price,
    mrp,
    discount_percentage,
    product_images,
    stock,
  } = product;

  const image = product_images?.[0]?.image_link;

  return (
    <div className="bg-white border  border-gray-300 rounded-xl p-3 hover:shadow-md transition">
      {/* Image */}
      <div className="relative flex justify-center">
        <img
          src={image}
          alt={product_name}
          className="h-28 w-28 object-contain"
        />

        {discount_percentage > 0 && (
          <span className="absolute top-1 left-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
            ₹{mrp - product_price} OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="text-sm font-medium line-clamp-2 h-10">
          {product_name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">
            ₹{product_price}
          </span>
          <span className="text-xs text-gray-500 line-through">
            ₹{mrp}
          </span>
        </div>

        <button
          disabled={stock === 0}
          className="mt-2 w-full border border-pink-600 text-pink-600 text-sm font-semibold py-1.5 rounded-lg
                     hover:bg-pink-600 hover:text-white transition
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ADD
        </button>
      </div>
    </div>
  );
}
