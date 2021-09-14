import { IFurnitureData, IRoomObject, NitroEvent, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { FurnitureContextMenuWidget } from '../furniture/context-menu/components/main/main.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetUseProductMessage } from '../messages/RoomWidgetUseProductMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureContextMenuWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;
    private _isDisposed: boolean                    = false;
    private _widget: FurnitureContextMenuWidget;

    constructor()
    {
        this.handleMonsterSeedPlant         = this.handleMonsterSeedPlant.bind(this);
        this.handlePurchasableClothing      = this.handlePurchasableClothing.bind(this);
        this.handleMysterybox               = this.handleMysterybox.bind(this);
        this.handleEffectBox                = this.handleEffectBox.bind(this);
        this.handleMysteryTrophy            = this.handleMysteryTrophy.bind(this);
    }

    public dispose(): void
    {
        this._container     = null;
        this._isDisposed    = true;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        return;
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
        return RoomWidgetEnum.FURNI_STICKIE_WIDGET;
    }

    public set container(container: IRoomWidgetManager)
    {
        if(this._container)
        {
            if(this._container.sessionDataManager && this._container.sessionDataManager.events)
            {
                this._container.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MONSTERPLANT_SEED_PLANT_CONFIRMATION_DIALOG, this.handleMonsterSeedPlant);
                this._container.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_PURCHASABLE_CLOTHING_CONFIRMATION_DIALOG, this.handlePurchasableClothing);
                this._container.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MYSTERYBOX_OPEN_DIALOG, this.handleMysterybox);
                this._container.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_EFFECTBOX_OPEN_DIALOG, this.handleEffectBox);
                this._container.roomEngine.events.removeEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MYSTERYTROPHY_OPEN_DIALOG, this.handleMysteryTrophy);
            }
        }

        this._container = container;

        if(!container) return;

        if(this._container.sessionDataManager && this._container.sessionDataManager.events)
        {
            this._container.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MONSTERPLANT_SEED_PLANT_CONFIRMATION_DIALOG, this.handleMonsterSeedPlant);
            this._container.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_PURCHASABLE_CLOTHING_CONFIRMATION_DIALOG, this.handlePurchasableClothing);
            this._container.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MYSTERYBOX_OPEN_DIALOG, this.handleMysterybox);
            this._container.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_EFFECTBOX_OPEN_DIALOG, this.handleEffectBox);
            this._container.roomEngine.events.addEventListener(RoomEngineTriggerWidgetEvent.REQUEST_MYSTERYTROPHY_OPEN_DIALOG, this.handleMysteryTrophy);
        }
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    private getRoomObject(objectId: number): IRoomObject
    {
        if(!this._container) return null;

        return this._container.roomEngine.getRoomObject(this._container.roomSession.roomId, objectId, RoomObjectCategory.FLOOR);
    }

    public getFurniData(roomObject: IRoomObject): IFurnitureData
    {
        if(!roomObject) return null;

        const local3 = Number.parseInt(<string>roomObject.model.getValue(RoomObjectVariable.FURNITURE_TYPE_ID));
        const local2 = this._container.sessionDataManager.getFloorItemData(local3);

        return local2;
    }

    private  handlePurchasableClothing(k:RoomEngineObjectEvent):void
    {
        if(!this._widget) return;

        const roomObject = this.getRoomObject(k.objectId);
        if(!roomObject) return;

        if(!this._container.isOwnerOfFurniture(roomObject)) return;

        this._widget._Str_24748(roomObject);
    }

    private  handleMonsterSeedPlant(k:RoomEngineObjectEvent):void
    {
    // var _local_2:IRoomObject;
    // var _local_3:Boolean;
    // if (this._widget != null)
    // {
    //     _local_2 = this.getRoomObject(k._Str_1577);
    //     if (_local_2 != null)
    //     {
    //         _local_3 = this._container.isOwnerOfFurniture(_local_2);
    //         if (!_local_3)
    //         {
    //             return;
    //         }
    //         this._widget._Str_20801(_local_2);
    //     }
    // }
    }

    private  handleMysterybox(k:RoomEngineObjectEvent):void
    {
    // var _local_2:IRoomObject;
    // if (this._widget != null)
    // {
    //     _local_2 = this.getRoomObject(k._Str_1577);
    //     if (_local_2 != null)
    //     {
    //         this._widget._Str_20629(_local_2);
    //     }
    // }
    }


    private  handleEffectBox(k:RoomEngineObjectEvent):void
    {
    // var _local_2:IRoomObject;
    // var _local_3:Boolean;
    // if (this._widget != null)
    // {
    //     _local_2 = this.getRoomObject(k._Str_1577);
    //     if (_local_2 != null)
    //     {
    //         _local_3 = this._container.isOwnerOfFurniture(_local_2);
    //         if (!_local_3)
    //         {
    //             return;
    //         }
    //         this._widget._Str_22510(_local_2);
    //     }
    // }
    }

    private  handleMysteryTrophy(k:RoomEngineObjectEvent):void
    {
    // var _local_2:IRoomObject;
    // var _local_3:Boolean;
    // if (this._widget != null)
    // {
    //     _local_2 = this.getRoomObject(k._Str_1577);
    //     if (_local_2 != null)
    //     {
    //         _local_3 = this._container.isOwnerOfFurniture(_local_2);
    //         if (!_local_3)
    //         {
    //             return;
    //         }
    //         this._widget._Str_25152(_local_2);
    //     }
    // }
    }

    public get widget(): FurnitureContextMenuWidget
    {
        return this._widget;
    }

    public set widget(k: FurnitureContextMenuWidget)
    {
        this._widget = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetUseProductMessage.MONSTERPLANT_SEED
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomEngineTriggerWidgetEvent.OPEN_FURNI_CONTEXT_MENU,
            RoomEngineTriggerWidgetEvent.CLOSE_FURNI_CONTEXT_MENU
        ];
    }
}
