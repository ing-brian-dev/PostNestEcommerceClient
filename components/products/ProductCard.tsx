import { Product } from "@/src/schemas";
import { formatCurrency, isAvailable } from "@/src/utils";
import AddProductButton from "./AddProductButton";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {

  return (
    <div
      className='rounded bg-white shadow relative p-5'
    >
      <div
        className={`${isAvailable(product.inventory) ? "opacity-100" : "opacity-50"} "rounded overflow-hidden" `}
      >
        <Image
          src={product.image ?? "/default.svg"}
          alt={`Imagen de Producto ${product.name}`}
          loading="eager"
          width={400}
          height={600}
          priority
        />
        <div className="p-3 space-y-2">
          <h3 className="text-xl font-bold text-gray-600">{product.name}</h3>
          <p className="text-gray-500">Disponibles: {product.inventory}</p>
          <p className="text-2xl font-extrabold  text-gray-900">{formatCurrency(product.price)}</p>
        </div>
      </div>
      {isAvailable(product.inventory) ? (
        <AddProductButton
          product={product}
        />
      ) : <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-white opacity-60 w-full text-center py-5 text-2xl uppercase font-black">
            Agotado
          </p>
      }
    </div>
  )
}