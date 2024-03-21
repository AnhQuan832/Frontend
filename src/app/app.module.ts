import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from './services/product.service';
import {
    GoogleLoginProvider,
    SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule, ToastModule],
    providers: [
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        ProductService,
        MessageService,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '862554826072-hh67j8al3nlhopa5hnsu27m7p7fu5gr6.apps.googleusercontent.com'
                        ),
                    },
                ],
                onError: (err) => {
                    console.error(err);
                },
            } as SocialAuthServiceConfig,
        },
    ],

    bootstrap: [AppComponent],
})
export class AppModule {}
