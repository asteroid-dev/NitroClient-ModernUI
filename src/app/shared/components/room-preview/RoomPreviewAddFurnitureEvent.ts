import { IVector3D, NitroEvent } from '@nitrots/nitro-renderer';

export class RoomPreviewAddFurnitureEvent extends NitroEvent
{
    private _classId: number;
    private _direction: IVector3D;

    constructor(type: string, classId: number, direction: IVector3D)
    {
        super(type);

        this._classId   = classId;
        this._direction = direction;
    }

    public get classId(): number
    {
        return this._classId;
    }

    public get direction(): IVector3D
    {
        return this._direction;
    }
}
