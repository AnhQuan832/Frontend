import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../constant/enum';
import { catchError, map } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

    login(userEmail, userPassword) {
        return this.http.post(API.AUTHENTICATE.END_POINT.LOGIN, {
            userEmail: userEmail,
            userPassword: userPassword
        }).pipe(
            map((data: any) => {
                if (data.meta.statusCode === API.AUTHENTICATE.STATUS.AUTHENTICATE_SUCCESSFUL) {
                    return data.data.user
                }
                else if (data.meta.statusCode === API.AUTHENTICATE.STATUS.BAD_CREDENTIAL) {
                    return false;
                }
                else {
                    throw new Error(data.meta)
                }
            }),
            catchError((err) => {
                throw new Error(err)
            })
        );
    }

    setRoles(userRoles: []) {
        sessionStorage.setItem("userRoles", JSON.stringify(userRoles))
    }
    getRoles() {
        return sessionStorage.getItem("userRoles")
    }

    setToken(jwtToken: string) {
        console.log("set token gg ")
        sessionStorage.setItem("jwtToken", jwtToken)
    }

    getToken(): string {
        return sessionStorage.getItem("jwtToken")
    }
    roleMatch(allowedRoles: any): boolean {
        const userRoles = this.getRoles();
        console.log(userRoles)
        if (userRoles != null && userRoles)
            if (userRoles.includes(allowedRoles[0]))
                return true
        return false
    }

}
