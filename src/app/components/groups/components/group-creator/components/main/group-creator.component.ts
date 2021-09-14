import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import GroupSettings from '../../../../common/GroupSettings';
import { GroupsService } from '../../../../services/groups.service';

@Component({
    selector: '[nitro-group-creator-component]',
    templateUrl: './group-creator.template.html'
})
export class GroupCreatorComponent implements OnInit, OnDestroy
{
    public groupSettings: GroupSettings;
    private _currentStep: number;
    private _showNameError: boolean;
    private _showDescriptionError: boolean;
    private _showRoomError: boolean;

    private _availableRooms: Map<number, string>;

    private _groupCost: number;

    constructor(
        private _groupsService: GroupsService,
        private _activeModal: NgbActiveModal)
    {
        this._clear();
    }

    private _clear(): void
    {
        this.groupSettings          = new GroupSettings();
        this._currentStep           = 1;
        this._showNameError         = false;
        this._showDescriptionError  = false;
        this._showRoomError         = false;

        this._availableRooms        = new Map();

        this._groupCost             = 0;
    }

    public ngOnInit(): void
    {
        this._clear();
    }

    public ngOnDestroy(): void
    {
        this._clear();
    }

    public previousStep(): void
    {
        if(this._currentStep === 1) return;

        this._currentStep--;
    }

    public nextStep(): void
    {
        if(this._currentStep === 4) return;

        if(this._currentStep === 1)
        {
            if(this.groupSettings.name.length === 0 || this.groupSettings.name.length > 29)
            {
                this._showNameError = true;
            }
            else
            {
                this._showNameError = false;
            }

            if(this.groupSettings.description.length > 254)
            {
                this._showDescriptionError = true;
            }
            else
            {
                this._showDescriptionError = false;
            }

            if(this.groupSettings.roomId === '0')
            {
                this._showRoomError = true;
            }
            else
            {
                this._showRoomError = false;
            }

            if(this._showNameError || this._showDescriptionError ||  this._showRoomError) return;
        }

        this._currentStep++;
    }

    public hide(): void
    {
        this._activeModal.close();
    }

    public buyGroup(): void
    {
        this._groupsService.buyGroup(this.groupSettings);
    }

    public get currentStep(): number
    {
        return this._currentStep;
    }

    public get showNameError(): boolean
    {
        return this._showNameError;
    }

    public get showDescriptionError(): boolean
    {
        return this._showDescriptionError;
    }

    public get showRoomError(): boolean
    {
        return this._showRoomError;
    }

    public get availableRooms(): Map<number, string>
    {
        return this._availableRooms;
    }

    public set availableRooms(availableRooms: Map<number, string>)
    {
        this._availableRooms = availableRooms;
    }

    public get groupCost(): number
    {
        return this._groupCost;
    }

    public set groupCost(cost: number)
    {
        this._groupCost = cost;
    }
}
