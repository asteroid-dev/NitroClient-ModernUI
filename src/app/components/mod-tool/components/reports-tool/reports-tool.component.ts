import { Component, Input, OnDestroy, EventEmitter, OnInit, Output } from '@angular/core';
import { ModTool } from '../tool.component';

@Component({
    selector: 'nitro-mod-tool-reports-component',
    templateUrl: './reports-tool.template.html'
})
export class ModToolReportsComponent extends ModTool implements OnInit, OnDestroy
{

    private _tab: number;

    constructor()
    {
        super();
        this._tab = 0;
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public get tab(): number
    {
        return this._tab;
    }

    public set tab(tab: number)
    {
        this._tab = tab;
    }

    public setTab(tab: number): void
    {
        this.tab = tab;
    }

}
