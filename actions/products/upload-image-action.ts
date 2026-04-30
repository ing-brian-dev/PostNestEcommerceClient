"use server"

export async function uploadImage(formData: FormData) {
    const url = `${process.env.API_URL}/products/upload-image`;
    const req = await fetch(url, {
        method: 'POST',
        body: formData
    });

    const image = await req.json();
    return {
        secure_url: image.secure_url,
        public_id: image.public_id
    };
}