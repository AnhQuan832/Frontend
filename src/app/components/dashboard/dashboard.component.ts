import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StorageService } from 'src/app/services/storage.service';
import { Route, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { StatisticService } from 'src/app/services/statistic.service';
import { dA } from '@fullcalendar/core/internal-common';
import { BaseComponent } from 'src/app/base.component';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    items!: MenuItem[];

    products!: any[];
    mostBuy;
    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    role;
    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private storageService: StorageService,
        private router: Router,
        private statisticService: StatisticService
    ) {
        super();
    }

    ngOnInit() {
        const token = this.storageService.getDataFromCookie('jwtToken');
        // if (!token) this.router.navigate(['/auth/login']);
        this.role = this.getRole() === 'ROLE_ADMIN' ? 'admin' : 'merchant';
        const params = {
            start_time_millis: moment()
                .clone()
                .startOf('week')
                .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
                .unix(),
            end_time_millis: moment().clone().endOf('week').unix(),
            interval: 'day',
        };
        this.getData(params);

        const paramTable = {
            quantity: 5,
            daysAmount: 7,
        };
        this.productService.getProdMost(paramTable).subscribe((data) => {
            this.products = data;
        });
        this.productService.getProdMostBuy(paramTable).subscribe((data) => {
            this.mostBuy = data;
        });
    }

    initChart(data) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const reportTime = data.map((i) =>
            moment(i.reportTime).format('DD/MM')
        );
        const totalSell = data.map((i) => i.totalSell);
        const totalImport = data.map((i) => i.totalImport);
        this.chartData = {
            labels: reportTime,
            datasets: [
                {
                    label: 'Total Sell',
                    data: totalSell,
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    borderColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    tension: 0.4,
                },
                {
                    label: 'Total Import',
                    data: totalImport,
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--teal-400'),
                    borderColor: documentStyle.getPropertyValue('--teal-400'),
                    tension: 0.4,
                },
            ],
        };
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getData(params) {
        this.statisticService.getData(this.role, params).subscribe({
            next: (res) => {
                this.initChart(res);
            },
        });
    }
}
