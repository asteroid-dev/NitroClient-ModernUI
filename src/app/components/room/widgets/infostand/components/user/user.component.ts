import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../events/RoomWidgetUpdateInfostandUserEvent';
import { RoomWidgetChangeMottoMessage } from '../../../messages/RoomWidgetChangeMottoMessage';
import { InfoStandUserData } from '../../data/InfoStandUserData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
    templateUrl: './user.template.html'
})
export class RoomInfoStandUserComponent extends RoomInfoStandBaseComponent
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

    public resizeTextArea(event: KeyboardEvent): void
    {
        if(!event) return;

        const target = (event.target as HTMLTextAreaElement);

        if(!target) return;

        target.style.height = '0px';
        target.style.height = ((target.scrollHeight) + 'px');
    }

    public saveMotto(event: KeyboardEvent): void
    {
        if(this.userData.motto.length > 38) return;

        const target = (event.target as HTMLInputElement);

        target.blur();

        this.widget.messageListener.processWidgetMessage(new RoomWidgetChangeMottoMessage(this.userData.motto));
    }

    public visitProfile(): void
    {
        Nitro.instance.createLinkEvent('profile/goto/' + this.userData.id);
    }

    public get isOwnProfile(): boolean
    {
        return (this.userData.type === RoomWidgetUpdateInfostandUserEvent.OWN_USER);
    }

    public get type(): number
    {
        return InfoStandType.USER;
    }
}
