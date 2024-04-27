import { SocialAuthService } from '@abacritt/angularx-social-login';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { debounce } from 'rxjs';
import { Location } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { LoginComponent } from '../../auth/login/login.component';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.less'],
    providers: [LoginComponent],
})
export class NavBarComponent
    extends BaseComponent
    implements OnInit, AfterViewInit
{
    isLogin: boolean;
    keySearch;
    searchRes;
    isShowSearch = true;
    showSearchRes = false;
    items: MenuItem[] = [
        {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
                this.router.navigate(['/user/profile']);
            },
        },
        // {
        //   label: 'Shopping history',
        //   icon: 'pi pi-shopping-bag',
        //   command: () => {
        //     this.router.navigate(['/user/invoice-history']);
        //   },
        // },
        {
            label: 'Log out',
            icon: 'pi pi-sign-out',
            command: () => {
                localStorage.clear();
                this.loginCpn.signOut();
                this.router.navigate(['/auth/login']);
            },
        },
    ];

    constructor(
        private router: Router,
        private socialLoginService: SocialAuthService,
        private productService: ProductService,
        private storageService: StorageService,
        private location: Location,
        private loginCpn: LoginComponent
    ) {
        super();
    }
    ngOnInit(): void {
        this.isLogin = !!this.getToken();
    }
    ngAfterViewInit(): void {
        this.setActiveNav();
    }

    routeToCart() {
        this.socialLoginService.signOut();
        this.router.navigate(['/user/cart']);
    }

    onSearch(key) {
        this.showSearchRes = true;
        if (!key) this.showSearchRes = false;

        this.productService.globalSearch(this.keySearch).subscribe({
            next: (res) => {
                // this.searchRes = Object.keys(res);
                // this.searchRes = Object.keys(res).reduce((acc, key) => {
                //   return acc.concat(res[key]);
                // }, []);
                this.searchRes = Object.values(res).map((items: any) => {
                    const groupItemName = items[0]?.groupName;
                    const groupItemId = groupItemName?.toLowerCase();

                    const groupItems = items.map((item) => ({
                        itemName: item.itemName,
                        itemId: item.itemId,
                        image: item.itemImage,
                        group: item.groupName,
                    }));

                    return {
                        itemName: groupItemName || '',
                        itemId: groupItemId || '',
                        items: groupItems,
                    };
                });
            },
        });
    }
    hideSearchBar() {
        this.isShowSearch = false;
    }

    routeToProduct(product) {
        this.showSearchRes = false;
        const prod = { ...product, productId: product.itemId };
        this.storageService.setItemLocal('currentProduct', prod);
        this.router.navigate([`user/product-detail/${prod.productId}`]);
    }

    setActiveNav() {
        let path = this.location.path();
        if (path.includes('home')) this.setActiveNavItem('home');
        else if (path.includes('shop')) this.setActiveNavItem('product');
        else if (path.includes('message')) this.setActiveNavItem('message');
    }

    public setActiveNavItem(element: any) {
        const items = document.querySelectorAll('.nav-link');
        const activated = document.getElementById(element) as HTMLElement;
        items.forEach((item) => {
            item.classList.remove('active');
            item.removeAttribute('style');
        });

        activated.classList.add('active');
    }

    toLoginPage() {
        this.router.navigate(['/auth/login']);
    }

    toChatPage() {
        this.router.navigate(['/user/message']);
    }
}
