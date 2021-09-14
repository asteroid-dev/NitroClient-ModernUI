import { RoomWidgetUpdateInfostandUserEvent } from '../../events/RoomWidgetUpdateInfostandUserEvent';

export class InfoStandUserData
{
    private _id: number = 0;
    private _name: string = '';
    private _figure: string = '';
    private _motto: string = '';
    private _badges: string[] = [];
    private _groupId: number = 0;
    private _groupName: string = '';
    private _groupBadgeId: string = '';
    private _activityPoints: number = 0;
    private _respectLeft: number = 0;
    private _petRespectLeft: number = 0;
    private _carryItem: number = 0;
    private _roomIndex: number = -1;
    private _type: string = '';

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

    public get groupId(): number
    {
        return this._groupId;
    }

    public set groupId(k: number)
    {
        this._groupId = k;
    }

    public get groupName(): string
    {
        return this._groupName;
    }

    public set groupName(k: string)
    {
        this._groupName = k;
    }

    public get groupBadgeId(): string
    {
        return this._groupBadgeId;
    }

    public set groupBadgeId(k: string)
    {
        this._groupBadgeId = k;
    }

    public get activityPoints(): number
    {
        return this._activityPoints;
    }

    public set activityPoints(score: number)
    {
        this._activityPoints = score;
    }

    public get respectLeft(): number
    {
        return this._respectLeft;
    }

    public set respectLeft(k: number)
    {
        this._respectLeft = k;
    }

    public get petRespectLeft(): number
    {
        return this._petRespectLeft;
    }

    public set petRespectLeft(k: number)
    {
        this._petRespectLeft = k;
    }

    public get carryItem(): number
    {
        return this._carryItem;
    }

    public set carryItem(carryItem: number)
    {
        this._carryItem = carryItem;
    }

    public get roomIndex(): number
    {
        return this._roomIndex;
    }

    public set roomIndex(roomIndex: number)
    {
        this._roomIndex = roomIndex;
    }

    public get type(): string
    {
        return this._type;
    }

    public set type(type: string)
    {
        this._type = type;
    }

    public getIsBot(): boolean
    {
        return (this.type === RoomWidgetUpdateInfostandUserEvent.BOT);
    }

    public populate(event: RoomWidgetUpdateInfostandUserEvent): void
    {
        this.id                 = event.webID;
        this.name               = event.name;
        this.figure             = event.figure;
        this.motto              = event.motto;
        this.badges             = event.badges;
        this.groupId            = event.groupId;
        this.groupName          = event.groupName;
        this.groupBadgeId       = event.groupBadgeId;
        this.activityPoints     = event.activityPoints;
        this.respectLeft        = event.respectLeft;
        this.petRespectLeft     = 0;
        this.carryItem          = event.carryId;
        this.roomIndex          = event.roomIndex;
        this.type               = event.type;
    }
}