import { Component, Input, NgZone } from '@angular/core';
import { FloorPlanService } from '../../services/floorplan.service';

@Component({
    selector: 'nitro-floorplan-import-export-component',
    templateUrl: './import-export.template.html'
})
export class FloorPlanImportExportComponent
{
    private _map: string = null;
    private _backupMap: string = null;

    public fontSize: string = '12';
    public letterSpacing: string = '3';

    public mapChanged: boolean = false;

    constructor(
        private _floorPlanService: FloorPlanService,
        private _ngZone: NgZone)
    {}

    public revert(): void
    {
        this._ngZone.run(() =>
        {
            this._map = this._backupMap;
        });
    }

    public save(): void
    {
        this._floorPlanService.floorMapSettings.heightMapString = this._map.split('\n').join('\r');
        this._floorPlanService.save(this._floorPlanService.floorMapSettings);
    }

    public close(): void
    {
        this._floorPlanService.showImportExport = false;
    }

    @Input() public set map(map: string)
    {
        this._map = map;

        if(!this._backupMap) this._backupMap = map.replace(/\r\n|\r|\n/g, '\r').toLowerCase();

        if(this._map !== this._backupMap)
        {
            this.mapChanged = true;
        }
        else
        {
            this.mapChanged = false;
        }
    }

    public get map(): string
    {
        return this._map;
    }
}
