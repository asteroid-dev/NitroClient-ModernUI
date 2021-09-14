import { RoomWidgetRentableBotInfostandUpdateEvent } from '../../events/RoomWidgetRentableBotInfostandUpdateEvent';

export class RentableBotInfoData
{
    private _id: number = -1;
    private _roomIndex: number;
    private _isIgnored: boolean = false;
    private _amIOwner: boolean = false;
    private _amIAnyRoomController: boolean = false;
    private _carryItemType: number = 0;
    private _botSkills: number[];
    private _botSkillsWithCommands: number[];
    private _name: string;


    public get id(): number
    {
        return this._id;
    }

    public set id(k: number)
    {
        this._id = k;
    }

    public get _Str_2707(): number
    {
        return this._roomIndex;
    }

    public set _Str_2707(k: number)
    {
        this._roomIndex = k;
    }

    public get _Str_3655(): boolean
    {
        return this._isIgnored;
    }

    public set _Str_3655(k: boolean)
    {
        this._isIgnored = k;
    }

    public get _Str_3246(): boolean
    {
        return this._amIOwner;
    }

    public set _Str_3246(k: boolean)
    {
        this._amIOwner = k;
    }

    public get _Str_3529(): boolean
    {
        return this._amIAnyRoomController;
    }

    public set _Str_3529(k: boolean)
    {
        this._amIAnyRoomController = k;
    }

    public get _Str_8826(): number
    {
        return this._carryItemType;
    }

    public set _Str_8826(k: number)
    {
        this._carryItemType = k;
    }

    public get _Str_2899(): number[]
    {
        return this._botSkills;
    }

    public set _Str_2899(k: number[])
    {
        this._botSkills = k;
    }

    public get _Str_10833(): number[]
    {
        return this._botSkillsWithCommands;
    }

    public set _Str_10833(k: number[])
    {
        this._botSkillsWithCommands = k;
    }

    public get name(): string
    {
        return this._name;
    }

    public populate(k: RoomWidgetRentableBotInfostandUpdateEvent):void
    {
        if(k.id != this.id)
        {
            this._botSkillsWithCommands = new Array(0);
        }
        this.id = k.id;
        this._Str_2707 = k.roomIndex;
        this._Str_3246 = k._Str_3246;
        this._Str_3529 = k._Str_3529;
        this._Str_8826 = k.carryId;
        this._Str_2899 = k.botSkills;
        this._name = k.name;
    }

    public _Str_19891(k: number[]):void
    {
        this._botSkills = [];

        for(const _local_2 of k) this._Str_2899.push(_local_2);

        this._botSkillsWithCommands = k.concat();
    }
}
