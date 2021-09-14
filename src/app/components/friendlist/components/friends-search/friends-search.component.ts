import { Component } from '@angular/core';
import { HabboSearchComposer, HabboSearchResultData, Nitro, RemoveFriendComposer, UserProfileComposer } from '@nitrots/nitro-renderer';
import { FriendListService } from '../../services/friendlist.service';

@Component({
    selector: '[nitro-friendlist-search-component]',
    templateUrl: './friends-search.template.html'
})
export class FriendListSearchComponent
{
  private _searchQuery: string;

  public friendsCollapsed: boolean = true;
  public othersCollapsed: boolean = true;

  constructor(private _friendListService: FriendListService)
  {}

  public searchAvatar(): void
  {
      if(this.searchQuery.trim().length === 0) return;

      Nitro.instance.communication.connection.send(new HabboSearchComposer(this.searchQuery));
  }

  public removeFriend(data: HabboSearchResultData): void
  {
      if(!data) return;

      Nitro.instance.communication.connection.send(new RemoveFriendComposer(data.avatarId));

      this._friendListService.friends.delete(data.avatarId);
  }

  public openProfile(data: HabboSearchResultData): void
  {
      if(!data) return;

      Nitro.instance.communication.connection.send(new UserProfileComposer(data.avatarId));
  }

  public sendFriendRequest(data: HabboSearchResultData): void
  {
      this._friendListService.avatarSearchResults.setFriendRequestSent(data.avatarId);

      this._friendListService.sendFriendRequest(data.avatarId, data.avatarName);
  }

  public isFriendRequestAllowed(id: number): boolean
  {
      return !this._friendListService.avatarSearchResults.isRequestFriend(id);
  }

  public get searchQuery(): string
  {
      return this._searchQuery;
  }

  public set searchQuery(query: string)
  {
      this._searchQuery = query;
  }

  public get friends(): HabboSearchResultData[]
  {
      return this._friendListService.avatarSearchResults.friends;
  }

  public get others(): HabboSearchResultData[]
  {
      return this._friendListService.avatarSearchResults.others;
  }
}
