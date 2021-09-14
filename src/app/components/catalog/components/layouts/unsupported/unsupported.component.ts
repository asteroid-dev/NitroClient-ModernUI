import { Component } from '@angular/core';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './unsupported.template.html'
})
export class CatalogLayoutUnsupportedComponent extends CatalogLayout
{
    public static CODE: string = 'UNSUPPORTED';
}