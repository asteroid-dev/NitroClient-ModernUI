import { Component, Input, Output } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';

@Component({
    selector: 'nitro-group-creator-tab-info-component',
    templateUrl: './tab-info.template.html'
})
export class GroupCreatorTabInfoComponent
{
    @Input()
    @Output()
    public groupSettings: GroupSettings;

    @Input()
    public showNameError: boolean;

    @Input()
    public showDescriptionError: boolean;

    @Input()
    public showRoomError: boolean;

    @Input()
    public availableRooms: Map<number, string>;

    constructor()
    {}
}
