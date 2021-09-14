import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdvancedMap, AvatarDirectionAngle, AvatarEditorFigureCategory, IPalette, IPartColor, ISetType, IStructureData, Nitro, UserFigureComposer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';
import { AvatarEditorGridPartItem } from '../../common/AvatarEditorGridPartItem';
import { CategoryBaseModel } from '../../common/CategoryBaseModel';
import { CategoryData } from '../../common/CategoryData';
import { FigureData } from '../../common/FigureData';
import { BodyModel } from '../../models/BodyModel';
import { HeadModel } from '../../models/HeadModel';
import { LegModel } from '../../models/LegModel';
import { TorsoModel } from '../../models/TorsoModel';
import { AvatarEditorService } from '../../services/avatar-editor.service';

@Component({
    selector: 'nitro-avatar-editor-main-component',
    templateUrl: './main.template.html'
})
export class AvatarEditorMainComponent implements OnInit, OnDestroy
{
    private static _Str_18590: string   = 'hr-100.hd-180-7.ch-215-66.lg-270-79.sh-305-62.ha-1002-70.wa-2007';
    private static _Str_18820: string   = 'hr-515-33.hd-600-1.ch-635-70.lg-716-66-62.sh-735-68';
    private static _Str_6331: number    = 2;

    @Input()
    public visible: boolean = false;

    private _figureStructureData: IStructureData;
    private _categories: AdvancedMap<string, CategoryBaseModel>;
    private _figures: Map<string, FigureData>;
    private _gender: string;
    private _clubMemberLevel: number;
    private _lastSavedFigure: string;
    private _lastSavedGender: string;

    private _aciveCategory: CategoryBaseModel;

    constructor(
        private _inventoryService: InventoryService,
        private _settingsService: SettingsService,
        private _avatarEditorService: AvatarEditorService)
    {}

    public ngOnInit(): void
    {
        this._avatarEditorService.component = this;

        this._figureStructureData   = Nitro.instance.avatar.structureData;
        this._categories            = new AdvancedMap();
        this._figures               = new Map();
        this._gender                = FigureData.MALE;
        this._clubMemberLevel       = 0;
        this._lastSavedFigure       = '';
        this._lastSavedGender       = FigureData.MALE;

        const maleFigure    = new FigureData();
        const femaleFigure  = new FigureData();

        maleFigure.loadAvatarData(AvatarEditorMainComponent._Str_18590, FigureData.MALE);
        femaleFigure.loadAvatarData(AvatarEditorMainComponent._Str_18820, FigureData.FEMALE);

        this._figures.set(FigureData.MALE, maleFigure);
        this._figures.set(FigureData.FEMALE, femaleFigure);

        this._categories.add(AvatarEditorFigureCategory.GENERIC, new BodyModel(this));
        this._categories.add(AvatarEditorFigureCategory.HEAD, new HeadModel(this));
        this._categories.add(AvatarEditorFigureCategory.TORSO, new TorsoModel(this));
        this._categories.add(AvatarEditorFigureCategory.LEGS, new LegModel(this));

        this.selectFirstCategory();
    }

    public ngOnDestroy(): void
    {
        this._avatarEditorService.component = null;
    }

    public hide(): void
    {
        this._settingsService.hideAvatarEditor();
    }

    private selectFirstCategory(): void
    {
        const category = this._categories.getWithIndex(0);

        if(!category) return;

        this.selectCategory(category.name);
    }

    public selectCategory(name: string): void
    {
        if(!name) return;

        const category = this._categories.getValue(name);

        if(!category) return;

        this._aciveCategory = category;
    }

    public loadAvatarInEditor(figure: string, gender: string, clubMemberLevel: number, reset: boolean = true): void
    {
        switch(gender)
        {
            case FigureData.MALE:
            case 'm':
            case 'M':
                gender = FigureData.MALE;
                break;
            case FigureData.FEMALE:
            case 'f':
            case 'F':
                gender = FigureData.FEMALE;
                break;
            default:
                gender = FigureData.MALE;
        }

        let update = false;

        this._clubMemberLevel = clubMemberLevel;

        const figureData = this._figures.get(gender);

        if(!figureData) return;

        if(figure !== figureData.getFigureString())
        {
            update = true;
        }

        if(gender !== this._gender)
        {
            this._gender = gender;

            update = true;
        }

        figureData.loadAvatarData(figure, gender);

        if(update)
        {
            for(const category of this._categories.getValues())
            {
                if(!category) continue;

                category.reset();
            }
        }

        if(reset)
        {
            this._lastSavedFigure   = figure;
            this._lastSavedGender   = this._gender;
        }
    }

