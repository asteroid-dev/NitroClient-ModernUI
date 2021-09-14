import { Component } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './frontpage-featured.template.html'
})
export class CatalogLayoutFrontPageFeaturedComponent extends CatalogLayout
{
    public static CODE: string = 'frontpage_featured';
}