import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { map, catchError } from 'rxjs';
import { API } from '../constant/enum';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    getPaymentInfo() {
        return this.http
            .get(API.INVOICE.END_POINT.INVOICE_USER, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
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

    processPayment(data) {
        return this.http
            .post(API.PAYMENT.END_POINT.CHECK_OUT, data, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.output;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }
    getVoucher() {
        return this.http
            .get(API.VOUCHER.END_POINT.AVAILABLE_VOUCHER, {
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

    getPaymentDetail(id) {
        return this.http
            .get(API.INVOICE.END_POINT.INVOICE + `/${id}`, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
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

    processBuyNow(data) {
        return this.http
            .post(API.PAYMENT.END_POINT.SINGLE_CHECKOUT, data, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.output;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    processPaymentUnauth(data) {
        return this.http
            .post(API.PAYMENT.END_POINT.UNTAUTH_CHECK_OUT, data)
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.output;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    processBuyNowUnauth(data) {
        return this.http
            .post(API.PAYMENT.END_POINT.UNTAUTH_SINGLE_CHECKOUT, data)
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.output;
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
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
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
