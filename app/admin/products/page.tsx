import ProductsTable from "@/components/products/TableProducts";
import Heading from "@/components/ui/Heading";
import { ProductResponseSchema } from "@/src/schemas";

async function getProducts() {
  const url = `${process.env.API_URL}/products`;
  const req = await fetch(url);
  const res = await req.json();

  const data = ProductResponseSchema.parse(res);

  return {
    products: data.products,
    total: data.total
  };
}

export default async function ProductsPage() {
  const { products, total } = await getProducts();
  return (
    <>
      <Heading>Administrar Productos</Heading>
      <ProductsTable
        products={products}
      />
    </>
  )
}
