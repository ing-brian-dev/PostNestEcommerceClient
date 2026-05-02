import { Product } from "@/src/schemas";
import { formatCurrency } from "@/src/utils";
import AddProductButton from "./AddProductButton";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {

  return (
    <div
      className='rounded bg-white shadow relative p-5'
    >
      <div>
        <Image
          src={product.image ?? "/default.svg"}
          alt={`Imagen de Producto ${product.name}`}
          loading="eager"
          width={200}
          height={200}
        />
        <div className="p-3 space-y-2">
          <h3 className="text-xl font-bold text-gray-600">{product.name}</h3>
          <p className="text-gray-500">Disponibles: {product.inventory}</p>
          <p className="text-2xl font-extrabold  text-gray-900">{formatCurrency(product.price)}</p>
        </div>
      </div>
      <AddProductButton
        product={product}
      />
    </div>
  )
}