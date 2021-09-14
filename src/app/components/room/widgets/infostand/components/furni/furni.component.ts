import { Component } from '@angular/core';
import { CrackableDataType, Nitro, RoomControllerLevel, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, StringDataType } from '@nitrots/nitro-renderer';
import { RoomWidgetFurniInfostandUpdateEvent } from '../../../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetFurniActionMessage } from '../../../messages/RoomWidgetFurniActionMessage';
import { InfoStandFurniData } from '../../data/InfoStandFurniData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
    templateUrl: './furni.template.html'
})
export class RoomInfoStandFurniComponent extends RoomInfoStandBaseComponent
{
    private static PICKUP_MODE_NONE: number     = 0;
    private static PICKUP_MODE_EJECT: number    = 1;
    private static PICKUP_MODE_FULL: number     = 2;

    public furniData: InfoStandFurniData = null;

    public pickupMode   = 0;
    public canMove      = false;
    public canRotate    = false;
    public canUse       = false;

    public furniSettingsKeys: string[]      = [];
    public furniSettingsValues: string[]    = [];
    public isCrackable: boolean             = false;
    public crackableHits: number            = 0;
    public crackableTarget: number          = 0;

    public update(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        this.furniSettingsKeys      = [];
        this.furniSettingsValues    = [];
        this.isCrackable            = false;
        this.crackableHits          = 0;
        this.crackableTarget        = 0;

        let canMove     = false;
        let canRotate   = false;
        let canUse      = false;
        let godMode     = false;

        const isValidController = (event.roomControllerLevel >= RoomControllerLevel.GUEST);

        if(isValidController || event.isOwner || event.isRoomOwner || event.isAnyRoomOwner)
        {
            canMove     = true;
            canRotate   = (!event.isWallItem);

            if(event.roomControllerLevel >= RoomControllerLevel.MODERATOR) godMode = true;
        }

        if((((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.EVERYBODY) || ((event.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.CONTROLLER) && isValidController)) || ((event.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((event.extraParam == RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController))
        {
            canUse = true;
        }

        if(event.extraParam)
        {
            if(event.extraParam === RoomWidgetEnumItemExtradataParameter.CRACKABLE_FURNI)
            {
                const stuffData = (event.stuffData as CrackableDataType);

                canUse  = true;

                this.isCrackable        = true;
                this.crackableHits      = stuffData.hits;
                this.crackableTarget    = stuffData.target;
            }

            if(godMode)
            {
                const extraParam = event.extraParam.substr(RoomWidgetEnumItemExtradataParameter.BRANDING_OPTIONS.length);

                if(extraParam)
                {
                    const parts = extraParam.split('\t');

                    for(const part of parts)
                    {
                        const value = part.split('=');

                        if(value && (value.length === 2))
                        {
                            this.furniSettingsKeys.push(value[0]);
                            this.furniSettingsValues.push(value[1]);
                        }
                    }
                }
            }
        }

        this.canMove    = canMove;
        this.canRotate  = canRotate;
        this.canUse     = canUse;

        this.togglePickupButton(event);
    }

    private togglePickupButton(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        if(!event) return;

        this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_NONE;

        if(event.isOwner || event.isAnyRoomOwner)
        {
            this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_FULL;
        }

        else if(event.isRoomOwner || (event.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN))
        {
            this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_EJECT;
        }

        if(event.isStickie) this.pickupMode = RoomInfoStandFurniComponent.PICKUP_MODE_NONE;
    }

    public processButtonAction(action: string): void
    {
        if(!action || (action === '')) return;

        let messageType: string = null;
        let objectData: string  = null;

        switch(action)
        {
            case 'move':
                messageType = RoomWidgetFurniActionMessage.RWFAM_MOVE;
                break;
            case 'rotate':
                messageType = RoomWidgetFurniActionMessage.RWFUAM_ROTATE;
                break;
            case 'pickup':
                if(this.pickupMode === RoomInfoStandFurniComponent.PICKUP_MODE_FULL)
                {
                    messageType = RoomWidgetFurniActionMessage.RWFAM_PICKUP;
                }
                else
                {
                    messageType = RoomWidgetFurniActionMessage.RWFAM_EJECT;
                }
                break;
            case 'use':
                messageType = RoomWidgetFurniActionMessage.RWFAM_USE;
                break;
            case 'save_branding_configuration':
                messageType = RoomWidgetFurniActionMessage.RWFAM_SAVE_STUFF_DATA;
                objectData = this.getSettingsAsString();
                break;

        }

        if(!messageType) return;

        this.widget.messageListener.processWidgetMessage(new RoomWidgetFurniActionMessage(messageType, this.furniData.id, this.furniData.category, this.furniData.purchaseOfferId, objectData));
    }

    private getSettingsAsString(): string
    {
        if(!this.furniSettingsKeys.length || !this.furniSettingsValues.length) return '';

        let data = '';

        let i = 0;

        while(i < this.furniSettingsKeys.length)
        {
            const key   = this.furniSettingsKeys[i];
            const value = this.furniSettingsValues[i];

            data = (data + (key + '=' + value + '\t'));

            i++;
        }

        return data;
    }

    public openFurniGroupInfo(): void
    {
        if(!this.furniData.groupId) return;

        Nitro.instance.createLinkEvent('groups/info/' + this.furniData.groupId);
    }

    public get getStuffDataAsStringDataType(): StringDataType
    {
        if(!this.furniData) return null;

        return (this.furniData.stuffData as StringDataType);
    }

    public get type(): number
    {
        return InfoStandType.FURNI;
    }

    public visitProfile(): void
    {
        Nitro.instance.createLinkEvent('profile/goto/' + this.furniData.ownerId);
    }
}
