import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GroupSettingsParser, Nitro } from '@nitrots/nitro-renderer';
import { NotificationChoice } from '../../../../../notification/components/choices/choices.component';
import { NotificationService } from '../../../../../notification/services/notification.service';
import GroupSettings from '../../../../common/GroupSettings';
import { GroupsService } from '../../../../services/groups.service';

@Component({
    selector: 'nitro-group-manager-component',
    templateUrl: './group-manager.template.html'
})
export class GroupManagerComponent implements OnInit, OnDestroy
{
    public groupSettings: GroupSettings;
    public visible: boolean;

    private _currentTab: number;
    private _showNameError: boolean;
    private _showDescriptionError: boolean;

    constructor(
        private _groupService: GroupsService,
        private _notificationService: NotificationService,
        private _ngZone: NgZone)
    {
        this._groupService.groupManagerComponent = this;

        this._clear();
    }

    private _clear(): void
    {
        this.groupSettings          = new GroupSettings();
        this.visible                = false;

        this._currentTab            = 1;
        this._showNameError         = false;
        this._showDescriptionError  = false;
    }

    public ngOnInit(): void
    {
        this._clear();
    }

    public ngOnDestroy(): void
    {
        this._clear();
    }

    public load(settingsData: GroupSettingsParser): void
    {
        this._clear();

        this._ngZone.run(() =>
        {
            this.groupSettings.id                   = settingsData.id;
            this.groupSettings.name                 = settingsData.title;
            this.groupSettings.description          = settingsData.description;
            this.groupSettings.roomId               = settingsData.roomId.toString();
            this.groupSettings.badgeParts           = settingsData.badgeParts;
            this.groupSettings.colorA               = settingsData.colorA;
            this.groupSettings.colorB               = settingsData.colorB;
            this.groupSettings.state                = settingsData.state;
            this.groupSettings.canMembersDecorate   = settingsData.canMembersDecorate;

            this.visible                            = true;
        });
    }

    public setTab(tab: number): void
    {
        this._currentTab = tab;
    }

    public hide(): void
    {
        this.visible = false;
    }

    public save(): void
    {
        if(this.groupSettings.name.length === 0 || this.groupSettings.name.length > 29)
        {
            this._showNameError = true;
        }
        else
        {
            this._showNameError = false;
        }

        if(this.groupSettings.description.length > 254)
        {
            this._showDescriptionError = true;
        }
        else
        {
            this._showDescriptionError = false;
        }

        if(this._showNameError || this._showDescriptionError)
        {
            this._currentTab = 1;
            return;
        }

        this._groupService.save(this.groupSettings);
    }

    public delete(): void
    {
        const title = Nitro.instance.localization.getValue('group.deleteconfirm.title');
        const message = Nitro.instance.localization.getValue('group.deleteconfirm.desc');

        const choices = [
            new NotificationChoice('group.delete', () =>
            {
                this._groupService.deleteGroup(this.groupSettings.id);
                this.hide();
                this._groupService.groupInfoComponent.clear();
            }, ['btn-danger']),
            new NotificationChoice('generic.close', () =>
            {}, ['btn-primary'])
        ];

        this._notificationService.alertWithChoices(message, choices, title);
    }

    public get currentTab(): number
    {
        return this._currentTab;
    }

    public get showNameError(): boolean
    {
        return this._showNameError;
    }

    public get showDescriptionError(): boolean
    {
        return this._showDescriptionError;
    }
}
