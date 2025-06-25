export interface PagedList<T> {
    records: T[];
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
}