    public _Str_24037(k: CategoryBaseModel, _arg_2: string): CategoryData
    {
        if(!k || !_arg_2) return null;

        const _local_3: AvatarEditorGridPartItem[]    = [];
        const _local_4: AvatarEditorGridColorItem[][] = [];

        let _local_5 = 0;

        while(_local_5 < AvatarEditorMainComponent._Str_6331)
        {
            _local_4.push([]);

            _local_5++;
        }

        const _local_8 = this._Str_20100(_arg_2);

        if(!_local_8) return null;

        const _local_9 = this.getPalette(_local_8.paletteID);

        if(!_local_9) return null;

        let _local_10 = this.figureData.getColourIds(_arg_2);

        if(!_local_10) _local_10 = [];

        const _local_11: IPartColor[]   = new Array(_local_10.length);
        const _local_12                 = this._Str_24175;

        for(const _local_13 of _local_9.colors.getValues())
        {
            if(_local_13.isSelectable && (_local_12 || (this.clubMemberLevel >= _local_13.clubLevel)))
            {
                let _local_20 = 0;

                while(_local_20 < AvatarEditorMainComponent._Str_6331)
                {
                    const _local_21 = (this.clubMemberLevel < _local_13.clubLevel);
                    const _local_22 = new AvatarEditorGridColorItem(k, _local_13, _local_21);

                    _local_4[_local_20].push(_local_22);

                    _local_20++;
                }

                if(_arg_2 !== FigureData.FACE)
                {
                    let _local_23 = 0;

                    while(_local_23 < _local_10.length)
                    {
                        if(_local_13.id === _local_10[_local_23]) _local_11[_local_23] = _local_13;

                        _local_23++;
                    }
                }
            }
        }

        let _local_24           = 0;
        let _local_14: string[] = [];

        if(_local_12)
        {
            _local_24 = 2;
            _local_14 = Nitro.instance.avatar.getMandatoryAvatarPartSetIds(this.gender, _local_24);
        }
        else
        {
            _local_14 = Nitro.instance.avatar.getMandatoryAvatarPartSetIds(this.gender, this.clubMemberLevel);
        }

        const _local_15 = (_local_14.indexOf(_arg_2) == -1);

        if(_local_15)
        {
            const partItem = new AvatarEditorGridPartItem(k, null, null, false);

            partItem.isClear = true;

            _local_3.push(partItem);
        }

        const _local_16 = (_arg_2 !== FigureData.FACE);
        const _local_17 = _local_8.partSets;
        const _local_18 = _local_17.length;

        let _local_19 = (_local_18 - 1);

        while(_local_19 >= 0)
        {
            const _local_6 = _local_17.getWithIndex(_local_19);

            let _local_28 = false;

            if(_local_6.gender === FigureData.UNISEX)
            {
                _local_28 = true;
            }
            else
            {
                if(_local_6.gender == this.gender)
                {
                    _local_28 = true;
                }
            }

            if((_local_6.isSelectable && _local_28) && (_local_12 || (this.clubMemberLevel >= _local_6.clubLevel)))
            {
                const _local_29 = (this.clubMemberLevel < _local_6.clubLevel);

                let _local_30 = true;

                if(_local_6.isSellable)
                {
                    _local_30 = (this._inventoryService && this._inventoryService.hasFigureSetId(_local_6.id));
                }

                if(_local_30)
                {
                    const _local_7 = new AvatarEditorGridPartItem(k, _local_6, _local_11, _local_16, _local_29);

                    _local_3.push(_local_7);
                }
            }

            _local_19--;
        }

        _local_3.sort(this._Str_25757 ? this._Str_25189 : this._Str_23935);

        // if(this._forceSellableClothingVisibility || Nitro.instance.getConfiguration<boolean>("avatareditor.support.sellablefurni", false))
        // {
        //     _local_31 = (this._manager.windowManager.assets.getAssetByName("camera_zoom_in") as BitmapDataAsset);
        //     _local_32 = (_local_31.content as BitmapData).clone();
        //     _local_33 = (AvatarEditorView._Str_6802.clone() as IWindowContainer);
        //     _local_33.name = AvatarEditorGridView.GET_MORE;
        //     _local_7 = new AvatarEditorGridPartItem(_local_33, k, null, null, false);
        //     _local_7._Str_3093 = _local_32;
        //     _local_3.push(_local_7);
        // }

        _local_5 = 0;

        while(_local_5 < AvatarEditorMainComponent._Str_6331)
        {
            const _local_34 = _local_4[_local_5];

            _local_34.sort(this._Str_23625);

            _local_5++;
        }

        return new CategoryData(_arg_2, _local_3, _local_4);
    }

    public openHabboClubAdWindow(): void
    {

    }

    public _Str_20100(k: string): ISetType
    {
        if(!this._figureStructureData) return null;

        return this._figureStructureData.getSetType(k);
    }

    public getPalette(k: number): IPalette
    {
        if(!this._figureStructureData) return null;

        return this._figureStructureData.getPalette(k);
    }

