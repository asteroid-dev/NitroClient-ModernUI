import { IFurnitureData, IGetImageListener, Nitro, NitroEvent, NitroTexture, RoomObjectCategory, RoomObjectVariable, RoomSessionPresentEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { ProductTypeEnum } from '../../../catalog/enums/ProductTypeEnum';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetPresentDataUpdateEvent } from '../events/RoomWidgetPresentDataUpdateEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetPresentOpenMessage } from '../messages/RoomWidgetPresentOpenMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurniturePresentWidgetHandler implements IRoomWidgetHandler, IGetImageListener
{
    private static readonly FLOOR: string       = 'floor';
    private static readonly WALLPAPER: string   = 'wallpaper';
    private static readonly LANDSCAPE: string   = 'landscape';
    private static readonly POSTER: string      = 'poster';

    private _name: string                           = null;
    private _objectId: number                       = -1;
    private _isDisposed: boolean                    = false;
    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._name          = null;
        this._objectId      = -1;
        this._container     = null;
        this._isDisposed    = true;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT: {
                const widgetMessage = (message as RoomWidgetFurniToWidgetMessage);

                const roomObject = this._container.roomEngine.getRoomObject(widgetMessage.roomId, widgetMessage.objectId, widgetMessage.category);

                if(!roomObject) return null;

                this._objectId = widgetMessage.objectId;

                const giftMessage       = (roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_DATA) || '');
                const purchaserName     = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_PURCHASER_NAME);
                const purchaserFigure   = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_PURCHASER_FIGURE);
                const typeId            = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_TYPE_ID);
                const extras            = roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_EXTRAS);

                this._container.events.dispatchEvent(new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_PACKAGEINFO, widgetMessage.objectId, giftMessage, this._container.isOwnerOfFurniture(roomObject), extras, purchaserName, purchaserFigure));

                break;
            }
            case RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT: {
                const openMessage = (message as RoomWidgetPresentOpenMessage);

                if(openMessage.objectId !== this._objectId) return null;

                if(this._container)
                {
                    this._container.roomSession.openGift(openMessage.objectId);
                    this._container.roomEngine.changeObjectModelData(this._container.roomEngine.activeRoomId, openMessage.objectId, RoomObjectCategory.FLOOR, RoomObjectVariable.FURNITURE_DISABLE_PICKING_ANIMATION, 1);
                }

                break;
            }
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || !this._container || !this._container.events) return;

        switch(event.type)
        {
            case RoomSessionPresentEvent.RSPE_PRESENT_OPENED: {
                const presentEvent = (event as RoomSessionPresentEvent);

                let furniData: IFurnitureData = null;

                if(presentEvent.itemType === ProductTypeEnum.FLOOR)
                {
                    furniData = this._container.sessionDataManager.getFloorItemData(presentEvent.classId);
                }
                else if(presentEvent.itemType === ProductTypeEnum.WALL)
                {
                    furniData = this._container.sessionDataManager.getWallItemData(presentEvent.classId);
                }

                let isOwnerOfFurni = false;

                if(presentEvent.placedInRoom)
                {
                    const roomObject = this._container.roomEngine.getRoomObject(this._container.roomSession.roomId, presentEvent.placedItemId, RoomObjectCategory.FLOOR);

                    if(roomObject) isOwnerOfFurni = this._container.isOwnerOfFurniture(roomObject);
                }

                let dataUpdateEvent: RoomWidgetPresentDataUpdateEvent = null;

                switch(presentEvent.itemType)
                {
                    case ProductTypeEnum.WALL: {
                        if(furniData)
                        {
                            switch(furniData.className)
                            {
                                case FurniturePresentWidgetHandler.LANDSCAPE:
                                    dataUpdateEvent = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_LANDSCAPE, 0, Nitro.instance.localization.getValue('inventory.furni.item.landscape.name'), isOwnerOfFurni);
                                    break;
                                case FurniturePresentWidgetHandler.WALLPAPER:
                                    dataUpdateEvent = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_WALLPAPER, 0, Nitro.instance.localization.getValue('inventory.furni.item.wallpaper.name'), isOwnerOfFurni);
                                    break;
                                case FurniturePresentWidgetHandler.POSTER: {
                                    const productCode = presentEvent.productCode;

                                    let extras: string = null;

                                    if(productCode.indexOf('poster') === 0) extras = productCode.replace('poster', '');

                                    const productData = this._container.sessionDataManager.getProductData(productCode);

                                    let name = '';

                                    if(productData) name = productData.name;
                                    else if(furniData) name = furniData.name;

                                    dataUpdateEvent = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, 0, name, isOwnerOfFurni, extras);

                                    break;
                                }
                                default: {
                                    dataUpdateEvent = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS, 0, ( furniData.name || ''), isOwnerOfFurni);
                                    break;
                                }
                            }
                        }

                        break;
                    }
                    case ProductTypeEnum.HABBO_CLUB:
                        dataUpdateEvent = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS_CLUB, 0, Nitro.instance.localization.getValue('widget.furni.present.hc'), false);
                        break;
                    default: {
                        if(presentEvent.placedItemType == ProductTypeEnum.PET)
                        {
                            // const petfigureString = presentEvent.petFigureString;

                            // if(petfigureString && petfigureString.trim().length > 0)
                            // {
                            //     const petFigureData = new PetFigureData(petfigureString);

                            //     const scale = 64;

                            //     const petImage = this._container.roomEngine.getRoomObjectPetImage(petFigureData.typeId, petFigureData.paletteId, petFigureData.color, new Vector3d(90), scale, this, true, 0, petFigureData.customParts);

                            //     if(petImage) furnitureIcon = petImage;
                            // }
                        }

                        const floorData = this._container.sessionDataManager.getFloorItemData(presentEvent.classId);

                        let name = '';

                        if(floorData) name = floorData.name;
                        else if(furniData) name = furniData.name;

                        dataUpdateEvent = new RoomWidgetPresentDataUpdateEvent(RoomWidgetPresentDataUpdateEvent.RWPDUE_CONTENTS,0, name, isOwnerOfFurni);

                        break;
                    }
                }

                if(dataUpdateEvent)
                {
                    dataUpdateEvent.classId         = presentEvent.classId;
                    dataUpdateEvent.itemType        = presentEvent.itemType;
                    dataUpdateEvent.placedItemId    = presentEvent.placedItemId;
                    dataUpdateEvent.placedInRoom    = presentEvent.placedInRoom;
                    dataUpdateEvent.placedItemType  = presentEvent.placedItemType;

                    this._container.events.dispatchEvent(dataUpdateEvent);
                }

                break;
            }
        }
    }

    public update(): void
    {
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_PRESENT_WIDGET;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFurniToWidgetMessage.REQUEST_PRESENT,
            RoomWidgetPresentOpenMessage.RWPOM_OPEN_PRESENT
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionPresentEvent.RSPE_PRESENT_OPENED
        ];
    }

    imageFailed(id: number): void
    {
    }

    imageReady(id: number, texture: NitroTexture, image?: HTMLImageElement): void
    {
    }
}
