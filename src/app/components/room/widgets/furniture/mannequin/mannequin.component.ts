import { Component, NgZone } from '@angular/core';
import { AvatarFigureContainer, AvatarFigurePartType, FurnitureMannequinSaveLookComposer, FurnitureMannequinSaveNameComposer, FurnitureMultiStateComposer, HabboClubLevelEnum, IAvatarFigureContainer, Nitro, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { FurnitureMannequinWidgetHandler } from '../../handlers/FurnitureMannequinWidgetHandler';

@Component({
    selector: 'nitro-room-furniture-mannequin-component',
    templateUrl: './mannequin.template.html'
})
export class MannequinWidget extends ConversionTrackingWidget
{
    private static readonly EditorView:number = 0;
    private static readonly PreviewAndSave:number = 1;
    private static readonly UseMannequin:number = 2;
    private static readonly WrongClubLevel:number = 3;
    private static readonly WrongGender:number = 4;
    private static readonly  parts = [
        AvatarFigurePartType.CHEST_ACCESSORY,
        AvatarFigurePartType.COAT_CHEST,
        AvatarFigurePartType.CHEST,
        AvatarFigurePartType.LEGS,
        AvatarFigurePartType.SHOES,
        AvatarFigurePartType.WAIST_ACCESSORY];
    private static readonly _Str_9071:number = 0;
    private static readonly  _Str_8000:number = 1;
    private static readonly _Str_8218:number = 2;
    private static readonly _Str_10597 = ['hd', 99999, [99998]];
    private _visible: boolean       = false;
    private _furniId: number;
    private _figure: string;
    private _renderedFigure: string;
    private _gender: string;
    public outfitName: string;
    private _mannequinClubLevel: number;
    private _view: string;
    public hasHabboClub: boolean = false;

    constructor(
        private _ngZone: NgZone)
    {
        super();

    }

    public open(id: number, figure: string, gender: string, name: string)
    {
        this._furniId = id;
        this._figure = figure;
        this._gender = gender;
        this.outfitName = name;

        const roomSession = this.handler.container.roomSession;
        const currentSessionUser =this.handler.container.sessionDataManager;
        const canEditMannequin = roomSession.isRoomOwner || roomSession.controllerLevel >= RoomControllerLevel.GUEST || currentSessionUser.isGodMode;
        const _local_8 = Nitro.instance.avatar;
        const local9 = _local_8.createFigureContainer(figure);
        this._mannequinClubLevel = _local_8.getFigureClubLevel(local9, gender, MannequinWidget.parts);
        const viewType = this.getViewType(canEditMannequin, currentSessionUser.gender, currentSessionUser.clubLevel, gender, this._mannequinClubLevel);

        this.setView(viewType);
    }

    public get handler(): FurnitureMannequinWidgetHandler
    {
        return (this.widgetHandler as FurnitureMannequinWidgetHandler);
    }

    public hide(): void
    {
        this._visible = false;
    }
    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    private getViewType(canEditMannequin:boolean, ownGender:string, currentClubLevel:number, mannequinGender:string, requiredClubLevel:number):number
    {
        if(canEditMannequin)
        {
            return MannequinWidget.EditorView;
        }
        if(ownGender.toLowerCase() != mannequinGender.toLowerCase())
        {
            return MannequinWidget.WrongGender;
        }
        if(currentClubLevel < requiredClubLevel)
        {
            return MannequinWidget.WrongClubLevel;
        }
        return MannequinWidget.UseMannequin;
    }



    private setView(viewType: number): void
    {
        const sessionDataManager = this.handler.container.sessionDataManager;
        const currentFigure = sessionDataManager.figure;
        const avatarRenderManager =  this.handler.container.avatarRenderManager;

        this._view = this.createView(viewType);


        let avatarFigureContainer:IAvatarFigureContainer = null;


        switch(viewType)
        {
            case MannequinWidget.PreviewAndSave:
            case MannequinWidget.WrongClubLevel:
            case MannequinWidget.WrongGender:{
                avatarFigureContainer = avatarRenderManager.createFigureContainer(this._figure);
                this.removeSectionsFromAvatar(avatarFigureContainer);
                this._renderedFigure = avatarFigureContainer.getFigureString();
            }
                break;
            case MannequinWidget.UseMannequin: {
                this._renderedFigure = this.mergeFigures(this._figure);
            }
                break;
            case MannequinWidget.EditorView: {
                avatarFigureContainer = avatarRenderManager.createFigureContainer(this._figure);
                this.removeSectionsFromAvatar(avatarFigureContainer);
                this._renderedFigure = avatarFigureContainer.getFigureString();


            }
                break;
        }

        this.showOrHideHabboClubLevel(this._mannequinClubLevel);

        this._ngZone.run(() =>
        {
            this._visible = true;
        });
    }

    public saveName(): void
    {
        this.changeOutfitName();
    }

    private removeSectionsFromAvatar(avatar:IAvatarFigureContainer): void
    {

        for(const item of avatar.getPartTypeIds())
        {

            if(MannequinWidget.parts.indexOf(item) == -1)
            {

                avatar.removePart(item);
            }
        }

        avatar.updatePart(<string>MannequinWidget._Str_10597[0], <number>MannequinWidget._Str_10597[1], <number[]>MannequinWidget._Str_10597[2]);
    }


    private mergeFigures(addedFigure: string): string
    {
        const ownContainer = new AvatarFigureContainer(this.widgetHandler.container.sessionDataManager.figure);
        const addedContainer = new AvatarFigureContainer(addedFigure);

        for(const part of MannequinWidget.parts)
        {
            ownContainer.removePart(part);
        }

        for(const part of addedContainer.getPartTypeIds())
        {
            ownContainer.updatePart(part, addedContainer.getPartSetId(part), addedContainer.getPartColorIds(part));
        }

        return ownContainer.getFigureString();

    }

    private createView(viewType: number): string
    {
        switch(viewType)
        {
            case MannequinWidget.EditorView:
                return 'main';
            case MannequinWidget.PreviewAndSave:
                return 'save';
            case MannequinWidget.UseMannequin:
                return 'peer-main';
            case MannequinWidget.WrongClubLevel:
                return 'no-club';
            case MannequinWidget.WrongGender:
                return 'wrong-gender';
        }

        return '';
    }


    private showOrHideHabboClubLevel(clubLevel:number): void
    {
        switch(clubLevel)
        {
            case HabboClubLevelEnum.NO_CLUB:
                this.hasHabboClub = false;
                break;
            case HabboClubLevelEnum.CLUB:
            case HabboClubLevelEnum.VIP:
                this.hasHabboClub = true;
                break;
        }
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'wear':
                this.wearOutfit();
                break;
            case 're_style':
                this.changeOutfitName();
                this.setView(MannequinWidget.PreviewAndSave);
                break;
            case 'save_outfit':
                this.handler.container.connection.send(new FurnitureMannequinSaveLookComposer(this._furniId));
                this._visible = false;
                break;
            case 'main':
                this.setView(MannequinWidget.EditorView);
                break;
            case 'close':
                this._visible = false;
                break;
        }
    }

    private wearOutfit(): void
    {
        const session = this.widgetHandler.container.sessionDataManager;
        if(session.clubLevel < this._mannequinClubLevel)
        {
            this.setView(MannequinWidget.WrongClubLevel);
            return;
        }

        if(session.gender.toLowerCase() != this._gender.toLowerCase())
        {
            this.setView(MannequinWidget.WrongGender);
            return;
        }

        this.handler.container.connection.send(new FurnitureMultiStateComposer(this._furniId));
        this._visible = false;
    }

    private changeOutfitName(): void
    {
        this.handler.container.connection.send(new FurnitureMannequinSaveNameComposer(this._furniId, this.outfitName));
    }


    public get figure(): string
    {
        return this._renderedFigure;
    }

    public get view(): string
    {
        return this._view;
    }
}
