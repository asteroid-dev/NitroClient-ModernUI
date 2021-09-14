import { Component } from '@angular/core';
import { WiredService } from '../../services/wired.service';

@Component({
    selector: 'nitro-wired-base-component',
    templateUrl: './base.template.html'
})
export class WiredBaseComponent
{
    constructor(private _wiredService: WiredService)
    {}

    public save(): void
    {
        this._wiredService.component.save();
    }

    public hide(): void
    {
        this._wiredService.component.close();
    }

    public get furniName(): string
    {
        return this._wiredService.component.getFurniName();
    }

    public get furniDescription(): string
    {
        return this._wiredService.component.getFurniDescription();
    }

    public get requiresFurni(): boolean
    {
        return this._wiredService.component._Str_19885();
    }

    public get furniSelectionCount(): number
    {
        return this._wiredService.component.furniSelectedIds.length;
    }

    public get maximumFurniSelectionCount(): number
    {
        return this._wiredService.component.maximumItemSelectionCount;
    }

    public get wiredType(): string
    {
        const wiredFactory = this._wiredService.component._Str_19071();

        if(wiredFactory)
        {
            return wiredFactory._Str_1196();
        }

        return '';
    }
}
