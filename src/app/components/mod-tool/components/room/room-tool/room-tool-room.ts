export class RoomToolRoom
{

    private _id: number;
    private _playerAmount: number;
    private _name: string;
    private _ownerName: string;
    private _description: string;
    private _owner: boolean;

    constructor(id: number, playerAmount: number, name: string, ownerName: string, description: string, owner: boolean)
    {
        this._id = id;
        this._playerAmount = playerAmount;
        this._name = name;
        this._ownerName = ownerName;
        this._description = description;
        this._owner = owner;
    }

    get id(): number
    {
        return this._id;
    }

    get playerAmount(): number
    {
        return this._playerAmount;
    }

    get name(): string
    {
        return this._name;
    }

    get ownerName(): string
    {
        return this._ownerName;
    }

    get description(): string
    {
        return this._description;
    }

    get owner(): boolean
    {
        return this._owner;
    }
}
