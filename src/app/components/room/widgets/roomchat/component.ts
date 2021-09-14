import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IEventDispatcher, IWorkerEventTracker, Nitro, NitroPoint, RoomEnterEffect } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../ConversionTrackingWidget';
import { RoomWidgetChatUpdateEvent } from '../events/RoomWidgetChatUpdateEvent';
import { RoomWidgetRoomViewUpdateEvent } from '../events/RoomWidgetRoomViewUpdateEvent';
import { ChatWidgetHandler } from '../handlers/ChatWidgetHandler';
import { RoomChatItemComponent } from './chatitem/component';

@Component({
    selector: 'nitro-room-chat-component',
    template: `
    <div #chatView class="nitro-room-chat-component">
        <ng-template #chatContainer></ng-template>
    </div>`
})
export class RoomChatComponent extends ConversionTrackingWidget implements OnInit, OnDestroy, IWorkerEventTracker
{
    private static TIMER_TRACKER: number    = 0;
    private static CHAT_COUNTER: number     = 0;

    @ViewChild('chatView')
    public chatViewReference: ElementRef<HTMLDivElement>;

    @ViewChild('chatContainer', { read: ViewContainerRef })
    public chatContainer: ViewContainerRef;

    public timerId: number = ++RoomChatComponent.TIMER_TRACKER;
    public cameraOffset: NitroPoint  = new NitroPoint();

    public chats: ComponentRef<RoomChatItemComponent>[]         = [];
    public tempChats: ComponentRef<RoomChatItemComponent>[]     = [];
    public pendingChats: RoomWidgetChatUpdateEvent[]            = [];
    public processingChats: boolean                             = false;

    private _skipNextMove: boolean = false;

    constructor(
        private ngZone: NgZone,
        private componentFactoryResolver: ComponentFactoryResolver)
    {
        super();

        this.onChatMessage      = this.onChatMessage.bind(this);
        this.onRoomViewUpdate   = this.onRoomViewUpdate.bind(this);
    }

