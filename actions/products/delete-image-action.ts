"use server"

export async function deleteImage(publicId: string) {
    const url = `${process.env.API_URL}/products/delete-image`;
    const req = await fetch(url, {
        method: 'DELETE',
        body: JSON.stringify({ publicId }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return req.json();
}