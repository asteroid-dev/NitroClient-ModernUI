export class RoomLayout
{
    private _level: number;
    private _tileSize: number;
    private _name: string;

    constructor(level: number, tileSize: number, name: string)
    {
        this._level     = level;
        this._tileSize  = tileSize;
        this._name      = name;
    }

    public get level(): number
    {
        return this._level;
    }

    public get tileSize(): number
    {
        return this._tileSize;
    }

    public get name(): string
    {
        return this._name;
    }
}