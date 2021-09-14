import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IGetImageListener, ImageResult, Nitro, NitroRenderTexture, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';
import { ProductTypeEnum } from '../../../components/catalog/enums/ProductTypeEnum';

@Component({
    selector: '[nitro-furniture-image]',
    templateUrl: './furniture-image.template.html'
})
export class FurnitureImageComponent implements OnInit, OnChanges, IGetImageListener
{
    @Input()
    public type = 's';

    @Input()
    public spriteId = -1;

    @Input()
    public direction: number = 0;

    @Input()
    public extras = '';

    public imageUrl: string     = null;
    public needsUpdate: boolean = true;

    constructor(private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        if(this.needsUpdate) this.buildImage();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const typeChange = changes.type;

        if(typeChange)
        {
            if(typeChange.previousValue !== typeChange.currentValue) this.needsUpdate = true;
        }

        const spriteIdChange = changes.spriteId;

        if(spriteIdChange)
        {
            if(spriteIdChange.previousValue !== spriteIdChange.currentValue) this.needsUpdate = true;
        }

        const directionChange = changes.direction;

        if(directionChange)
        {
            if(directionChange.previousValue !== directionChange.currentValue) this.needsUpdate = true;
        }

        const extrasChange = changes.extras;

        if(extrasChange)
        {
            if(extrasChange.previousValue !== extrasChange.currentValue) this.needsUpdate = true;
        }

        if(this.needsUpdate) this.buildImage();
    }

    private buildImage(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.needsUpdate = false;

            let imageResult: ImageResult = null;

            const type = this.type.toLocaleLowerCase();

            switch(type)
            {
                case ProductTypeEnum.FLOOR:
                    imageResult = Nitro.instance.roomEngine.getFurnitureFloorImage(this.spriteId, new Vector3d(this.direction), 64, this, 0, this.extras);
                    break;
                case ProductTypeEnum.WALL:
                    imageResult = Nitro.instance.roomEngine.getFurnitureWallImage(this.spriteId, new Vector3d(this.direction), 64, this, 0, this.extras);
                    break;
            }

            if(imageResult)
            {
                const image = imageResult.getImage();

                if(image) this._ngZone.run(() => (this.imageUrl = image.src));
            }
        });
    }

    public imageReady(id: number, texture: NitroRenderTexture, image: HTMLImageElement): void
    {
        if(!texture) return;

        if(image)
        {
            this._ngZone.run(() => (this.imageUrl = image.src));

            return;
        }

        if(texture)
        {
            const imageUrl = TextureUtils.generateImageUrl(texture);

            if(imageUrl) this._ngZone.run(() => (this.imageUrl = imageUrl));
        }
    }

    public imageFailed(id: number): void
    {
        return;
    }
}
