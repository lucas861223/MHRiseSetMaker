import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SkillSetSharingService {
    
    private observable= new Subject<number[]>();

    getObservable() {
        return this.observable;
    }
}