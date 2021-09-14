import { Directive } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from './components/main/main.component';
import { WiredService } from './services/wired.service';

@Directive()
export class WiredFurniture
{
    constructor(
        protected _wiredService: WiredService,
        protected _formBuilder: FormBuilder)
    {}

    public get code(): number
    {
        return -1;
    }

    public get negativeCode(): number
    {
        return -1;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5431;
    }

    public get hasStateSnapshot(): boolean
    {
        return false;
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [];
    }

    public readStringParamFromForm(): string
    {
        return '';
    }

    public onInitStart(): void
    {
    }

    public onEditStart(trigger: Triggerable): void
    {
    }

    public get hasSpecialInputs(): boolean
    {
        return false;
    }

    public validate(): string
    {
        return null;
    }

    public static getLocaleName(value: number): string
    {
        const time = Math.floor((value / 2));

        if(!(value % 2)) return time.toString();

        return (time + 0.5).toString();
    }
}
