import { Component, Input, Output } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';

@Component({
    selector: 'nitro-group-manager-tab-info-component',
    templateUrl: './tab-info.template.html'
})
export class GroupManagerTabInfoComponent
{
    @Input()
    @Output()
    public groupSettings: GroupSettings;

    @Input()
    public showNameError: boolean;

    @Input()
    public showDescriptionError: boolean;

    constructor()
    {}
}
