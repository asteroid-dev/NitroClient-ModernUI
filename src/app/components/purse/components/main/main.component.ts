import { Component, OnInit } from '@angular/core';
import { FriendlyTime, Nitro } from '@nitrots/nitro-renderer';
import { PurseService } from '../../services/purse.service';

@Component({
    selector: 'nitro-purse-main-component',
    templateUrl: './main.template.html'
})
export class PurseMainComponent implements OnInit
{
    constructor(private _purseService: PurseService)
    {}

    public ngOnInit(): void
    {
        this._purseService.requestUpdate();
    }

    public isVisible(type: number): boolean
    {
        if(this._purseService.visibleCurrencies.indexOf(type) === -1) return false;

        return true;
    }

    public getCurrencyUrl(type: string): string
    {
        const url = Nitro.instance.getConfiguration<string>('currency.asset.icon.url');

        return url.replace('%type%', type);
    }

    public get currencies(): Map<number, number>
    {
        return this._purseService.currencies;
    }

    public get hcDay(): string
    {
        if(!this._purseService.hcSub) return;

        const days = FriendlyTime.shortFormat((this._purseService.hcSub.minutesUntilExpiration * 60));

        if(!this._purseService.hcSub.minutesUntilExpiration) return Nitro.instance.localization.getValue('purse.clubdays.zero.amount.text');

        return days;
    }

    public get isReady(): boolean
    {
        return this._purseService.isReady;
    }
}
