import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetPetCommandMessage extends RoomWidgetMessage
{
    public static RWPCM_REQUEST_PET_COMMANDS: string = 'RWPCM_REQUEST_PET_COMMANDS';
    public static RWPCM_PET_COMMAND: string = 'RWPCM_PET_COMMAND';
    public static _Str_16282: number = 46;

    private _petId: number = 0;
    private _value: string;

    constructor(k: string, _arg_2: number, _arg_3: string = null)
    {
        super(k);

        this._petId = _arg_2;
        this._value = _arg_3;
    }

    public get id(): number
    {
        return this._petId;
    }

    public get value(): string
    {
        return this._value;
    }
}
