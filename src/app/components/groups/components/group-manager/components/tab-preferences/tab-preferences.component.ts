import { Component, Input } from '@angular/core';
import GroupSettings from '../../../../common/GroupSettings';

@Component({
    selector: 'nitro-group-manager-tab-preferences-component',
    templateUrl: './tab-preferences.template.html'
})
export class GroupManagerTabPreferencesComponent
{
    private _groupSettings: GroupSettings;
    private _state: string;
    private _canMembersDecorate: boolean;

    constructor()
    {
        this._groupSettings         = null;
        this._state                 = '0';
        this._canMembersDecorate    = false;
    }

    public get groupSettings(): GroupSettings
    {
        return this._groupSettings;
    }

    @Input()
    public set groupSettings(settings: GroupSettings)
    {
        this._groupSettings = settings;
        this._state = this.groupSettings.state.toString();
        this._canMembersDecorate = this.groupSettings.canMembersDecorate;
    }

    public get state(): string
    {
        return this._state;
    }

    public set state(state: string)
    {
        this._state = state;
        this._groupSettings.state = parseInt(state);
    }

    public get canMembersDecorate(): boolean
    {
        return this._canMembersDecorate;
    }

    public set canMembersDecorate(canMembersDecorate: boolean)
    {
        this._canMembersDecorate = canMembersDecorate;
        this._groupSettings.canMembersDecorate = canMembersDecorate;
    }
}
