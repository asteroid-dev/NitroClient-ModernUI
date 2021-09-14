import { Component, NgZone } from '@angular/core';
import { FriendFurniEngravingWidgetType, Nitro, StringDataType } from '@nitrots/nitro-renderer';
import { ConversionTrackingWidget } from '../../ConversionTrackingWidget';

@Component({
    templateUrl: './engraving.template.html'
})
export class FriendFurniEngravingWidget extends ConversionTrackingWidget
{
    public engravingView: string = null;
    public visible: boolean = false;

    public firstFigure: string = null;
    public firstName: string = null;

    public secondFigure: string = null;
    public secondName: string = null;

    public engravedDate: string = null;

    constructor(
        private _ngZone: NgZone
    )
    {
        super();
    }


    public open(furniId: number, _arg_2:number, _arg_3:StringDataType):void
    {
        switch(_arg_2)
        {
            case FriendFurniEngravingWidgetType.LOVE_LOCK:
                this.engravingView = 'engraving';
                break;
            case FriendFurniEngravingWidgetType.CARVE_A_TREE:
                break;
            case FriendFurniEngravingWidgetType.FRIENDS_PORTRAIT:
                break;
            case FriendFurniEngravingWidgetType.WILD_WEST_WANTED:
                this.engravingView = 'wildwest';
                break;
            case FriendFurniEngravingWidgetType.HABBOWEEN:
                this.engravingView = 'hween14';
                break;
        }

        // Only supported views
        if(this.engravingView)
        {
            this._ngZone.run(() =>
            {
                this.firstName = _arg_3.getValue(1);
                this.secondName = _arg_3.getValue(2);
                this.firstFigure = _arg_3.getValue(3);
                this.secondFigure = _arg_3.getValue(4);
                this.engravedDate = _arg_3.getValue(5);
                this.visible = true;
            });

        }
    }

    public hide(): void
    {
        this.visible = false;
    }

    public get image(): string
    {
        return Nitro.instance.getConfiguration('furni.extras.url').toString().replace('%image%', `loveLock_${this.engravingView}`);
    }
}
