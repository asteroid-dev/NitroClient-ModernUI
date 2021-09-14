import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { RoomWidgetChooserContentEvent } from '../../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRequestWidgetMessage } from '../../messages/RoomWidgetRequestWidgetMessage';
import { ChooserWidgetBaseComponent } from '../base/base.component';

@Component({
    selector: 'nitro-room-chooser-user',
    templateUrl: '../base/base.template.html'
})
export class ChooserWidgetUserComponent extends ChooserWidgetBaseComponent
{
    constructor(
        protected _ngZone: NgZone)
    {
        super(_ngZone);

        this.title = 'widget.chooser.user.title';

        this.onRoomWidgetChooserContentEvent    = this.onRoomWidgetChooserContentEvent.bind(this);
        this.onRoomWidgetRoomObjectUpdateEvent  = this.onRoomWidgetRoomObjectUpdateEvent.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(eventDispatcher == null) return;

        eventDispatcher.addEventListener(RoomWidgetChooserContentEvent.RWCCE_USER_CHOOSER_CONTENT, this.onRoomWidgetChooserContentEvent);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.onRoomWidgetRoomObjectUpdateEvent.bind(this));
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, this.onRoomWidgetRoomObjectUpdateEvent.bind(this));

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(eventDispatcher == null) return;

        eventDispatcher.removeEventListener(RoomWidgetChooserContentEvent.RWCCE_USER_CHOOSER_CONTENT, this.onRoomWidgetChooserContentEvent);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_REMOVED, this.onRoomWidgetRoomObjectUpdateEvent.bind(this));
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.USER_ADDED, this.onRoomWidgetRoomObjectUpdateEvent.bind(this));

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomWidgetChooserContentEvent(event: RoomWidgetChooserContentEvent): void
    {
        if(!event) return;

        this._ngZone.run(() =>
        {
            this._items = event.items;

            this.visible = true;
        });
    }

    private onRoomWidgetRoomObjectUpdateEvent(event: RoomWidgetRoomObjectUpdateEvent): void
    {
        if(!this.visible) return;

        this.clearTimeout();

        this._timeout = setTimeout(() =>
        {
            this.messageListener.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER));
        }, 100);
    }
}
