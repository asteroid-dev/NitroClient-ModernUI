import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AchievementData, AchievementEvent, AchievementsEvent, AchievementsScoreEvent, IMessageEvent, Nitro, RequestAchievementsMessageComposer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../core/settings/service';
import { AchievementCategory } from '../common/AchievementCategory';

@Injectable()
export class AchievementsService implements OnDestroy
{
    private _messages: IMessageEvent[] = [];

    private _categories: AchievementCategory[]      = [];
    private _selectedCategory: AchievementCategory  = null;
    private _achievementScore: number               = 0;
    private _isInitalized: boolean                  = false;

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new AchievementsEvent(this.onAchievementsMessageEvent.bind(this)),
                new AchievementsScoreEvent(this.onAchievementsScoreEvent.bind(this)),
                new AchievementEvent(this.onAchievementEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    public onAchievementsScoreEvent(event: AchievementsScoreEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._achievementScore = parser.score));
    }

    public onAchievementsMessageEvent(event: AchievementsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const categories: AchievementCategory[] = [];

        for(const achievement of parser.achievements)
        {
            if(!achievement) continue;

            let existing: AchievementCategory = null;

            for(const category of categories)
            {
                if(!category || (category.name !== achievement.category)) continue;

                existing = category;

                break;
            }

            if(!existing)
            {
                existing = new AchievementCategory(achievement.category);

                categories.push(existing);
            }

            existing.achievements.push(achievement);
        }

        this._ngZone.run(() =>
        {
            this._categories        = categories;
            this._selectedCategory  = this._categories[0];

            this._isInitalized = true;
        });
    }

    public onAchievementEvent(event: AchievementEvent)
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const updatedAchievement = parser.achievement;

        if(!updatedAchievement) return;

        this._ngZone.run(() =>
        {
            for(const category of this._categories)
            {
                if(!category || (category.name !== updatedAchievement.category)) continue;

                let updated = false;

                for(const achievement of category.achievements)
                {
                    if(!achievement || (achievement.achievementId !== updatedAchievement.achievementId)) continue;

                    updated = true;

                    if(achievement.progress !== updatedAchievement.progress)
                    {
                        achievement.reset(updatedAchievement);

                        if(!this.isIgnoredAchievement(achievement))
                        {
                            if(this._selectedCategory !== category) achievement.unseen++;
                        }
                    }

                    break;
                }

                if(updated) break;
            }
        });
    }

    public isIgnoredAchievement(achievement: AchievementData): boolean
    {
        if(!achievement) return false;

        const ignored   = Nitro.instance.getConfiguration<string[]>('achievements.unseen.ignored');
        const value     = achievement.badgeId.replace(/[0-9]/g, '');
        const index     = ignored.indexOf(value);

        if(index >= 0) return true;

        return false;
    }

    public loadAchievements(): void
    {
        Nitro.instance.communication.connection.send(new RequestAchievementsMessageComposer());
    }

    public get categories(): AchievementCategory[]
    {
        return this._categories;
    }

    public get selectedCategory(): AchievementCategory
    {
        return this._selectedCategory;
    }

    public set selectedCategory(category: AchievementCategory)
    {
        this._selectedCategory = category;
    }

    public get achievementScore(): number
    {
        return this._achievementScore;
    }

    public get isInitalized(): boolean
    {
        return this._isInitalized;
    }

    public get unseenCount(): number
    {
        let unseenCount = 0;

        for(const category of this._categories)
        {
            if(!category) continue;

            for(const achievement of category.achievements)
            {
                if(!achievement) continue;

                unseenCount = (unseenCount + achievement.unseen);
            }
        }

        return unseenCount;
    }
}
