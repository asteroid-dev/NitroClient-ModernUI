import { HabboSearchResultData } from '@nitrots/nitro-renderer';

export class AvatarSearchResults
{
  private _friends: HabboSearchResultData[];
  private _others: HabboSearchResultData[];
  private _sentRequests: Map<number, boolean>;

  constructor()
  {
      this._sentRequests = new Map<number, boolean>();
  }

  public getResult(id: number): HabboSearchResultData
  {
      for(const friend of this._friends)
      {
          if(friend.avatarId === id) return friend;
      }

      for(const other of this._others)
      {
          if(other.avatarId === id) return other;
      }

      return null;
  }

  public searchReceived(friends: HabboSearchResultData[], others: HabboSearchResultData[]): void
  {
      this._friends = friends;
      this._others = others;
  }

  public setFriendRequestSent(id: number): void
  {
      this._sentRequests[id] = true;
  }

  public isRequestFriend(id: number): boolean
  {
      return this._sentRequests[id];
  }

  public get friends(): HabboSearchResultData[]
  {
      return this._friends;
  }

  public get others(): HabboSearchResultData[]
  {
      return this._others;
  }
}