    private _Str_25189(k: AvatarEditorGridPartItem, _arg_2: AvatarEditorGridPartItem): number
    {
        const _local_3 = (!k.partSet ? 9999999999 : k.partSet.clubLevel);
        const _local_4 = (!_arg_2.partSet ? 9999999999 : _arg_2.partSet.clubLevel);
        const _local_5 = (!k.partSet ? false : k.partSet.isSellable);
        const _local_6 = (!_arg_2.partSet ? false : _arg_2.partSet.isSellable);

        if(_local_5 && !_local_6) return 1;

        if(_local_6 && !_local_5) return -1;

        if(_local_3 > _local_4) return -1;

        if(_local_3 < _local_4) return 1;

        if(k.partSet.id > _arg_2.partSet.id) return -1;

        if(k.partSet.id < _arg_2.partSet.id) return 1;

        return 0;
    }

    private _Str_23935(k: AvatarEditorGridPartItem, _arg_2: AvatarEditorGridPartItem): number
    {
        const _local_3 = (!k.partSet ? -1 : k.partSet.clubLevel);
        const _local_4 = (!_arg_2.partSet ? -1 : _arg_2.partSet.clubLevel);
        const _local_5 = (!k.partSet ? false : k.partSet.isSellable);
        const _local_6 = (!_arg_2.partSet ? false : _arg_2.partSet.isSellable);

        if(_local_5 && !_local_6) return 1;

        if(_local_6 && !_local_5) return -1;

        if(_local_3 < _local_4) return -1;

        if(_local_3 > _local_4) return 1;

        if(k.partSet.id < _arg_2.partSet.id) return -1;

        if(k.partSet.id > _arg_2.partSet.id) return 1;

        return 0;
    }

    private _Str_23625(k: AvatarEditorGridColorItem, _arg_2: AvatarEditorGridColorItem): number
    {
        const _local_3 = (!k._Str_3420 ? -1 : k._Str_3420.clubLevel);
        const _local_4 = (!_arg_2._Str_3420 ? -1 : _arg_2._Str_3420.clubLevel);

        if(_local_3 < _local_4) return -1;

        if(_local_3 > _local_4) return 1;

        if(k._Str_3420.index < _arg_2._Str_3420.index) return -1;

        if(k._Str_3420.index > _arg_2._Str_3420.index) return 1;

        return 0;
    }

    public rotateAvatar(direction: number): void
    {
        let newDirection = direction;

        if(newDirection < AvatarDirectionAngle.MIN_DIRECTION)
        {
            newDirection = (AvatarDirectionAngle.MAX_DIRECTION + (newDirection + 1));
        }

        if(newDirection > AvatarDirectionAngle.MAX_DIRECTION)
        {
            newDirection = (newDirection - (AvatarDirectionAngle.MAX_DIRECTION + 1));
        }

        this.figureData.direction = newDirection;
    }

    public saveFigure(): void
    {
        const figureData = this.figureData;

        if(!figureData) return;

        this._lastSavedFigure   = figureData.getFigureString();
        this._lastSavedGender   = figureData.gender;

        Nitro.instance.communication.connection.send(new UserFigureComposer(figureData.gender, this._lastSavedFigure));

        this.hide();
    }

    public clearFigure(): void
    {
        const figureData = this.figureData;

        if(!figureData) return;

        this.loadAvatarInEditor(figureData.getFigureStringWithFace(0, false), figureData.gender, this._clubMemberLevel, false);
    }

    public resetFigure(): void
    {
        this.loadAvatarInEditor(this._lastSavedFigure, this._gender, this._clubMemberLevel);
    }

    private get _Str_25757(): boolean
    {
        return Nitro.instance.getConfiguration<boolean>('avatareditor.show.clubitems.first', true);
    }

    private get _Str_24175(): boolean
    {
        return Nitro.instance.getConfiguration<boolean>('avatareditor.show.clubitems.dimmed', true);
    }

    public get clubMemberLevel(): number
    {
        if(!this._clubMemberLevel) return Nitro.instance.sessionDataManager.clubLevel;

        return this._clubMemberLevel;
    }

    public set clubMemberLevel(k: number)
    {
        this._clubMemberLevel = k;
    }

    public get figureStructureData(): IStructureData
    {
        return this._figureStructureData;
    }

    public get figureData(): FigureData
    {
        return this._figures.get(this._gender);
    }

    public get gender(): string
    {
        return this._gender;
    }

    public set gender(k: string)
    {
        if(this._gender === k) return;

        switch(k)
        {
            case FigureData.MALE:
            case 'm':
            case 'M':
                k = FigureData.MALE;
                break;
            case FigureData.FEMALE:
            case 'f':
            case 'F':
                k = FigureData.FEMALE;
                break;
            default:
                k = FigureData.MALE;
        }

        this._gender = k;

        for(const _local_2 of this._categories.getValues()) _local_2.reset();

        this.selectFirstCategory();
    }

    public get categories(): AdvancedMap<string, CategoryBaseModel>
    {
        return this._categories;
    }

    public get activeCategory(): CategoryBaseModel
    {
        return this._aciveCategory;
    }
}
