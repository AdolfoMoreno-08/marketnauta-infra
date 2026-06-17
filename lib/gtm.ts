type DataLayerEvent = {
    event: string;
    [key: string]: any;
};

export const pushToDataLayer = (data: DataLayerEvent) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push(data);
    }
};

// event_id consistente para deduplicar pixel ↔ CAPI en todos los destinos.
export const newEventId = () =>
    `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;