import { ComponentRef, Directive, ElementRef } from '@angular/core';
import { FixedSizeStack, Nitro, NitroPoint, NitroRectangle } from '@nitrots/nitro-renderer';
import { IContextMenuParentWidget } from './IContextMenuParentWidget';

@Directive()
export class ContextInfoView
{
    private static LOCATION_STACK_SIZE: number  = 25;
    private static BUBBLE_DROP_SPEED: number    = 3;
    public static SPACE_AROUND_EDGES: number   = 5;

    public parent: IContextMenuParentWidget                 = null;
    public componentRef: ComponentRef<ContextInfoView>      = null;
    public activeView: ElementRef<HTMLDivElement>           = null;
    public stack: FixedSizeStack                            = new FixedSizeStack(ContextInfoView.LOCATION_STACK_SIZE);
    public opacity: number                                  = 0;
    public currentDeltaY: number                            = -1000000;

    public willFade: boolean                                = false;
    public firstFadeStarted: boolean                        = false;
    public fadeAfterDelay: boolean                          = true;
    public fadeLength: number                               = 500;
    public fadeTime: number                                 = 0;
    public fadeStartDelay: number                           = 3000;
    public fadingOut: boolean                               = false;
    public fadeStartTimer: ReturnType<typeof setTimeout>    = null;

    public completeSetup(): void
    {
        this.firstFadeStarted  = false;
        this.fadeLength        = 75;
        this.fadingOut         = false;
        this.opacity           = 1;

        this.onTimerComplete = this.onTimerComplete.bind(this);

        if(this.fadeAfterDelay && this.willFade)
        {
            if(this.fadeStartTimer)
            {
                clearTimeout(this.fadeStartTimer);

                this.fadeStartTimer = null;
            }

            this.fadeStartTimer = setTimeout(this.onTimerComplete, this.fadeStartDelay);
        }
    }

    public ngOnDestroy(): void
    {
        if(this.fadeStartTimer)
        {
            clearTimeout(this.fadeStartTimer);

            this.fadeStartTimer = null;
        }
    }

    public update(rectangle: NitroRectangle, point: NitroPoint, time: number): void
    {
        if(!rectangle) return;

        if(this.fadingOut)
        {
            this.fadeTime  = (this.fadeTime + time);
            this.opacity   = ((1 - (this.fadeTime / this.fadeLength)) * this.maximumOpacity);
        }
        else
        {
            this.opacity = this.maximumOpacity;
        }

        if(this.opacity <= 0)
        {
            this.parent.removeView(this.componentRef, false);

            return;
        }

        const offset    = this.getOffset(rectangle);
        const _local_5  = (point.y - rectangle.top);

        this.stack.addValue(_local_5);

        let deltaY = this.stack.getMax();

        if(deltaY < (this.currentDeltaY - ContextInfoView.BUBBLE_DROP_SPEED))
        {
            deltaY = (this.currentDeltaY - ContextInfoView.BUBBLE_DROP_SPEED);
        }

        const _local_7 = (point.y - deltaY);

        this.currentDeltaY = deltaY;

        let left    = (Math.round(point.x - (this.activeViewElement.offsetWidth / 2)));
        let top     = (((Math.round(_local_7 + offset))) - 5);

        if(top <= 0) top = ContextInfoView.SPACE_AROUND_EDGES;

        if(top >= (Nitro.instance.height - this.activeViewElement.offsetHeight)) top = ((Nitro.instance.height - this.activeViewElement.offsetHeight) - ContextInfoView.SPACE_AROUND_EDGES);

        if(left >= (Nitro.instance.width - this.activeViewElement.offsetWidth)) left = ((Nitro.instance.width - this.activeViewElement.offsetWidth) - ContextInfoView.SPACE_AROUND_EDGES);

        if(left < 0) left = 0 + ContextInfoView.BUBBLE_DROP_SPEED;

        this.activeViewElement.style.left = (left + 'px');
        this.activeViewElement.style.top  = (top + 'px');

        this.activeViewElement.style.opacity = this.opacity.toString();
    }

    public hide(flag: boolean): void
    {
        if(!this.activeView) return;

        if(!this.firstFadeStarted && flag)
        {
            this.firstFadeStarted = true;

            if(this.fadeStartTimer)
            {
                clearTimeout(this.fadeStartTimer);

                this.fadeStartTimer = null;
            }

            this.fadeStartTimer = setTimeout(this.onTimerComplete, this.fadeStartDelay);
        }
        else
        {
            this.parent.removeView(this.componentRef, false);
        }
    }

    private onTimerComplete(): void
    {
        this.fadingOut = true;

        this.hide(true);
    }

    protected getOffset(k: NitroRectangle): number
    {
        let _local_2 = -(this.activeViewElement.offsetHeight);

        _local_2 = (_local_2 - 4);

        return _local_2;
    }

    public get maximumOpacity(): number
    {
        return 1;
    }

    public get activeViewElement(): HTMLDivElement
    {
        return ((this.activeView && this.activeView.nativeElement) || null);
    }
}
