import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';

@Directive({
    selector: '[badge-image]'
})
export class BadgeImageDirective implements OnInit, OnChanges
{
    @Input()
    public badge: string = '';

    @Input()
    public isGroup: boolean = false;

    @Input()
    public asBackground: boolean = false;

    public needsUpdate: boolean = true;

    constructor(private elementRef: ElementRef<HTMLDivElement>)
    {}

    public ngOnInit(): void
    {
        if(this.needsUpdate) this.buildBadge();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const badgeChange = changes.badge;

        if(badgeChange)
        {
            if(badgeChange.previousValue !== badgeChange.currentValue) this.needsUpdate = true;
        }

        const groupChange = changes.isGroup;

        if(groupChange)
        {
            if(groupChange.previousValue !== groupChange.currentValue) this.needsUpdate = true;
        }

        if(this.needsUpdate) this.buildBadge();
    }

    private buildBadge(): void
    {
        this.needsUpdate = false;

        const imageUrl = this.badgeUrl;

        if(!imageUrl || !imageUrl.length) return;

        const element = this.elementRef.nativeElement;

        if(!element) return;

        if(this.asBackground)
        {
            element.style.backgroundImage = `url(${ imageUrl })`;
        }
        else
        {
            const existingImages = element.getElementsByClassName('badge-image');

            let i = existingImages.length;

            while(i < 0)
            {
                const imageElement = (existingImages[i] as HTMLImageElement);

                imageElement.remove();

                i--;
            }

            const imageElement = document.createElement('img');

            imageElement.className = 'badge-image';

            imageElement.src = imageUrl;
        }
    }

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
