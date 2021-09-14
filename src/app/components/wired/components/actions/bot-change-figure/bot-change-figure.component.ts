import { Component } from '@angular/core';
import { Nitro, Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredActionType } from '../WiredActionType';
import { WiredAction } from './../WiredAction';

@Component({
    templateUrl: './bot-change-figure.template.html'
})
export class BotChangeFigureComponent extends WiredAction
{
    public static CODE: number = WiredActionType.BOT_CHANGE_FIGURE;
    private static DELIMETER: string = '\t';

    private defaultFigure: string = 'hd-180-1.ch-210-66.lg-270-82.sh-290-81';

    public botName: string;
    public figure: string;

    public get code(): number
    {
        return BotChangeFigureComponent.CODE;
    }

    public onEditStart(trigger: Triggerable): void
    {
        const data = trigger.stringData.split(BotChangeFigureComponent.DELIMETER);
        if(data.length > 0)
        {
            this.botName = data[0];
        }
        if(data.length > 1)
        {
            this.figure = data[1].length > 0 ? data[1] : this.defaultFigure;
        }
        super.onEditStart(trigger);
    }

    public readStringParamFromForm(): string
    {
        return this.botName + BotChangeFigureComponent.DELIMETER + this.figure;
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_5431;
    }

    public copyLook(): void
    {
        this.figure = Nitro.instance.sessionDataManager.figure;
    }
}
