import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AchievementData, Nitro } from '@nitrots/nitro-renderer';
import { AchievementCategory } from '../../common/AchievementCategory';
import { AchievementsService } from '../../services/achievements.service';
import { BadgeBaseAndLevel } from '../../utils/badge-base-and-level';

@Component({
    selector: '[nitro-achievements-category-component]',
    templateUrl: './category.template.html'
})
export class AchievementsCategoryComponent implements OnChanges
{
    @Input()
    public category: AchievementCategory = null;

    private _selectedAchievement: AchievementData = null;

    constructor(
        private _achivementsService: AchievementsService)
    {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.category.previousValue;
        const next = changes.category.currentValue;

        if(next && (next !== prev)) this._selectedAchievement = null;
    }

    public selectAchievement(achievement: AchievementData)
    {
        achievement.unseen = 0;

        this._selectedAchievement = achievement;
    }

    private getAchievedBadgeId(achievement: AchievementData): string
    {
        return (achievement.finalLevel) ? achievement.badgeId : Nitro.instance.localization.getBadgeBaseAndLevel(achievement.badgeId);
    }

    public getBadgeText(badge: AchievementData, desc = false): string
    {
        const str: string = this.getAchievedBadgeId(badge);

        const badgeBase = new BadgeBaseAndLevel(str);

        let charReplaced: string;

        if(desc)
        {
            charReplaced = this.getText(['badge_desc_' + str, 'badge_desc_' + badgeBase.base]);
        }
        else
        {
            charReplaced = this.getText(['badge_name_' + str, 'badge_name_' + badgeBase.base]);
        }

        return charReplaced
            .replace('%roman%', this.getRomanNumeral(badgeBase.level))
            .replace('%limit%',badge.scoreLimit.toString());
    }

    private getText(texts: string[]): string
    {
        let value = '';

        let i = 0;

        while(i < texts.length)
        {
            const text = texts[i];

            value = Nitro.instance.getLocalization(text);

            if(value !== text) return value;

            i++;
        }

        return '';
    }

    public getProgress(badge: AchievementData, stringify = false): string
    {
        if(!badge) return;

        if(stringify) return badge.progress + '/' + badge.toNextProgress;

        return Math.trunc(badge.progress / badge.toNextProgress * 100) + '%';
    }

    public getBadgeLevelString(badge: AchievementData): string
    {
        if(!badge) return;

        let string = Nitro.instance.getLocalization('achievements.details.level');

        string = string.replace('%level%', Math.max(1,badge.level - 1).toString());
        string = string.replace('%limit%',badge.levelCount.toString());

        return string;
    }

    public getRomanNumeral(number: number): string
    {
        return Nitro.instance.localization.getRomanNumeral(number);
    }

    public getBadgeImageUrl(badge: AchievementData): string
    {
        let badgeId = badge.badgeId;

        if(badge.levelCount > 1)
        {
            badgeId = badgeId.replace(/[0-9]/g, '');
            badgeId = (badgeId + (((badge.level - 1) > 0) ? (badge.level - 1) : badge.level));
        }

        return Nitro.instance.sessionDataManager.getBadgeUrl(badgeId);
    }

    public getCurrencyUrl(type: number): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type.toString());
    }

    public get selectedAchievement(): AchievementData
    {
        return this._selectedAchievement;
    }
}
