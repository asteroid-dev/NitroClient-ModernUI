import { Component } from '@angular/core';
import { BotRemoveComposer, Nitro } from '@nitrots/nitro-renderer';
import { RoomWidgetRentableBotInfostandUpdateEvent } from '../../../events/RoomWidgetRentableBotInfostandUpdateEvent';
import { InfoStandRentableBotData } from '../../data/InfoStandRentableBotData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
    templateUrl: './rentablebot.template.html'
})
export class RoomInfoStandRentableBotComponent extends RoomInfoStandBaseComponent
{
    public botData: InfoStandRentableBotData = null;

    public ownerText: string = '';
    public carryText: string = '';

    public update(event: RoomWidgetRentableBotInfostandUpdateEvent): void
    {
        if(!event) return;

        this.ownerText = Nitro.instance.getLocalizationWithParameter('infostand.text.botowner', 'name', this.botData.ownerName);

        if(event.carryId > 0)
        {
            this.carryText = Nitro.instance.getLocalizationWithParameter('infostand.text.handitem', 'item', Nitro.instance.getLocalization('handitem' + event.carryId));
        }
    }

    public get type(): number
    {
        return InfoStandType.RENTABLE_BOT;
    }

    public pickup(): void
    {
        this.hide();
        Nitro.instance.communication.connection.send(new BotRemoveComposer(this.botData.id));
    }
}
