import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AdvancedMap, AvatarScaleType, AvatarSetType, IAvatarImageListener, Nitro } from '@nitrots/nitro-renderer';

@Directive({
    selector: '[avatar-image]'
})
export class AvatarImageDirective implements OnInit, OnChanges, IAvatarImageListener
{
    private static MAX_CACHE_SIZE: number = 10;

    @Input()
    public figure: string = '';

    @Input()
    public gender: string = 'M';

    @Input()
    public headOnly: boolean = false;

    @Input()
    public direction: number = 0;

    @Input()
    public scale: number = 1;

    @Input()
    public asBackground: boolean = false;

    private _avatarImageCache: AdvancedMap<string, string> = new AdvancedMap();

    public avatarUrl: string	= null;
    public disposed: boolean	= false;
    public needsUpdate: boolean	= true;

    constructor(private elementRef: ElementRef<HTMLDivElement>)
    {}

    public ngOnInit(): void
    {
        if(this.needsUpdate) this.buildAvatar();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const figureChange = changes.figure;

        if(figureChange)
        {
            if(figureChange.previousValue !== figureChange.currentValue) this.needsUpdate = true;
        }

        const genderChange = changes.gender;

        if(genderChange)
        {
            if(genderChange.previousValue !== genderChange.currentValue) this.needsUpdate = true;
        }

        const headOnlyChange = changes.headOnly;

        if(headOnlyChange)
        {
            if(headOnlyChange.previousValue !== headOnlyChange.currentValue) this.needsUpdate = true;
        }

        const directionChange = changes.direction;

        if(directionChange)
        {
            if(directionChange.previousValue !== directionChange.currentValue) this.needsUpdate = true;
        }

        if(this.needsUpdate) this.buildAvatar();
    }

    public dispose(): void
    {
        if(this.disposed) return;
    }

    public resetFigure(figure: string): void
    {
        this._avatarImageCache.remove(this.getAvatarBuildString());

        this.buildAvatar();
    }

    private buildAvatar(): void
    {
        this.needsUpdate = false;

        const imageUrl = this.getUserImageUrl();

        if(!imageUrl || !imageUrl.length) return;

        const element = this.elementRef.nativeElement;

        if(!element) return;

        if(this.asBackground)
        {
            element.style.backgroundImage = `url(${ imageUrl })`;
            element.style.backgroundPositionY = '-31px';
        }
        else
        {
            const existingImages = element.getElementsByClassName('avatar-image');

            let i = existingImages.length;

            while(i < 0)
            {
                const imageElement = (existingImages[i] as HTMLImageElement);

                imageElement.remove();

                i--;
            }

            const imageElement = document.createElement('img');

            imageElement.className = `avatar-image scale-${ this.scale }`;

            imageElement.src = imageUrl;
        }
    }

    private getUserImageUrl(): string
    {
        const build = this.getAvatarBuildString();

        let existing = this._avatarImageCache.getValue(build);

        if(!existing)
        {
            const avatarImage = Nitro.instance.avatar.createAvatarImage(this.figure, AvatarScaleType.LARGE, this.gender, this, null);

            if(avatarImage)
            {
                let setType = AvatarSetType.FULL;

                if(this.headOnly) setType = AvatarSetType.HEAD;

                avatarImage.setDirection(setType, this.direction);

                const image = avatarImage.getCroppedImage(setType);

                if(image) existing = image.src;

                avatarImage.dispose();
            }

            if(existing && existing.length) this.putInCache(build, existing);
        }

        return existing;
    }

    private putInCache(build: string, url: string): void
    {
        if(this._avatarImageCache.length === AvatarImageDirective.MAX_CACHE_SIZE) this._avatarImageCache.remove(this._avatarImageCache.getKey(0));

        this._avatarImageCache.add(build, url);
    }

    public getAvatarBuildString(): string
    {
        return (`${ this.figure }:${ this.gender }:${ this.direction }:${ this.headOnly }`);
    }
}
