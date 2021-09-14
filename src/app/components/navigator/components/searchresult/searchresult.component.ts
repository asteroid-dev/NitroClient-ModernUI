import { Component, Input, OnInit } from '@angular/core';
import { NavigatorSearchResultList } from '@nitrots/nitro-renderer';
import { NavigatorDisplayMode } from '../search/NavigatorDisplayMode';

@Component({
    selector: '[nitro-navigator-search-result-component]',
    templateUrl: './searchresult.template.html'
})
export class NavigatorSearchResultComponent implements OnInit
{
    @Input()
    public result: NavigatorSearchResultList;

    private _displayMode: number;
    private _isCollapsed: boolean;

    public ngOnInit(): void
    {
        this._displayMode = this.result.mode;
        this._isCollapsed = this.result.closed;
    }

    public toggleListMode(): void
    {
        if(this._displayMode === NavigatorDisplayMode.FORCED_THUMBNAILS) return;

        if(this._displayMode === NavigatorDisplayMode.LIST)
        {
            this._displayMode = NavigatorDisplayMode.THUMBNAILS;

            return;
        }

        this._displayMode = NavigatorDisplayMode.LIST;
    }

    public toggleCollapsed(): void
    {
        this._isCollapsed = !this._isCollapsed;
    }

    public get resultCode(): string
    {
        let name = this.result.code;

        if((!name || name.length == 0) && (this.result.data && this.result.data.length > 0))
        {
            return this.result.data;
        }

        if(this.result.code.startsWith('${'))
        {
            name = name.substr(2, (name.length - 3));
        }
        else
        {
            name = ('navigator.searchcode.title.' + name);
        }

        return name;
    }

    public get displayMode(): number
    {
        return this._displayMode;
    }

    public get isCollapsed(): boolean
    {
        return !this._isCollapsed;
    }
}
