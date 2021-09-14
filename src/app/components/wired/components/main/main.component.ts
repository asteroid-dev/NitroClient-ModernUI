import { Component, ComponentFactoryResolver, ComponentRef, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ConditionDefinition, Nitro, RoomObjectCategory, RoomObjectVariable, Triggerable, TriggerDefinition, UpdateActionMessageComposer, UpdateConditionMessageComposer, UpdateTriggerMessageComposer, WiredActionDefinition } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../core/settings/service';
import { NotificationService } from '../../../notification/services/notification.service';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredService } from '../../services/wired.service';
import { WiredFurniture } from '../../WiredFurniture';
import { WiredSelectionVisualizer } from '../../WiredSelectionVisualizer';
import { WiredAction } from '../actions/WiredAction';
import { WiredConditionFactory } from '../conditions/WiredConditionFactory';
import { WiredTriggerFactory } from '../triggers/WiredTriggerFactory';
import { WiredActionFactory } from './../actions/WiredActionFactory';

@Component({
    selector: 'nitro-wired-main-component',
    templateUrl: './main.template.html'
})
export class WiredMainComponent implements OnInit, OnDestroy
{
    public static _Str_5431: number = 0;
    public static _Str_4873: number = 1;
    public static _Str_4991: number = 2;
    public static _Str_5430: number = 3;

    @ViewChild('inputsContainer', { read: ViewContainerRef })
    public inputsContainer: ViewContainerRef;

    private _triggerConfs: WiredTriggerFactory;
    private _actionTypes: WiredActionFactory;
    private _conditionTypes: WiredConditionFactory;
    private _selectionVisualizer: WiredSelectionVisualizer;

    private _updated: Triggerable = null;
    private _lastComponent: ComponentRef<WiredFurniture> = null;
    private _furniSelectedIds: number[] = [];

    constructor(
        private _settingsService: SettingsService,
        private _notificationService: NotificationService,
        private _wiredService: WiredService,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._wiredService.component = this;

        this._triggerConfs          = new WiredTriggerFactory();
        this._actionTypes           = new WiredActionFactory();
        this._conditionTypes        = new WiredConditionFactory();
        this._selectionVisualizer   = new WiredSelectionVisualizer(this);
    }

    public ngOnDestroy(): void
    {
        this._wiredService.component = null;
    }

    public setupTrigger(k: Triggerable): void
    {
        // this._Str_2755();

        this._updated = k;

        const wired = this._Str_3959();

        this._selectionVisualizer.clearSelectionShaderFromFurni(this._furniSelectedIds);

        this._furniSelectedIds = [ ...this._updated.selectedItems ];

        wired.onEditStart(this._updated);

        this._selectionVisualizer.applySelectionShaderToFurni(this._furniSelectedIds);
    }

    public _Str_19071(): IUserDefinedRoomEventsCtrl
    {
        if(this._updated instanceof TriggerDefinition) return this._triggerConfs;

        if(this._updated instanceof WiredActionDefinition) return this._actionTypes;

        if(this._updated instanceof ConditionDefinition) return this._conditionTypes;

        return null;
    }

    private _Str_3959(): WiredFurniture
    {
        const wiredType = this._Str_19071()._Str_15652(this._updated.code);

        if(!wiredType) return null;

        if(this._lastComponent && (this._lastComponent.instance instanceof wiredType)) return this._lastComponent.instance;

        if(this.inputsContainer.length) this.inputsContainer.remove();

        const factory = this._componentFactoryResolver.resolveComponentFactory(wiredType);

        let ref: ComponentRef<WiredFurniture> = null;

        if(factory)
        {
            ref = this.inputsContainer.createComponent(factory);
        }

        this._lastComponent = ref;

        if(ref)
        {
            ref.instance.onInitStart();

            return ref.instance;
        }

        return null;
    }

    public close(): void
    {
        if(this.inputsContainer.length) this.inputsContainer.remove();

        this._selectionVisualizer.clearSelectionShaderFromFurni(this._furniSelectedIds);

        this._updated           = null;
        this._lastComponent     = null;
        this._furniSelectedIds  = [];
    }

    public save(): void
    {
        if(!this.isOwnerOfFurniture(this._updated.id))
        {
            this._notificationService.alertWithConfirm('${wiredfurni.nonowner.change.confirm.body}', '${wiredfurni.nonowner.change.confirm.title}', () =>
            {
                this.update();
            });

            return;
        }

        this.update();
    }

