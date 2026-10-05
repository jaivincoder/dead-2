import { HttpContextToken } from '@angular/common/http';

/** Set on a request to keep the error interceptor from toasting. */
export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);
