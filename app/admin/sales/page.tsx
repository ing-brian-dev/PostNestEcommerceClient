import TransactionFilter from "@/components/transactions/TransactionFilter";
import Heading from "@/components/ui/Heading";

export default function SalesPage() {
  return (
    <>
      <Heading>Ventas</Heading>
      <p>En esta sección apareceran las ventas, utiliza el calendario para filtrar por fecha.</p>
      <TransactionFilter />
    </>
  )
}
