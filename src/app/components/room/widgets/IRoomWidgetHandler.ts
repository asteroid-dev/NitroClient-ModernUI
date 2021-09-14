import { IDisposable, NitroEvent } from '@nitrots/nitro-renderer';
import { IRoomWidgetHandlerContainer } from './IRoomWidgetHandlerContainer';
import { RoomWidgetMessage } from './RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export interface IRoomWidgetHandler extends IDisposable
{
    update(): void;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
    processEvent(event: NitroEvent): void;
    type: string;
    messageTypes: string[];
    eventTypes: string[];
    container: IRoomWidgetHandlerContainer;
}
