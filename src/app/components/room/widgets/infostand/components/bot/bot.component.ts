import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../events/RoomWidgetUpdateInfostandUserEvent';
import { InfoStandUserData } from '../../data/InfoStandUserData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
    templateUrl: './bot.template.html'
})
export class RoomInfoStandBotComponent extends RoomInfoStandBaseComponent
{
    public userData: InfoStandUserData = null;

    public carryText: string = '';

    public update(event: RoomWidgetUpdateInfostandUserEvent): void
    {
        if(!event) return;

        if(event.carryId > 0)
        {
            this.carryText = Nitro.instance.getLocalizationWithParameter('infostand.text.handitem', 'item', Nitro.instance.getLocalization('handitem' + event.carryId));
        }
    }

    public get type(): number
    {
        return InfoStandType.BOT;
    }
}
