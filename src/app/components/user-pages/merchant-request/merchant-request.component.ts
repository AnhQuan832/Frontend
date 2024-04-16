import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/base.component';
import { FileHandler } from 'src/app/model/FileHandler';
import { AddressService } from 'src/app/services/address.service';
import { MerchantService } from 'src/app/services/merchant.service';

@Component({
    selector: 'app-merchant-request',
    templateUrl: './merchant-request.component.html',
    styleUrls: ['./merchant-request.component.scss'],
})
export class MerchantRequestComponent extends BaseComponent {
    avatarFile: FileList;
    coverImgFile: FileList;
    logoUrl: string;
    documentList: Array<File> = new Array();
    listProvince = new Array();
    listDistrict = new Array();
    listWard = new Array();
    selectedProvince: any;
    selectedDistrict: any;
    selectedWard: any;
    relatedDoc: FileHandler[] = [];
    constructor(
        private builder: FormBuilder,
        private router: Router,
        private messageService: MessageService,
        private apiAddress: AddressService,
        private merchantService: MerchantService,
        private sanitizer: DomSanitizer
    ) {
        super();
    }

    requestForm = this.builder.group({
        merchantName: this.builder.control('', Validators.required),
        merchantDescription: this.builder.control('', Validators.required),
        address: this.builder.control('', Validators.required),
        location: this.builder.control(''),
        phoneNumber: this.builder.control('', Validators.required),
        // relatedDocuments: this.builder.control(''),
        // avatar: this.builder.control(''),
        // coverImage: this.builder.control(''),
    });

    ngOnInit() {
        this.bindProvinces();
    }

    async upload(event: any) {}

    bindProvinces() {
        this.apiAddress.getProvinces().then((response: any) => {
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

    async provinceSelectedChange(selectedValue) {
        // this.checkOutForm.patchValue({ city: selectedValue.provName });
        let foundProvince = this.listProvince.find(
            (item) => item.provName == selectedValue.provName
        );
        await this.apiAddress
            .getDistrictsByProvince(foundProvince.provCode)
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

    async districtSelectedChange(selectedValue) {
        // this.checkOutForm.patchValue({ district: selectedValue.distName });

        await this.apiAddress
            .getWardsByDistrict(selectedValue.distCode)
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

    sendRequest() {
        // if (this.requestForm.valid) {
        //     this.messageService.add({
        //         severity: 'success',
        //         summary: 'Success',
        //         detail: 'Request sent successfully',
        //     });
        //     this.router.navigate(['/']);
        // } else {
        //     this.messageService.add({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: 'Please fill all required fields',
        //     });
        // }
        this.requestForm.patchValue({
            location:
                this.requestForm.value?.address +
                this.selectedWard.wardName +
                ', ' +
                this.selectedDistrict.distName +
                ', ' +
                this.selectedProvince.provName,
        });
        const { address, ...data } = this.requestForm.value;
        data['userId'] = this.getUserInfo().userId;
        const formData = this.setUpFormData(data);
        this.merchantService.createMerchantRequest(formData).subscribe({
            next: (res: any) => {
                if (res) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Request sent successfully',
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Request failed',
                    });
                }
            },
        });
    }

    setUpFormData(data: any) {
        const formData = new FormData();
        this.prepareFormData(formData, data, 'createMerchantRequest', true);
        this.prepareFormData(
            formData,
            this.relatedDoc,
            'relatedDocuments',
            false
        );
        this.prepareFormData(formData, this.avatarFile[0], 'avatar', false);
        this.prepareFormData(
            formData,
            this.coverImgFile[0],
            'coverImage',
            false
        );

        return formData;
    }

    public onSelectFiles(event) {
        this.relatedDoc = [];
        for (let i = 0; i < event.currentFiles.length; i++) {
            const file = event.currentFiles[i];
            const fileHandler: FileHandler = {
                file: file,
                url: this.sanitizer.bypassSecurityTrustUrl(
                    window.URL.createObjectURL(file)
                ),
            };
            this.relatedDoc.push(fileHandler);
        }
    }

    onSelectAvatar(event: any) {
        this.avatarFile = event.target.files;
        const imgInput = <HTMLImageElement>(
            document.getElementById('merchantAvatar')
        );
        imgInput.src = URL.createObjectURL(this.avatarFile[0]);
    }
    onSelectCoverImg(event: any) {
        this.coverImgFile = event.target.files;
        const imgInput = <HTMLImageElement>document.getElementById('coverImg');
        imgInput.src = URL.createObjectURL(this.coverImgFile[0]);
    }
}
