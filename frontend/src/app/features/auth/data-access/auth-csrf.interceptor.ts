import { HttpClient, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { switchMap } from "rxjs";

import { environment } from '../../../../../environments/environments';

interface CsrfTokenResponse {
  csrfToken: string;
}

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

export const authCsrfInterceptor: HttpInterceptorFn = (request, next) => {
  if (!environment.authSessionCookiesEnabled) {
    return next(request);
  }

  const isApiRequest = request.url.startsWith(`${environment.apiUrl}/api/`);

  if (!isApiRequest) {
    return next(request);
  }

  // Les requêtes de lecture ne nécessitent pas de jeton CSRF.
  if (SAFE_METHODS.includes(request.method.toUpperCase())) {
    return next(request);
  }

  const http = inject(HttpClient);

  return http
    .get<CsrfTokenResponse>(
    `${environment.apiUrl}/api/auth/csrf`,
      {
        withCredentials: true,
      })
    .pipe(
      switchMap(({ csrfToken }) => {
        const securedRequest = request.clone({
          setHeaders: {
            'X-XSRF-TOKEN': csrfToken,
          },
        });

        return next(securedRequest);
      })
    );
};