    public ngOnInit(): void
    {
        Nitro.instance.addWorkerEventTracker(this);

        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.sendWorkerEvent({
                type: 'CREATE_INTERVAL',
                time: 5000,
                timerId: this.timerId,
                response: { type: 'MOVE_CHATS' }
            });
        });
    }

    public ngOnDestroy(): void
    {
        this.ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.sendWorkerEvent({
                type: 'REMOVE_INTERVAL',
                timerId: this.timerId
            });
        });

        Nitro.instance.removeWorkerEventTracker(this);
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onChatMessage);
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.addEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomViewUpdate);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetChatUpdateEvent.RWCUE_EVENT_CHAT, this.onChatMessage);
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SIZE_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.POSITION_CHANGED, this.onRoomViewUpdate);
        eventDispatcher.removeEventListener(RoomWidgetRoomViewUpdateEvent.SCALE_CHANGED, this.onRoomViewUpdate);
    }

    private updateChatViewForDimensions(width: number, height: number): void
    {
        const element = this.chatViewElement;

        if(!element) return;

        const percentage = Nitro.instance.getConfiguration<number>('chat.viewer.height.percentage', 0.40);

        element.style.height = ((height * percentage) + 'px');
    }

    private onChatMessage(k: RoomWidgetChatUpdateEvent): void
    {
        if(!k || RoomEnterEffect.isRunning() && (k.chatType !== RoomWidgetChatUpdateEvent.CHAT_TYPE_WHISPER)) return;

        this.pendingChats.push(k);

        this.processPendingChats();
    }

    private onRoomViewUpdate(event: RoomWidgetRoomViewUpdateEvent): void
    {
        if(event.positionDelta)
        {
            this.cameraOffset.x = (this.cameraOffset.x + event.positionDelta.x);
            this.cameraOffset.y = (this.cameraOffset.y + event.positionDelta.y);

            this.resetAllChatLocations();
        }

        if(event.roomViewRectangle) this.updateChatViewForDimensions(event.roomViewRectangle.width, event.roomViewRectangle.height);
    }

    private processPendingChats(skipCheck: boolean = false): void
    {
        if(!skipCheck)
        {
            if(this.processingChats) return;
        }

        this.processingChats = true;

        const pendingChat = this.pendingChats.shift();

        if(!pendingChat)
        {
            this.processingChats = false;

            return;
        }

        let chatRef: ComponentRef<RoomChatItemComponent>    = null;
        let chat: RoomChatItemComponent                     = null;

        this.ngZone.run(() =>
        {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(RoomChatItemComponent);

            chatRef = this.chatContainer.createComponent(componentFactory);
            chat    = chatRef.instance;

            if(!chat) return;

            chat.id = this.getFreeItemId();
            chat.update(pendingChat);
        });

        this.addChat(chatRef);

        this._skipNextMove = true;
    }

    private getFreeItemId(): string
    {
        return ('chat_item_' + RoomChatComponent.CHAT_COUNTER);
    }

    private addChat(chat: ComponentRef<RoomChatItemComponent>): void
    {
        if(!chat) return;

        const chatInstance = chat.instance;

        chatInstance.senderX = (chatInstance.senderX - this.cameraOffset.x);

        chatInstance.setY(this.chatViewElement.offsetHeight - chatInstance.height);

        this.resetChatItemLocation(chat);
        this.makeRoomForChat(chat);

        this.chats.push(chat);

        chatInstance.ready();

        RoomChatComponent.CHAT_COUNTER++;

        this.processPendingChats(true);
    }

    private hideChat(chat: ComponentRef<RoomChatItemComponent>): void
    {
        if(!chat) return;

        const chatIndex = this.chats.indexOf(chat);

        if(chatIndex >= 0) this.chats.splice(chatIndex, 1);

        const chatContainerIndex = this.chatContainer.indexOf(chat.hostView);

        if(chatContainerIndex >= 0) this.chatContainer.remove(chatContainerIndex);
    }

    private moveChatUp(chat: ComponentRef<RoomChatItemComponent>, nextHeight: number = 0): void
    {
        if(!chat) return;

        const chatInstance = chat.instance;

        let y = chatInstance.height;

        if(nextHeight) y = nextHeight;

        chatInstance.setY((chatInstance.getY() - y));

        if(chatInstance.getY() < (-(chatInstance.height * 2))) this.hideChat(chat);
    }

    private moveAllChatsUp(): void
    {
        if(this._skipNextMove)
        {
            this._skipNextMove = false;

            return;
        }

        let i = (this.chats.length - 1);

        while(i >= 0)
        {
            this.moveChatUp(this.chats[i], 15);

            i--;
        }
    }

    private makeRoomForChat(chat: ComponentRef<RoomChatItemComponent>): void
    {
        if(!chat) return;

        const chatInstance = chat.instance;

        const lastChat          = this.chats[this.chats.length - 1];
        const lastChatInstance  = (lastChat && lastChat.instance);

        if(!lastChatInstance) return;

        const lowestPoint   = ((lastChatInstance.getY() + lastChatInstance.height) - 1);
        const requiredSpace = (chatInstance.height + 1);

        const spaceAvailable = (this.chatViewElement.offsetHeight - lowestPoint);

        if(spaceAvailable < requiredSpace)
        {
            for(const chat of this.chats)
            {
                this.moveChatUp(chat, (requiredSpace - spaceAvailable));
            }
        }
    }

    private resetAllChatLocations(): void
    {
        let i = (this.chats.length - 1);

        while(i >= 0)
        {
            const chat = this.chats[i];

            if(chat) this.resetChatItemLocation(chat);

            i--;
        }
    }

    private resetChatItemLocation(chat: ComponentRef<RoomChatItemComponent>): void
    {
        const chatInstance = chat.instance;

        let x = (chatInstance.senderX + this.cameraOffset.x);

        x = (x - (chatInstance.width / 2));

        chatInstance.setX(x);
    }

    public workerMessageReceived(message: { [index: string]: any }): void
    {
        if(!message) return;

        switch(message.type)
        {
            case 'MOVE_CHATS':
                this.moveAllChatsUp();
                return;
        }
    }

    public get chatViewElement(): HTMLDivElement
    {
        return ((this.chatViewReference && this.chatViewReference.nativeElement) || null);
    }

    public get handler(): ChatWidgetHandler
    {
        return (this.widgetHandler as ChatWidgetHandler);
    }
}
