import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs';
import { API } from '../constant/enum';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    getPaymentInfo(params?) {
        return this.http
            .get(API.INVOICE.END_POINT.INVOICE, {
                params: params,
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.IMPORT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.invoiceList;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }
    getPaymentDetail(id) {
        return this.http
            .get(API.INVOICE.END_POINT.INVOICE + `/${id}`, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.IMPORT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.invoiceItemList;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    updateStatus(params) {
        return this.http
            .put(API.INVOICE.END_POINT.UPDATE_INVOICE, null, {
                headers: this.storageService.getHttpHeader(),
                params: params,
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.IMPORT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.invoiceItemList;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }
}
