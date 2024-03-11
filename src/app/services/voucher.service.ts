import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { API } from '../constant/enum';
import { catchError, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VoucherService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    getVoucher() {
        return this.http
            .get(API.VOUCHER.END_POINT.VOUCHER, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.voucherList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    createVoucher(data) {
        return this.http
            .post(API.VOUCHER.END_POINT.VOUCHER, data, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.voucherList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    updateVoucher(data) {
        return this.http
            .put(API.VOUCHER.END_POINT.VOUCHER + `/${data.voucherId}`, data, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.voucherList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }
}
