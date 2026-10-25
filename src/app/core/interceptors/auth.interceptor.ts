import { HttpInterceptorFn } from '@angular/common/http';

export const API_URL = 'http://localhost:3000';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    url: `${API_URL}${req.url}`
  });

  return next(apiReq);
};
