import { animate, style, transition, trigger } from '@angular/animations';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../../core/settings/service';
import { AchievementsService } from '../../../achievements/services/achievements.service';
import { AvatarEditorService } from '../../../avatar-editor/services/avatar-editor.service';
import { NavigatorService } from '../../../navigator/services/navigator.service';

@Component({
    selector: 'nitro-toolbar-me-menu-component',
    templateUrl: './me-menu.template.html',
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ bottom: 10, opacity: 0 }),
                        animate('.3s ease-out',
                            style({ bottom: 77, opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ bottom: 77, opacity: 1 }),
                        animate('.3s ease-in',
                            style({ bottom: 10, opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})
export class MeMenuComponent implements OnInit, OnDestroy
{
    constructor(
        private _avatarEditorService: AvatarEditorService,
        private settingsService: SettingsService,
        private navigatorService: NavigatorService,
        private _achievementService: AchievementsService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {}

    public ngOnDestroy(): void
    {}

    public get isVisible(): boolean
    {
        return (this.settingsService.meMenuVisible || false);
    }

    public toggleAvatarEditor(): void
    {
        this._avatarEditorService.loadOwnAvatarInEditor();

        this.settingsService.toggleAvatarEditor();
    }

    public toggleAchievements(): void
    {
        this.settingsService.toggleAchievements();
    }

    public toggleNavigator(): void
    {
        this.settingsService.toggleNavigator();

        this.navigatorService.setCurrentContextByCode('myworld_view');
    }

    public toggleUserSettings(): void
    {
        this.settingsService.toggleUserSettings();
    }

    public get unseenAchievementsCount(): number
    {
        return this._achievementService.unseenCount;
    }
}
