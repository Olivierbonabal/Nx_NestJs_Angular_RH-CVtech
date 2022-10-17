import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DurationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log("first Interceptor");
    //calculer la durée de vie d'1 Req.
    const dateIn = Date.now();
    console.log('request created At : ', dateIn);
    //traite le retour et observable ss le modifié
    return next.handle().pipe(
      tap(
        () => {
          const dateOut = Date.now();
          console.log('request end At : ', dateOut);
          console.log(`Request duration: ${dateOut - dateIn} ms`)
        }
      )
    );
  }
}
//je px appliquer l'interceptor a 1 controller ou en main*