import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { GetPaginatedProduct } from '../../Models/Product/GetPaginatedProduct';
import { PaginatedRequest } from '../../Models/PaginatedRequest';
import { PagedList } from '../../Models/Product/PagedList';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [HttpClientModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent {
    constructor(private productService: ProductService) { }

    length = 0;
    pageIndex = 0;
    pageSize = 15;
    sortBy = 'createdDate';
    defaultSortBy = 'createdDate';
    sortDirection = "Desc";
    defaultSortDirection = "Desc"
    searchText = ''
    pageSizeOptions = [15, 50, 100]

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    dataSource = new MatTableDataSource<GetPaginatedProduct>([]);

    displayedColumns = ['name', 'id', 'description']


    ngOnInit() {
        this.loadData();
    }
    loadData() {
        const params: PaginatedRequest = {
            pageSize: this.pageSize,
            pageNumber: this.pageIndex + 1,
            searchText: this.searchText,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection

        }

        this.productService.getAll(params).subscribe({
            next: (res: PagedList<GetPaginatedProduct>) => {
                this.dataSource.data = res.records
                this.paginator.pageIndex = this.pageIndex;
                this, this.paginator.length = res.totalRecords
            },
            error: (err) => {

            },

        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }


    onAddProduct(): void {
        console.log('Add Product clicked');
        // Navigate or open dialog
    }
    onSearchInput(event: Event): void {
        const input = (event.target as HTMLInputElement).value;
        console.log('Search text:', input);
        // Optionally: debounce or send to backend
    }


}
