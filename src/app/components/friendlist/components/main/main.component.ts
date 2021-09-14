import { Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MessengerInitComposer, Nitro } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: 'nitro-friendlist-main-component',
    templateUrl: './main.template.html'
})
export class FriendListMainComponent implements OnInit, OnChanges, OnDestroy
{
    @Input()
    public visible: boolean = false;

    private _friendsVisible: boolean = true;
    private _currentThread: MessengerThread = null;

    constructor(
        private _settingsService: SettingsService,
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {
        this.selectThread = this.selectThread.bind(this);
    }

    public ngOnInit(): void
    {
        this._friendListService.component = this;

        Nitro.instance.communication.connection.send(new MessengerInitComposer());
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.visible.previousValue;
        const next = changes.visible.currentValue;

        if(!next && (next !== prev)) this.selectThread(null);
    }

    public ngOnDestroy(): void
    {
        this._friendListService.component = null;
    }

    public hide(): void
    {
        this._settingsService.hideFriendList();
    }

    public displayFriends(): void
    {
        this._friendsVisible    = true;
        this._currentThread     = null;
    }

    public selectThread(thread: MessengerThread): void
    {
        if(thread)
        {
            this._friendsVisible    = false;
            this._currentThread     = thread;

            thread.setRead();

            return;
        }

        this._friendsVisible    = true;
        this._currentThread     = null;
    }

    public get currentThread(): MessengerThread
    {
        return this._currentThread;
    }

    public get friendsVisible(): boolean
    {
        return (this._friendsVisible && !this._currentThread);
    }

    public get totalFriendRequests(): number
    {
        return this._friendListService.requests.size;
    }
}
