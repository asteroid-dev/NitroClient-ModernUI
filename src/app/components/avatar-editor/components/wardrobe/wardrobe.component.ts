import { Component, Input } from '@angular/core';
import * as $ from "jquery";
import { FigureData } from '../../common/FigureData';
import { AvatarEditorService } from '../../services/avatar-editor.service';

@Component({
    selector: '[nitro-avatar-wardrobe-component]',
    templateUrl: './wardrobe.template.html'
})
export class AvatarEditorWardrobeComponent
{
    public readonly maxServerPage: number = 1;
    public readonly maxClientPage: number = 2;
    public readonly looksPerClientPage: number = 24;

    @Input()
    public figureData: FigureData = null;

    private _currentServerPage: number = 1;
    private _currentClientPage: number = 1;
    private _maxLoadedServerPage: number = 1;
    private _looks: Map<number, string[]> = new Map();

    constructor(
        private _avatarEditorService: AvatarEditorService)
    {
        this._avatarEditorService.wardrobeComponent = this;
        this._requestLooks(this._currentServerPage);
    }

    public ngOnInit() : void{

        $(function(){
            $(".wardrobe-menu").click(function(){
               $(".modern-wardrobe-main").addClass("wardrobe-dblock")
               $(this).addClass("modernmenu-active")
               $(".ae-othermenu").removeClass("modernmenu-active");
            })

            $(".ae-othermenu").click(function(){
                $(this).addClass("modernmenu-active")
                $(".wardrobe-menu").removeClass("modernmenu-active");
                $(".modern-wardrobe-main").removeClass("wardrobe-dblock")
            })
        })
       
    }
    
    public previousPage(): void
    {
        if(this._currentClientPage === 1) return;

        this._currentClientPage--;
    }

    public nextPage(): void
    {
        if(this._currentClientPage === this.maxClientPage) return;

        this._currentClientPage++;

        if((this._currentClientPage - 1) % 2 === 0)
        {

            if(this._currentServerPage < this.maxServerPage)
            {
                this._currentServerPage++;

                if(this._currentServerPage < this._maxLoadedServerPage) return;

                this._maxLoadedServerPage = this._currentServerPage;

                this._requestLooks(this._currentServerPage);
            }
        }
    }

    public getLook(index: number): string
    {
        const realIndex = this.getRealIndex(index);

        if(!this._looks.has(realIndex)) return null;

        return this._looks.get(realIndex)[0];
    }

    public setLook(index: number, look: string, gender: string): void
    {
        this._looks.set(index, [look, gender]);
    }

    public updateLook(index: number): void
    {
        const realIndex = this.getRealIndex(index);

        this._looks.set(realIndex, [this._avatarEditorService.currentEditorLook, this._avatarEditorService.currentEditorGender]);
        this._avatarEditorService.setWardrobeSlot(realIndex);
    }

    public loadLook(index: number): void
    {
        const realIndex = this.getRealIndex(index);

        if(!this._looks.has(realIndex)) return;

        const look = this._looks.get(realIndex);

        this._avatarEditorService.loadAvatarInEditor(look[0], look[1]);
    }

    public counter()
    {
        return new Array(this.looksPerClientPage);
    }

    public getRealIndex(index: number): number
    {
        return (index + ((this._currentClientPage - 1) * this.looksPerClientPage));
    }

    private _requestLooks(pageId: number): void
    {
        this._avatarEditorService.requestWardrobePage(pageId);
    }

    public get currentPage(): number
    {
        return this._currentClientPage;
    }
}
