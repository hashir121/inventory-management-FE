import { Injectable } from '@angular/core';
import { URLS } from '../Core/ConstantVariables';
import { Observable } from 'rxjs';
import { PaginatedRequest } from '../Models/PaginatedRequest';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private genericService: GenericService) {

  }
  getAll(data: PaginatedRequest): Observable<any> {
    const url = URLS.Controller.Purchase.Name + URLS.Controller.Purchase.GetAll;
    return this.genericService.post(url, data);
  }


  getProductList(): Observable<any> {
    const url = URLS.Controller.Purchase.Name + URLS.Controller.Purchase.GetProductList;
    return this.genericService.get(url);
  }

  add(data: any): Observable<any> {
    const url = URLS.Controller.Purchase.Name + URLS.Controller.Purchase.Add;
    return this.genericService.post(url, data);
  }


  update(data: any): Observable<any> {
    const url = URLS.Controller.Purchase.Name + URLS.Controller.Purchase.Update;
    return this.genericService.put(url, data);
  }

  delete(purchaseId: number): Observable<any> {
    const url = URLS.Controller.Purchase.Name + URLS.Controller.Purchase.Delete + "/" + purchaseId;
    return this.genericService.delete(url);
  }
}
