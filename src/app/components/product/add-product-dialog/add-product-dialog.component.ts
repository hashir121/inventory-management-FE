import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../services/product.service';
import { AddResponse } from '../../../Models/AddResponse';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: ProductService,
    private toastr: ToastrService
  ) { }
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  })

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
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

}
