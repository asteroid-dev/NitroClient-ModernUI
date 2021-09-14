import { Component, NgZone } from '@angular/core';
import { IEventDispatcher, Nitro } from '@nitrots/nitro-renderer';
import { ProductTypeEnum } from '../../../../catalog/enums/ProductTypeEnum';
import { CatalogService } from '../../../../catalog/services/catalog.service';
import { FurniCategory } from '../../../../inventory/items/FurniCategory';
import { IFurnitureItem } from '../../../../inventory/items/IFurnitureItem';
import { InventoryService } from '../../../../inventory/services/inventory.service';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomWidgetPresentDataUpdateEvent } from '../../events/RoomWidgetPresentDataUpdateEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetPresentOpenMessage } from '../../messages/RoomWidgetPresentOpenMessage';

@Component({
    selector: 'nitro-room-furniture-gift-opening-component',
    templateUrl: './present.template.html'
})
export class PresentFurniWidget extends ConversionTrackingWidget
{
    private static FLOOR: string        = 'floor';
    private static WALLPAPER: string    = 'wallpaper';
    private static LANDSCAPE: string    = 'landscape';

    private _lastEvent: RoomWidgetPresentDataUpdateEvent = null;
    private _needsOpen: boolean = false;
    private _currentView: string = '';

    private _type: string = null;
    private _spriteId: number = -1;
    private _extras: string = null;
    private _text: string = null;
    private _isWallItem: boolean = false;

    private _visible: boolean = false;

    constructor(
        private _ngZone: NgZone,
        private _catalogService: CatalogService,
        private _inventoryService: InventoryService)
    {
        super();

        this.onObjectUpdate = this.onObjectUpdate.bind(this);
        this.onFurniRemoved = this.onFurniRemoved.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER, this.onObjectUpdate);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.onFurniRemoved);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER, this.onObjectUpdate);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.onFurniRemoved);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onObjectUpdate(event: RoomWidgetPresentDataUpdateEvent): void
    {
        if(!event) return;

        this.reset();

        this._ngZone.run(() =>
        {
            this._lastEvent = event;

            switch(event.type)
            {
                case RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO: {
                    this.showOpeningPresent();

                    break;
                }
                case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS:
                case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_FLOOR:
                case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE:
                case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER:
                case RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB: {
                    this._type          = event.itemType;
                    this._spriteId      = event.classId;
                    this._isWallItem    = (event.itemType === 'i');

                    this.showOpenPresent();

                    break;
                }
            }
        });
    }

    private onFurniRemoved(k: RoomWidgetRoomObjectUpdateEvent):void
    {
        if(!this._lastEvent) return;

        if(this._lastEvent.objectId === k.id) this.hide();
    }

    public hide(): void
    {
        this._visible = false;

        this.reset();
    }

    private reset(): void
    {
        this._type          = null;
        this._spriteId      = -1;
        this._extras        = null;
        this._text          = null;
        this._isWallItem    = false;
        this._lastEvent     = null;
        this._currentView   = null;
    }

    private showOpeningPresent(): void
    {
        if(!this._lastEvent || (this._lastEvent.objectId < 0)) return;

        this._text = (this._lastEvent.giftMessage || '');

        this._currentView   = 'open_present';
        this._visible       = true;
    }

    private showOpenPresent(): void
    {
        if(!this._lastEvent || (this._lastEvent.objectId < 0)) return;

        this._text = Nitro.instance.localization.getValueWithParameter('widget.furni.present.message_opened', 'product', this._lastEvent.giftMessage);

        if(this.isSpacesFurniture()) this._text = Nitro.instance.localization.getValueWithParameter('widget.furni.present.spaces.message_opened', 'product', this._lastEvent.giftMessage);

        this._currentView   = 'present_opened';
        this._visible       = true;
    }

    private isSpacesFurniture(): boolean
    {
        if(!this._lastEvent || (this._lastEvent.itemType !== ProductTypeEnum.WALL)) return false;

        const furniData = Nitro.instance.sessionDataManager.getWallItemData(this._lastEvent.classId);

        if(!furniData) return false;

        const className = furniData.className;

        return ((className == PresentFurniWidget.FLOOR) || (className == PresentFurniWidget.LANDSCAPE) || (className == PresentFurniWidget.WALLPAPER));
    }

    public handleButton(button: string): void
    {
        if(!button) return;

        switch(button)
        {
            case 'accept':
                this.acceptAndOpenPresent();
                break;
            case 'return':
                break;
            case 'furni_place_in_room':
                this.placeItemInRoom();
                break;
            case 'furni_place_in_inventory':
                this.hide();
                break;
        }
    }

    private acceptAndOpenPresent(): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetPresentOpenMessage(RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT, this._lastEvent.objectId));

        this.hide();
    }

    private placeItemInRoom(): void
    {
        const placedItemType    = (this._lastEvent && this._lastEvent.placedItemType);
        const placedItemId      = (this._lastEvent && this._lastEvent.placedItemId);
        const placedInRoom      = (this._lastEvent && this._lastEvent.placedInRoom);

        if((placedItemId > 0) && !placedInRoom)
        {
            switch(placedItemType)
            {
                case ProductTypeEnum.FLOOR: {
                    const furniture = this._inventoryService.controller.furnitureService.getFurnitureItem(-(placedItemId));

                    if(this.canMoveItem(furniture))
                    {
                        // update unseen
                    }
                    break;
                }
                case ProductTypeEnum.WALL: {
                    const furniture = this._inventoryService.controller.furnitureService.getFurnitureItem(placedItemId);

                    if(this.canMoveItem(furniture))
                    {
                        // update unseen
                    }
                    break;
                }
                case ProductTypeEnum.PET: {
                    // if (this._inventory._Str_6675(this._placedItemId, false))
                    // {
                    //     this._inventory._Str_21312(this._placedItemId);
                    // }
                    break;
                }
            }
        }

        this.hide();
    }

    private canMoveItem(item: IFurnitureItem): boolean
    {
        if(!item) return false;

        let canMove = true;

        if(((item.category == FurniCategory._Str_3683) || (item.category == FurniCategory._Str_3639)) || (item.category == FurniCategory._Str_3432))
        {
            canMove = false;
        }
        else
        {
            canMove = this._inventoryService.controller.furnitureService.startRoomObjectPlacementWithoutRequest(item);
        }

        return canMove;
    }

    public getGiftTitle(): string
    {
        if(this.isAnonymousGift) return 'widget.furni.present.window.title';

        return 'widget.furni.present.window.title_from';
    }

    public get handler(): FurnitureDimmerWidgetHandler
    {
        return (this.widgetHandler as FurnitureDimmerWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get currentView(): string
    {
        return this._currentView;
    }

    public get figure(): string
    {
        return this._lastEvent.purchaserFigure;
    }

    public get senderText(): string
    {
        return this._lastEvent.giftMessage;
    }

    public get senderName(): string
    {
        return this._lastEvent.purchaserName;
    }

    public get type(): string
    {
        return this._type;
    }

    public get spriteId(): number
    {
        return this._spriteId;
    }

    public get extras(): string
    {
        return this._extras;
    }

    public get text(): string
    {
        return this._text;
    }

    public get isWallItem(): boolean
    {
        return this._isWallItem;
    }

    public get isAnonymousGift(): boolean
    {
        return !this.senderName || this.senderName.length == 0;
    }
}
