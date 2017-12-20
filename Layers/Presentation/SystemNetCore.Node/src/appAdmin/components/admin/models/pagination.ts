import { Dictionary } from './dictionary';

export class Pagination {

    searchCriteria: Dictionary[];
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    sortBy: string;
    sortDirection: string;
    startRow: number;
    endRow: number;
}
