import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { URLS } from '../Core/ConstantVariables';
import { PaginatedRequest } from '../Models/PaginatedRequest';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private genericService: GenericService) {

  }
  getAll(data: PaginatedRequest): Observable<any> {
    const url = URLS.Controller.Product.Name + URLS.Controller.Product.GetAll;
    return this.genericService.post(url, data);
  }

  add(data: any): Observable<any> {
    const url = URLS.Controller.Product.Name + URLS.Controller.Product.Add;
    return this.genericService.post(url, data);
  }

  update(data: any): Observable<any> {
    const url = URLS.Controller.Product.Name + URLS.Controller.Product.Update;
    return this.genericService.put(url, data);
  }

  delete(productId: number): Observable<any> {
    const url = URLS.Controller.Product.Name + URLS.Controller.Product.Delete + "/" + productId;
    return this.genericService.delete(url);
  }

}
