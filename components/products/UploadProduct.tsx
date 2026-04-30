"use client"

import { deleteImage } from "@/actions/products/delete-image-action";
import { uploadImage } from "@/actions/products/upload-image-action";
import Image from "next/image";
import { useCallback, useState } from "react"
import { useDropzone, FileRejection } from "react-dropzone"

export default function UploadProduct() {

    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState({ secure_url: '', public_id: '' });
    const onDrop = useCallback(async (files: File[], rejectedFile: FileRejection[]) => {
        setError(null)

        if (rejectedFile.length > 0) {
            const firstError = rejectedFile[0].errors[0]

            if (firstError.code === "file-too-large") {
                setError("El archivo es demasiado grande (máx 2MB)")
            } else if (firstError.code === "file-invalid-type") {
                setError("Formato no permitido (solo JPG/PNG)")
            } else if (firstError.code === "too-many-files") {
                setError("Solo se permite 1 solo archivo.")
            } else {
                setError("Archivo inválido")
            }
            return
        }

        const formData = new FormData();
        files.forEach(file => formData.append('file', file));
        const image = await uploadImage(formData);
        setImage(image);
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"]
        },
        maxFiles: 1,
        maxSize: 1024 * 1024 * 2 // 2MB
    })

    const handleRemoveImage = async (publicId: string) => {
        await deleteImage(publicId);
        setImage({ secure_url: '', public_id: '' });
    }

    return (
        <div className="space-y-4">
            {!image.secure_url && (
                <>

                    <label className="block text-sm font-medium text-gray-900">
                        Imagen Producto
                    </label>

                    {/* DROPZONE */}
                    <div
                        {...getRootProps({
                            className: `
                    py-16 px-4 border-2 border-dashed rounded-lg text-center transition
                    ${isDragActive ? "border-blue-500 bg-blue-50" : ""}
                    ${isDragAccept ? "border-green-500 bg-green-50" : ""}
                    ${isDragReject ? "border-red-500 bg-red-50" : "cursor-pointer"}
                    ${!isDragActive ? "border-gray-300 bg-white" : ""}
                `
                        })}
                    >
                        <input {...getInputProps()} />

                        {isDragActive ? (
                            <p className="text-sm">Suelta la imagen aquí...</p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Arrastra una imagen o haz clic
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* ERROR */}
            {
                error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )
            }

            {/* PREVIEW */}
            {
                image.secure_url && (
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">Vista previa:</p>

                        <Image
                            src={image.secure_url}
                            alt={`Preview ${image.secure_url}`}
                            className=" object-cover rounded-md border"
                            width={300}
                            height={420}
                        />

                        <button
                            type="button"
                            onClick={() => handleRemoveImage(image.public_id)}
                            className="text-xs text-red-500 hover:underline cursor-pointer"
                        >
                            Eliminar imagen
                        </button>
                        <input type="hidden" name="image" value={image.secure_url} />
                    </div>

                )
            }
        </div >
    )
}