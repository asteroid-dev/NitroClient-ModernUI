import { RoomWidgetRentableBotInfostandUpdateEvent } from '../../events/RoomWidgetRentableBotInfostandUpdateEvent';

export class InfoStandRentableBotData
{
    private _id: number = 0;
    private _name: string = '';
    private _figure: string = '';
    private _motto: string = '';
    private _badges: string[] = [];
    private _carryItem: number = 0;
    private _roomIndex: number = -1;
    private _ownerId: number = -1;
    private _ownerName: string = '';
    private _amIOwner: boolean = false;
    private _amIAnyRoomController: boolean = false;
    private _botSkills: number[] = [];

    public get id(): number
    {
        return this._id;
    }

    public set id(k: number)
    {
        this._id = k;
    }

    public get name(): string
    {
        return this._name;
    }

    public set name(k: string)
    {
        this._name = k;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public set figure(figure: string)
    {
        this._figure = figure;
    }

    public get motto(): string
    {
        return this._motto;
    }

    public set motto(motto: string)
    {
        this._motto = motto;
    }

    public get badges(): string[]
    {
        return this._badges.slice();
    }

    public set badges(k: string[])
    {
        this._badges = k;
    }

    public get carryItem(): number
    {
        return this._carryItem;
    }

    public set carryItem(k: number)
    {
        this._carryItem = k;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public set roomIndex(k: number)
    {
        this._roomIndex = k;
    }

    public get ownerId(): number
    {
        return this._ownerId;
    }

    public set ownerId(id: number)
    {
        this._ownerId = id;
    }

    public get ownerName(): string
    {
        return this._ownerName;
    }

    public set ownerName(name: string)
    {
        this._ownerName = name;
    }

    public get amIOwner(): boolean
    {
        return this._amIOwner;
    }

    public set amIOwner(k: boolean)
    {
        this._amIOwner = k;
    }

    public get amIAnyRoomController(): boolean
    {
        return this._amIAnyRoomController;
    }

    public set amIAnyRoomController(k: boolean)
    {
        this._amIAnyRoomController = k;
    }

    public get botSkills(): number[]
    {
        return this._botSkills.slice();
    }

    public set botSkills(k: number[])
    {
        this._botSkills = k;
    }

    public populate(event: RoomWidgetRentableBotInfostandUpdateEvent): void
    {
        this.id                     = event.id;
        this.name                   = event.name;
        this.figure                 = event.figure;
        this.motto                  = event.motto;
        this.badges                 = event.badges;
        this.carryItem              = event.carryId;
        this.roomIndex              = event.roomIndex;
        this.ownerId                = event.ownerId;
        this.ownerName              = event.ownerName;
        this.amIOwner               = event._Str_3246;
        this.amIAnyRoomController   = event._Str_3529;
        this.botSkills              = event.botSkills;
    }
}