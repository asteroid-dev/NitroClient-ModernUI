import { Component } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './pets2.template.html'
})
export class CatalogLayoutPets2Component extends CatalogLayout
{
    public static CODE: string = 'pets2';
}