import { AdvancedMap } from '@nitrots/nitro-renderer';
import { InventoryService } from '../../inventory/services/inventory.service';
import { AvatarEditorMainComponent } from '../components/main/main.component';
import { AvatarEditorModelViewerComponent } from '../components/model-viewer/model-viewer.component';
import { CategoryData } from './CategoryData';
import { IAvatarEditorCategoryModel } from './IAvatarEditorCategoryModel';

export class CategoryBaseModel implements IAvatarEditorCategoryModel
{
    protected _categories: AdvancedMap<string, CategoryData>;
    protected _editor: AvatarEditorMainComponent;
    protected _viewer: AvatarEditorModelViewerComponent;
    protected _isInitalized: boolean;
    protected _maxPaletteCount: number;
    private _disposed: boolean;

    constructor(k: AvatarEditorMainComponent)
    {
        this._editor  = k;
        this._isInitalized  = false;
        this._maxPaletteCount = 0;
    }

    public dispose(): void
    {
        this._categories    = null;
        this._editor      = null;
        this._disposed      = true;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public init(): void
    {
        if(!this._categories) this._categories = new AdvancedMap();
    }

    public reset(): void
    {
        this._isInitalized = false;

        if(this._categories)
        {
            for(const k of this._categories.getValues())
            {
                if(k) k.dispose();
            }
        }

        this._categories = new AdvancedMap();

        (this._viewer && this._viewer.prepareModel());
    }

    public setViewer(viewer: AvatarEditorModelViewerComponent): void
    {
        this._viewer = viewer;
    }

    protected addCategory(name: string): void
    {
        let existing = this._categories.getValue(name);

        if(existing) return;

        existing = this._editor._Str_24037(this, name);

        if(!existing) return;

        this._categories.add(name, existing);

        this.updateSelectionsFromFigure(name);
    }

    protected updateSelectionsFromFigure(figure: string): void
    {
        if(!this._categories || !this._editor || !this._editor.figureData) return;

        const category = this._categories.getValue(figure);

        if(!category) return;

        const setId = this._editor.figureData.getPartSetId(figure);

        let colorIds = this._editor.figureData.getColourIds(figure);

        if(!colorIds) colorIds = [];

        category.selectPartId(setId);
        category.selectColorIds(colorIds);
    }

    public hasClubSelectionsOverLevel(k: number): boolean
    {
        if(!this._categories) return false;

        for(const category of this._categories.getValues())
        {
            if(!category) continue;

            if(category.hasClubSelectionsOverLevel(k)) return true;
        }

        return false;
    }

    public hasInvalidSelectedItems(inventory: InventoryService): boolean
    {
        if(!this._categories) return false;

        for(const category of this._categories.getValues())
        {
            if(!category) continue;

            if(category.hasInvalidSelectedItems(inventory)) return true;
        }

        return false;
    }

    public _Str_15298(k: number): boolean
    {
        if(!this._categories) return false;

        let _local_2 = false;

        for(const name of this._categories.getKeys())
        {
            const category = this._categories.getValue(name);

            if(!category) continue;

            let _local_7 = false;

            if(category.stripClubItemsOverLevel(k)) _local_7 = true;

            if(category.stripClubColorsOverLevel(k)) _local_7 = true;

            if(_local_7)
            {
                const _local_8 = category.getCurrentPart();

                if(_local_8 && this._editor && this._editor.figureData && category)
                {
                    this._editor.figureData.savePartData(name, _local_8.id, category.getSelectedColorIds(), true);
                }

                _local_2 = true;
            }
        }

        return _local_2;
    }

    public _Str_8360(): boolean
    {
        if(!this._categories) return false;

        let _local_2 = false;

        for(const name of this._categories.getKeys())
        {
            const category = this._categories.getValue(name);

            if(!category) continue;

            const _local_6 = false;

            // if(category._Str_8360(this._Str_2278.manager.inventory)) _local_6 = true;

            if(_local_6)
            {
                const _local_7 = category.getCurrentPart();

                if(_local_7 && this._editor && this._editor.figureData && category)
                {
                    this._editor.figureData.savePartData(name, _local_7.id, category.getSelectedColorIds(), true);
                }

                _local_2 = true;
            }
        }

        return _local_2;
    }

    public selectPart(k: string, _arg_2: number): void
    {
        const categoryData = this._categories.getValue(k);

        if(!categoryData) return;

        const partIndex = categoryData.selectedPartIndex;

        categoryData.selectPartIndex(_arg_2);

        const partItem = categoryData.getCurrentPart();

        if(!partItem) return;

        if(partItem.isDisabledForWearing)
        {
            categoryData.selectPartIndex(partIndex);

            this._editor.openHabboClubAdWindow();

            return;
        }

        this._maxPaletteCount = partItem.colorLayerCount;

        if(this._editor && this._editor.figureData)
        {
            this._editor.figureData.savePartData(k, partItem.id, categoryData.getSelectedColorIds(), true);
        }
    }

    public selectColor(k: string, _arg_2: number, _arg_3: number): void
    {
        const categoryData = this._categories.getValue(k);

        if(!categoryData) return;

        const paletteIndex = categoryData.getCurrentColorIndex(_arg_3);

        categoryData.selectColorIndex(_arg_2, _arg_3);

        if(this._editor && this._editor.figureData)
        {
            const colorItem = categoryData.getSelectedColor(_arg_3);

            if(colorItem._Str_14863)
            {
                categoryData.selectColorIndex(paletteIndex, _arg_3);

                this._editor.openHabboClubAdWindow();

                return;
            }

            this._editor.figureData.savePartSetColourId(k, categoryData.getSelectedColorIds(), true);
        }
    }

    public get controller(): AvatarEditorMainComponent
    {
        return this._editor;
    }

    public getCategoryData(k: string): CategoryData
    {
        if(!this._isInitalized) this.init();

        if(!this._categories) return null;

        return this._categories.getValue(k);
    }

    public get categories(): AdvancedMap<string, CategoryData>
    {
        return this._categories;
    }

    public get canSetGender(): boolean
    {
        return false;
    }

    public get maxPaletteCount(): number
    {
        return this._maxPaletteCount;
    }

    public set maxPaletteCount(count: number)
    {
        this._maxPaletteCount = count;
    }

    public get name(): string
    {
        return null;
    }
}
