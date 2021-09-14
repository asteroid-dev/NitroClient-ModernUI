import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Nitro } from '@nitrots/nitro-renderer';
import { WiredFurniture } from '../../../WiredFurniture';

@Component({
    selector: 'nitro-wired-action-base-component',
    templateUrl: './action-base.template.html'
})
export class WiredActionBaseComponent implements OnChanges
{
    private static DELAY_MINIMUM_VALUE: number = 0;
    private static DELAY_MAXIMUM_VALUE: number = 20;
    private static DELAY_STEPPER_VALUE: number = 1;

    @Input()
    public delay: number = 0;

    @Output()
    public delayChange: EventEmitter<number> = new EventEmitter<number>();

    public delayLocale: string = '';

    public ngOnChanges(changes: SimpleChanges): void
    {
        const prev = changes.delay.previousValue;
        const next = changes.delay.currentValue;

        if(next !== prev) this.updateLocaleParameter();
    }

    public onSliderChange(): void
    {
        this.delayChange.emit(this.delay);
    }

    public decreaseDelay(): void
    {
        this.delay -= 1;

        if(this.delay < WiredActionBaseComponent.DELAY_MINIMUM_VALUE) this.delay = WiredActionBaseComponent.DELAY_MINIMUM_VALUE;

        this.delayChange.emit(this.delay);
    }

    public increaseDelay(): void
    {
        this.delay += 1;

        if(this.delay > WiredActionBaseComponent.DELAY_MAXIMUM_VALUE) this.delay = WiredActionBaseComponent.DELAY_MAXIMUM_VALUE;

        this.delayChange.emit(this.delay);
    }

    protected updateLocaleParameter(): void
    {
        this.delayLocale = Nitro.instance.getLocalizationWithParameter('wiredfurni.params.delay', 'seconds', WiredFurniture.getLocaleName(this.delay));
    }

    public get delaySliderOptions(): Options
    {
        return {
            floor: WiredActionBaseComponent.DELAY_MINIMUM_VALUE,
            ceil: WiredActionBaseComponent.DELAY_MAXIMUM_VALUE,
            step: WiredActionBaseComponent.DELAY_STEPPER_VALUE,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}
