import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { di } from '@fullcalendar/core/internal-common';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/base.component';
import { AddressService } from 'src/app/services/address.service';
import { CartService } from 'src/app/services/cart.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-check-out',
    templateUrl: './check-out.component.html',
    styleUrls: ['./check-out.component.less'],
})
export class CheckOutComponent extends BaseComponent implements OnInit {
    shipService = [
        {
            service_type_id: 2,
            name: 'E-comerce shipping',
            price: 0,
        },
        {
            service_type_id: 5,
            name: 'Traditional shipping',
            price: 0,
        },
    ];

    paymentType = [
        {
            id: 'CREDIT_CARD',
            name: 'Credit Card',
        },
        {
            id: 'COD',
            name: 'COD',
        },
    ];
    listProvince: any[] = [];
    listDistrict: any[] = [];
    listWard: any[] = [];
    listShippingService: any[] = [];
    selectedProvince: any;
    selectedDistrict: any;
    selectedWard: any;
    selectedShipping: any;
    cartItem;
    totalPrice;
    isAddNewAddress: boolean = false;
    listAddress: any[] = [];
    selectedAdd: any;
    voucherOption: any[] = [];
    selectedVoucher;
    discount = 0;
    checkOutForm: FormGroup;
    isLogin;
    liveCartId;
    constructor(
        private apiAddress: AddressService,
        private cartService: CartService,
        private storageService: StorageService,
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private router: Router,
        private msgService: MessageService
    ) {
        super();
    }
    ngOnInit(): void {
        this.discount = this.storageService.getItemLocal('discountPrice');
        this.checkOutForm = this.fb.group({
            recipientName: this.fb.control('', [Validators.required]),
            phoneNumber: this.fb.control('', [Validators.required]),
            paymentType: this.fb.control('CREDIT_CARD'),
            userEmail: this.fb.control('', Validators.required),
            returnUrl: this.fb.control(''),
            address: this.fb.group({
                userId: this.fb.control(''),
                addressId: this.fb.control(''),
                streetName: this.fb.control('', [Validators.required]),
                cityName: this.fb.control('', [Validators.required]),
                districtName: this.fb.control('', [Validators.required]),
                wardName: this.fb.control('', [Validators.required]),
                districtId: this.fb.control('', [Validators.required]),
                wardCode: this.fb.control('', [Validators.required]),
            }),
            voucherByMerchantMap: this.fb.control(null),
        });
        this.isLogin = !!this.getToken();
        if (this.isLogin) {
            this.invoiceService.getVoucher().subscribe({
                next: (res) => {
                    this.voucherOption = res;
                },
            });
            this.getListAddress();
            const info = this.storageService.getItemLocal('currentUser');
            this.liveCartId = this.storageService.getItemLocal('liveCartId');
            this.checkOutForm.patchValue({ recipientName: info.userFullName });
            this.checkOutForm.patchValue({ phoneNumber: info.userPhoneNumber });
            this.checkOutForm.patchValue({ userEmail: info.userEmail });
        }
        this.bindProvinces();
        this.cartItem = this.storageService.getItemLocal('cart');
        this.totalPrice = this.cartItem.reduce((acc, currentItem) => {
            return (
                acc +
                (currentItem.totalItemPrice ||
                    currentItem.quantity * currentItem.price)
            );
        }, 0);
    }

    getListAddress() {
        this.apiAddress.getAddress().subscribe({
            next: (res) => {
                this.listAddress = res;
            },
        });
    }

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

    async wardSelectChange(selectedValue) {
        // this.checkOutForm.patchValue({ ward: selectedValue.wardName });

        await this.apiAddress
            .getShippingService(this.selectedDistrict.distCode)
            .then((res: any) => {
                this.listShippingService = res.data;
            });
        this.listShippingService.forEach((item, index) => {
            const data = {
                to_district_id: this.selectedDistrict.distCode,
                to_ward_code: this.selectedWard.wardCode,
                insurance_value: 500000,
                service_id: item.service_id,
                height: 15,
                length: 15,
                weight: 1000,
                width: 15,
                coupon: null,
            };
            this.cartService.getShippingFee(data).subscribe((res: any) => {
                if (res.code === 200)
                    this.shipService.map((item) => {
                        if (
                            item.service_type_id ===
                            this.listShippingService[index].service_type_id
                        )
                            item.price = res.data.total;
                    });
                console.log(this.shipService);
            });
        });
    }

    shippingServiceChange(selectedValue) {}

