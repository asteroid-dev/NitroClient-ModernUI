import { Component } from '@angular/core';
import { Nitro, ToolbarIconEnum } from '@nitrots/nitro-renderer';
import * as $ from "jquery";
import { SettingsService } from '../../../../core/settings/service';
import { SessionService } from '../../../../security/services/session.service';

@Component({
    selector: 'nitro-hotelview-component',
    templateUrl: './hotelview.template.html'
})
export class HotelViewComponent
{
    private _background: string;
    private _backgroundColour: string;
    private _sun: string;
    private _drape: string;
    private _left: string;
    private _right: string;
    private _rightRepeat: string;
    private _carousel1: string;
    private _carousel2: string;
    private _carousel3: string;
    private _carousel4: string;

    constructor(
        private settingsService: SettingsService,
        private sessionService: SessionService)
    {
        this._background        = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['background']);
        this._backgroundColour  = Nitro.instance.getConfiguration('hotelview.images')['background.colour'];
        this._sun               = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['sun']);
        this._drape             = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['drape']);
        this._left              = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['left']);
        this._right             = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['right']);
        this._rightRepeat       = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['right.repeat']);
        this._carousel1         = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['carousel1']);
        this._carousel2         = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['carousel2']);
        this._carousel3         = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['carousel3']);
        this._carousel4         = Nitro.instance.core.configuration.interpolate(Nitro.instance.getConfiguration('hotelview.images')['carousel4']);
    }

    public ngOnInit(): void
    {
        
        $(document).ready(function(){
            
         
          
            $(".rightclick").click(function(){
                var i = $(".carousel-main").scrollLeft();

                $(".carousel-main").scrollLeft(i + 700);
            })

            $(".leftclick").click(function(){
                var i = $(".carousel-main").scrollLeft();

                $(".carousel-main").scrollLeft(i - 700);
            })



        })

    }

    public clickIcon(name: string): void
    {
        if(!name || (name === '')) return;

        switch(name)
        {
            case ToolbarIconEnum.CATALOG:
                this.toggleCatalog();
        }
    }

    public getIconName(icon: string): string
    {
        switch(icon)
        {

            case ToolbarIconEnum.CATALOG:
                return 'icon-catalog';

            default:
                return '';
        }
    }

    public toggleCatalog(): void
    {
        this.settingsService.toggleCatalog();
    }

    public get figure(): string
    {
        return this.sessionService.figure;
    }

    public get background(): string
    {
        return (this._background || null);
    }

    public get backgroundColour(): string
    {
        return (this._backgroundColour || null);
    }

    public get sun(): string
    {
        return (this._sun || null);
    }

    public get drape(): string
    {
        return (this._drape || null);
    }

    public get left(): string
    {
        return (this._left || null);
    }

    public get right(): string
    {
        return (this._right || null);
    }

    public get rightRepeat(): string
    {
        return (this._rightRepeat || null);
    }

    public get carousel1(): string
    {
        return (this._carousel1 || null);
    }

    public get carousel2(): string
    {
        return (this._carousel2 || null);
    }

    public get carousel3(): string
    {
        return (this._carousel3 || null);
    }

    public get carousel4(): string
    {
        return (this._carousel4 || null);
    }
}
