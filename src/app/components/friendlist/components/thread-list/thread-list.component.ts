import { Component, Input, NgZone } from '@angular/core';
import { MessengerThread } from '../../common/MessengerThread';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-thread-list-component]',
    templateUrl: './thread-list.template.html'
})
export class FriendListThreadListComponent
{
    public static THREAD_SELECTED: string = 'FLTLC_THREAD_SELECTED';

    @Input()
    public currentThread: MessengerThread = null;

    @Input()
    public threadSelector: (thread: MessengerThread) => void = null;

    constructor(
        private _friendListService: FriendListService,
        private _ngZone: NgZone)
    {}

    public selectThread(thread: MessengerThread): void
    {
        if(!thread) return;

        if(this.threadSelector) this.threadSelector(thread);
    }

    public get threads(): MessengerThread[]
    {
        const threads = Array.from(this._friendListService.threads.values());

        threads.sort((a, b) =>
        {
            return (<any> b.lastUpdated - <any> a.lastUpdated);
        });

        return threads;
    }
}