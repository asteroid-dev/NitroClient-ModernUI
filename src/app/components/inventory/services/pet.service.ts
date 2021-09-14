import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { IMessageEvent, Nitro, PetAddedToInventoryEvent, PetData, PetInventoryEvent, PetRemovedFromInventory, RequestPetsComposer, RoomEngineObjectEvent, RoomEngineObjectPlacedEvent, RoomObjectCategory, RoomObjectPlacementSource, RoomObjectType } from '@nitrots/nitro-renderer';
import { InventoryMainComponent } from '../components/main/main.component';
import { PetItem } from '../items/PetItem';
import { UnseenItemCategory } from '../unseen/UnseenItemCategory';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryPetService implements OnDestroy
{
    public static INVENTORY_UPDATED: string             = 'IPS_INVENTORY_UPDATED';
    public static SELECT_FIRST_GROUP: string            = 'IPS_SELECT_FIRST_GROUP';
    public static SELECT_EXISTING_GROUP_DEFAULT: string = 'IPS_SELECT_EXISTING_GROUP_DEFAULT';

    private _messages: IMessageEvent[]                  = [];
    private _petMsgFragments: Map<number, PetData>[]    = null;
    private _pets: PetItem[]                            = [];
    private _petIdInPetPlacing: number                  = -1;
    private _isObjectMoverRequested: boolean            = false;
    private _isInitialized: boolean                     = false;
    private _needsUpdate: boolean                       = false;

    constructor(
        private _inventoryService: InventoryService,
        private _ngZone: NgZone)
    {
        this.onRoomEngineObjectPlacedEvent = this.onRoomEngineObjectPlacedEvent.bind(this);

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
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectPlacedEvent);

            this._messages = [
                new PetInventoryEvent(this.onPetsReceivedEvent.bind(this)),
                new PetAddedToInventoryEvent(this.onPetAddedEvent.bind(this)),
                new PetRemovedFromInventory(this.onPetRemovedEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.PLACED, this.onRoomEngineObjectPlacedEvent);

            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onRoomEngineObjectPlacedEvent(event: RoomEngineObjectPlacedEvent): void
    {
        if(!event) return;

        if(this._isObjectMoverRequested && event.type === RoomEngineObjectEvent.PLACED)
        {
            this._isObjectMoverRequested = false;

            if(!event.placedInRoom)
            {
                this._ngZone.run(() => this._inventoryService.showWindow());
            }
        }
    }

    private onPetsReceivedEvent(event: PetInventoryEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!this._petMsgFragments) this._petMsgFragments = new Array(parser.totalFragments);

        const map       = new Map([ ...parser.fragment ]);
        const merged    = this.mergeFragments(map, parser.totalFragments, parser.fragmentNumber, this._petMsgFragments);

        if(!merged) return;

        this._ngZone.run(() => this.processFragment(merged));
    }

    private onPetRemovedEvent(event: PetRemovedFromInventory): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            const petItem = this.removeItemById(parser.petId);

            if(petItem) this.setAllPetsSeen();
        });
    }

    private onPetAddedEvent(event: PetAddedToInventoryEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        const pet = parser.pet;

        this._ngZone.run(() =>
        {
            const existing = this.getPetItem(pet.id);

            if(existing)
            {
                // update

                existing.isUnseen = true;
            }
            else
            {
                this.addSinglePetItem(pet);
            }
        });
    }

    private mergeFragments(fragment: Map<number, PetData>, totalFragments: number, fragmentNumber: number, fragments: Map<number, PetData>[]): Map<number, PetData>
    {
        if(totalFragments === 1) return fragment;

        fragments[fragmentNumber] = fragment;

        for(const frag of fragments)
        {
            if(!frag) return null;
        }

        const mergedFragment: Map<number, PetData> = new Map();

        for(const frag of fragments)
        {
            for(const [ key, value ] of frag) mergedFragment.set(key, value);

            frag.clear();
        }

        fragments = null;

        return mergedFragment;
    }

    private processFragment(fragment: Map<number, PetData>): void
    {
        const existingSet           = this.getAllItemIds();
        const addedSet: number[]    = [];
        const removedSet: number[]  = [];

        for(const key of fragment.keys())
        {
            if(existingSet.indexOf(key) === -1) addedSet.push(key);
        }

        for(const itemId of existingSet)
        {
            if(!fragment.get(itemId)) removedSet.push(itemId);
        }

        const emptyExistingSet = (existingSet.length === 0);

        for(const itemId of removedSet)
        {
            this.removeItemById(itemId);
        }

        for(const itemId of addedSet)
        {
            const parser = fragment.get(itemId);

            if(!parser) continue;

            this.addSinglePetItem(parser);
        }

        if(!emptyExistingSet)
        {
            if(addedSet.length) this._inventoryService.updateItemLocking();
        }

        this._isInitialized = true;

        this._inventoryService.events.next(InventoryPetService.INVENTORY_UPDATED);

        if(this._inventoryService.petsController) this._inventoryService.petsController.selectExistingGroupOrDefault();
    }

    private getAllItemIds(): number[]
    {
        const itemIds: number[] = [];

        for(const petData of this._pets) itemIds.push(petData.id);

        return itemIds;
    }

    public getPetItem(id: number): PetItem
    {
        for(const pet of this._pets)
        {
            if(!pet || (pet.id !== id)) continue;

            return pet;
        }

        return null;
    }

    private addSinglePetItem(petData: PetData): PetItem
    {
        const petItem   = new PetItem(petData);
        const unseen    = this.isPetUnseen(petData);

        if(unseen)
        {
            petItem.isUnseen = true;

            this.unshiftPetItem(petItem);
        }
        else
        {
            this.pushPetItem(petItem);
        }

        return petItem;
    }

    public removeItemById(id: number): PetItem
    {
        let i = 0;

        while(i < this._pets.length)
        {
            const petItem = this._pets[i];

            if(petItem && (petItem.id === id))
            {
                if(this._petIdInPetPlacing === petItem.id)
                {
                    this.cancelRoomObjectPlacement();

                    this._inventoryService.showWindow();
                }

                this._pets.splice(i, 1);

                return petItem;
            }

            i++;
        }

        return null;
    }

    private isPetUnseen(petData: PetData): boolean
    {
        const category = UnseenItemCategory.PET;

        return this._inventoryService.unseenTracker._Str_3613(category, petData.id);
    }

    public setAllPetsSeen(): void
    {
        this._inventoryService.unseenTracker._Str_8813(UnseenItemCategory.PET);

        for(const petItem of this._pets)
        {
            if(petItem.isUnseen) petItem.isUnseen = false;
        }

        this._inventoryService.updateUnseenCount();
    }

    public attemptPetPlacement(flag: boolean = false): boolean
    {
        const petItem = this.getSelectedPet();

        if(!petItem) return false;

        const petData = petItem.petData;

        if(!petData) return false;

        const session = Nitro.instance.roomSessionManager.getSession(1);

        if(!session) return false;

        if(!session.isRoomOwner)
        {
            if(!session.allowPets) return false;
        }

        this._inventoryService.hideWindow();

        this.startRoomObjectPlacement(petData);

        return true;
    }

    private startRoomObjectPlacement(petData: PetData): void
    {
        const isMoving = Nitro.instance.roomEngine.processRoomObjectPlacement(RoomObjectPlacementSource.INVENTORY, -(petData.id), RoomObjectCategory.UNIT, RoomObjectType.PET, petData.figureData.figuredata);

        if(isMoving)
        {
            this._petIdInPetPlacing = petData.id;

            this.setObjectMoverRequested(true);
        }
    }

    private cancelRoomObjectPlacement(): void
    {
        if(this._petIdInPetPlacing > -1)
        {
            Nitro.instance.roomEngine.cancelRoomObjectPlacement();

            this.setObjectMoverRequested(false);

            this._petIdInPetPlacing = -1;
        }
    }

    public getSelectedPet(): PetItem
    {
        for(const petItem of this._pets)
        {
            if(petItem && petItem.selected) return petItem;
        }

        return null;
    }

    private unshiftPetItem(petItem: PetItem): void
    {
        this._pets.unshift(petItem);
    }

    private pushPetItem(petItem: PetItem): void
    {
        this._pets.push(petItem);
    }

    private removePetItem(petItem: PetItem): void
    {
        const index = this._pets.indexOf(petItem);

        if(index > -1) this._pets.splice(index, 1);
    }

    private removeAndUnshiftGroupitem(petItem: PetItem): void
    {
        this.removePetItem(petItem);
        this.unshiftPetItem(petItem);
    }

    public unselectAllPetItems(): void
    {
        for(const petItem of this._pets) petItem.selected = false;
    }

    public requestLoad(): void
    {
        this._needsUpdate = false;

        Nitro.instance.communication.connection.send(new RequestPetsComposer());
    }

    private setObjectMoverRequested(flag: boolean)
    {
        if(this._isObjectMoverRequested === flag) return;

        this._ngZone.run(() => (this._isObjectMoverRequested = flag));
    }

    public get controller(): InventoryMainComponent
    {
        return this._inventoryService.controller;
    }

    public get isInitalized(): boolean
    {
        return this._isInitialized;
    }

    public get needsUpdate(): boolean
    {
        return this._needsUpdate;
    }

    public get pets(): PetItem[]
    {
        return this._pets;
    }

    public get isObjectMoverRequested(): boolean
    {
        return this._isObjectMoverRequested;
    }
}
