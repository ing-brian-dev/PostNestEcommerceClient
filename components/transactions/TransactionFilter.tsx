"use client";

import { getSalesByDate } from "@/src/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import TransactionSummary from "./TransactionSumary";
import { formatCurrency } from "@/src/utils";
import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("react-calendar"), {
    ssr: false // Say that this component should not be rendered on the server
})

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function TransactionFilter() {
    const [date, setDate] = useState<Value>(new Date());

    const formattedDate = format(date?.toString()!, 'yyyy-MM-dd');
    const { data, isLoading } = useQuery({
        queryKey: ['sales', formattedDate],
        queryFn: () => getSalesByDate(formattedDate)
    });

    const total = data?.reduce((total, transaction) => total + +transaction.total, 0) ?? 0;

    return (
        <>
            <p
                className="text-right text-lg font-bold my-5"
            >
                Total del dia: {''}
                <span
                    className="font-normal"
                >
                    {formatCurrency(total)}
                </span>
            </p>
            <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10 relative items-start"
            >
                <div
                    className="lg:sticky lg:top-10"
                >
                    <Calendar
                        value={date}
                        onChange={setDate}
                        // locale="es-ES"
                    />
                </div>
                <div>
                    {isLoading && "Cargando..."}
                    {data && data.length ? data.map(transaction => (
                        <TransactionSummary
                            key={transaction.id}
                            transaction={transaction}
                        />
                    )) : (
                        <p
                            className="text-lg text-center"
                        >
                            No hay ventas en esta fecha.
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
