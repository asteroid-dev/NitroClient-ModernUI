import { Component, Input, OnInit, Output } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';
import { GroupsService } from '../../../../services/groups.service';

@Component({
    selector: 'nitro-group-creator-tab-colors-component',
    templateUrl: './tab-colors.template.html'
})
export class GroupCreatorTabColorsComponent implements OnInit
{
    @Input()
    @Output()
    public groupSettings: GroupSettings;

    @Input()
    public setDefaultValues: boolean;

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

        if(this.setDefaultValues)
        {
            this.groupSettings.colorA = this._groupColorsA.keys().next().value;
            this.groupSettings.colorB = this._groupColorsB.keys().next().value;
        }
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
