import { RoomWidgetMessage } from './RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export interface IRoomWidgetMessageListener
{
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
}
