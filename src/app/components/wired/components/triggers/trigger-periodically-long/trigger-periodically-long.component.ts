import { Component } from '@angular/core';
import { FriendlyTime, Nitro } from '@nitrots/nitro-renderer';
import { TriggerPeriodicallyComponent } from '../trigger-periodically/trigger-periodically.component';
import { WiredTriggerType } from '../WiredTriggerType';

@Component({
    templateUrl: './trigger-periodically-long.template.html'
})
export class TriggerPeriodicallyLongComponent extends TriggerPeriodicallyComponent
{
    public static CODE: number = WiredTriggerType.TRIGGER_PERIODICALLY_LONG;

    public get code(): number
    {
        return TriggerPeriodicallyLongComponent.CODE;
    }

    protected updateLocaleParameter(): void
    {
        this.timeLocale = Nitro.instance.getLocalizationWithParameter('wiredfurni.params.setlongtime', 'time', FriendlyTime.format(this.time * 5));
    }
}
