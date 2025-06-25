import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GetPaginatedPurchase } from '../../Models/Purchase/GetPaginatedPurchase';
import { PaginatedRequest } from '../../Models/PaginatedRequest';
import { PurchaseService } from '../../services/purchase.service';
import { PagedList } from '../../Models/PagedList';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddPurchaseDialogComponent } from './add-purchase-dialog/add-purchase-dialog.component';
import { DeleteResponse } from '../../Models/DeleteResponse';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-purchase',
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
        MatSortModule,
        CurrencyPipe],
    templateUrl: './purchase.component.html',
    styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent {
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
    private searchDebounceTime: ReturnType<typeof setTimeout> | undefined;

    displayedColumns = ['productName', 'id', 'quantity', 'price']

    dataSource = new MatTableDataSource<GetPaginatedPurchase>([]);

    constructor(private purchaseService: PurchaseService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {

    }

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

        this.purchaseService.getAll(params).subscribe({
            next: (res: PagedList<GetPaginatedPurchase>) => {
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

    onEdit(elem: GetPaginatedPurchase) {
        const dialogRef = this.dialog.open(AddPurchaseDialogComponent, {
            width: '600px',
            height: '900px',
            position: {
                top: '50px',
                right: '0'
            },
            data: { isEdit: true, purchase: elem }
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
    onDelete(purchaseId: number) {
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
                this.purchaseService.delete(purchaseId).subscribe({
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
    onAddPurchase() {
        const dialogRef = this.dialog.open(AddPurchaseDialogComponent, {
            width: '600px',
            height: '900px',
            position: {
                top: '50px',
                right: '0'
            },
            data: {
                isEdit: false,
                purchase: null
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

    announceSort(sortState: Sort) {
        if (sortState.direction) {
            this.sortDirection = sortState.direction == 'asc' ? 'asc' : 'desc'
            this.sortBy = sortState.active;
            this.loadData();
        }
    }
}
