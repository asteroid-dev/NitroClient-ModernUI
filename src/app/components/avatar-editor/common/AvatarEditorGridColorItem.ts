import { ColorConverter, IPartColor } from '@nitrots/nitro-renderer';
import { CategoryBaseModel } from './CategoryBaseModel';

export class AvatarEditorGridColorItem
{
    private _model: CategoryBaseModel;
    private _partColor: IPartColor;
    private _isSelected: boolean
    private _isDisabledForWearing: boolean;
    private _isHC: boolean;

    constructor(_arg_2: CategoryBaseModel, _arg_3: IPartColor, _arg_4: boolean = false)
    {
        this._model                 = _arg_2;
        this._partColor             = _arg_3;
        this._isSelected            = false;
        this._isDisabledForWearing  = _arg_4;

        this._Str_22595();
    }

    public dispose(): void
    {
        this._model     = null;
        this._partColor = null;
    }

    public get isSelected(): boolean
    {
        return this._isSelected;
    }

    public set isSelected(k: boolean)
    {
        this._isSelected = k;
    }

    private _Str_22595(): void
    {
        if(this._partColor)
        {
            this._isHC = (this._partColor.clubLevel > 0);
        }
        else
        {
            this._isHC = false;
        }
    }

    public get _Str_3420(): IPartColor
    {
        return this._partColor;
    }

    public get color(): string
    {
        return ColorConverter.int2rgb(this._partColor.rgb);
    }

    public get _Str_14863(): boolean
    {
        return this._isDisabledForWearing;
    }

    public get isHC(): boolean
    {
        return this._isHC;
    }
}
