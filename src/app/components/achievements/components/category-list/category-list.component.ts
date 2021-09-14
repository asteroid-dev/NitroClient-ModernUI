import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { AchievementData, Nitro } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { AchievementCategory } from '../../common/AchievementCategory';
import { AchievementsService } from '../../services/achievements.service';

@Component({
    selector: '[nitro-achievements-category-list-component]',
    templateUrl: './category-list.template.html'
})
export class AchievementsCategoryListComponent
{
    @Input()
    public visible: boolean = false;

    @ViewChild('progressBar')
    public progressBar: ElementRef<HTMLElement>;

    constructor(
        private _settingsService: SettingsService,
        private _achivementsService: AchievementsService,
        private _ngZone: NgZone)
    {}

    public selectCategory(category: AchievementCategory): void
    {
        this._achivementsService.selectedCategory = category;
    }

    public getProgressNumbers(): [ number, number ]
    {
        let completed   = 0;
        let total       = 0;

        for(const category of this.categories)
        {
            if(!category) continue;

            for(const achievement of category.achievements)
            {
                if(!achievement) continue;

                completed += (achievement.finalLevel) ? achievement.level : (achievement.level - 1);
                total += achievement.levelCount;
            }
        }

        return [ completed, total ];
    }

    public getProgressPercentageString(): string
    {
        const [ completed, total ] = this.getProgressNumbers();

        return (Math.trunc(completed / total * 100) + '%');
    }

    public getProgressString(): string
    {
        const [ completed, total ] = this.getProgressNumbers();

        return (completed + '/' + total);
    }

    public getCategoryImage(cat: string, achievements: AchievementData[], icon: boolean = false): string
    {
        if(icon) return Nitro.instance.getConfiguration('achievements.images.url', Nitro.instance.core.configuration.getValue('image.library.url') + `quests/achcategory_${cat}.png`).toString().replace('%image%',cat);

        let level = 0;

        for(const achievement of achievements)
        {
            level = (level + ((achievement.finalLevel) ? achievement.level : (achievement.level - 1)));
        }

        const isActive = ((level > 0) ? 'active' : 'inactive');

        return Nitro.instance.getConfiguration('achievements.images.url', Nitro.instance.core.configuration.getValue('image.library.url') + `quests/achcategory_${cat}_${isActive}.png`).toString().replace('%image%',`achcategory_${cat}_${isActive}`);
    }

    public getCategoryProgress(achievements: AchievementData[]): string
    {
        let completed   = 0;
        let total       = 0;

        for(const achievement of achievements)
        {
            if(!achievement) continue;

            if(achievement.firstLevelAchieved) completed = (completed + ((achievement.finalLevel) ? achievement.level : (achievement.level - 1)));

            total = (total + achievement.levelCount);
        }

        return (completed + '/' + total);
    }

    public getUnseenCount(category: AchievementCategory): number
    {
        let unseen = 0;

        if(category)
        {
            for(const achievement of category.achievements)
            {
                if(!achievement) continue;

                unseen = (unseen + achievement.unseen);
            }
        }

        return unseen;
    }

    public get categories(): AchievementCategory[]
    {
        return this._achivementsService.categories;
    }

    public get selectedCategory(): AchievementCategory
    {
        return this._achivementsService.selectedCategory;
    }

    public get achievementScore(): number
    {
        return this._achivementsService.achievementScore;
    }
}
