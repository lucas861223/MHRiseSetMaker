import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Talisman } from './Talisman';

@Injectable()
export class TalismanSharingService {
    
    private observable= new Subject<[number, Talisman | null]>();
    
    getObservable() {
        return this.observable;
    }
}