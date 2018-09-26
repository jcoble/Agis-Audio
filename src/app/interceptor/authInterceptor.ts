import { TokenData } from './../models/tokenData';
import { AuthService } from "./../services/auth.service";
import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse
} from "@angular/common/http";
import "rxjs/add/operator/take";
import { Observable, throwError } from "rxjs";
import { BehaviorSubject } from "rxjs";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { switchMap, catchError, finalize, filter, take } from "../../../node_modules/rxjs/operators";
import { ToastrService } from '../../../node_modules/ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService,
    private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    return next.handle(this.addTokenToRequest(request, this.authService.getAuthToken()))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                return this.handle401Error(request, next);
              case 400:
                this.authService.logout();
                return <any>Observable.throw(err);
            }
          } else {
            return <any>this.HandleError(err);
          }
        }));
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string) : HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}`}});
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if(!this.isRefreshingToken) {
      this.isRefreshingToken = true;
 
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      return this.authService.refreshToken()
        .pipe(
          switchMap((user: TokenData) => {
            if(user) {
              this.tokenSubject.next(user.access_token);;
              localStorage.setItem('tokenData', JSON.stringify(user));
              return next.handle(this.addTokenToRequest(request, user.access_token));
            }
 
            return <any>this.authService.logout();
          }),
          catchError(err => {
            return <any>this.authService.logout();
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;
 
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
          return next.handle(this.addTokenToRequest(request, token));
        }));
    }
  }

  private HandleError (error: Response) {
    this.toastr.error("Oops! Something Went Wrong!");
  }
}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // add authorization header with jwt token if available
//     let currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     if (currentUser && currentUser.token) {
//         request = request.clone({
//             setHeaders: { 
//                 Authorization: `Bearer ${currentUser.token}`
//             }
//         });
//     }

//     return next.handle(request);
// }

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const idToken = localStorage.getItem("id_token");

  //   if (idToken) {
  //     const cloned = req.clone({
  //       headers: req.headers.set("Authorization", "Bearer " + idToken)
  //     });

  //     return next.handle(cloned);
  //   } else {
  //     return next.handle(req);
  //   }
  // }
//   constructor(inj: Injector) {
//     setTimeout(() => {
//       this.authService = inj.get(AuthService);
//     });
//   }

//   addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
//     return req.clone({ setHeaders: { Authorization: "Bearer " + token } });
//   }

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const idToken = localStorage.getItem("id_token");
//     if (idToken) {
//       const cloned = req.clone({
//         headers: req.headers.set("Authorization", "Bearer " + idToken)
//       });
  
//       return next.handle(cloned).catch(error => {
//         if (error instanceof HttpErrorResponse) {
//           switch ((<HttpErrorResponse>error).status) {
//             case 400:
//               return this.handle400Error(error);
//             case 401:
//               return this.handle401Error(req, next);
//           }
//         } else {
//           return Observable.throw(error);
//         }
//       });
//     } else {
//       return next.handle(req);
//     }
    
//   }

//   handle401Error(req: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshingToken) {
//       this.isRefreshingToken = true;

//       // Reset here so that the following requests wait until the token
//       // comes back from the refreshToken call.
//       this.tokenSubject.next(null);

//       return this.authService.getRefreshToken().map(data => {
//         const newToken = data;
//         if (newToken) {
//           this.tokenSubject.next(newToken);
//           return next.handle(this.addToken(req, newToken));
//         }
//         // If we don't get a new token, we are in trouble so logout.
//         this.isRefreshingToken = false;
//         return Observable.of(this.authService.logout());
//       });
//     } else {
//       return this.tokenSubject
//         .filter(token => token != null)
//         .take(1)
//         .switchMap(token => {
//           return next.handle(this.addToken(this.getNewRequest(req), token));
//         });
//     }
//   }

//   handle400Error(error) {
//     if (
//       error &&
//       error.status === 400 &&
//       error.error &&
//       error.error.error === "invalid_grant"
//     ) {
//       // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
//       return Observable.of(this.authService.logout());
//     }

//     return Observable.throw(error);
//   }

//   /*
//   This method is only here so the example works.
//   Do not include in your code, just use 'req' instead of 'this.getNewRequest(req)'.
// */
//   getNewRequest(req: HttpRequest<any>): HttpRequest<any> {
//     if (req.url.indexOf("getData") > 0) {
//       return new HttpRequest(
//         "GET",
//         "http://private-4002d-testerrorresponses.apiary-mock.com/getData"
//       );
//     }

//     return new HttpRequest(
//       "GET",
//       "http://private-4002d-testerrorresponses.apiary-mock.com/getLookup"
//     );
//   }

// }
