export interface GetPaginatedPurchase {
    id: number;
    productId?: number;
    quantity?: number;
    price?: number;
    productName?: string;
    createdDate?: string; // or Date, if you convert it to Date in code
}
