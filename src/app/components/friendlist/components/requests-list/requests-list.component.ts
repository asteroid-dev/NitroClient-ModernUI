import { Component } from '@angular/core';
import { MessengerRequest } from '../../common/MessengerRequest';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-requests-list-component]',
    templateUrl: './requests-list.template.html'
})
export class FriendListRequestsListComponent
{
    constructor(
        private _friendListService: FriendListService)
    {}

    public acceptRequest(request: MessengerRequest): void
    {
        if(!request) return;

        this._friendListService.acceptFriendRequest(request);
    }

    public declineRequest(request: MessengerRequest): void
    {
        if(!request) return;

        this._friendListService.removeFriendRequest(request);
    }

    public declineAllRequests(): void
    {
        this._friendListService.removeAllFriendRequests();
    }

    public get requests(): Map<number, MessengerRequest>
    {
        return this._friendListService.requests;
    }
}