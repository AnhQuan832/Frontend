import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { API } from '../constant/enum';
import { catchError, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StatisticService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    getData(role, params) {
        return this.http
            .get(API.STATISTIC.END_POINT.STATISTIC + `/${role}`, {
                params: params,
                headers: this.storageService.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.PRODUCT.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.data;
                    }
                    return [];
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }
}
