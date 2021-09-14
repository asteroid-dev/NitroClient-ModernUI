import { Component, Input } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';

@Component({
    selector: 'nitro-badge',
    template: `
    <img [src]="badgeUrl" image-placeholder />`
})
export class BadgeComponent
{
    @Input()
    public badge: string = '';

    @Input()
    public isGroup?: boolean = false;

    @Input()
    public hover?: boolean = true;

    public get badgeUrl(): string
    {
        if(this.isGroup)
        {
            return ((Nitro.instance.getConfiguration<string>('badge.asset.group.url')).replace('%badgedata%', this.badge));
        }
        else
        {
            return ((Nitro.instance.getConfiguration<string>('badge.asset.url')).replace('%badgename%', this.badge));
        }
    }
}
