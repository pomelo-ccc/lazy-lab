import { Observable } from 'rxjs';

export interface ApiProxy<TRequest, TResponse> {
  execute$(request: TRequest): Observable<TResponse>;
}