    public update(): void
    {
        const wired = this._Str_3959();

        const validateError = wired.validate();

        if(validateError)
        {
            this._notificationService.alert(validateError, 'Update failed');

            return;
        }

        if(this._updated instanceof TriggerDefinition)
        {
            Nitro.instance.communication.connection.send(new UpdateTriggerMessageComposer(this._updated.id, this.readIntegerParams(), this.readStringParam(), this.readFurniSelectionIds(), this.readFurniSelectionCode()));

            return;
        }

        if(this._updated instanceof WiredActionDefinition)
        {
            Nitro.instance.communication.connection.send(new UpdateActionMessageComposer(this._updated.id, this.readIntegerParams(), this.readStringParam(), this.readFurniSelectionIds(), this.getActionDelay(), this.readFurniSelectionCode()));

            return;
        }

        if(this._updated instanceof ConditionDefinition)
        {
            Nitro.instance.communication.connection.send(new UpdateConditionMessageComposer(this._updated.id, this.readIntegerParams(), this.readStringParam(), this.readFurniSelectionIds(), this.readFurniSelectionCode()));

            return;
        }
    }

    private getActionDelay(): number
    {
        const wired = this._Str_3959();
        if(wired && wired instanceof WiredAction)
        {
            return (<WiredAction>wired).delay;
        }
        return 0;
    }

    private readIntegerParams(): number[]
    {
        const wired = this._Str_3959();

        if(wired)
        {
            return wired.readIntegerParamsFromForm();
        }

        return [];
    }

    private readStringParam(): string
    {
        const wired = this._Str_3959();

        if(wired)
        {
            return wired.readStringParamFromForm();
        }

        return '';
    }

    private readFurniSelectionIds(): number[]
    {
        return [ ...this._furniSelectedIds ];
    }

    private readFurniSelectionCode(): number
    {
        if(!this._updated.stuffTypeSelectionEnabled) return 0;

        const wired = this._Str_3959();

        if(wired && ((wired.requiresFurni === WiredMainComponent._Str_4991) || (wired.requiresFurni === WiredMainComponent._Str_5430)))
        {
            return this._updated.stuffTypeSelectionCode;
        }

        return 0;
    }

    public getFurniName(): string
    {
        const spriteId = ((this._updated && this._updated.spriteId) || -1);

        const furniData = Nitro.instance.sessionDataManager.getFloorItemData(spriteId);

        if(!furniData)
        {
            return ('NAME: ' + spriteId);
        }

        return furniData.name;
    }

    public getFurniDescription(): string
    {
        const spriteId = ((this._updated && this._updated.spriteId) || -1);

        const furniData = Nitro.instance.sessionDataManager.getFloorItemData(spriteId);

        if(!furniData)
        {
            return ('NAME: ' + spriteId);
        }

        return furniData.description;
    }

    public _Str_19885(): boolean
    {
        return (this._Str_3959().requiresFurni !== WiredMainComponent._Str_5431);
    }

    public toggleFurniSelected(furniId: number, type: string): void
    {
        if(!this._updated || !this._Str_19885()) return;

        const index = this._furniSelectedIds.indexOf(furniId);

        if(index >= 0)
        {
            this._furniSelectedIds.splice(index, 1);

            this._selectionVisualizer.hide(furniId);
        }
        else
        {
            if(this._furniSelectedIds.length < this._updated.maximumItemSelectionCount)
            {
                this._furniSelectedIds.push(furniId);

                this._selectionVisualizer.show(furniId);
            }
        }

        Nitro.instance.localization.registerParameter('wiredfurni.pickfurnis.caption', 'count', this._furniSelectedIds.length.toString());
    }

    private isOwnerOfFurniture(k: number): boolean
    {
        const roomObject = Nitro.instance.roomEngine.getRoomObject(this._wiredService.roomId, k, RoomObjectCategory.FLOOR);

        if(!roomObject) return false;

        const ownerId = roomObject.model.getValue<number>(RoomObjectVariable.FURNITURE_OWNER_ID);

        return (ownerId === Nitro.instance.sessionDataManager.userId);
    }

    public get roomId(): number
    {
        return this._wiredService.roomId;
    }

    public get furniSelectedIds(): number[]
    {
        return this._furniSelectedIds;
    }

    public get maximumItemSelectionCount(): number
    {
        return this._updated.maximumItemSelectionCount;
    }
}
