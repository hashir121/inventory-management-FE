export interface PaginatedRequest {
    pageNumber?: number;      // default is 1
    pageSize?: number;        // default is 15
    searchText?: string | null;
    sortBy?: string;          // default is "createdDate"
    sortDirection?: string | null;  // default is "Desc"
}