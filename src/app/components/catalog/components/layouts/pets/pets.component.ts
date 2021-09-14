import { Component } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './pets.template.html'
})
export class CatalogLayoutPetsComponent extends CatalogLayout
{
    public static CODE: string = 'pets';
}