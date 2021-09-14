import { NitroEvent, RoomObjectCategory, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { dynamicSort } from '../choosers/utils/sorting';
import { RoomObjectItem } from '../events/RoomObjectItem';
import { RoomWidgetChooserContentEvent } from '../events/RoomWidgetChooserContentEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetRoomObjectMessage } from '../messages/RoomWidgetRoomObjectMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class UserChooserWidgetHandler implements IRoomWidgetHandler
{
    private _isDisposed: boolean = false;
    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._isDisposed = true;

        this.container = null;
    }

    public processWidgetMessage(k: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!k) return null;

        switch(k.type)
        {
            case RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER:
                this.processUserChooser();
                break;
            case RoomWidgetRoomObjectMessage.SELECT_OBJECT:
                this.selectUnit(k);
                break;
        }

        return null;
    }

    private selectUnit(k: RoomWidgetMessage): void
    {
        const event = k as RoomWidgetRoomObjectMessage;

        if(event == null) return;

        if(event.category == RoomObjectCategory.UNIT)
        {
            this._container.roomEngine.selectRoomObject(this._container.roomSession.roomId, event.id, event.category);
        }
    }

    private processUserChooser(): void
    {

        if(this._container == null || this._container.roomSession == null || this._container.roomEngine == null || this._container.roomSession.userDataManager == null) return;

        const roomId = this._container.roomSession.roomId;
        const categoryId = RoomObjectCategory.UNIT;
        const units = [];
        const unitObjectsCounts = this._container.roomEngine.getRoomObjectCount(roomId, categoryId);

        for(let index = 0; index < unitObjectsCounts; index++)
        {
            const unitObject = this._container.roomEngine.getRoomObjectByIndex(roomId, index, categoryId);

            if(unitObject == null) continue;

            const unitData = this._container.roomSession.userDataManager.getUserDataByIndex(unitObject.id);

            if(unitData == null) continue;

            units.push(new RoomObjectItem(unitData.roomIndex, categoryId, unitData.name));
        }

        units.sort(dynamicSort('name'));
        this._container.events.dispatchEvent(new RoomWidgetChooserContentEvent(RoomWidgetChooserContentEvent.RWCCE_USER_CHOOSER_CONTENT, units));
    }

    public processEvent(event: NitroEvent): void
    {

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
        return RoomWidgetEnum.USER_CHOOSER;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER,
            RoomWidgetRoomObjectMessage.SELECT_OBJECT];
    }

    public get eventTypes(): string[]
    {
        return [];
    }
}
