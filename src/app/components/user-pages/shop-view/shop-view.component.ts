import { Component, Input, OnInit } from '@angular/core';
import { DataView } from 'primeng/dataview';
import _ from 'lodash';
import { forkJoin } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
@Component({
    selector: 'app-shop-view',
    templateUrl: './shop-view.component.html',
    styleUrls: ['./shop-view.component.scss'],
})
export class ShopViewComponent implements OnInit {
    @Input() merchantId = null;
    responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1,
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1,
        },
    ];
    priceRange: number[] = [10000, 30000000];
    products = [];
    searchValue;
    timeAutoPlay = 3000;
    sortedProd;
    defaultProd;
    protected selectedBrand = 'All';
    protected selectedCate = 'All';
    selectedCategory;
    listCate = [];
    listBrand;
    isLoading: boolean = false;
    page = 1;
    size = 10;
    throttle = 300;
    scrollDistance = 1;
    scrollUpDistance = 2;
    totalRecord = 0;
    isLoadingMore = false;
    filter = {};
    constructor(private productService: ProductService) {}
    ngOnInit(): void {
        this.initialize();
    }

    private initialize() {
        this.isLoading = true;

        this.applyFilter(true);
        forkJoin([
            this.productService.getCategory(),
            this.productService.getBrand(),
        ]).subscribe({
            next: (res: any) => {
                this.listCate = res[0];
                this.listBrand = res[1];
                this.listBrand.unshift({ name: 'All', brandId: 'All' });
                this.listCate.unshift({ name: 'All', categoryId: 'All' });
            },
        });
    }

    getProducts(isInit = false) {
        if (isInit) {
            this.products = [];
            this.isLoading = true;
        } else if (this.totalRecord === this.products.length) {
            this.isLoadingMore = false;
            return;
        }
        this.isLoadingMore = true;

        this.productService.getAllProduct(this.filter).subscribe({
            next: (res) => {
                this.isLoading = false;
                this.isLoadingMore = false;
                this.totalRecord = res.length !== 0 ? res[0]['totalRecord'] : 0;
                this.products.push(...res);
            },
            error: (err) => console.log(err),
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'success';
        }
    }

    onUserSearched() {
        if (this.searchValue === '') {
            this.products = [...this.sortedProd];
            return;
        }
        const formatedValue = this.searchValue
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        console.log(formatedValue);
        this.products = this.products.filter((prod) => {
            return Object.values(prod).some((value) =>
                String(value)
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .includes(formatedValue)
            );
        });
    }

    // onCheckboxBrandChange(event) {
    //     this.products = [...this.defaultProd];
    //     console.log(this.products);
    //     console.log(event);

    //     if (event.value === 'All') {
    //         if (this.selectedCate === 'All') return;
    //         else {
    //             this.products = this.products.filter((prod) => {
    //                 return (
    //                     prod.subCategory.category.categoryId ===
    //                     this.selectedCate
    //                 );
    //             });
    //         }
    //     } else {
    //         if (this.selectedCate === 'All')
    //             this.products = this.products.filter((prod) => {
    //                 return prod.brand.brandId === event.value;
    //             });
    //         else
    //             this.products = this.products.filter((prod) => {
    //                 return (
    //                     prod.brand.brandId === event.value &&
    //                     prod.subCategory.category.categoryId ===
    //                         this.selectedCate
    //                 );
    //             });
    //     }
    //     this.sortedProd = [...this.products];
    // }

    // onCheckboxCateChange(event) {
    //     this.products = [...this.defaultProd];
    //     if (event.value === 'All') {
    //         if (this.selectedBrand === 'All') return;
    //         else {
    //             this.products = this.products.filter((prod) => {
    //                 return prod.brand.brandId === this.selectedBrand;
    //             });
    //         }
    //     } else {
    //         if (this.selectedBrand === 'All')
    //             this.products = this.products.filter((prod) => {
    //                 return prod.subCategory.category.categoryId === event.value;
    //             });
    //         else
    //             this.products = this.products.filter((prod) => {
    //                 return (
    //                     prod.subCategory.category.categoryId === event.value &&
    //                     prod.brand.brandId === this.selectedBrand
    //                 );
    //             });
    //     }
    //     this.sortedProd = [...this.products];
    // }

    onPriceChange() {}

    applyFilter(init = true) {
        if (init) this.page = 1;
        this.filter = {
            brandId: this.selectedBrand == 'All' ? null : this.selectedBrand,
            categoryId: this.selectedCate == 'All' ? null : this.selectedCate,
            minPrice: this.priceRange[0],
            maxPrice: this.priceRange[1],
            page: init ? 1 : this.page,
            size: this.size,
            merchantId: this.merchantId,
        };
        for (const key in this.filter) {
            if (this.filter[key] === null) {
                delete this.filter[key];
            }
        }
        this.getProducts(init);
    }
    clearFilter() {}

    onScrollDown() {
        ++this.page;
        this.applyFilter(false);
    }

    onUp(ev) {
        // console.log('scrolled up!', ev);
        // const start = this.sum;
        // this.sum += 20;
        // this.prependItems(start, this.sum);
        // this.direction = 'up';
    }
}
