/**
 * Constructs a full image URL using the backend API base URL
 * @param imagePath - Relative image path (e.g., "technicians/filename.png")
 * @returns Full image URL pointing to backend storage
 */
export function getImageUrl(imagePath?: string | null): string {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // Extract backend URL from VITE_API_URL
    // VITE_API_URL is like "http://127.0.0.1:8000/api"
    // We need "http://127.0.0.1:8000"
    const apiUrl = import.meta.env.VITE_API_URL;
    const backendUrl = apiUrl.replace(/\/api\/?$/, '');

    return `${backendUrl}/storage/${imagePath}`;
}
