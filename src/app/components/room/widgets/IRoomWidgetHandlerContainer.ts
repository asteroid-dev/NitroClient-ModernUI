import { IAvatarRenderManager, IConnection, IEventDispatcher, IRoomEngine, IRoomObject, IRoomSession, IRoomSessionManager, ISessionDataManager, NitroRectangle } from '@nitrots/nitro-renderer';
import { RoomWidgetMessage } from './RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from './RoomWidgetUpdateEvent';

export interface IRoomWidgetHandlerContainer
{
    getFirstCanvasId(): number;
    getRoomViewRect(): NitroRectangle;
    checkFurniManipulationRights(roomId: number, objectId: number, category: number): boolean;
    isOwnerOfFurniture(roomObject: IRoomObject): boolean;
    processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent;
    events: IEventDispatcher;
    connection: IConnection;
    roomEngine: IRoomEngine;
    avatarRenderManager: IAvatarRenderManager;
    roomSession: IRoomSession;
    roomSessionManager: IRoomSessionManager;
    sessionDataManager: ISessionDataManager;
}
