import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../constant/enum';
import { catchError, map } from 'rxjs';
import { StorageService } from './storage.service';
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    getAllProduct(params?) {
        return this.http
            .get(API.PRODUCT.END_POINT.PRODUCT, { params: params })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.productList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getProduct(id) {
        return this.http.get(API.PRODUCT.END_POINT.PRODUCT + `/${id}`).pipe(
            map((data: any) => {
                if (
                    data.meta.statusCode ===
                    API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                ) {
                    return data.data.product;
                } else {
                    return [];
                }
            }),
            catchError((err) => {
                throw new Error(err);
            })
        );
    }

    getCategory() {
        return this.http.get(API.PRODUCT.END_POINT.CATEGORY).pipe(
            map((data: any) => {
                if (
                    data.meta.statusCode ===
                    API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                ) {
                    return data.data.categoryList;
                } else {
                    return [];
                }
            }),
            catchError((err) => {
                throw new Error(err);
            })
        );
    }

    getSubCategory(categoryId?) {
        return this.http
            .get(API.PRODUCT.END_POINT.SUB_CATEGORY + `/${categoryId}`)
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.subCategoryList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getBrand() {
        return this.http.get(API.PRODUCT.END_POINT.BRAND).pipe(
            map((data: any) => {
                if (
                    data.meta.statusCode ===
                    API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                ) {
                    return data.data.brandList;
                } else {
                    return [];
                }
            }),
            catchError((err) => {
                throw new Error(err);
            })
        );
    }

    getAttribute() {
        return this.http.get(API.PRODUCT.END_POINT.ATTRIBUTES).pipe(
            map((data: any) => {
                if (
                    data.meta.statusCode ===
                    API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                ) {
                    return data.data.productList;
                } else {
                    return [];
                }
            }),
            catchError((err) => {
                throw new Error(err);
            })
        );
    }

    addNewProduct(formData: FormData) {
        return this.http
            .post(API.PRODUCT.END_POINT.PRODUCT, formData, {
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

    addNewBrand(formData: FormData) {
        return this.http.post(API.PRODUCT.END_POINT.BRAND, formData, {
            headers: this.storageService.getHttpHeader(),
        });
    }

    addNewCategory(name) {
        return this.http.post(
            API.PRODUCT.END_POINT.CATEGORY,
            { name: name },
            { headers: this.storageService.getHttpHeader() }
        );
    }

    addNewSubCategory(form) {
        return this.http.post(API.PRODUCT.END_POINT.SUB_CATEGORY, form, {
            headers: this.storageService.getHttpHeader(),
        });
    }

    addNewAttribute(attribute, productId) {
        return this.http.post(
            API.PRODUCT.END_POINT.ADD_ATTRIBUTES + `/${productId}`,
            attribute,
            { headers: this.storageService.getHttpHeader() }
        );
    }
    updateProduct(formData) {
        return this.http
            .put(API.PRODUCT.END_POINT.PRODUCT, formData, {
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

    updateImages(id, formData) {
        return this.http
            .put(API.PRODUCT.END_POINT.IMAGES + `/${id}`, formData, {
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

    deleteAttribute(params) {
        return this.http
            .delete(
                API.PRODUCT.END_POINT.IMAGES +
                    `/${params.productId}/${params.attributeId}`,
                { headers: this.storageService.getHttpHeader() }
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

    getAllImport(params?) {
        return this.http
            .get(API.IMPORT.END_POINT.IMPORT, {
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
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    processImport(data) {
        return this.http
            .post(API.IMPORT.END_POINT.IMPORT, data, {
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
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getInvoidGroup(id) {
        return this.http
            .get(API.IMPORT.END_POINT.GROUP + `/${id}`, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.IMPORT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.itemGroup;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getInvoiceDetail(params) {
        return this.http
            .get(API.IMPORT.END_POINT.DETAIL, {
                params: params,
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.IMPORT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.itemList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getProdMost(params) {
        return this.http
            .get(API.PRODUCT.END_POINT.MOST_VIEW, { params: params })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.productList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getProdMostBuy(params) {
        return this.http
            .get(API.PRODUCT.END_POINT.MOST_BUY, { params: params })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.productList;
                    } else {
                        return [];
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getProductDetail(id) {
        return this.http.get(API.PRODUCT.END_POINT.PRODUCT + `/${id}`).pipe(
            map((data: any) => {
                if (
                    data.meta.statusCode ===
                    API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                ) {
                    return data.data.product;
                } else {
                    throw new Error(data.meta);
                }
            }),
            catchError((err) => {
                throw new Error(err);
            })
        );
    }

    addReview(data) {
        return this.http
            .post(API.PRODUCT.END_POINT.REVIEW, data, {
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return true;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    globalSearch(keyword) {
        return this.http
            .get(API.SEARCH.ENDPOINT, { params: { keyword: keyword } })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.searchResult;
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
