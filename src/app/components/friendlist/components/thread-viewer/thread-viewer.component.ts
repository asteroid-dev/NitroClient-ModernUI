import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FollowFriendComposer, Nitro, RelationshipStatusEnum, SendMessageComposer, SetRelationshipStatusComposer } from '@nitrots/nitro-renderer';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SettingsService } from '../../../../core/settings/service';
import { MessengerChat } from '../../common/MessengerChat';
import { MessengerFriend } from '../../common/MessengerFriend';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-thread-viewer-component]',
    templateUrl: './thread-viewer.template.html'
})

export class FriendListThreadViewerComponent implements OnChanges, OnDestroy, AfterViewInit
{
    @Input()
    public thread: MessengerThread = null;

    @ViewChild("content") content: ElementRef;
    @ViewChildren('messages') messages: QueryList<any>;

    @ViewChild('threadScroller')
    public threadScroller: PerfectScrollbarComponent;

    private _subscription: Subscription = null;

    constructor(
        private _friendListService: FriendListService,
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.thread.previousValue;
        const next = changes.thread.currentValue;

        if(next && (next !== prev)) this.prepareThread();
        else if(!next && (next !== prev)) this.unsubscribe();
    }

    public ngOnDestroy(): void
    {
        this.unsubscribe();
    }

    public ngAfterViewInit(): void
    {
        //this.scrollToBottom();
        this.scrollToBottom2();
        this.messages.changes.subscribe(this.scrollToBottom2);

    }

    scrollToBottom2 = () => {
        try {
          this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
        } catch (err) {}
      }


    private unsubscribe(): void
    {
        if(this._subscription)
        {
            this._subscription.unsubscribe();

            this._subscription = null;
        }
    }

    private prepareThread(): void
    {
        this.unsubscribe();

        this._subscription = this.thread.emitter.asObservable().pipe(delay(1)).subscribe(string =>
        {
            switch(string)
            {
                case MessengerThread.MESSAGE_RECEIVED:
                    this.messageReceived();
                    return;
            }
        });
    }

    private messageReceived(): void
    {
        this.scrollToBottom();
    }

    public sendMessage(message: string): void
    {
        if(!message || !message.length) return;

        this._ngZone.run(() =>
        {
            this.thread.insertChat(Nitro.instance.sessionDataManager.userId, message, 0, null);

            this.thread.setRead();
        });

        Nitro.instance.communication.connection.send(new SendMessageComposer(this.participant.id, message));
    }

    public changeRelation(relation: number): void
    {
        if(!this.participant) return;

        if(RelationshipStatusEnum.RELATIONSHIP_TYPES.indexOf(relation) === -1) return;

        Nitro.instance.communication.connection.send(new SetRelationshipStatusComposer(this.participant.id, relation));
    }

    public followParticipant(): void
    {
        if(!this.participant) return;

        this._settingsService.toggleFriendList();

        Nitro.instance.communication.connection.send(new FollowFriendComposer(this.participant.id));
    }

    public onKeyDownEvent(event: KeyboardEvent): void
    {
        if(!event) return;

        const target = (event.target as HTMLInputElement);

        if(!target) return;

        switch(event.key)
        {
            case 'Enter':
                this.sendMessage(target.value);

                target.value = '';
                return;
        }
    }

    private scrollToBottom(): void
    {
        if(!this.threadScroller) return;

        this.threadScroller.directiveRef.scrollToBottom(0, 200);
    }

    public get participant(): MessengerFriend
    {
        return this.thread.participant;
    }

    public get chats(): MessengerChat[]
    {
        return this.thread.chats;
    }

    public get relations(): string[]
    {
        return RelationshipStatusEnum.RELATIONSHIP_NAMES;
    }
}
