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

    getAllMerchant(params?) {
        return this.http
            .get(API.MERCHANT.END_POINT.ADMIN_MERCHANT, {
                params: params,
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.merchantList.content;
                    } else return false;
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getMerchantDetail(merchantId: string) {
        return this.http
            .get(API.MERCHANT.END_POINT.MERCHANT + '/' + merchantId, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.merchant;
                    } else return false;
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    approveMerchant(merchantId: string) {
        return this.http
            .put(
                API.MERCHANT.END_POINT.APPROVE_MERCHANT + '/' + merchantId,
                {},
                {
                    headers: this.storageService.getHttpHeader(),
                }
            )
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

    disapproveMerchant(merchantId: string) {
        return this.http
            .put(
                API.MERCHANT.END_POINT.UN_APPROVE_MERCHANT + '/' + merchantId,
                {},
                {
                    headers: this.storageService.getHttpHeader(),
                }
            )
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

    suspendMerchant(merchantId: string) {
        return this.http
            .put(
                API.MERCHANT.END_POINT.SUSPEND_MERCHANT + '/' + merchantId,
                {},
                {
                    headers: this.storageService.getHttpHeader(),
                }
            )
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

    unsuspendMerchant(merchantId: string) {
        return this.http
            .put(
                API.MERCHANT.END_POINT.UNSUSPEND_MERCHANT + '/' + merchantId,
                {},
                {
                    headers: this.storageService.getHttpHeader(),
                }
            )
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
