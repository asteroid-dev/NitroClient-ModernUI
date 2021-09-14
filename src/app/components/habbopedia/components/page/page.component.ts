import { Component } from '@angular/core';
import { HabbopediaService } from '../../services/habbopedia.service';

@Component({
    templateUrl: './page.template.html'
})
export class HabbopediaPageComponent
{
    public url: string = '';

    constructor(
        private _habbopediaService: HabbopediaService
    )
    {}

    public close(): void
    {
        this._habbopediaService.closePage(this);
    }
}