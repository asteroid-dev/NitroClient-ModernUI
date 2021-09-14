import { NitroEvent, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { MannequinWidget } from '../furniture/mannequin/mannequin.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureMannequinWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetManager = null;
    private _widget: MannequinWidget;

    public dispose():void
    {
        this._isDisposed    = true;
        this._container     = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN: {
                const roomObjectEvent   = (event as RoomEngineObjectEvent);
                const roomObject        = this._container.roomEngine.getRoomObject(roomObjectEvent.roomId, roomObjectEvent.objectId, roomObjectEvent.category);

                if(!roomObject) return;

                const model = roomObject.model;

                const figure    = model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_FIGURE);
                const gender    = model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_GENDER);
                const name      = model.getValue<string>(RoomObjectVariable.FURNITURE_MANNEQUIN_NAME);

                if(figure && gender) this._widget.open(roomObject.id,figure, gender, name);

                return;
            }
        }
    }

    public update():void
    {
    }


    public get widget(): MannequinWidget
    {
        return this._widget;
    }

    public set widget(widget: MannequinWidget)
    {
        this._widget = widget;
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.MANNEQUIN;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [ RoomEngineTriggerWidgetEvent.REQUEST_MANNEQUIN ];
    }
}
