import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../constant/enum';
import { StorageService } from './storage.service';
import { catchError, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MerchantService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    createMerchantRequest(formData: FormData) {
        return this.http
            .post(API.MERCHANT.END_POINT.MERCHANT, formData, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return true;
                    } else return false;
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }
}
