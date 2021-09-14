import { Component } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { CatalogLayout } from '../../../CatalogLayout';

@Component({
    templateUrl: './guild-frontpage.template.html'
})
export class CatalogLayoutGuildFrontPageComponent extends CatalogLayout
{
    public static CODE: string = 'guild_frontpage';

    public openGroupCreator(): void
    {
        Nitro.instance.createLinkEvent('groups/create');
    }
}
