import { IPartColor } from '@nitrots/nitro-renderer';
import { InventoryService } from '../../inventory/services/inventory.service';
import { AvatarEditorGridColorItem } from './AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from './AvatarEditorGridPartItem';

export class CategoryData
{
    private MAX_PALETTES: number = 2;

    private _name: string;
    private _parts: AvatarEditorGridPartItem[];
    private _palettes: AvatarEditorGridColorItem[][];
    private _selectedPartIndex: number = -1;
    private _paletteIndexes: number[];

    constructor(name: string, k: AvatarEditorGridPartItem[], _arg_2: AvatarEditorGridColorItem[][])
    {
        this._name              = name;
        this._parts             = k;
        this._palettes          = _arg_2;
        this._selectedPartIndex = -1;
    }

    private static defaultColorId(palettes: AvatarEditorGridColorItem[], clubLevel: number): number
    {
        if(!palettes || !palettes.length) return -1;

        let i = 0;

        while(i < palettes.length)
        {
            const _local_4 = palettes[i];

            if(((_local_4._Str_3420) && (_local_4._Str_3420.clubLevel <= clubLevel)))
            {
                return _local_4._Str_3420.id;
            }

            i++;
        }

        return -1;
    }

    public init(): void
    {
        for(const part of this._parts)
        {
            if(!part) continue;

            part.init();
        }
    }


    public dispose(): void
    {
        if(this._parts)
        {
            for(const k of this._parts) k.dispose();

            this._parts = null;
        }

        if(this._palettes)
        {
            for(const _local_2 of this._palettes)
            {
                if(_local_2) for(const _local_3 of _local_2) _local_3.dispose();
            }

            this._palettes = null;
        }

        this._selectedPartIndex = -1;
        this._paletteIndexes    = null;
    }

    public selectPartId(partId: number): void
    {
        if(!this._parts) return;

        let i = 0;

        while(i < this._parts.length)
        {
            const partItem = this._parts[i];

            if(partItem.id === partId)
            {
                this.selectPartIndex(i);

                return;
            }

            i++;
        }
    }

    public selectColorIds(colorIds: number[]): void
    {
        if(!colorIds || !this._palettes) return;

        this._paletteIndexes = new Array(colorIds.length);

        let i = 0;

        while(i < this._palettes.length)
        {
            const palette = this.getPalette(i);

            if(palette)
            {
                let colorId = 0;

                if(colorIds.length > i)
                {
                    colorId = colorIds[i];
                }
                else
                {
                    const colorItem = palette[0];

                    if(colorItem && colorItem._Str_3420) colorId = colorItem._Str_3420.id;
                }

                let j = 0;

                while(j < palette.length)
                {
                    const colorItem = palette[j];

                    if(colorItem._Str_3420.id === colorId)
                    {
                        this._paletteIndexes[i] = j;

                        colorItem.isSelected = true;
                    }
                    else
                    {
                        colorItem.isSelected = false;
                    }

                    j++;
                }
            }

            i++;
        }

        this.updatePartColors();
    }

    public selectPartIndex(partIndex: number): AvatarEditorGridPartItem
    {
        if(!this._parts) return null;

        if((this._selectedPartIndex >= 0) && (this._parts.length > this._selectedPartIndex))
        {
            const partItem = this._parts[this._selectedPartIndex];

            if(partItem) partItem.isSelected = false;
        }

        if(this._parts.length > partIndex)
        {
            const partItem = this._parts[partIndex];

            if(partItem)
            {
                partItem.isSelected = true;

                this._selectedPartIndex = partIndex;

                return partItem;
            }
        }

        return null;
    }

    public selectColorIndex(colorIndex: number, paletteId: number): AvatarEditorGridColorItem
    {
        const palette = this.getPalette(paletteId);

        if(!palette) return null;

        if(palette.length <= colorIndex) return null;

        this.deselectColorIndex(this._paletteIndexes[paletteId], paletteId);

        this._paletteIndexes[paletteId] = colorIndex;

        const colorItem = palette[colorIndex];

        if(!colorItem) return null;

        colorItem.isSelected = true;

        this.updatePartColors();

        return colorItem;
    }

    public getCurrentColorIndex(k: number): number
    {
        return this._paletteIndexes[k];
    }

    private deselectColorIndex(colorIndex: number, paletteIndex: number): void
    {
        const palette = this.getPalette(paletteIndex);

        if(!palette) return;

        if(palette.length <= colorIndex) return;

        const colorItem = palette[colorIndex];

        if(!colorItem) return;

        colorItem.isSelected = false;
    }

    public getSelectedColorIds(): number[]
    {
        if(!this._paletteIndexes || !this._paletteIndexes.length) return null;

        if(!this._palettes || !this._palettes.length) return null;

        const palette = this._palettes[0];

        if(!palette || (!palette.length)) return null;

        const colorItem = palette[0];

        if(!colorItem || !colorItem._Str_3420) return null;

        const colorId               = colorItem._Str_3420.id;
        const colorIds: number[]    = [];

        let i = 0;

        while(i < this._paletteIndexes.length)
        {
            const paletteSet = this._palettes[i];

            if(!((!(paletteSet)) || (paletteSet.length <= i)))
            {
                if(paletteSet.length > this._paletteIndexes[i])
                {
                    const color = paletteSet[this._paletteIndexes[i]];

                    if(color && color._Str_3420)
                    {
                        colorIds.push(color._Str_3420.id);
                    }
                    else
                    {
                        colorIds.push(colorId);
                    }
                }
                else
                {
                    colorIds.push(colorId);
                }
            }

            i++;
        }

        const partItem = this.getCurrentPart();

        if(!partItem) return null;

        return colorIds.slice(0, Math.max(partItem.colorLayerCount, 1));
    }