    voucherChange() {
        if (this.selectedVoucher.type === 'PERCENTAGE') {
            this.discount =
                (this.totalPrice * this.selectedVoucher.value) / 100;
            if (this.discount > this.selectedVoucher.maxValue)
                this.discount = this.selectedVoucher.maxValue;
        } else this.discount = this.selectedVoucher.value;
    }
    onCheckOut() {
        // if (this.isLogin)
        this.checkOutForm.patchValue({ address: this.selectedAdd });
        // else {
        //     const dist = this.listDistrict.find(
        //         (item) => item.distName === this.selectedAdd.districtName
        //     );
        //     this.districtSelectedChange({ distCode: dist.distCode });
        //     const ward = this.listWard.find(
        //         (item) => item.wardName === this.selectedAdd.wardName
        //     );
        //     const address = {
        //         streetName: this.checkOutForm.value.address.streetName,
        //         cityName: this.selectedProvince.provName,
        //         districtName: this.selectedDistrict.distName,
        //         wardName: this.selectedWard.wardName,
        //     };
        //     this.checkOutForm.patchValue({ address: address });
        // }

        this.checkOutForm.patchValue({ voucher: this.selectedVoucher });
        this.checkOutForm.patchValue({
            // returnUrl: 'https://gradution-project-eta.vercel.app/user/complete-checkout',
            returnUrl: 'http://localhost:4200/user/complete-checkout',
        });
        if (!this.liveCartId)
            this.checkOutForm.patchValue({
                voucherByMerchantMap:
                    this.storageService.getItemLocal('voucherByMerchantMap') ||
                    {},
            });
        else
            this.checkOutForm.patchValue({
                voucherByMerchantMap: {},
            });
        let data;
        if (this.cartItem[0]?.cartId || this.liveCartId) {
            data = {
                paymentInfoDTO: this.checkOutForm.value,
                cartId: this.cartItem[0].cartId,
            };
            if (!this.liveCartId) {
                this.invoiceService.processPayment(data).subscribe({
                    next: (res) => {
                        // window.open(res);
                        if (res) {
                            window.location.href = res.paymentUrl;
                            this.storageService.setItemLocal(
                                'sucInvoice',
                                res.invoiceId
                            );
                        } else {
                            this.msgService.add({
                                key: 'toast',
                                severity: 'success',
                                detail: 'Your order has been sent',
                            });
                            setTimeout(() => {
                                this.router.navigate(['/user/profile']);
                            }, 1000);
                        }
                    },
                });
            } else {
                data.cartId = this.liveCartId;
                localStorage.removeItem('liveCartId');
                this.invoiceService.processLivePayment(data).subscribe({
                    next: (res) => {
                        // window.open(res);
                        if (res) {
                            window.location.href = res.paymentUrl;
                            this.storageService.setItemLocal(
                                'sucInvoice',
                                res.invoiceId
                            );
                        } else {
                            this.msgService.add({
                                key: 'toast',
                                severity: 'success',
                                detail: 'Your order has been sent',
                            });
                            setTimeout(() => {
                                this.router.navigate(['/user/profile']);
                            }, 1000);
                        }
                    },
                });
            }
        } else {
            data = {
                paymentInfoDTO: this.checkOutForm.value,
                varietyId: this.cartItem[0].varietyId,
                quantity: this.cartItem[0].quantity,
            };
            if (this.isLogin)
                this.invoiceService.processBuyNow(data).subscribe({
                    next: (res) => {
                        // window.open(res);
                        if (res) {
                            window.location.href = res.paymentUrl;
                            this.storageService.setItemLocal(
                                'sucInvoice',
                                res.invoiceId
                            );
                        } else {
                            this.msgService.add({
                                key: 'toast',
                                severity: 'success',
                                detail: 'Your order has been sent',
                            });
                            setTimeout(() => {
                                this.router.navigate(['/user/profile']);
                            }, 1000);
                        }
                    },
                });
            else
                this.invoiceService.processBuyNowUnauth(data).subscribe({
                    next: (res) => {
                        // window.open(res);
                        if (res) {
                            window.location.href = res.paymentUrl;
                            this.storageService.setItemLocal(
                                'sucInvoice',
                                res.invoiceId
                            );
                        } else {
                            this.msgService.add({
                                key: 'toast',
                                severity: 'success',
                                detail: 'Your order has been sent',
                            });
                            setTimeout(() => {
                                this.router.navigate(['/user/profile']);
                            }, 1000);
                        }
                    },
                });
        }
    }

    onAddress() {
        if (this.isAddNewAddress) {
            if (this.isLogin) {
                const address = {
                    userId: this.storageService.getItemLocal('currentUser')
                        ?.userId,
                    streetName: this.checkOutForm.value.address.streetName,
                    cityName: this.selectedProvince.provName,
                    districtName: this.selectedDistrict.distName,
                    wardName: this.selectedWard.wardName,
                    districtId: this.selectedDistrict.distCode,
                    wardCode: this.selectedWard.wardCode,
                };
                this.apiAddress.addAddress(address).subscribe({
                    next: (res) => {
                        this.listAddress.push(res);
                    },
                });
            } else {
                this.listAddress.push({
                    streetName: this.checkOutForm.value.address.streetName,
                    cityName: this.selectedProvince.provName,
                    districtName: this.selectedDistrict.distName,
                    wardName: this.selectedWard.wardName,
                    districtId: this.selectedDistrict.distCode,
                    wardCode: this.selectedWard.wardCode,
                });
            }
        } else {
            this.isAddNewAddress = !this.isAddNewAddress;
        }
    }
    async changeAdd() {
        await this.provinceSelectedChange({
            provName: this.selectedAdd.cityName,
        });
        const dist = this.listDistrict.find(
            (item) => item.distName === this.selectedAdd.districtName
        );
        await this.districtSelectedChange({ distCode: dist.distCode });
        const ward = this.listWard.find(
            (item) => item.wardName === this.selectedAdd.wardName
        );
        // await this.apiAddress
        //     .getShippingService(dist.distCode)
        //     .then((res: any) => {
        //         this.listShippingService = res.data;
        //     });
        // this.listShippingService.forEach((item, index) => {
        //     const data = {
        //         to_district_id: dist.distCode,
        //         to_ward_code: ward.wardCode,
        //         insurance_value: 500000,
        //         service_id: item.service_id,
        //         height: 15,
        //         length: 15,
        //         weight: 1000,
        //         width: 15,
        //         coupon: null,
        //     };
        //     this.cartService.getShippingFee(data).subscribe((res: any) => {
        //         if (res.code === 200)
        //             this.shipService.map((item) => {
        //                 if (
        //                     item.service_type_id ===
        //                     this.listShippingService[index].service_type_id
        //                 )
        //                     item.price = res.data.total;
        //             });
        //     });
        //     this.selectedShipping = this.listShippingService[0];
        // });
    }
}
