import { AvatarEditorFigureCategory, AvatarScaleType, AvatarSetType, IAvatarImageListener, Nitro } from '@nitrots/nitro-renderer';
import { CategoryBaseModel } from '../common/CategoryBaseModel';
import { FigureData } from '../common/FigureData';

export class BodyModel extends CategoryBaseModel implements IAvatarImageListener
{
    private _imageCallBackHandled: boolean = false;

    public init(): void
    {
        super.init();

        this.addCategory(FigureData.FACE);

        this._isInitalized = true;
    }

    public selectColor(k: string, _arg_2: number, _arg_3: number): void
    {
        super.selectColor(k, _arg_2, _arg_3);

        this.updateSelectionsFromFigure(FigureData.FACE);
    }

    protected updateSelectionsFromFigure(k: string): void
    {
        if(!this._categories || !this._editor || !this._editor.figureData) return;

        const category = this._categories.getValue(k);

        if(!category) return;

        const setId = this._editor.figureData.getPartSetId(k);

        let colorIds = this._editor.figureData.getColourIds(k);

        if(!colorIds) colorIds = [];

        category.selectPartId(setId);
        category.selectColorIds(colorIds);

        for(const part of category.parts)
        {
            const figure        = this.controller.figureData.getFigureStringWithFace(part.id);
            const avatarImage   = Nitro.instance.avatar.createAvatarImage(figure, AvatarScaleType.LARGE, null, this);

            const sprite = avatarImage.getImageAsSprite(AvatarSetType.HEAD);

            if(sprite)
            {
                sprite.y = 10;

                part.iconImage = sprite;

                setTimeout(() => avatarImage.dispose(), 0);
            }
        }

        // if (this._Str_2271) this._Str_2271._Str_5614(k, _local_4.length);
    }

    public resetFigure(figure: string): void
    {
        if(this._imageCallBackHandled) return;

        this._imageCallBackHandled = true;

        this.updateSelectionsFromFigure(FigureData.FACE);
    }

    public get canSetGender(): boolean
    {
        return true;
    }

    public get name(): string
    {
        return AvatarEditorFigureCategory.GENERIC;
    }
}
