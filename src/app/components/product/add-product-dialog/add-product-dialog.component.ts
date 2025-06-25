import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../services/product.service';
import { AddResponse } from '../../../Models/AddResponse';
import { ToastrService } from 'ngx-toastr';
import { GetPaginatedProduct } from '../../../Models/Product/GetPaginatedProduct';
import { UpdateResponse } from '../../../Models/UpdateResponse';

@Component({
  selector: 'app-add-product-dialog',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent {
  isEdit: boolean = false;
  constructor(private dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isEdit: boolean;
      product: GetPaginatedProduct;
    },
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    this.isEdit = data.isEdit;
  }
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })

  onCancel() {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    if (this.isEdit) {
      this.productForm.controls.name.setValue(this.data.product.name ?? "")
      this.productForm.controls.description.setValue(this.data.product.description ?? "")

    }
  }
  save() {
    if (this.productForm.invalid) {
      return;
    }
    const params = {
      name: this.productForm.controls.name.value,
      description: this.productForm.controls.description.value
    }

    this.productService.add(params).subscribe({
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
    if (this.productForm.invalid || !this.productForm.dirty) {
      return;
    }

    const params = {
      id: this.data.product.id,
      name: this.productForm.controls.name.value,
      description: this.productForm.controls.description.value
    }
    this.productService.update(params).subscribe({
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

  onNameBlur() {
    const name = this.productForm.get('name')?.value?.trim() || '';
    this.productForm.patchValue({
      name
    })
  }
  onDescriptionBlur() {
    const description = this.productForm.get('description')?.value?.trim() || '';

    this.productForm.patchValue({

      description
    });

  }

}
