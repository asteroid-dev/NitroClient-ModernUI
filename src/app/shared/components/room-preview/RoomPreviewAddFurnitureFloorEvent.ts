import { IObjectData, IVector3D } from '@nitrots/nitro-renderer';
import { RoomPreviewAddFurnitureEvent } from './RoomPreviewAddFurnitureEvent';

export class RoomPreviewAddFurnitureFloorEvent extends RoomPreviewAddFurnitureEvent
{
    public static ADD_FURNITURE: string = 'RPAFFE_ADD_FURNITURE';

    private _objectData: IObjectData;
    private _extras: string;

    constructor(classId: number, direction: IVector3D, objectData: IObjectData = null, extras: string = null)
    {
        super(RoomPreviewAddFurnitureFloorEvent.ADD_FURNITURE, classId, direction);

        this._objectData    = objectData;
        this._extras        = extras;
    }

    public get objectData(): IObjectData
    {
        return this._objectData;
    }

    public get extras(): string
    {
        return this._extras;
    }
}
