import { Component, Input, OnInit, Output } from '@angular/core';
import { GroupBadgePart } from '@nitrots/nitro-renderer';
import GroupSettings from '../../../../common/GroupSettings';
import { GroupsService } from '../../../../services/groups.service';

@Component({
    selector: 'nitro-group-creator-tab-badge-component',
    templateUrl: './tab-badge.template.html'
})
export class GroupCreatorTabBadgeComponent implements OnInit
{
    @Input()
    @Output()
    public groupSettings: GroupSettings;

    @Input()
    public setDefaultValues: boolean;

    private _badgeBases: Map<number, string[]>;
    private _badgeSymbols: Map<number, string[]>;
    private _badgePartColors: Map<number, string>;

    private _badgePartBeingSelected: GroupBadgePart;
    private _selectorVisible: boolean;
    private _positions: number[];

    constructor(
        private _groupsService: GroupsService)
    {
        this._clear();
    }

    private _clear(): void
    {
        this._badgeBases                = new Map();
        this._badgeSymbols              = new Map();
        this._badgePartColors           = new Map();

        this._badgePartBeingSelected    = null;
        this._selectorVisible           = false;
        this._positions                 = [];

        for(let i = 0; i < 9; i++)
        {
            this._positions.push(i);
        }
    }

    ngOnInit(): void
    {
        this._clear();
        this.loadBadgeData();
    }

    public loadBadgeData(): void
    {
        this._badgeBases        = this._groupsService.badgeBases;
        this._badgeSymbols      = this._groupsService.badgeSymbols;
        this._badgePartColors   = this._groupsService.badgePartColors;

        if(this.setDefaultValues)
        {
            this.groupSettings.getBadgePart(0).key = this._badgeSymbols.keys().next().value;
            this.groupSettings.setPartsColor(this._badgePartColors.keys().next().value);
        }
    }

    public openPartSelector(part: GroupBadgePart): void
    {
        this._badgePartBeingSelected = part;
        this._selectorVisible = true;
    }

    public onPartSelected(id: number): void
    {
        this._badgePartBeingSelected.key = id;
        this._badgePartBeingSelected = null;
        this._selectorVisible = false;
    }

    public get badgePartBeingSelected(): GroupBadgePart
    {
        return this._badgePartBeingSelected;
    }

    public get selectorVisible(): boolean
    {
        return this._selectorVisible;
    }

    public get positions(): number[]
    {
        return this._positions;
    }

    public get badgeBases(): Map<number, string[]>
    {
        return this._badgeBases;
    }

    public get badgeSymbols(): Map<number, string[]>
    {
        return this._badgeSymbols;
    }

    public get badgePartColors(): Map<number, string>
    {
        return this._badgePartColors;
    }
}
