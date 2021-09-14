import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { IEventDispatcher, IRoomObject } from '@nitrots/nitro-renderer';
import { InventoryService } from '../../../../../../inventory/services/inventory.service';
import { ConversionTrackingWidget } from '../../../../ConversionTrackingWidget';
import { FurnitureContextMenuWidgetHandler } from '../../../../handlers/FurnitureContextMenuWidgetHandler';
import { PurchaseClothingComponent } from '../purchasable-clothing/purchasable-clothing.component';

@Component({
    selector: 'nitro-room-furniture-context-menu-component',
    templateUrl: './main.template.html'
})
export class FurnitureContextMenuWidget extends ConversionTrackingWidget
{
    @ViewChild('purchaseClothing', { read: ViewContainerRef }) purchaseClothingContainer;
    private _purchaseClothingContainerRef: ComponentRef<PurchaseClothingComponent>;

    private _visible: boolean   = false;
    private _selectedObject:IRoomObject = null;

    constructor(
        private _ngZone: NgZone,
        private _resolver: ComponentFactoryResolver,
        public inventoryService: InventoryService)
    {
        super();
    }

    public registerUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        super.registerUpdateEvents(eventDispatcher);
    }

    public unregisterUpdateEvents(eventDispatcher: IEventDispatcher): void
    {
        if(!eventDispatcher) return;
        super.unregisterUpdateEvents(eventDispatcher);
    }


    public _Str_24748(roomObject: IRoomObject): void
    {
        this._selectedObject = roomObject;

        this._ngZone.run(() =>
        {
            this.purchaseClothingContainer.clear();

            const factory: ComponentFactory<PurchaseClothingComponent> = this._resolver.resolveComponentFactory(PurchaseClothingComponent);

            this._purchaseClothingContainerRef = this.purchaseClothingContainer.createComponent(factory);
            this._purchaseClothingContainerRef.instance.contextWidget = this;
            this._purchaseClothingContainerRef.instance.open(roomObject.id);
        });

    }

    public closeClothing(): void
    {
        this._ngZone.run(() => this.purchaseClothingContainer.clear());
    }

    public hide(): void
    {
        this._visible = false;
    }

    public get handler(): FurnitureContextMenuWidgetHandler
    {
        return (this.widgetHandler as FurnitureContextMenuWidgetHandler);
    }

    public get visible(): boolean
    {
        return this._visible;
    }

    public set visible(flag: boolean)
    {
        this._visible = flag;
    }


}
