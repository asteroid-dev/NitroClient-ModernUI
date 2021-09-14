import { Component } from '@angular/core';
import { CatalogLayoutDefaultComponent } from '../default/default.component';

@Component({
    templateUrl: './bots.template.html'
})
export class CatalogLayoutBotsComponent extends CatalogLayoutDefaultComponent
{
    public static CODE: string = 'bots';
}
