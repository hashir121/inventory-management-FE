import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { DeleteResponse } from '../../Models/DeleteResponse';
import { ToastrService } from 'ngx-toastr';
import { Sort } from '@angular/material/sort'
import { MatSortModule } from '@angular/material/sort';


@Component({
    selector: 'app-product',
    standalone: true,
    imports: [HttpClientModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent {
    constructor(private productService: ProductService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

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

    private searchDebounceTime: ReturnType<typeof setTimeout> | undefined;

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
                setTimeout(() => {
                    this.paginator.pageIndex = this.pageIndex;
                    this.paginator.length = res.totalRecords

                });
            },
            error: (err) => {

            },

        })
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }


    onAddProduct() {
        const dialogRef = this.dialog.open(AddProductDialogComponent, {
            width: '600px',
            height: '900px',
            position: {
                top: '50px',
                right: '0'
            },
            data: {
                isEdit: false,
                product: null
            }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.searchText = "";
                this.sortBy = this.defaultSortBy
                this.sortDirection = this.defaultSortDirection
                this.pageIndex = 0
                this.loadData();
            }
        });
    }


    applySearch(searchValue: string): void {
        clearTimeout(this.searchDebounceTime);
        this.searchDebounceTime = setTimeout(async () => {
            this.pageIndex = 0;
            this.searchText = searchValue;
            this.loadData()
        }, 500);
    }

    onPageChange(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }


    onDelete(productId: number) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This change will be permenant',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.productService.delete(productId).subscribe({
                    next: (res: DeleteResponse) => {
                        if (res.success) {
                            this.toastr.success(res.message, "Success")
                            this.pageIndex = 0;
                            this.searchText = ''
                            this.sortBy = this.defaultSortBy
                            this.sortDirection = this.defaultSortDirection
                            this.loadData();

                        }
                        else {
                            this.toastr.error(res.message, "Error")
                        }
                    },
                    error: (err: Error) => {
                        this.toastr.error(err.message, "Error")
                    }
                })
            }
        });

    }
    onEdit(elem: GetPaginatedProduct) {
        const dialogRef = this.dialog.open(AddProductDialogComponent, {
            width: '600px',
            height: '900px',
            position: {
                top: '50px',
                right: '0'
            },
            data: { isEdit: true, product: elem }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.searchText = "";
                this.sortBy = this.defaultSortBy
                this.sortDirection = this.defaultSortDirection
                this.pageIndex = 0
                this.loadData();
            }
        });
    }

    announceSort(sortState: Sort) {
        if (sortState.direction) {
            this.sortDirection = sortState.direction == 'asc' ? 'asc' : 'desc'
            this.sortBy = sortState.active;
            this.loadData();
        }
    }

}
