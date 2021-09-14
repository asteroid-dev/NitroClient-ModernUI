import { Component, NgZone, OnInit } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { NavigatorService } from '../../services/navigator.service';

@Component({
    selector: '[nitro-navigator-slider-component]',
    templateUrl: './slider.template.html'
})
export class NavigatorSliderComponent implements OnInit
{
    private _sliderContent: Array<Object>;

    constructor(
        private _navigatorService: NavigatorService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._sliderContent = Nitro.instance.core.configuration.getValue('navigator.slider.content');
    }

    public visit(room: number): void
    {
        this._navigatorService.goToPrivateRoom(room);
    }

    public get sliderContent(): Object
    {
        return this._sliderContent;
    }
}
