import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './date-range-active.template.html'
})
export class DateRangeActiveComponent extends WiredCondition
{
    public static CODE: number = WiredConditionType.DATE_RANGE_ACTIVE;

    public startDate: string;
    public endDate: string;

    public get code(): number
    {
        return DateRangeActiveComponent.CODE;
    }

    public test(): number
    {
        return DateRangeActiveComponent.CODE;
    }

    public readIntegerParamsFromForm(): number[]
    {
        const dates: number[] = [];

        const startDate = new Date(this.startDate).getTime();
        if(!isNaN(startDate))
        {
            dates.push((startDate / 1000));

            const endDate = new Date(this.endDate).getTime();
            if(!isNaN(endDate))
            {
                dates.push((endDate / 1000));
            }
        }

        return dates;
    }

    public onEditStart(trigger: Triggerable): void
    {
        let startDate: Date;
        let endDate: Date;

        if(trigger.intData.length > 0)
        {
            startDate = new Date((trigger.intData[0] * 1000));
        }
        else
        {
            startDate = new Date(0);
        }

        if(trigger.intData.length > 1)
        {
            endDate = new Date((trigger.intData[1] * 1000));
        }
        else
        {
            endDate = new Date(0);
        }

        this.startDate = this.dateToString(startDate);
        this.endDate = this.dateToString(endDate);
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    private dateToString(date: Date): string
    {
        return `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)} ` +
            `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
    }
}
