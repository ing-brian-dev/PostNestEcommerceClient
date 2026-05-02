"use client";

import { deleteImage } from "@/actions/products/delete-image-action";
import { uploadImage } from "@/actions/products/upload-image-action";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

export default function UploadProduct({
    currentImage,
    currentImagePublicId,
}: {
    currentImage?: string;
    currentImagePublicId?: string;
}) {
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState({ secure_url: "", public_id: "" });
    const [removed, setRemoved] = useState(false);
    const [loading, setLoading] = useState(false);

    const previewImage = removed
        ? image.secure_url || null
        : image.secure_url || currentImage || null;

    const previewPublicId =
        image.public_id || currentImagePublicId || null;
    console.log(previewPublicId);

    const onDrop = useCallback(
        async (files: File[], rejectedFile: FileRejection[]) => {
            setError(null);

            if (rejectedFile.length > 0) {
                const firstError = rejectedFile[0].errors[0];

                if (firstError.code === "file-too-large") {
                    setError("El archivo es demasiado grande (máx 2MB)");
                } else if (firstError.code === "file-invalid-type") {
                    setError("Formato no permitido (solo JPG/PNG)");
                } else if (firstError.code === "too-many-files") {
                    setError("Solo se permite 1 archivo.");
                } else {
                    setError("Archivo inválido");
                }
                return;
            }

            try {
                setLoading(true);

                const formData = new FormData();
                files.forEach((file) => formData.append("file", file));

                const res = await uploadImage(formData);

                setImage(res);
                setRemoved(false);
            } catch {
                setError("Error al subir la imagen");
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        },
        maxFiles: 1,
        maxSize: 1024 * 1024 * 2,
    });

    const handleRemoveImage = async () => {
        if (!previewPublicId) return;

        try {
            setLoading(true);

            await deleteImage(previewPublicId);

            setImage({ secure_url: "", public_id: "" });
            setRemoved(true);
        } catch {
            setError("Error al eliminar la imagen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* DROPZONE */}
            {!previewImage && (
                <>
                    <label className="block text-sm font-medium text-gray-900">
                        Imagen Producto
                    </label>

                    <div
                        {...getRootProps({
                            className: `
                py-16 px-4 border-2 border-dashed rounded-lg text-center transition
                ${isDragActive ? "border-blue-500 bg-blue-50" : ""}
                ${!isDragActive ? "border-gray-300 bg-white cursor-pointer" : ""}
              `,
                        })}
                    >
                        <input {...getInputProps()} />

                        {loading ? (
                            <p className="text-sm text-gray-500">Subiendo...</p>
                        ) : isDragActive ? (
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
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* PREVIEW */}
            {previewImage && (
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">Vista previa:</p>

                    <Image
                        src={previewImage}
                        alt="Preview"
                        className="object-cover rounded-md border"
                        width={300}
                        height={420}
                        loading="eager"
                    />

                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={loading}
                        className="text-xs text-red-500 hover:underline cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Eliminando..." : "Eliminar imagen"}
                    </button>

                    {/* hidden inputs */}
                    <input type="hidden" name="image" value={previewImage} />
                    <input type="hidden" name="image_public_id" value={previewPublicId ?? ""}
                    />
                </div>
            )}
        </div>
    );
}