import { FriendParser } from '@nitrots/nitro-renderer';

export class MessengerFriend
{
    private _id: number = -1;
    private _name: string = null;
    private _gender: number = 0;
    private _online: boolean = false;
    private _followingAllowed: boolean = false;
    private _figure: string = null;
    private _categoryId: number = 0;
    private _motto: string = null;
    private _realName: string = null;
    private _lastAccess: string = null;
    private _persistedMessageUser: boolean = false;
    private _vipMember: boolean = false;
    private _pocketHabboUser: boolean = false;
    private _relationshipStatus: number = -1;
    private _unread:number = 0;

    public populate(data: FriendParser): boolean
    {
        if(!data) return false;

        this._id                    = data.id;
        this._name                  = data.name;
        this._gender                = data.gender;
        this._online                = data.online;
        this._followingAllowed      = data.followingAllowed;
        this._figure                = data.figure;
        this._categoryId            = data.categoryId;
        this._motto                 = data.motto;
        this._realName              = data.realName;
        this._lastAccess            = data.lastAccess;
        this._persistedMessageUser  = data.persistedMessageUser;
        this._vipMember             = data.vipMember;
        this._pocketHabboUser       = data.pocketHabboUser;
        this._relationshipStatus    = data.relationshipStatus;

        return true;
    }

    public get id(): number
    {
        return this._id;
    }

    public set id(id: number)
    {
        this._id = id;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(name: string)
    {
        this._name = name;
    }

    public get gender(): number
    {
        return this._gender;
    }

    public set gender(gender: number)
    {
        this._gender = gender;
    }

    public get online(): boolean
    {
        return this._online;
    }

    public set online(flag: boolean)
    {
        this._online = flag;
    }

    public get followingAllowed(): boolean
    {
        return this._followingAllowed;
    }

    public set followingAllowed(flag: boolean)
    {
        this._followingAllowed = flag;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public set figure(figure: string)
    {
        this._figure = figure;
    }

    public get categoryId(): number
    {
        return this._categoryId;
    }

    public set categoryId(id: number)
    {
        this._categoryId = id;
    }

    public get motto(): string
    {
        return this._motto;
    }

    public set motto(motto: string)
    {
        this._motto = motto;
    }

    public get lastAccess(): string
    {
        return this._lastAccess;
    }

    public set lastAccess(lastAccess: string)
    {
        this._lastAccess = lastAccess;
    }

    public get realName(): string
    {
        return this._realName;
    }

    public set realName(name: string)
    {
        this._realName = name;
    }

    public get persistedMessageUser(): boolean
    {
        return this._persistedMessageUser;
    }

    public set persistedMessageUser(flag: boolean)
    {
        this._persistedMessageUser = flag;
    }

    public get vipMember(): boolean
    {
        return this._vipMember;
    }

    public set vipMember(flag: boolean)
    {
        this._vipMember = flag;
    }

    public get pocketHabboUser(): boolean
    {
        return this._pocketHabboUser;
    }

    public set pocketHabboUser(flag: boolean)
    {
        this._pocketHabboUser = flag;
    }

    public get relationshipStatus(): number
    {
        return this._relationshipStatus;
    }

    public set relationshipStatus(status: number)
    {
        this._relationshipStatus = status;
    }

    public get unread(): number
    {
        return this._unread;
    }

    public set unread(unread: number)
    {
        this._unread = unread;
    }
}
