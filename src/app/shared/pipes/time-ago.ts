import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { FriendlyTime } from '@nitrots/nitro-renderer';

@Pipe({ name: 'timeAgo' })
export class TimeAgoPipe implements PipeTransform, OnDestroy
{
    private _time: number = 0;
    private _timer: ReturnType<typeof setInterval> = null;

    constructor(private changeDetector: ChangeDetectorRef)
    {
        this.updateTime = this.updateTime.bind(this);
    }

    public ngOnDestroy(): void
    {
        this.clearInterval();
    }

    public transform(time: number): string
    {
        this._time = time;

        this.setupInterval();

        return FriendlyTime.format((Date.now() - this._time));
    }

    private clearInterval(): void
    {
        if(this._timer)
        {
            clearInterval(this._timer);

            this._timer = null;
        }
    }

    private setupInterval(): void
    {
        if(this._timer) return;

        this._timer = setInterval(this.updateTime, 30000);
    }

    private updateTime(): void
    {
        this.changeDetector.markForCheck();
    }
}
