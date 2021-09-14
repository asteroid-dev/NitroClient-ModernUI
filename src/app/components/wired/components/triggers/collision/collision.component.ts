import { Component } from '@angular/core';
import { WiredTrigger } from '../WiredTrigger';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './collision.template.html'
})
export class CollisionComponent extends WiredTrigger
{
    public static CODE: number = WiredTriggerType.COLLISION;

    public get code(): number
    {
        return CollisionComponent.CODE;
    }
}