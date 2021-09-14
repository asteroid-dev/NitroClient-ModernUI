import { Component, Input } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';
import { GroupsService } from '../../../../services/groups.service';

@Component({
    selector: 'nitro-group-creator-tab-confirmation-component',
    templateUrl: './tab-confirmation.template.html'
})
export class GroupCreatorTabConfirmationComponent
{
    @Input()
    public groupSettings: GroupSettings;

    @Input()
    public groupCost: number;

    private _groupColorsA: Map<number, string>;
    private _groupColorsB: Map<number, string>;

    constructor(
        private _groupsService: GroupsService)
    {}

    ngOnInit(): void
    {
        this.loadColorsData();
    }

    public loadColorsData(): void
    {
        this._groupColorsA = this._groupsService.groupColorsA;
        this._groupColorsB = this._groupsService.groupColorsB;
    }

    public get groupColorsA(): Map<number, string>
    {
        return this._groupColorsA;
    }

    public get groupColorsB(): Map<number, string>
    {
        return this._groupColorsB;
    }
}
