import { HttpInterceptorFn } from '@angular/common/http';

// Functional interceptor (Angular 15+) to attach JWT from localStorage when available.
// SSR-safe: checks for browser environment before touching localStorage.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    const token = isBrowser ? localStorage.getItem('accessToken') : null;

    // Do not override an existing Authorization header
    if (token && !req.headers.has('Authorization')) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  } catch {
    // no-op: in non-browser/SSR contexts, just forward request as-is
  }

  return next(req);
};
