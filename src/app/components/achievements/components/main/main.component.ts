import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { SettingsService } from '../../../../core/settings/service';
import { AchievementCategory } from '../../common/AchievementCategory';
import { AchievementsService } from '../../services/achievements.service';

@Component({
    selector: 'nitro-achievements-main-component',
    templateUrl: './main.template.html'
})
export class AchievementsMainComponent implements OnChanges
{
    @Input()
    public visible: boolean = false;

    constructor(
        private _settingsService: SettingsService,
        private _achivementsService: AchievementsService,
        private _ngZone: NgZone)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = (changes.visible.previousValue || false);
        const next = changes.visible.currentValue;

        if(next && (next !== prev)) this.prepareAchievements();
    }

    private prepareAchievements(): void
    {
        if(!this._achivementsService.isInitalized) this._achivementsService.loadAchievements();
    }

    public hide(): void
    {
        this._settingsService.hideAchievements();
    }

    public get selectedCategory(): AchievementCategory
    {
        return this._achivementsService.selectedCategory;
    }
}