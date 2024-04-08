import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/base.component';
import { AddressService } from 'src/app/services/address.service';

@Component({
    selector: 'app-merchant-request',
    templateUrl: './merchant-request.component.html',
    styleUrls: ['./merchant-request.component.scss'],
})
export class MerchantRequestComponent extends BaseComponent {
    avatarFile: FileList;
    logoUrl: string;
    documentList: Array<File> = new Array();
    relatedDoc: string[] = new Array();
    listProvince = new Array();
    listDistrict = new Array();
    listWard = new Array();

    constructor(
        private builder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private apiAddress: AddressService
    ) {
        super();
    }

    requestForm = this.builder.group({
        shelterName: this.builder.control('', Validators.required),
        shelterFacebookUrl: this.builder.control('', Validators.required),
        shelterNo: this.builder.control('', Validators.required),
        shelterProvince: this.builder.control('', Validators.required),
        shelterDistrict: this.builder.control('', Validators.required),
        shelterWard: this.builder.control('', Validators.required),
        shelterPhoneNum: this.builder.control('', [Validators.required]),
        shelterRelatedDoc: this.builder.control(''),
    });

    ngOnInit() {
        this.bindProvinces();
    }

    async upload(event: any) {}

    public onSelectFiles(event) {
        for (let i = 0; i < (event.files as FileList).length; i++) {
            this.documentList.push((event.files as FileList).item(i));
        }
    }

    bindProvinces() {
        this.apiAddress.getProvinces().then((response: any) => {
            const rListProvince = response.data;
            this.listProvince = rListProvince.map((rListProvince) => {
                return {
                    provName: rListProvince.name_with_type,
                    provCode: rListProvince.code,
                };
            });
            console.log(this.listProvince);
        }),
            (err) => {
                console.log(err.error.message);
            };
    }

    provinceSelectedChange(selectedValue) {
        let foundProvince = this.listProvince.find(
            (item) => item.provName == selectedValue.provName
        );
        this.apiAddress
            .getDistrictsByProvince(foundProvince.provCode)
            .then((response: any) => {
                const rListDistrict = response.data.data;
                (this.listDistrict = rListDistrict.map((rListDistrict) => {
                    return {
                        distName: rListDistrict.name_with_type,
                        distCode: rListDistrict.code,
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

    districtSelectedChange(selectedValue) {
        this.apiAddress
            .getWardsByDistrict(selectedValue.distCode)
            .then((response: any) => {
                const rListWard = response.data.data;
                this.listWard = rListWard.map((rListWard) => {
                    return {
                        wardName: rListWard.name_with_type,
                        wardCode: rListWard.code,
                    };
                });
            }),
            (err) => {
                console.log(err.error.message);
            };
    }
}
