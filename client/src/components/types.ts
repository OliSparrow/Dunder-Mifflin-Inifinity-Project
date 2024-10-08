export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    discontinued: boolean;
    paperProperties: PaperProperty[];
}

export interface PaperProperty {
    paperId: number;
    propertyId: number;
    property: Property;
}

export interface Property {
    id: number;
    propertyName: string;
    paperProperties: PaperProperty[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface DeleteCheckResponse {
    canDelete: boolean;
    assignedCount: number;
}

export interface EditPropertyFormProps {
    property: Property;
    onClose: () => void;
    onUpdate: (updatedProperty: Partial<Property> & { id: number }) => void;
}

export type Order = {
    id: number;
    orderDate: string;
    deliveryDate?: string;
    status: string;
    totalAmount: number;
    customer: {
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
    };
}
