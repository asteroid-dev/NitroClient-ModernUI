import { Component } from '@angular/core';
import { InfoStandPetData } from '../../data/InfoStandPetData';
import { InfoStandType } from '../../InfoStandType';
import { RoomInfoStandBaseComponent } from '../base/base.component';

@Component({
    templateUrl: './pet.template.html'
})
export class RoomInfoStandPetComponent extends RoomInfoStandBaseComponent
{
    public petData: InfoStandPetData;

    public processButtonAction(action: string)
    {
        if(!action || !action.length) return;

        switch(action)
        {
            case '':
                break;
        }
    }

    public get type(): number
    {
        return InfoStandType.PET;
    }
}
