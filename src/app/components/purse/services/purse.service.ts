import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent, Nitro, UserCreditsEvent, UserCurrencyComposer, UserCurrencyEvent, UserCurrencyUpdateEvent, UserSubscriptionEvent, UserSubscriptionParser } from '@nitrots/nitro-renderer';

@Injectable()
export class PurseService implements OnDestroy
{
    private _messages: IMessageEvent[];
    private _currencies: Map<number, number>;
    private _habboClubSubscription: UserSubscriptionParser;
    private _isReady: boolean = false;

    constructor(
        private _ngZone: NgZone)
    {
        this._messages      = [];
        this._currencies    = new Map();

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
            this.unregisterMessages();

            this._messages = [
                new UserCreditsEvent(this.onUserCreditsEvent.bind(this)),
                new UserCurrencyEvent(this.onUserCurrencyEvent.bind(this)),
                new UserCurrencyUpdateEvent(this.onUserCurrencyUpdateEvent.bind(this)),
                new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    public requestUpdate(): void
    {
        Nitro.instance.communication.connection.send(new UserCurrencyComposer());
    }

    private onUserCreditsEvent(event: UserCreditsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._isReady = true;

        this._ngZone.run(() => this.setCurrency(-1, parseFloat(parser.credits)));
    }

    private onUserCurrencyEvent(event: UserCurrencyEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._ngZone.run(() =>
        {
            for(const [ type, amount ] of parser.currencies) this.setCurrency(type, amount);
        });
    }

    private onUserCurrencyUpdateEvent(event: UserCurrencyUpdateEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        this._ngZone.run(() => this.setCurrency(parser.type, parser.amount));
    }

    private onUserSubscriptionEvent(event: UserSubscriptionEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.productName)
        {
            case 'habbo_club':
                this._habboClubSubscription = parser;
                return;
            default:
                return;
        }
    }

    private setCurrency(type: number, amount: number): void
    {
        this._currencies.set(type, amount);
    }

    public get currencies(): Map<number, number>
    {
        return this._currencies;
    }

    public get visibleCurrencies(): number[]
    {
        return Nitro.instance.getConfiguration<number[]>('displayed.currency.types', []);
    }

    public get hcSub(): UserSubscriptionParser
    {
        return this._habboClubSubscription;
    }

    public get isReady(): boolean
    {
        return this._isReady;
    }
}
