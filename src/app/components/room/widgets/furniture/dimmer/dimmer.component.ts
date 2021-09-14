import { Options } from '@angular-slider/ngx-slider';
import { Component, NgZone } from '@angular/core';
import { IEventDispatcher } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomWidgetDimmerStateUpdateEvent } from '../../events/RoomWidgetDimmerStateUpdateEvent';
import { RoomWidgetDimmerUpdateEvent } from '../../events/RoomWidgetDimmerUpdateEvent';
import { FurnitureDimmerWidgetHandler } from '../../handlers/FurnitureDimmerWidgetHandler';
import { RoomWidgetDimmerChangeStateMessage } from '../../messages/RoomWidgetDimmerChangeStateMessage';
import { RoomWidgetDimmerPreviewMessage } from '../../messages/RoomWidgetDimmerPreviewMessage';
import { RoomWidgetDimmerSavePresetMessage } from '../../messages/RoomWidgetDimmerSavePresetMessage';

@Component({
    selector: 'nitro-room-furniture-dimmer-component',
    templateUrl: './dimmer.template.html'
})
export class DimmerFurniComponent extends ConversionTrackingWidget
{
    private _visible: boolean       = false;
    private _dimmerState: number    = 0;
    private _effectId: number       = 0;
    private _color: number          = 0xFFFFFF;
    private _brightness: number     = 0xFF;
    public presets: MoodlightItem[] = [];
    public selectedPresetId: number = 0;
    public isOn: boolean            = false;
    public aktifler = ["rdimmer-button-active","",""]

    public  readonly availableColors: number[] = [7665141, 21495, 15161822, 15353138, 15923281, 8581961, 0];
    public  readonly htmlColors: string[] = ['#74F5F5', '#0053F7', '#E759DE', '#EA4532', '#F2F851', '#82F349', '#000000'];

    constructor(
        private _ngZone: NgZone)
    {
        super();

        this.onDimmerPresetsEvent   = this.onDimmerPresetsEvent.bind(this);
        this.onDimmerStateEvent     = this.onDimmerStateEvent.bind(this);
    }



    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.addEventListener(RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS, this.onDimmerPresetsEvent);
        eventDispatcher.addEventListener(RoomWidgetDimmerStateUpdateEvent.RWDSUE_DIMMER_STATE, this.onDimmerStateEvent);

        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;

        eventDispatcher.removeEventListener(RoomWidgetDimmerUpdateEvent.RWDUE_PRESETS, this.onDimmerPresetsEvent);
        eventDispatcher.removeEventListener(RoomWidgetDimmerStateUpdateEvent.RWDSUE_DIMMER_STATE, this.onDimmerStateEvent);

        super.unregisterUpdateEvents(eventDispatcher);
    }

    public getSelectedPreset(): MoodlightItem
    {
        return this.presets[this.selectedPresetId -1];
    }

    public selectPreset(index: number): void
    {
        this.selectedPresetId = index;
        this.aktifler[0] = ""
        this.aktifler[1] = ""
        this.aktifler[2] = ""
        this.aktifler[index-1] = "rdimmer-button-active"
    
    }

    public selectColor(color: number): void
    {
        this.getSelectedPreset().color = color;
        this.previewSettings();
    }

    private onDimmerPresetsEvent(event: RoomWidgetDimmerUpdateEvent): void
    {
        this.presets = event.presets.map(item =>
        {
            return {
                color: item.color,
                id: item.id,
                intensity: item._Str_4272,
                backgroundOnly: item.type == 2
            };
        });


        this.selectedPresetId = event.selectedPresetId;
        this._ngZone.run(() =>
        {
            this._visible = true;
        });
    }

    private onDimmerStateEvent(event: RoomWidgetDimmerStateUpdateEvent): void
    {
        this._ngZone.run(() =>
        {
            this.isOn           = event.state == 1;
            this._effectId      = event._Str_6815;
            this._color         = event.color;
            this._brightness    = event._Str_5123;
        });
        this.messageListener.processWidgetMessage(new RoomWidgetDimmerPreviewMessage(this._color, this._brightness, (this._effectId === 2)));
    }

    public get handler(): FurnitureDimmerWidgetHandler
    {
        return (this.widgetHandler as FurnitureDimmerWidgetHandler);
    }

    public hide(): void
    {
        this._visible = false;
    }
    public get visible(): boolean
    {
        return this._visible && this.selectedPresetId > 0 && this.presets.length > 0;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }


    public onSliderChange(): void
    {
        this.previewSettings();
    }

    public changeCheckbox(event): void
    {

        this.getSelectedPreset().backgroundOnly = event.target.checked;
        this.previewSettings();
    }

    private previewSettings(): void
    {
        if(!this.messageListener) return;

        const currentItem = this.getSelectedPreset();

        this.messageListener.processWidgetMessage(new RoomWidgetDimmerPreviewMessage(currentItem.color, currentItem.intensity, currentItem.backgroundOnly));
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'on_off':
                this.toggleState();
                break;
            case 'apply':
                this.apply();
                break;
        }
    }

    private toggleState(): void
    {
        if(!this.messageListener) return;

        this.messageListener.processWidgetMessage(new RoomWidgetDimmerChangeStateMessage());
    }

    private apply(): void
    {
        if(!this.isOn || !this.messageListener || this.presets == null || this.presets.length == 0) return;

        const preset = this.getSelectedPreset();

        if(!preset) return;

        this.messageListener.processWidgetMessage(new RoomWidgetDimmerSavePresetMessage(preset.id,(preset.backgroundOnly) ? 2 : 1, preset.color, preset.intensity, true));
    }

    public get delaySliderOptions(): Options
    {
        return {
            floor:75,
            ceil:255,
            step:1,
            hidePointerLabels: true,
            hideLimitLabels: true,
        };
    }
}


interface MoodlightItem {
    color: number;
    intensity: number;
    id: number;
    backgroundOnly: boolean
}
