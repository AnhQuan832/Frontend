import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { aW, di } from '@fullcalendar/core/internal-common';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from 'src/app/base.component';
import { AddressService } from 'src/app/services/address.service';
import { CartService } from 'src/app/services/cart.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { StreamService } from 'src/app/services/stream.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-merchant-profile',
    templateUrl: './merchant-profile.component.html',
    styleUrls: ['./merchant-profile.component.scss'],
})
export class MerchantProfileComponent
    extends BaseComponent
    implements OnInit, AfterViewInit
{
    @Input() merchantId;
    merchantDetail;
    isEditing: boolean = false;
    listProvince = new Array();
    listDistrict = new Array();
    listWard = new Array();
    selectedProvince: any;
    selectedDistrict: any;
    selectedWard: any;
    avatarFile: FileList;
    coverImgFile: FileList;
    items: MenuItem[];
    updateMerchantInfoRequest = this.builder.group({
        merchantId: this.builder.control('', Validators.required),
        merchantName: this.builder.control('', Validators.required),
        merchantDescription: this.builder.control('', Validators.required),
        phoneNumber: this.builder.control('', Validators.required),
        districtId: this.builder.control('', Validators.required),
        districtName: this.builder.control('', Validators.required),
        wardName: this.builder.control('', Validators.required),
        wardCode: this.builder.control('', Validators.required),
        cityCode: this.builder.control('', Validators.required),
        cityName: this.builder.control('', Validators.required),
    });
    constructor(
        private storageService: StorageService,
        private router: Router,
        private messageService: ToastMessageService,
        private streamService: StreamService,
        private productService: ProductService,
        private cartService: CartService,
        private merchantService: MerchantService,
        private builder: FormBuilder,
        private apiAddress: AddressService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getProfile();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.items = [
                {
                    label: 'Change Avatar',
                    command: () => {
                        const input = document.getElementById('merchantAvatar');
                        input.click();
                    },
                },
                {
                    label: 'Change Cover image',
                    command: () => {
                        const input = document.getElementById('coverImg');
                        input.click();
                    },
                },
            ];
        }, 500);
    }
    async bindAddress(data) {
        this.selectedProvince = Number(data.cityCode);
        this.selectedDistrict = data.districtId;
        this.selectedWard = data.wardCode;
        await this.bindProvinces();
        await this.provinceSelectedChange(null, data.cityCode);
        await this.districtSelectedChange(null, data.districtId);
        this.updateMerchantInfoRequest.patchValue(this.merchantDetail);
    }

    initForm() {}

    getProfile() {
        const info = this.getUserInfo();
        this.merchantService.getMerchantDetail(info.merchantId).subscribe({
            next: (res) => {
                this.merchantDetail = res;
                this.bindAddress(res);
            },
        });
    }

    urlToFileType(file) {
        const fileType = file.slice(file.lastIndexOf('.') + 1, file.length);
        return fileType;
    }

    async bindProvinces() {
        await this.apiAddress.getProvinces().then((response: any) => {
            const rListProvince = response.data;
            this.listProvince = rListProvince.map((rListProvince) => {
                return {
                    provName: rListProvince.ProvinceName,
                    provCode: rListProvince.ProvinceID,
                };
            });
        }),
            (err) => {
                console.log(err.error.message);
            };
    }

    async provinceSelectedChange(selectedValue, provCode?) {
        // this.checkOutForm.patchValue({ city: selectedValue.provName });
        let foundProvince;
        if (selectedValue)
            foundProvince = this.listProvince.find(
                (item) => item.provName == selectedValue.provName
            );
        await this.apiAddress
            .getDistrictsByProvince(provCode || foundProvince.provCode)
            .then((response: any) => {
                const rListDistrict = response.data;
                (this.listDistrict = rListDistrict.map((rListDistrict) => {
                    return {
                        distName: rListDistrict.DistrictName,
                        distCode: rListDistrict.DistrictID,
                    };
                })),
                    (err) => {
                        console.log(err.error.message);
                    };
            }),
            (err) => {
                console.log(err.error.message);
            };
    }

    async districtSelectedChange(selectedValue, distCode?) {
        if (selectedValue) {
            const foundDistrict = this.listDistrict.find(
                (item) => item.distCode == selectedValue
            );
            this.updateMerchantInfoRequest.patchValue({
                districtName: foundDistrict.distName,
            });
            this.updateMerchantInfoRequest.patchValue({
                districtId: foundDistrict.distCode,
            });
        }
        await this.apiAddress
            .getWardsByDistrict(distCode || selectedValue)
            .then((response: any) => {
                const rListWard = response.data;
                this.listWard = rListWard.map((rListWard) => {
                    return {
                        wardName: rListWard.WardName,
                        wardCode: rListWard.WardCode,
                    };
                });
            }),
            (err) => {
                console.log(err.error.message);
            };
    }

    wardSelectedChange(selectedValue) {
        if (selectedValue) {
            const foundWard = this.listWard.find(
                (item) => item.wardCode == selectedValue
            );
            this.updateMerchantInfoRequest.patchValue({
                wardCode: foundWard.wardCode,
            });
            this.updateMerchantInfoRequest.patchValue({
                wardName: foundWard.wardName,
            });
        }
    }
    updateData() {
        let formData = new FormData();
        this.prepareFormData(
            formData,
            this.updateMerchantInfoRequest.value,
            'updateMerchantInfoRequest',
            true
        );
        console.log(formData.getAll('updateMerchantInfoRequest'));
        if (this.avatarFile?.length)
            this.prepareFormData(formData, this.avatarFile[0], 'avatar');
        else this.prepareFormData(formData, null, 'avatar');
        if (this.coverImgFile?.length)
            this.prepareFormData(formData, this.coverImgFile[0], 'coverImage');
        else this.prepareFormData(formData, null, 'coverImage');
        console.log(formData.getAll('updateMerchantInfoRequest'));

        this.merchantService.updateProfile(formData).subscribe({
            next: (res) => {
                this.messageService.showMessage('', 'Updated', 'success');
            },
            error: (err) => {
                this.messageService.showMessage('', 'Update failed', 'error');
            },
        });
    }

    onSelectImage(event: any) {
        this.avatarFile = event.target.files;
        const imgInput = <HTMLImageElement>document.getElementById('logo');
        imgInput.src = URL.createObjectURL(this.avatarFile[0]);
    }

    onSelectCover(event) {
        this.coverImgFile = event.target.files;
        const imgInput = <HTMLElement>document.getElementById('cover');
        imgInput.style.backgroundImage = `url(${URL.createObjectURL(
            this.coverImgFile[0]
        )})`;
    }
    changeAvatar() {}
}
