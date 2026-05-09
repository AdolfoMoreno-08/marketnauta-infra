export const FB_PIXEL_ID = '1723830311936647';

// Informar un PageView manual
export const pageview = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
    }
};

// Informar eventos de conversión (Lead, Contact, etc.)
export const event = (name: string, options = {}) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', name, options);
    }
};