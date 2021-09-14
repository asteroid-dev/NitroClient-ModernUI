import { Component } from '@angular/core';
import { Triggerable } from '@nitrots/nitro-renderer';
import { WiredMainComponent } from '../../main/main.component';
import { WiredCondition } from '../WiredCondition';
import { WiredConditionType } from '../WiredConditionType';

@Component({
    templateUrl: './stuffs-in-formation.template.html'
})
export class StuffsInFormationComponent extends WiredCondition
{
    public static CODE: number          = WiredConditionType.STUFFS_IN_FORMATION;
    public static NEGATIVE_CODE: number = WiredConditionType.NOT_STUFFS_IN_FORMATION;

    //private _slider:SliderWindowController;

    public get code(): number
    {
        return StuffsInFormationComponent.CODE;
    }

    public get negativeCode(): number
    {
        return StuffsInFormationComponent.NEGATIVE_CODE;
    }

    public get requiresFurni(): number
    {
        return WiredMainComponent._Str_4873;
    }

    // public readIntegerParamsFromForm(k:IWindowContainer):Array
    // {
    //     var _local_2:Array = new Array();
    //     _local_2.push(int(this._slider.getValue()));
    //     _local_2.push(this._Str_21596(k)._Str_2657().id);
    //     return _local_2;
    // }

    public onInit(): void
    {
        // this._slider = new SliderWindowController(_arg_2, this._Str_2453(k), _arg_2.assets, 2, 10, 1);
        // this._slider._Str_2526(3);
        // this._slider.addEventListener(Event.CHANGE, this.onSliderChange);
        // _arg_2.refreshButton(k, "move_diag", true, null, 0);
        // _arg_2.refreshButton(k, "move_vrt", true, null, 0);
    }

    public onEditStart(trigger: Triggerable): void
    {
        // this._slider._Str_2526(_arg_2.intData[0]);
        // var _local_3: number = _arg_2.intData[1];
        // this._Str_21596(k)._Str_2520(this._Str_24795(k, _local_3));
    }

    public get hasSpecialInputs(): boolean
    {
        return true;
    }

    // private _Str_2453(k:IWindowContainer):IWindowContainer
    // {
    //     return k.findChildByName("slider_container") as IWindowContainer;
    // }

    // private onSliderChange(k:Event): void
    // {
    //     var _local_2:SliderWindowController;
    //     var _local_3:Number;
    //     var _local_4: number;
    //     if (k.type == Event.CHANGE)
    //     {
    //         _local_2 = (k.target as SliderWindowController);
    //         if (_local_2)
    //         {
    //             _local_3 = _local_2.getValue();
    //             _local_4 = int(_local_3);
    //             this._roomEvents.localization.registerParameter("wiredfurni.params.requiredformationsize", "furnis", ("" + _local_4));
    //         }
    //     }
    // }

    // private _Str_24795(k:IWindowContainer, _arg_2: number):IRadioButtonWindow
    // {
    //     return IRadioButtonWindow(k.findChildByName((("formation_" + _arg_2) + "_radio")));
    // }

    // private _Str_21596(k:IWindowContainer):ISelectorWindow
    // {
    //     return ISelectorWindow(k.findChildByName("formation_selector"));
    // }
}
