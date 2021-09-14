import { HighScoreDataType, NitroEvent, RoomEngineObjectEvent, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { HighscoreComponent } from '../furniture/highscore/highscore.component';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { IRoomWidgetHandlerContainer } from '../IRoomWidgetHandlerContainer';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureHighScoreWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetHandlerContainer = null;
    private _widget: HighscoreComponent     = null;

    private _cachedRequest: RoomEngineObjectEvent = null;

    private _isDisposed: boolean = false;

    public dispose(): void
    {
        this._isDisposed = true;
        this._container = null;
        this._widget = null;
        this._cachedRequest = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this.disposed) return;

        const objectEvent = (event as RoomEngineObjectEvent);

        switch(event.type)
        {
            case RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY: {
                const roomObject = this._container.roomEngine.getRoomObject(objectEvent.roomId, objectEvent.objectId, objectEvent.category);

                if(roomObject)
                {
                    const stuffData = new HighScoreDataType();

                    stuffData.initializeFromRoomObjectModel(roomObject.model);

                    this._widget.open(objectEvent.objectId, objectEvent.roomId, stuffData);

                    this._cachedRequest = objectEvent;
                }

                return;
            }
            case RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY:
                if((objectEvent.roomId === this._widget.roomId) && (objectEvent.objectId === this._widget.objectId))
                {
                    this._widget.hide();

                    this._cachedRequest = null;
                }
                return;
        }
        return;
    }

    public update(): void
    {
        if(!this._cachedRequest || !this.widget.visible || (this._widget.roomId !== this._cachedRequest.roomId) || (this._widget.objectId !== this._cachedRequest.objectId)) return;

        const point = this._container.roomEngine.getRoomObjectScreenLocation(this._cachedRequest.roomId, this._cachedRequest.objectId, this._cachedRequest.category);

        if(!point) return;

        this._widget.updatePoint(point.x, point.y);
    }

    public get disposed(): boolean
    {
        return this._isDisposed;
    }

    public get type(): string
    {
        return RoomWidgetEnum.HIGH_SCORE_DISPLAY;
    }

    public set container(k: IRoomWidgetHandlerContainer)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomEngineTriggerWidgetEvent.REQUEST_HIGH_SCORE_DISPLAY,
            RoomEngineTriggerWidgetEvent.REQUEST_HIDE_HIGH_SCORE_DISPLAY
        ];
    }

    public get widget(): HighscoreComponent
    {
        return this._widget;
    }

    public set widget(widget: HighscoreComponent)
    {
        this._widget = widget;
    }
}
