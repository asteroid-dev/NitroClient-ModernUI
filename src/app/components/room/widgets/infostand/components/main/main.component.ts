import { Component, ComponentFactoryResolver, ComponentRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { InventoryService } from '../../../../../inventory/services/inventory.service';
import { InventoryTradingService } from '../../../../../inventory/services/trading.service';
import { ConversionTrackingWidget } from '../../../ConversionTrackingWidget';
import { RoomWidgetFurniInfostandUpdateEvent } from '../../../events/RoomWidgetFurniInfostandUpdateEvent';
import { RoomWidgetPetInfostandUpdateEvent } from '../../../events/RoomWidgetPetInfostandUpdateEvent';
import { RoomWidgetRentableBotInfostandUpdateEvent } from '../../../events/RoomWidgetRentableBotInfostandUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetUpdateInfostandUserEvent } from '../../../events/RoomWidgetUpdateInfostandUserEvent';
import { InfoStandWidgetHandler } from '../../../handlers/InfoStandWidgetHandler';
import { RoomWidgetRoomObjectMessage } from '../../../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetUpdateEvent } from '../../../RoomWidgetUpdateEvent';
import { InfoStandFurniData } from '../../data/InfoStandFurniData';
import { InfoStandPetData } from '../../data/InfoStandPetData';
import { InfoStandRentableBotData } from '../../data/InfoStandRentableBotData';
import { InfoStandUserData } from '../../data/InfoStandUserData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';
import { RoomInfoStandBotComponent } from '../bot/bot.component';
import { RoomInfoStandFurniComponent } from '../furni/furni.component';
import { RoomInfoStandPetComponent } from '../pet/pet.component';
import { RoomInfoStandRentableBotComponent } from '../rentablebot/rentablebot.component';
import { RoomInfoStandUserComponent } from '../user/user.component';

@Component({
    templateUrl: './main.template.html'
})
export class RoomInfoStandMainComponent extends ConversionTrackingWidget
{
    @ViewChild('infostandsContainer', { read: ViewContainerRef })
    public infostandsContainer: ViewContainerRef;

    private _lastComponent: ComponentRef<RoomInfoStandBaseComponent> = null;

    private _furniData  = new InfoStandFurniData();
    private _userData   = new InfoStandUserData();
    private _petData    = new InfoStandPetData();
    private _botData    = new InfoStandRentableBotData();

    constructor(
        private _inventoryService: InventoryService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone)
    {
        super();

        this.objectSelectedHandler              = this.objectSelectedHandler.bind(this);
        this.objectDeselectedHandler            = this.objectDeselectedHandler.bind(this);
        this.objectRemovedHandler               = this.objectRemovedHandler.bind(this);
        this.userInfostandUpdateHandler         = this.userInfostandUpdateHandler.bind(this);
        this.botInfostandUpdateHandler          = this.botInfostandUpdateHandler.bind(this);
        this.furniInfostandUpdateHandler        = this.furniInfostandUpdateHandler.bind(this);
        this.rentableBotInfostandUpdateHandler  = this.rentableBotInfostandUpdateHandler.bind(this);
        this.petInfostandUpdateHandler          = this.petInfostandUpdateHandler.bind(this);

    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.objectRemovedHandler);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.objectRemovedHandler);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this.userInfostandUpdateHandler);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this.userInfostandUpdateHandler);
        eventDispatcher.addEventListener(RoomWidgetUpdateInfostandUserEvent.BOT, this.botInfostandUpdateHandler);
        eventDispatcher.addEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this.furniInfostandUpdateHandler);
        eventDispatcher.addEventListener(RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT, this.rentableBotInfostandUpdateHandler);
        eventDispatcher.addEventListener(RoomWidgetPetInfostandUpdateEvent.PET_INFO, this.petInfostandUpdateHandler);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_SELECTED, this.objectSelectedHandler);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.OBJECT_DESELECTED, this.objectDeselectedHandler);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.objectRemovedHandler);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.objectRemovedHandler);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.OWN_USER, this.userInfostandUpdateHandler);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.PEER, this.userInfostandUpdateHandler);
        eventDispatcher.removeEventListener(RoomWidgetUpdateInfostandUserEvent.BOT, this.botInfostandUpdateHandler);
        eventDispatcher.removeEventListener(RoomWidgetFurniInfostandUpdateEvent.FURNI, this.furniInfostandUpdateHandler);
        eventDispatcher.removeEventListener(RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT, this.rentableBotInfostandUpdateHandler);
        eventDispatcher.removeEventListener(RoomWidgetPetInfostandUpdateEvent.PET_INFO, this.petInfostandUpdateHandler);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    public close(): void
    {
        if(this.infostandsContainer.length) this.infostandsContainer.remove();

        this._lastComponent = null;
    }

    private objectSelectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_INFO, k.id, k.category));
    }

    private objectDeselectedHandler(k: RoomWidgetRoomObjectUpdateEvent): void
    {
        this._ngZone.run(() => this.close());
    }

    private objectRemovedHandler(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        let remove = false;

        const type = ((this._lastComponent && this._lastComponent.instance.type) || -1);

        if(type === -1) remove = true;

        if(type > 0)
        {
            switch(event.type)
            {
                case RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED:
                    if(type === InfoStandType.FURNI && (event.id === this._furniData.id)) remove = true;
                    break;
                case RoomWidgetRoomObjectUpdateEvent.USER_REMOVED:
                    if((type === InfoStandType.USER) && (event.id === this._userData.id)) remove = true;

                    else if((type === InfoStandType.PET) && (event.id === this._petData._Str_2707)) remove = true;

                    else if((type === InfoStandType.BOT) && (event.id === this._userData.id)) remove = true;

                    else if((type === InfoStandType.RENTABLE_BOT) && (event.id === this._botData.id)) remove = true;
                    break;
            }
        }

        if(remove) this._ngZone.run(() => this.close());
    }

    private userInfostandUpdateHandler(event: RoomWidgetUpdateInfostandUserEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._userData.populate(event);

            const infostand = (this.getInfoStand(event) as RoomInfoStandUserComponent);

            if(infostand)
            {
                infostand.userData = this._userData;

                infostand.update(event);
            }
        });
    }

    private botInfostandUpdateHandler(event: RoomWidgetUpdateInfostandUserEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._userData.populate(event);

            const infostand = (this.getInfoStand(event) as RoomInfoStandBotComponent);

            if(infostand)
            {
                infostand.userData = this._userData;

                infostand.update(event);
            }
        });
    }

    private furniInfostandUpdateHandler(event: RoomWidgetFurniInfostandUpdateEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._furniData.populate(event);

            const infostand = (this.getInfoStand(event) as RoomInfoStandFurniComponent);

            if(infostand)
            {
                infostand.furniData = this._furniData;

                infostand.update(event);
            }
        });
    }

    private rentableBotInfostandUpdateHandler(event: RoomWidgetRentableBotInfostandUpdateEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._botData.populate(event);

            const infostand = (this.getInfoStand(event) as RoomInfoStandRentableBotComponent);

            if(infostand)
            {
                infostand.botData = this._botData;

                infostand.update(event);
            }
        });
    }

    private petInfostandUpdateHandler(event: RoomWidgetPetInfostandUpdateEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._petData.populate(event);

            const infostand = (this.getInfoStand(event) as RoomInfoStandPetComponent);

            if(infostand)
            {
                infostand.petData = this._petData;

                infostand.update(event);
            }
        });
    }

    public updateUserBadges(userId: number, badges: string[]): void
    {
        if(userId !== this._userData.id) return;

        if(!this._userData.getIsBot()) this._ngZone.run(() => (this._userData.badges = badges));
    }

    private getInfoStand(event: RoomWidgetUpdateEvent): RoomInfoStandBaseComponent
    {
        const componentType = this.getInfoStandComponentType(event);

        if(!componentType) return null;

        if(this._lastComponent && (this._lastComponent.instance instanceof componentType)) return this._lastComponent.instance;

        if(this.infostandsContainer.length) this.infostandsContainer.remove();

        const factory = this._componentFactoryResolver.resolveComponentFactory(componentType);

        let ref: ComponentRef<RoomInfoStandBaseComponent> = null;

        if(factory) ref = this.infostandsContainer.createComponent(factory);

        this._lastComponent = ref;

        if(ref)
        {
            ref.instance.widget = this;

            return ref.instance;
        }

        return null;
    }

    public get furniData(): InfoStandFurniData
    {
        return this._furniData;
    }

    private getInfoStandComponentType(event: RoomWidgetUpdateEvent): typeof RoomInfoStandBaseComponent
    {
        if(!event) return null;

        switch(event.type)
        {
            case RoomWidgetUpdateInfostandUserEvent.BOT:
                return RoomInfoStandBotComponent;
            case RoomWidgetFurniInfostandUpdateEvent.FURNI:
                return RoomInfoStandFurniComponent;
            case RoomWidgetPetInfostandUpdateEvent.PET_INFO:
                return RoomInfoStandPetComponent;
            case RoomWidgetRentableBotInfostandUpdateEvent.RENTABLE_BOT:
                return RoomInfoStandRentableBotComponent;
            case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
            case RoomWidgetUpdateInfostandUserEvent.PEER:
                return RoomInfoStandUserComponent;
        }

        return null;
    }

    public get handler(): InfoStandWidgetHandler
    {
        return (this.widgetHandler as InfoStandWidgetHandler);
    }

    public get inventoryTrading(): InventoryTradingService
    {
        return this._inventoryService.controller.tradeService;
    }
}
