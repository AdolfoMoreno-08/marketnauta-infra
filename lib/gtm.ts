type DataLayerEvent = {
    event: string;
    [key: string]: any;
};

export const pushToDataLayer = (data: DataLayerEvent) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push(data);
    }
};