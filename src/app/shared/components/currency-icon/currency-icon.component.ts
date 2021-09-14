import { Component, Input } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';

@Component({
    selector: '[nitro-currency-icon]',
    templateUrl: './currency-icon.template.html'
})
export class CurrencyIconComponent
{
    @Input()
    public type: number = null;

    public get iconUrl(): string
    {
        if(this.type === null) return null;

        let currencyUrl = Nitro.instance.getConfiguration<string>('currency.asset.icon.url', '');

        currencyUrl = currencyUrl.replace('%type%', this.type.toString());

        return `url('${ currencyUrl }')`;
    }
}
