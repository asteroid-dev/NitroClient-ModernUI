import { FurnitureExchangeComposer, NitroEvent, RoomObjectVariable, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomWidgetCreditFurniUpdateEvent } from '../events/RoomWidgetCreditFurniUpdateEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetCreditFurniRedeemMessage } from '../messages/RoomWidgetCreditFurniRedeemMessage';
import { RoomWidgetFurniToWidgetMessage } from '../messages/RoomWidgetFurniToWidgetMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class FurnitureCreditWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager = null;

    public dispose(): void
    {
        this._container = null;
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || !this.container) return null;

        switch(message.type)
        {
            case RoomWidgetFurniToWidgetMessage.REQUEST_CREDITFURNI: {
                const creditMessage = (message as RoomWidgetFurniToWidgetMessage);

                const roomObject = this._container.roomEngine.getRoomObject(creditMessage.roomId, creditMessage.objectId, creditMessage.category);

                if(roomObject && this._container.isOwnerOfFurniture(roomObject))
                {
                    const value = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_CREDIT_VALUE);

                    this._container.events.dispatchEvent(
                        new RoomWidgetCreditFurniUpdateEvent(RoomWidgetCreditFurniUpdateEvent.RWCFUE_CREDIT_FURNI_UPDATE,
                            roomObject.model.getValue<string>(RoomObjectVariable.FURNITURE_TYPE_ID) + '_' + creditMessage.type + '_' + creditMessage.objectId,
                            creditMessage.objectId,
                            value));
                }
                break;
            }
            case RoomWidgetCreditFurniRedeemMessage.RWFCRM_REDEEM: {
                const creditMessage = (message as RoomWidgetFurniToWidgetMessage);

                if(this.container.roomSession)
                {
                    this.container.roomSession.connection.send(new FurnitureExchangeComposer(creditMessage.objectId));
                }
                break;
            }
        }

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
        return !!this._container;
    }

    public get type(): string
    {
        return RoomWidgetEnum.FURNI_CREDIT_WIDGET;
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        this._container = container;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetFurniToWidgetMessage.REQUEST_CREDITFURNI, RoomWidgetCreditFurniRedeemMessage.RWFCRM_REDEEM ];
    }

    public get eventTypes(): string[]
    {
        return [ ];
    }
}
