import { Component, Input } from '@angular/core';
import { IFurnitureData, Nitro, RedeemItemClothingComposer, RoomObjectCategory, UserFigureComposer } from '@nitrots/nitro-renderer';
import { FurniCategory } from '../../../../../../catalog/enums/FurniCategory';
import { FurnitureContextMenuWidget } from '../main/main.component';

@Component({
    templateUrl: './purchasable-clothing.template.html'
})
export class PurchaseClothingComponent
{
    @Input() contextWidget: FurnitureContextMenuWidget = null;
    @Input() objectId: number =null;
    public visible: boolean = false;

    private _furniData: IFurnitureData = null;
    private _requestObjectId: number = -1;
    public newFigureString: string;
    public caption: string = null;

    public hide(): void
    {
        if(!this.contextWidget) return;

        this.contextWidget.closeClothing();

    }

    public open(objectId: number)
    {
        if(!this.contextWidget) return;

        const roomId = this.contextWidget.handler.container.roomSession.roomId;
        const roomObject = this.contextWidget.handler.container.roomEngine.getRoomObject(roomId, objectId, RoomObjectCategory.FLOOR);
        if(!roomObject) return;

        this._furniData = this.contextWidget.handler.getFurniData(roomObject);
        this._requestObjectId = roomObject.id;


        let local4 = -1;
        const local5: number[] = [];
        const gender =  this.contextWidget.handler.container.sessionDataManager.gender;
        switch(this._furniData.specialType)
        {
            case FurniCategory.FIGURE_PURCHASABLE_SET: {
                local4 = 0;
                const local6 = this._furniData.customParams.split(',');
                for(let i = 0; i < local6.length; i++)
                {
                    const setId = Number.parseInt(local6[i]);
                    if(this.contextWidget.handler.container.avatarRenderManager.isValidFigureSetForGender(setId,gender))
                    {
                        local5.push(setId);
                    }
                }
            }
                break;
        }

        const figure = this.contextWidget.handler.container.sessionDataManager.figure;
        this.newFigureString = this.contextWidget.handler.container.avatarRenderManager.getFigureStringWithFigureIds(figure,gender, local5);

        if(this.contextWidget.inventoryService.hasBoundFigureSetFurniture(this.newFigureString))
        {
            this.contextWidget.handler.container.connection.send(new UserFigureComposer(gender, this.newFigureString));
        }
        else
        {
            this.showWindow(local4);
        }
    }

    public handleButton(button: string): void
    {
        switch(button)
        {
            case 'cancel':
                this.hide();
                break;
            case 'use': {
                const gender =  this.contextWidget.handler.container.sessionDataManager.gender;
                this.contextWidget.handler.container.connection.send(new RedeemItemClothingComposer(this._requestObjectId));
                this.contextWidget.handler.container.connection.send(new UserFigureComposer(gender, this.newFigureString));
                this.hide();
            }
                break;
        }
    }

    private showWindow(k: number): void
    {
        this.caption = Nitro.instance.localization.getValueWithParameter('useproduct.widget.text.bind_clothing', 'productName', this._furniData.name);
        this.visible = true;
    }
}
