import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../constant/enum';
import { catchError, map } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
    providedIn: 'root',
})
export class LoginService {
    constructor(private http: HttpClient) {}

    login(userEmail, userPassword) {
        return this.http
            .post(API.AUTHENTICATE.END_POINT.LOGIN, {
                userEmail: userEmail,
                userPassword: userPassword,
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.AUTHENTICATE_SUCCESSFUL
                    ) {
                        return data.data.user;
                    } else if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.BAD_CREDENTIAL
                    ) {
                        return 'Bad credential! Please check your email or password again!';
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    setRoles(userRoles: []) {
        sessionStorage.setItem('userRoles', JSON.stringify(userRoles));
    }
    getRoles() {
        return sessionStorage.getItem('userRoles');
    }

    setToken(jwtToken: string) {
        console.log('set token gg ');
        sessionStorage.setItem('jwtToken', jwtToken);
    }

    getToken(): string {
        return sessionStorage.getItem('jwtToken');
    }
    roleMatch(allowedRoles: any): boolean {
        const userRoles = this.getRoles();
        console.log(userRoles);
        if (userRoles != null && userRoles)
            if (userRoles.includes(allowedRoles[0])) return true;
        return false;
    }

    loginGoogle(inputData: any) {
        return this.http
            .post(API.AUTHENTICATE.END_POINT.GG_LOGIN, {
                userEmail: inputData.email,
                userFirstName: inputData.firstName,
                userLastName: inputData.lastName,
                userAvatar: inputData.photoUrl,
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.AUTHENTICATE_SUCCESSFUL
                    )
                        return data.data.user;
                    return false;
                })
            );
    }
    registerNewUser(inputData) {
        return this.http
            .post(API.AUTHENTICATE.END_POINT.REGISTER, {
                userEmail: inputData.userEmail,
                userPassword: inputData.userPassword,
                userFirstName: this.getFirstName(inputData.userFullName),
                userLastName: this.getLastName(inputData.userFullName),
                userPhoneNumber: inputData.phoneNumber,
                userAvatar: '',
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.CREATED_ACCOUNT_SUCCESSFUL
                    ) {
                        return data.data;
                    } else if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.ACCOUNT_EXISTED
                    ) {
                        return 'Account existed';
                    } else if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.ACCOUNT_INACTIVE
                    ) {
                        return 'Account was not activated';
                    } else if (
                        data.meta.statusCode ===
                        API.AUTHENTICATE.STATUS.ACCOUNT_LOCKED
                    ) {
                        return 'Account locked';
                    } else {
                        throw new Error(data.meta);
                    }
                }),
                catchError((err) => {
                    throw new Error(err);
                })
            );
    }

    sendOtpRes(email) {
        return this.http
            .post(API.AUTHENTICATE.END_POINT.CONFIRM_EMAIL, null, {
                params: {
                    emailAddress: email,
                },
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode === API.AUTHENTICATE.STATUS.SUCCESS
                    ) {
                        return true;
                    }
                    return false;
                })
            );
    }

    sendOtpReset(email) {
        return this.http.post(API.AUTHENTICATE.END_POINT.FORGOT_PASS, null, {
            params: {
                emailAddress: email,
            },
        });
    }

    validateRes(data) {
        return this.http
            .post(API.AUTHENTICATE.END_POINT.VALIDATE_EMAIL, null, {
                params: data,
            })
            .pipe(
                map((data: any) => {
                    if (
                        data.meta.statusCode === API.AUTHENTICATE.STATUS.SUCCESS
                    ) {
                        return true;
                    }
                    return false;
                })
            );
    }

    validateReset(data) {
        return this.http.post(API.AUTHENTICATE.END_POINT.VALIDATE_PASS, null, {
            params: data,
        });
    }

    private getFirstName(userName: string) {
        return userName.slice(0, userName.indexOf(' '));
    }
    private getLastName(userName: string) {
        return userName.slice(userName.trim().indexOf(' ') + 1);
    }
}
