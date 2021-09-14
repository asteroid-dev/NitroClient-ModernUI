import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { ILinkEventTracker, Nitro } from '@nitrots/nitro-renderer';
import { HabbopediaService } from '../../services/habbopedia.service';
import { HabbopediaPageComponent } from '../page/page.component';

@Component({
    selector: 'nitro-pedia-main-component',
    templateUrl: './main.template.html'
})
export class HabbopediaMainComponent implements OnInit, OnDestroy, ILinkEventTracker
{
    @ViewChild('pagesContainer', { read: ViewContainerRef })
    public pagesContainer: ViewContainerRef;

    private _pages: Map<HabbopediaPageComponent, ComponentRef<HabbopediaPageComponent>> = new Map();

    constructor(
        private _habbopediaService: HabbopediaService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._habbopediaService.component = this;

        Nitro.instance.addLinkEventTracker(this);
    }

    public ngOnDestroy(): void
    {
        Nitro.instance.removeLinkEventTracker(this);

        this._habbopediaService.component = null;
    }

    public openPage(url: string): void
    {
        this.buildPage(HabbopediaPageComponent, url);
    }

    public buildPage(type: typeof HabbopediaPageComponent, url: string): HabbopediaPageComponent
    {
        const component = this.createComponent(type);

        if(!component) return null;

        component.url = url;

        return component;
    }

    private createComponent(type: typeof HabbopediaPageComponent): HabbopediaPageComponent
    {
        if(!type) return null;

        const factory = this._componentFactoryResolver.resolveComponentFactory(type);

        let ref: ComponentRef<HabbopediaPageComponent> = null;

        if(factory)
        {
            ref = this.pagesContainer.createComponent(factory);

            this._pages.set(ref.instance, ref);
        }

        return ref.instance;
    }

    public close(component: HabbopediaPageComponent): void
    {
        if(!component) return;

        const ref = this._pages.get(component);

        if(!ref) return;

        this._pages.delete(component);

        this.removeView(ref.hostView);
    }

    public closeAll(): void
    {
        for(const component of this._pages.keys()) this.close(component);
    }

    private removeView(view: ViewRef): void
    {
        if(!view) return;

        const index = this.pagesContainer.indexOf(view);

        if(index === -1) return;

        this.pagesContainer.remove(index);
    }

    public linkReceived(link: string): void
    {
        const parts: string[] = link.split('/');

        if(parts.length < 2) return;

        parts.shift();

        this.openPage(parts.join('/'));
    }

    public get eventUrlPrefix(): string
    {
        return 'habbopages/';
    }
}
