import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { RoomWidgetChooserContentEvent } from '../../events/RoomWidgetChooserContentEvent';
import { RoomWidgetRoomObjectUpdateEvent } from '../../events/RoomWidgetRoomObjectUpdateEvent';
import { RoomWidgetRequestWidgetMessage } from '../../messages/RoomWidgetRequestWidgetMessage';
import { ChooserWidgetBaseComponent } from '../base/base.component';

@Component({
    selector: 'nitro-room-chooser-furni',
    templateUrl: '../base/base.template.html'
})
export class ChooserWidgetFurniComponent extends ChooserWidgetBaseComponent
{
    constructor(
        protected _ngZone: NgZone)
    {
        super(_ngZone);

        this._title = 'widget.chooser.furni.title';

        this.onRoomWidgetChooserContentEvent  = this.onRoomWidgetChooserContentEvent.bind(this);
        this.onRoomWidgetRoomObjectUpdateEvent  = this.onRoomWidgetRoomObjectUpdateEvent.bind(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetChooserContentEvent.RWCCE_FURNI_CHOOSER_CONTENT, this.onRoomWidgetChooserContentEvent);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED, this.onRoomWidgetRoomObjectUpdateEvent);
        eventDispatcher.addEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.onRoomWidgetRoomObjectUpdateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher)
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetChooserContentEvent.RWCCE_FURNI_CHOOSER_CONTENT, this.onRoomWidgetChooserContentEvent);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_ADDED, this.onRoomWidgetRoomObjectUpdateEvent);
        eventDispatcher.removeEventListener(RoomWidgetRoomObjectUpdateEvent.FURNI_REMOVED, this.onRoomWidgetRoomObjectUpdateEvent);

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
        if(!event || !this.visible) return;

        this.clearTimeout();

        this._timeout = setTimeout(() =>
        {
            this.messageListener.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER));
        }, 100);
    }

}
