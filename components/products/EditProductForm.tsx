"use client"

import { editProduct } from "@/actions/products/edit-product-action";
import { useParams, useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"

export default function EditProductForm({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const editProductWithId = editProduct.bind(null, +id)
    const [state, dispatch] = useActionState(editProductWithId, {
        errors: [],
        success: '',
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
            router.push('/admin/products?page=1');
        }
    }, [state])

    return (
        <form
            action={dispatch}
            className="space-y-5"
        >
            {children}
            <input
                type="submit"
                className="rounded bg-green-400 font-bold py-2 w-full cursor-pointer"
                defaultValue="Guardar Cambios"
            />
        </form>
    )
}
