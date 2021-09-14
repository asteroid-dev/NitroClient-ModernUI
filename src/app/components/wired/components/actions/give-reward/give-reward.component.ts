import { Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './give-reward.template.html'
})
export class GiveRewardComponent extends WiredAction
{
    private static LIMIT_MINIMUM_VALUE: number = 1;
    private static LIMIT_MAXIMUM_VALUE: number = 1000;
    private static LIMIT_STEPPER_VALUE: number = 1;

    public static CODE: number = WiredActionType.GIVE_REWARD;

    public readonly SETTING_ONCE: string = '0';
    public readonly SETTING_N_MINS: string = '3';
    public readonly SETTING_N_HOURS: string = '2';
    public readonly SETTING_N_DAYS: string = '1';

    public limitEnabled: boolean;
    public rewardsLimit: number;

    public rewardTime: string;
    public limitationInterval: string = '1';

    public uniqueRewards: boolean = false;
    public rewardRows: RewardRow[] = [];

    public get code(): number
    {
        return GiveRewardComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        this.rewardTime = (trigger.intData.length > 0 ? trigger.intData[0] : 0).toString();
        this.uniqueRewards = trigger.intData.length > 1 ? trigger.intData[1] == 1 : false;
        this.rewardsLimit = trigger.intData.length > 2 ? trigger.intData[2] : 0;
        this.limitationInterval = trigger.intData.length > 3 ? trigger.intData[3].toString() : '';
        this.limitEnabled = this.limitationInterval.length > 0;

        if(trigger.stringData.length > 0 && trigger.stringData.includes(';'))
        {
            const rewardRows = trigger.stringData.split(';');
            rewardRows.forEach(row =>
            {
                if(row.length > 0 && row.includes(','))
                {
                    const rowValues = row.split(',');

                    if(rowValues.length == 3)
                    {
                        const badge = rowValues[0] == '0'; // Blame Habbo for this :'(
                        const itemCode = rowValues[1];
                        const probability = rowValues[2];
                        this.rewardRows.push({ badge: badge, itemCode: itemCode, probability: probability });
                    }
                }
            });
        }
        if(this.rewardRows.length < 4)
        {
            for(let i = this.rewardRows.length; i < 4; i++)
            {
                this.rewardRows.push({ badge: false, itemCode: '', probability: '' });
            }
        }
        super.onEditStart(trigger);
    }

    public readIntegerParamsFromForm(): number[]
    {
        return [
            Number.parseInt(this.rewardTime),
            this.uniqueRewards ? 1 : 0,
            this.rewardsLimit,
            Number.parseInt(this.limitationInterval)
        ];
    }

    public readStringParamFromForm(): string
    {
        let rewards = '';
        for(let i = 0; i < this.rewardRows.length; i++)
        {
            const row = this.rewardRows[i];
            if(row.itemCode == '')
            {
                continue;
            }

            const probability = row.probability.toString();
            const stringData = [
                row.badge ? 0 : 1,
                row.itemCode,
                probability.length > 0 ? probability : 0
            ].join(',');
            rewards  = rewards + (rewards == '' ? '' : ';') + stringData;
        }
        return rewards;
    }

    public decreaseLimit(): void
    {
        this.rewardsLimit -= 1;

        if(this.rewardsLimit < GiveRewardComponent.LIMIT_MINIMUM_VALUE) this.rewardsLimit = GiveRewardComponent.LIMIT_MINIMUM_VALUE;
    }

    public increaseLimit(): void
    {
        this.rewardsLimit += 1;

        if(this.rewardsLimit > GiveRewardComponent.LIMIT_MAXIMUM_VALUE) this.rewardsLimit = GiveRewardComponent.LIMIT_MAXIMUM_VALUE;
    }

    public increaseRewardsCount(): void
    {
        this.rewardRows.push({ badge: false, itemCode: '', probability: '' });
    }

    public get limitSliderOptions(): Options
    {
        return {
            floor: GiveRewardComponent.LIMIT_MINIMUM_VALUE,
            ceil: GiveRewardComponent.LIMIT_MAXIMUM_VALUE,
            step: GiveRewardComponent.LIMIT_STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }

    public get hasIntervalValue(): boolean
    {
        return this.rewardTime == this.SETTING_N_DAYS || this.rewardTime == this.SETTING_N_HOURS || this.rewardTime == this.SETTING_N_MINS;
    }

    public validate(): string
    {
        let probabilitiesSum = 0;
        const probabilityMin = 1;
        const probabilityMax = 100;

        const itemCodeMaxLength = 100;

        if(this.limitationInterval.trim().length > 0 && isNaN(Number.parseInt(this.limitationInterval)))
        {
            return 'The interval value has to be a number.';
        }

        for(let i = 0; i < this.rewardRows.length; i++)
        {
            const row = this.rewardRows[i];
            if(row.itemCode.trim().length == 0 && row.probability.trim().length == 0)
            {
                continue;
            }
            if(row.itemCode.includes(','))
            {
                return 'Product/badge codes must not contain \',\' characters.';
            }
            if(row.itemCode.includes(';'))
            {
                return 'Product/badge codes must not contain \';\' characters.';
            }
            if(row.itemCode.length > itemCodeMaxLength)
            {
                return `Product/badge codes cannot contain more than ${itemCodeMaxLength} characters.`;
            }
            if(row.itemCode == '')
            {
                return 'Remember to define product/badge codes for all rewards (fill all fields or leave all fields empty).';
            }
            if(!this.uniqueRewards)
            {
                if(row.probability == '')
                {
                    return 'Remember to define probabilities for all rewards (fill all fields or leave all fields empty).';
                }
                const probability = Number.parseInt(row.probability);
                if(isNaN(probability))
                {
                    return 'Make sure all probabilities are numbers.';
                }
                if(probability < probabilityMin || probability > probabilityMax)
                {
                    return `Make sure all probabilities are numbers between ${probabilityMin} and ${probabilityMax}.`;
                }
                probabilitiesSum += probability;
            }
        }

        if(probabilitiesSum > probabilityMax)
        {
            return `The sum of probabilities cannot exceed ${probabilityMax}. You now have ${probabilitiesSum}.`;
        }
        return null;
    }
}

export interface RewardRow {
    badge: boolean;
    itemCode: string;
    probability: string;
}
