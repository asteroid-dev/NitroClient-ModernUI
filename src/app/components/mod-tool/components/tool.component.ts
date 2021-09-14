import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Nitro, NitroLogger } from '@nitrots/nitro-renderer';

@Component({
    template: ''
})
export class ModTool implements OnInit, OnDestroy
{
    @Input()
    public visible: boolean = false;

    @Output()
    visibleChange = new EventEmitter<boolean>();
    private _logger: NitroLogger;

    constructor()
    {
        this._logger = new NitroLogger(this.constructor.name);
    }

    public ngOnInit(): void
    {
    }

    public ngOnDestroy(): void
    {
    }

    public hideTool(): void
    {
        this.visible = false;
    }

    public getTranslatedForKey(nameKey: string, fallback: string): string
    {
        const newKey = `modtools.nitro.${nameKey}`;
        const value = Nitro.instance.localization.getValue(newKey);

        if(value !== newKey) return value;

        //this._logger.warn(`Text for MODTools not found, key: '${newKey}', returning default value.`);

        return fallback;
    }

}
