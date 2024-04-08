import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
import { API } from '../constant/enum';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class AddressService {
    private baseUrl =
        'https://online-gateway.ghn.vn/shiip/public-api/master-data/';

    private token = '12a3810e-8ba7-11ee-a59f-a260851ba65c';
    private shop_id = '4723073';
    private service_id = 53321;
    private from_district_id = 1442;
    constructor(
        private http: HttpClient,
        private storageSerive: StorageService
    ) {}

    async getProvinces() {
        return await this.http
            .get(this.baseUrl + 'province', {
                headers: { token: this.token },
            })
            .toPromise();
    }

    async getDistrictsByProvince(provinceCode: string) {
        return await this.http
            .get(this.baseUrl + `district`, {
                params: { province_id: provinceCode },
                headers: { token: this.token },
            })
            .toPromise();
    }

    async getWardsByDistrict(districtCode: string) {
        return await this.http
            .get(this.baseUrl + `ward`, {
                params: { district_id: districtCode },
                headers: { token: this.token },
            })
            .toPromise();
    }

    getShippingService(district_id) {
        const params = {
            shop_id: this.shop_id,
            from_district: this.from_district_id,
            to_district: district_id,
        };
        return lastValueFrom(
            this.http.get(
                'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services',
                {
                    headers: { token: this.token },
                    params,
                }
            )
        );
    }

    getShippingFee(data) {
        const params = {
            ...data,
            from_district_id: this.from_district_id,
        };
        return this.http.post(
            'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
            params,
            {
                headers: { token: this.token, shop_id: this.shop_id },
            }
        );
    }

    addAddress(data) {
        return this.http
            .post(API.USER.END_POINT.ADDRESS, data, {
                headers: this.storageSerive.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.address;
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    getAddress() {
        return this.http
            .get(API.USER.END_POINT.ADDRESS, {
                headers: this.storageSerive.getHttpHeader(),
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.CART.STATUS.GET_PRODUCT_SUCCESS
                    ) {
                        return data.data.addressList;
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
