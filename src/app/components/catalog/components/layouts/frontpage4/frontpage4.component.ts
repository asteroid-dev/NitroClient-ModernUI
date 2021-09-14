import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './frontpage4.template.html'
})
export class CatalogLayoutFrontPage4Component extends CatalogLayout
{
    public static CODE: string = 'frontpage4';

    public getImagesUrl(): string
    {
        return Nitro.instance.core.configuration.getValue('image.library.url');
    }
}
