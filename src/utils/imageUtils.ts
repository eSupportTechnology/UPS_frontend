
export const getImageUrl = (photoPath: string): string => {
    if (!photoPath) return '';

    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
        return photoPath;
    }

    const imageBaseUrl = import.meta.env.VITE_API_URL?.replace('/api', '');

    if (!imageBaseUrl) {
        return '';
    }

    let finalUrl: string;
    if (photoPath.startsWith('storage/')) {
        finalUrl = `${imageBaseUrl}/${photoPath}`;
    } else {
        finalUrl = `${imageBaseUrl}/storage/${photoPath}`;
    }

    return finalUrl;
};

export const isValidImagePath = (photoPath: string): boolean => {
    if (!photoPath || typeof photoPath !== 'string') return false;

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const ext = photoPath.split('.').pop()?.toLowerCase();

    return ext ? validExtensions.includes(ext) : false;
};


export const processTicketPhotos = (photoPaths: string | string[] | null | undefined): string[] => {
    if (!photoPaths) return [];

    let photos: string[] = [];

    if (typeof photoPaths === 'string') {
        try {
            const parsed = JSON.parse(photoPaths);
            photos = Array.isArray(parsed) ? parsed : [photoPaths];
        } catch {
            photos = [photoPaths];
        }
    } else if (Array.isArray(photoPaths)) {
        photos = photoPaths;
    }

    return photos
        .filter((photo) => photo && photo.trim() !== '')
        .filter(isValidImagePath)
        .map(getImageUrl);
};
