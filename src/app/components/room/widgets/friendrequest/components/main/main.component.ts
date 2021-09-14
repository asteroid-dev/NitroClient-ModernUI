import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { IEventDispatcher, Nitro, RoomObjectType } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../../ConversionTrackingWidget';
import { RoomWidgetFriendRequestUpdateEvent } from '../../../events/RoomWidgetFriendRequestUpdateEvent';
import { RoomWidgetUserLocationUpdateEvent } from '../../../events/RoomWidgetUserLocationUpdateEvent';
import { FriendRequestHandler } from '../../../handlers/FriendRequestHandler';
import { RoomWidgetFriendRequestMessage } from '../../../messages/RoomWidgetFriendRequestMessage';
import { RoomWidgetGetObjectLocationMessage } from '../../../messages/RoomWidgetGetObjectLocationMessage';
import { FriendRequestDialogComponent } from '../dialog/dialog.component';

@Component({
    selector: 'nitro-room-friendrequest-component',
    templateUrl: './main.template.html'
})
export class FriendRequestMainComponent extends ConversionTrackingWidget implements OnDestroy
{
    @ViewChild('contextsContainer', { read: ViewContainerRef })
    public contextsContainer: ViewContainerRef;

    public cachedFriendRequestDialogs: Map<FriendRequestDialogComponent, ComponentRef<FriendRequestDialogComponent>> = new Map();

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone
    )
    {
        super();

        this.onRoomWidgetFriendRequestUpdateEvent = this.onRoomWidgetFriendRequestUpdateEvent.bind(this);
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.ticker.remove(this.update, this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetFriendRequestUpdateEvent.RWFRUE_SHOW_FRIEND_REQUEST, this.onRoomWidgetFriendRequestUpdateEvent);
        eventDispatcher.addEventListener(RoomWidgetFriendRequestUpdateEvent.RWFRUE_HIDE_FRIEND_REQUEST, this.onRoomWidgetFriendRequestUpdateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher:IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetFriendRequestUpdateEvent.RWFRUE_SHOW_FRIEND_REQUEST, this.onRoomWidgetFriendRequestUpdateEvent);
        eventDispatcher.removeEventListener(RoomWidgetFriendRequestUpdateEvent.RWFRUE_HIDE_FRIEND_REQUEST, this.onRoomWidgetFriendRequestUpdateEvent);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    private onRoomWidgetFriendRequestUpdateEvent(event: RoomWidgetFriendRequestUpdateEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case RoomWidgetFriendRequestUpdateEvent.RWFRUE_SHOW_FRIEND_REQUEST:
                this.createFriendRequest(event.requestId, event.userId, event.userName);
                break;
            case RoomWidgetFriendRequestUpdateEvent.RWFRUE_HIDE_FRIEND_REQUEST:
                this.removeFriendRequest(event.requestId);
                break;
        }

        this.toggleUpdateReceiver();
    }

    private createFriendRequest(requestId: number, userId: number, userName: string): void
    {
        const component = this.createView(FriendRequestDialogComponent);

        if(!component) return;

        component.instance.requestId = requestId;
        component.instance.userId = userId;
        component.instance.userName = userName;

        this.cachedFriendRequestDialogs.set(component.instance, component);
    }

    public removeFriendRequest(requestId: number)
    {
        for(const view of this.cachedFriendRequestDialogs.values())
        {
            if(!view) continue;

            const viewInstance = view.instance;

            if(!viewInstance || (viewInstance.requestId !== requestId)) continue;

            this.removeView(view);

            return;
        }
    }

    public toggleUpdateReceiver(): void
    {
        if(this.cachedFriendRequestDialogs && this.cachedFriendRequestDialogs.size)
        {
            Nitro.instance.ticker.add(this.update, this);
        }
        else
        {
            Nitro.instance.ticker.remove(this.update, this);
        }
    }

    private createView<T extends FriendRequestDialogComponent>(component: Type<T>): ComponentRef<T>
    {
        if(!component) return null;

        let viewRef: ComponentRef<T>    = null;
        let view: T                     = null;

        this._ngZone.run(() =>
        {
            const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);

            viewRef = this.contextsContainer.createComponent(componentFactory);
            view    = viewRef.instance;
        });

        if(!view || !viewRef) return null;

        view.parent = this;

        return viewRef;
    }

    private removeView(view: ComponentRef<FriendRequestDialogComponent>): void
    {
        if(!view) return;

        const componentIndex = this.contextsContainer.indexOf(view.hostView);

        if(componentIndex === -1) return;

        this.cachedFriendRequestDialogs.delete(view.instance);

        this.toggleUpdateReceiver();

        this._ngZone.run(() => this.contextsContainer.remove(componentIndex));
    }

    public update(time: number): void
    {
        for(const view of this.cachedFriendRequestDialogs.values())
        {
            if(!view) continue;

            const viewInstance = view.instance;

            const message = (this.messageListener.processWidgetMessage(new RoomWidgetGetObjectLocationMessage(RoomWidgetGetObjectLocationMessage.RWGOI_MESSAGE_GET_OBJECT_LOCATION, viewInstance.userId, RoomObjectType.USER)) as RoomWidgetUserLocationUpdateEvent);

            if(message) viewInstance.update(message.rectangle, message._Str_9337);
        }
    }

    public acceptFriendRequest(requestId: number): void
    {
        if(!this.messageListener) return;

        this.messageListener.processWidgetMessage(new RoomWidgetFriendRequestMessage(RoomWidgetFriendRequestMessage.RWFRM_ACCEPT, requestId));

        this.removeFriendRequest(requestId);
    }

    public declineFriendRequest(requestId: number): void
    {
        if(!this.messageListener) return;

        this.messageListener.processWidgetMessage(new RoomWidgetFriendRequestMessage(RoomWidgetFriendRequestMessage.RWFRM_DECLINE, requestId));

        this.removeFriendRequest(requestId);
    }

    public get handler(): FriendRequestHandler
    {
        return (this.widgetHandler as FriendRequestHandler);
    }
}
