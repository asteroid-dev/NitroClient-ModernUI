import { IVector3D } from '@nitrots/nitro-renderer';
import { RoomPreviewAddFurnitureEvent } from './RoomPreviewAddFurnitureEvent';

export class RoomPreviewAddFurnitureWallEvent extends RoomPreviewAddFurnitureEvent
{
    public static ADD_FURNITURE: string = 'RPAFWE_ADD_FURNITURE';

    private _objectData: string;

    constructor(classId: number, direction: IVector3D, objectData: string = null)
    {
        super(RoomPreviewAddFurnitureWallEvent.ADD_FURNITURE, classId, direction);

        this._objectData = objectData;
    }

    public get objectData(): string
    {
        return this._objectData;
    }
}
