import { RoomWidgetMessage } from '@nitrots/nitro-renderer';

export class RoomWidgetPollMessage extends RoomWidgetMessage
{
    public static RWPM_START: string = 'RWPM_START';
    public static RWPM_REJECT: string = 'RWPM_REJECT';
    public static RWPM_ANSWER: string = 'RWPM_ANSWER';

    private _id: number = -1;
    private _questionId: number = 0;
    private _answers: string[] = null;

    constructor(k: string, _arg_2: number)
    {
        super(k);

        this._id = _arg_2;
    }

    public get id(): number
    {
        return this._id;
    }

    public get _Str_3218(): number
    {
        return this._questionId;
    }

    public set _Str_3218(k: number)
    {
        this._questionId = k;
    }

    public get answers(): string[]
    {
        return this._answers;
    }

    public set answers(k: string[])
    {
        this._answers = k;
    }
}
