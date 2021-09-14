import { Injectable } from '@angular/core';
import { HabbopediaMainComponent } from '../components/main/main.component';
import { HabbopediaPageComponent } from '../components/page/page.component';

@Injectable()
export class HabbopediaService
{
    private _component: HabbopediaMainComponent;

    public openPage(link: string): void
    {
        if(!this._component) return;
    }

    public closePage(component: HabbopediaPageComponent): void
    {
        if(!component || !this._component) return;

        this._component.close(component);
    }

    public closeAll(): void
    {
        if(!this._component) return;

        this._component.closeAll();
    }

    public get component(): HabbopediaMainComponent
    {
        return this._component;
    }

    public set component(component: HabbopediaMainComponent)
    {
        this._component = component;
    }
}