import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductDropDown } from '../../../Models/Purchase/ProductDropdownDto';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../../services/purchase.service';
import { ProductService } from '../../../services/product.service';
import { AddResponse } from '../../../Models/AddResponse';
import { ToastrService } from 'ngx-toastr';
import { GetPaginatedPurchase } from '../../../Models/Purchase/GetPaginatedPurchase';
import { UpdateResponse } from '../../../Models/UpdateResponse';


@Component({
  selector: 'app-add-purchase-dialog',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule],
  templateUrl: './add-purchase-dialog.component.html',
  styleUrl: './add-purchase-dialog.component.scss'
})

export class AddPurchaseDialogComponent {
  isEdit: boolean = false;
  constructor(private dialogRef: MatDialogRef<AddPurchaseDialogComponent>,
    private toastr: ToastrService,
    private purchaseService: PurchaseService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEdit: boolean;
      purchase: GetPaginatedPurchase;
    },
  ) {
    this.isEdit = data.isEdit
  }



  purchaseForm = new FormGroup({
    productId: new FormControl(0, [Validators.required]),
    quantity: new FormControl('', [Validators.required, Validators.min(1)]),
    price: new FormControl('', [Validators.required, this.priceValidator()]),
  })
  productsDropDown: ProductDropDown[] = [];

  ngOnInit() {
    this.loadProducts()



  }

  loadProducts() {
    this.purchaseService.getProductList().subscribe({
      next: (resp: ProductDropDown[]) => {
        this.productsDropDown = resp;

        if (this.isEdit) {
          this.purchaseForm.patchValue({
            productId: this.data.purchase.productId,
            price: this.data.purchase.price?.toString() ?? '',
            quantity: this.data.purchase.quantity?.toString() ?? ''
          });

        }
      }
    })
  }


  priceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.toString();



      const pricePattern = /^(\d{1,8}(\.\d{1,2})?|\d{1,10})$/;

      if (!pricePattern.test(value)) {
        return {
          invalidPrice: {
            message: 'Price must be maximum 10 digits total (including decimal places)'
          }
        };
      }

      return null;
    };
  }
  preventDecimal(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    if (event.key === '.' || event.key === ',' || event.key === 'e') {
      event.preventDefault();
    }

    if (currentValue.length >= 10 &&
      !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
  }
  onCancel() {
    this.dialogRef.close(false);
  }
  save() {
    if (this.purchaseForm.invalid) {
      return;
    }

    const params = {
      productId: this.purchaseForm.controls.productId.value,
      quantity: this.purchaseForm.controls.quantity.value,
      price: this.purchaseForm.controls.price.value,
    }
    this.purchaseService.add(params).subscribe({
      next: (res: AddResponse) => {
        if (res.success) {
          this.toastr.success(res.message, "Success")
          this.dialogRef.close(true);
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

  update() {
    if (this.purchaseForm.invalid || !this.purchaseForm.dirty) {
      return;
    }

    const params = {
      id: this.data.purchase.id,
      productId: this.purchaseForm.controls.productId.value,
      quantity: this.purchaseForm.controls.quantity.value,
      price: this.purchaseForm.controls.price.value,
    }

    this.purchaseService.update(params).subscribe({
      next: (res: UpdateResponse) => {
        if (res.success) {
          this.toastr.success(res.message, "Success")
          this.dialogRef.close(true);
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
}
