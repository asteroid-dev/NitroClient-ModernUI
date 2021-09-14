import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomWidgetDoorbellEvent } from '../../events/RoomWidgetDoorbellEvent';
import { RoomWidgetLetUserInMessage } from '../../messages/RoomWidgetLetUserInMessage';

@Component({
    selector: 'nitro-room-doorbell-component',
    templateUrl: './doorbell.template.html'
})
export class DoorbellWidgetComponent extends ConversionTrackingWidget
{
    private _visible: boolean   = false;
    private _users: string[]    = [];

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onRoomRinging              = this.onRoomRinging.bind(this);
        this.onRoomAcceptedAndRejected  = this.onRoomAcceptedAndRejected.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetDoorbellEvent.RWDE_RINGING, this.onRoomRinging);
        eventDispatcher.addEventListener(RoomWidgetDoorbellEvent.REJECTED, this.onRoomAcceptedAndRejected);
        eventDispatcher.addEventListener(RoomWidgetDoorbellEvent.RWDE_ACCEPTED, this.onRoomAcceptedAndRejected);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetDoorbellEvent.RWDE_RINGING, this.onRoomRinging);
        eventDispatcher.removeEventListener(RoomWidgetDoorbellEvent.REJECTED, this.onRoomAcceptedAndRejected);
        eventDispatcher.removeEventListener(RoomWidgetDoorbellEvent.RWDE_ACCEPTED, this.onRoomAcceptedAndRejected);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomRinging(event: RoomWidgetDoorbellEvent): void
    {
        if(!event) return;

        this._ngZone.run(() => this.addUser(event.userName));
    }

    private onRoomAcceptedAndRejected(event: RoomWidgetDoorbellEvent): void
    {
        if(!event) return;

        this._ngZone.run(() => this.removeUser(event.userName));
    }

    private addUser(user: string): void
    {
        if(this._users.indexOf(user) >= 0) return;

        if(this._users.length >= 50)
        {
            this.deny(user);

            return;
        }

        this._visible = true;

        this._users.push(user);
    }

    private removeUser(user: string): void
    {
        const index = this._users.indexOf(user);

        if(index === -1) return;

        this._users.splice(index, 1);

        if(!this._users.length) this._visible = false;
    }

    public deny(user: string): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetLetUserInMessage(user, false));

        this.removeUser(user);
    }

    public accept(user: string): void
    {
        this.messageListener.processWidgetMessage(new RoomWidgetLetUserInMessage(user, true));

        this.removeUser(user);
    }

    public hide(): void
    {
        this._visible = false;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public get users(): string[]
    {
        return this._users;
    }
}
