import {
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

export interface IHttpGetConfig {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | { [param: string]: string | string[] };
  body?: any | null;
  url?: string;
  force_refresh?: boolean;
  cache_duration?: number;
};
