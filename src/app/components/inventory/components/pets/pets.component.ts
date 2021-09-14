import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Nitro, RoomObjectVariable, RoomPreviewer } from '@nitrots/nitro-renderer';
import { NotificationService } from '../../../notification/services/notification.service';
import { PetItem } from '../../items/PetItem';
import { InventoryService } from '../../services/inventory.service';
import { InventorySharedComponent } from '../shared/inventory-shared.component';

@Component({
    selector: '[nitro-inventory-pets-component]',
    templateUrl: './pets.template.html'
})
export class InventoryPetsComponent extends InventorySharedComponent implements OnInit, OnDestroy
{
    @Input()
    public roomPreviewer: RoomPreviewer = null;

    public selectedItem: PetItem = null;
    public mouseDown: boolean = false;

    constructor(
        private _notificationService: NotificationService,
        protected _inventoryService: InventoryService,
        protected _ngZone: NgZone)
    {
        super(_inventoryService, _ngZone);
    }

    public ngOnInit(): void
    {
        this._inventoryService.petsController = this;

        if(this._inventoryService.controller.petService.isInitalized) this.selectExistingGroupOrDefault();

        this.prepareInventory();
    }

    public ngOnDestroy(): void
    {
        this._inventoryService.controller.setAllPetsSeen();

        this._inventoryService.petsController = null;
    }

    private prepareInventory(): void
    {
        if(!this._inventoryService.controller.petService.isInitalized || this._inventoryService.controller.petService.needsUpdate)
        {
            this._inventoryService.controller.petService.requestLoad();
        }
        else
        {
            this.selectExistingGroupOrDefault();
        }
    }

    public selectExistingGroupOrDefault(): void
    {
        if(this.selectedItem)
        {
            const index = this.petItems.indexOf(this.selectedItem);

            if(index > -1)
            {
                this.selectPetItem(this.selectedItem);

                return;
            }
        }

        this.selectFirstPet();
    }

    public selectFirstPet(): void
    {
        let pet: PetItem = null;

        for(const petItem of this.petItems)
        {
            if(!petItem) continue;

            pet = petItem;

            break;
        }

        this.selectPetItem(pet);
    }

    private selectPetItem(petItem: PetItem): void
    {
        if(this.selectedItem === petItem) return;

        this._inventoryService.controller.petService.unselectAllPetItems();

        this.selectedItem = petItem;

        if(this.selectedItem)
        {
            this.selectedItem.selected = true;

            if(this.selectedItem.isUnseen) this.selectedItem.isUnseen = false;

            const petData = this.selectedItem.petData;

            if(!petData) return;

            this._ngZone.runOutsideAngular(() =>
            {
                if(this.roomPreviewer)
                {
                    let wallType        = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_WALL_TYPE);
                    let floorType       = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_FLOOR_TYPE);
                    let landscapeType   = Nitro.instance.roomEngine.getRoomInstanceVariable<string>(Nitro.instance.roomEngine.activeRoomId, RoomObjectVariable.ROOM_LANDSCAPE_TYPE);

                    wallType        = (wallType && wallType.length) ? wallType : '101';
                    floorType       = (floorType && floorType.length) ? floorType : '101';
                    landscapeType   = (landscapeType && landscapeType.length) ? landscapeType : '1.1';

                    this.roomPreviewer.reset(false);
                    this.roomPreviewer.updateRoomWallsAndFloorVisibility(false, true);
                    this.roomPreviewer.updateObjectRoom(floorType, wallType, landscapeType);
                    this.roomPreviewer.addPetIntoRoom(petData.figureData.figuredata);
                }
            });
        }
        else
        {
            this._ngZone.runOutsideAngular(() => this.roomPreviewer && this.roomPreviewer.reset(false));
        }
    }

    public onMouseDown(petItem: PetItem): void
    {
        if(!petItem) return;

        this.selectPetItem(petItem);

        this.mouseDown = true;
    }

    public onMouseUp(): void
    {
        this.mouseDown = false;
    }

    public onMouseOut(petItem: PetItem): void
    {
        if(!this.mouseDown) return;

        if(this.selectedItem !== petItem) return;

        this.attemptPetPlacement();
    }

    public trackByType(index: number, item: PetItem): number
    {
        return item.id;
    }

    public get petItems(): PetItem[]
    {
        return this._inventoryService.controller.petService.pets;
    }

    public get hasPetItems(): boolean
    {
        return !!this.petItems.length;
    }
}