    private getSelectedColors(): IPartColor[]
    {
        const partColors: IPartColor[] = [];

        let i = 0;

        while(i < this._paletteIndexes.length)
        {
            const colorItem = this.getSelectedColor(i);

            if(colorItem)
            {
                partColors.push(colorItem._Str_3420);
            }
            else
            {
                partColors.push(null);
            }

            i++;
        }

        return partColors;
    }

    public getSelectedColor(k: number): AvatarEditorGridColorItem
    {
        const _local_2 = this.getPalette(k);

        if(!_local_2 || (_local_2.length <= this._paletteIndexes[k])) return null;

        return _local_2[this._paletteIndexes[k]];
    }

    public getSelectedColorId(k: number): number
    {
        const _local_2 = this.getSelectedColor(k);

        if(_local_2 && (_local_2._Str_3420)) return _local_2._Str_3420.id;

        return 0;
    }

    public get parts(): AvatarEditorGridPartItem[]
    {
        return this._parts;
    }

    public getPalette(k: number): AvatarEditorGridColorItem[]
    {
        if(!this._paletteIndexes || !this._palettes || (this._palettes.length <= k))
        {
            return null;
        }

        return this._palettes[k];
    }

    public getCurrentPart(): AvatarEditorGridPartItem
    {
        return this._parts[this._selectedPartIndex] as AvatarEditorGridPartItem;
    }

    private updatePartColors(): void
    {
        const k = this.getSelectedColors();

        for(const _local_2 of this._parts)
        {
            if(_local_2) _local_2.colors = k;
        }
    }

    public hasClubSelectionsOverLevel(k: number): boolean
    {
        let _local_2 = false;

        const _local_3 = this.getSelectedColors();

        if(_local_3)
        {
            let _local_6 = 0;

            while(_local_6 < _local_3.length)
            {
                const _local_7 = _local_3[_local_6];

                if(_local_7 && (_local_7.clubLevel > k)) _local_2 = true;

                _local_6++;
            }
        }

        let _local_4 = false;
        const _local_5 = this.getCurrentPart();

        if(_local_5 && _local_5.partSet)
        {
            const _local_8 = _local_5.partSet;

            if(_local_8 && (_local_8.clubLevel > k))
            {
                _local_4 = true;
            }
        }

        return (_local_2) || (_local_4);
    }

    public hasInvalidSelectedItems(inventory: InventoryService): boolean
    {
        const part = this.getCurrentPart();

        if(!part) return false;

        const partSet = part.partSet;

        if(!partSet || !partSet.isSellable) return;

        return !inventory.hasFigureSetId(partSet.id);
    }

    public stripClubItemsOverLevel(k: number): boolean
    {
        const _local_2 = this.getCurrentPart();

        if(((_local_2) && (_local_2.partSet)))
        {
            const _local_3 = _local_2.partSet;

            if(_local_3.clubLevel > k)
            {
                const _local_4 = this.selectPartIndex(0);

                if(_local_4 && !_local_4.partSet) this.selectPartIndex(1);

                return true;
            }
        }

        return false;
    }

    public stripClubColorsOverLevel(k: number): boolean
    {
        const _local_2: number[]  = [];
        const _local_3            = this.getSelectedColors();
        let _local_4            = false;
        const _local_5            = this.getPalette(0);

        const _local_6 = CategoryData.defaultColorId(_local_5, k);

        if(_local_6 === -1) return false;

        let _local_7 = 0;

        while(_local_7 < _local_3.length)
        {
            const _local_8 = _local_3[_local_7];

            if(!_local_8)
            {
                _local_2.push(_local_6);
                _local_4 = true;
            }
            else
            {
                if(_local_8.clubLevel > k)
                {
                    _local_2.push(_local_6);
                    _local_4 = true;
                }
                else
                {
                    _local_2.push(_local_8.id);
                }
            }

            _local_7++;
        }

        if(_local_4) this.selectColorIds(_local_2);

        return _local_4;
    }

    // public stripInvalidSellableItems(k:IHabboInventory): boolean
    // {
    //     var _local_3:IFigurePartSet;
    //     var _local_4:AvatarEditorGridPartItem;
    //     var _local_2:AvatarEditorGridPartItem = this._Str_6315();
    //     if (((_local_2) && (_local_2.partSet)))
    //     {
    //         _local_3 = _local_2.partSet;
    //         if (((_local_3.isSellable) && (!(k._Str_14439(_local_3.id)))))
    //         {
    //             _local_4 = this._Str_8066(0);
    //             if (((!(_local_4 == null)) && (_local_4.partSet == null)))
    //             {
    //                 this._Str_8066(1);
    //             }
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    public get name(): string
    {
        return this._name;
    }

    public get selectedPartIndex(): number
    {
        return this._selectedPartIndex;
    }
}
