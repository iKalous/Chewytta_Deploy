// src/types/blindBox.ts

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Item {
    id: number;
    name: string;
    image: string;
    rarity?: string;
}

export interface BlindBox {
    id: number;
    name: string;
    image?: string;
    price: number;
    stock: number;
    isPublished: boolean;
    description: string;
    items: Item[];
}

export interface Comment {
    id: number;
    user: string;
    content: string;
    date: string;
}

export interface BlindBoxContextType {
    boxes: BlindBox[];
    setBoxes: React.Dispatch<React.SetStateAction<BlindBox[]>>;
    loading: boolean;
    error: string | null;
    refreshBoxes: () => void;
    updateBox: (boxId: number, updatedData: Partial<BlindBox>) => Promise<any>;
    deleteBox: (boxId: number) => Promise<any>;
    getBoxById: (boxId: number) => Promise<BlindBox>;
    fetchAllBoxes: () => Promise<void>;
}
