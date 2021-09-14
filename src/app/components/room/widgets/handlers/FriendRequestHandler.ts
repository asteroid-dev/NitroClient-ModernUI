import { NitroEvent, RoomSessionFriendRequestEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { FriendRequestEvent } from '../../../friendlist/events/FriendRequestEvent';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetFriendRequestUpdateEvent } from '../events/RoomWidgetFriendRequestUpdateEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetFriendRequestMessage } from '../messages/RoomWidgetFriendRequestMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FriendRequestHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;
    private _isDisposed: boolean                    = false;

    public dispose(): void
    {
        this._container     = null;
        this._isDisposed    = true;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message) return null;

        switch(message.type)
        {
            case RoomWidgetFriendRequestMessage.RWFRM_ACCEPT: {
                const widgetMessage = (message as RoomWidgetFriendRequestMessage);

                if(!this._container.friendService) return null;

                this._container.friendService.acceptFriendRequestById(widgetMessage._Str_2951);

                break;
            }
            case RoomWidgetFriendRequestMessage.RWFRM_DECLINE: {
                const widgetMessage = (message as RoomWidgetFriendRequestMessage);

                if(!this._container.friendService) return null;

                this._container.friendService.removeFriendRequestById(widgetMessage._Str_2951);

                break;
            }
        }

        return null;
    }


    public processEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST: {
                const friendRequestEvent = (event as RoomSessionFriendRequestEvent);

                this._container.events.dispatchEvent(new RoomWidgetFriendRequestUpdateEvent(RoomWidgetFriendRequestUpdateEvent.RWFRUE_SHOW_FRIEND_REQUEST, friendRequestEvent.requestId, friendRequestEvent.userId, friendRequestEvent.userName));

                return;
            }
            case FriendRequestEvent.ACCEPTED:
            case FriendRequestEvent.DECLINED: {
                const friendRequestEvent = (event as FriendRequestEvent);

                this._container.events.dispatchEvent(new RoomWidgetFriendRequestUpdateEvent(RoomWidgetFriendRequestUpdateEvent.RWFRUE_HIDE_FRIEND_REQUEST, friendRequestEvent.requestId));

                return;
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
        return RoomWidgetEnum.FRIEND_REQUEST;
    }

    public set container(k: IRoomWidgetManager)
    {
        this._container = k;
    }

    public get messageTypes(): string[]
    {
        return [
            RoomWidgetFriendRequestMessage.RWFRM_ACCEPT,
            RoomWidgetFriendRequestMessage.RWFRM_DECLINE
        ];
    }

    public get eventTypes(): string[]
    {
        return [
            RoomSessionFriendRequestEvent.RSFRE_FRIEND_REQUEST,
            FriendRequestEvent.ACCEPTED,
            FriendRequestEvent.DECLINED
        ];
    }
}
