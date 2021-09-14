import { Component, NgZone, OnDestroy } from '@angular/core';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';
import { RoomObjectItem } from '../../events/RoomObjectItem';
import { RoomWidgetRoomObjectMessage } from '../../messages/RoomWidgetRoomObjectMessage';

@Component({
    selector: 'nitro-room-chooser-base-component',
    templateUrl: './base.template.html'
})
export class ChooserWidgetBaseComponent extends ConversionTrackingWidget implements OnDestroy
{
    protected _visible: boolean                         = false;
    protected _items: RoomObjectItem[]                  = [];
    protected _title: string                            = null;
    protected _timeout: ReturnType<typeof setTimeout>   = null;
    private _selectedItemIndex                          = -1;
    private _searchValue: string;

    constructor(
        protected _ngZone: NgZone)
    {
        super();
    }

    public ngOnDestroy(): void
    {
        this.clearTimeout();
    }

    public hide(): void
    {
        this._visible = false;
    }

    public selectItem(item: RoomObjectItem, index: number): void
    {
        if(!item || !this.items || !this.items.length) return;

        this._selectedItemIndex = index;
        this._ngZone.runOutsideAngular(() => this.messageListener.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.SELECT_OBJECT, item.id, item.category)));
    }

    protected clearTimeout(): void
    {
        if(!this._timeout) return;

        clearTimeout(this._timeout);

        this._timeout = null;
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }

    public get title(): string
    {
        return this._title;
    }

    public set title(title: string)
    {
        this._title = title;
    }

    public get items(): RoomObjectItem[]
    {
        return this._items;
    }

    public set items(items: RoomObjectItem[])
    {
        this._items = items;
    }

    public get selectedItemIndex()
    {
        return this._selectedItemIndex;
    }

    public get searchValue()
    {
        return this._searchValue;
    }

    public set searchValue(value: string)
    {
        this._selectedItemIndex = -1;
        this._searchValue = value;
    }
}
