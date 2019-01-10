import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import {
    catchError,
    exhaustMap,
    map,
    mergeMap
} from "rxjs/operators";
import { appRoutePaths } from "../../../app.routes";
import { AuthService } from "../../service/auth.service";
import { AuthActionTypes } from "./auth.action";
import {
    Auth,
    LoginCredentials,
    RegisterCredentials
} from "../../domain/auth.model";
import * as AuthActions from "./auth.action";
import * as RouterActions from "../router/router.action";

@Injectable()
export class AuthEffect {
    /**
     * Attempt to login.
     */
    @Effect()
    login$: Observable<Action> = this.actions$.pipe(
        ofType<AuthActions.Login>(AuthActionTypes.Login),
        map((action: AuthActions.Login) => action.payload),
        exhaustMap((creds: LoginCredentials) =>
            this.authService.login(creds).pipe(
                mergeMap((data: Auth) => [
                    new AuthActions.LoginSuccess(data),
                    new RouterActions.Go({ path: appRoutePaths.beer })
                ]),
                catchError((err: HttpErrorResponse) => of(new AuthActions.LoginFault(err.message)))
            )
        )
    );

    /**
     * Attempt to register a user.
     */
    @Effect()
    register$: Observable<Action> = this.actions$.pipe(
        ofType<AuthActions.Register>(AuthActionTypes.Register),
        map((action: AuthActions.Register) => action.payload),
        exhaustMap((creds: RegisterCredentials) =>
            this.authService.register(creds).pipe(
                mergeMap((data: Auth) => [
                    new AuthActions.RegisterSuccess(data),
                    new RouterActions.Go({ path: appRoutePaths.beer })
                ]),
                catchError((err: HttpErrorResponse) => of(new AuthActions.RegisterFault(err.message)))
            )
        )
    );

    /**
     * Constructor
     */
    constructor(private actions$: Actions, private store$: Store<any>, private authService: AuthService) {}
}