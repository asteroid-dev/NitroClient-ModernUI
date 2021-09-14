import { Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CompositeRectTileLayer, Nitro, PixiApplicationProxy, RoomBlockedTilesComposer, RoomDoorSettingsComposer, RoomPreviewer } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../../../core/settings/service';
import { SessionService } from '../../../../../security/services/session.service';
import { FloorPlanService } from '../../services/floorplan.service';

@Component({
    selector: 'nitro-floorplan-main-component',
    templateUrl: './main.template.html'
})

export class FloorplanMainComponent implements OnInit, OnChanges, OnDestroy
{
    @ViewChild('floorplanElement')
    public floorplanElement: ElementRef<HTMLDivElement>;

    @ViewChild('floorplanPreviewer')
    public floorplanPreviewer: ElementRef<HTMLDivElement>;

    @Input('visible')
    public visible: boolean = false;

    public minimize: boolean;

    public showPreviewer: boolean = false;

    private _app: PixiApplicationProxy;
    private _roomPreviewer: RoomPreviewer;

    private _tileMap: CompositeRectTileLayer;

    private _previewerEventsSet: boolean = false;


    constructor(
        private _ngZone: NgZone,
        private floorPlanService: FloorPlanService,
        private _settingsService: SettingsService,
        private _sessionService: SessionService)
    {
        this.floorPlanService.component = this;
        this._clear();
    }

    public ngOnInit(): void
    {
        this._roomPreviewer = new RoomPreviewer(Nitro.instance.roomEngine, ++RoomPreviewer.PREVIEW_COUNTER);

        this._roomPreviewer.zoomOut();
        this._roomPreviewer.zoomOut();
    }

    public ngOnChanges(changes: SimpleChanges): void
    {
        const next = changes.visible.currentValue;

        if(next)
        {
            Nitro.instance.communication.connection.send(new RoomDoorSettingsComposer());
            Nitro.instance.communication.connection.send(new RoomBlockedTilesComposer());
        }
        else
        {
            this._clear();
        }
    }

    public ngOnDestroy(): void
    {
        if(this._roomPreviewer)
        {
            this._roomPreviewer.dispose();

            this._roomPreviewer = null;
        }
    }


    private _clear(): void
    {
        this.floorPlanService.clear();

        this._ngZone.runOutsideAngular(() =>
        {

            if(this._app)
            {
                this._app.destroy(true);

                this._app = null;

                this._tileMap.destroy();

                this._tileMap = null;
            }
        });
    }

    public close(): void
    {
        this._settingsService.floorPlanVisible = false;
        this.floorPlanService.showImportExport = false;
    }

    public preview(mapString: string)
    {
        const { doorX, doorY, doorDirection, thicknessWall, thicknessFloor } = this.floorPlanService.floorMapSettings;
        this.init(mapString, this.floorPlanService.blockedTilesMap, doorX, doorY, doorDirection, thicknessWall, thicknessFloor);
    }

    public render() : void
    {
        if(this._app)
        {
            this._app.stage.removeChildren();
        }
        this._ngZone.runOutsideAngular(() =>
        {


        });
        this.floorPlanService.render();
    }

    public init(mapString: string, blockedTilesMap: boolean[][], doorX: number, doorY: number, doorDirection: number, thicknessWall: number, thicknessFloor: number)
    {
        this._clear();

        this.floorPlanService.floorMapSettings.heightMapString = mapString;
        this.floorPlanService.floorMapSettings.doorX = doorX;
        this.floorPlanService.floorMapSettings.doorY = doorY;
        this.floorPlanService.floorMapSettings.doorDirection = doorDirection;
        this.floorPlanService.blockedTilesMap = blockedTilesMap;

        this.floorPlanService.floorMapSettings.thicknessWall = thicknessWall;
        this.floorPlanService.floorMapSettings.thicknessFloor = thicknessFloor;

        this._ngZone.run(() =>
        {
            this.floorPlanService.floorMapSettings.doorDirection = doorDirection;
        });

        this.floorPlanService.floorMapSettings.heightMap = this.floorPlanService.readTileMapString(mapString);

        const tileSize = this.floorPlanService.tileSize;
        const width = tileSize * this.floorPlanService.floorMapSettings.heightMap.length + 20;
        const height = (tileSize * this.floorPlanService.floorMapSettings.heightMap.length) / 2 + 100;

        this.floorPlanService.originalMapSettings = this.floorPlanService.floorMapSettings;


        this._ngZone.runOutsideAngular(() =>
        {
            this._buildApp(width, height);
            this.floorPlanService.renderTileMap();
        });

    }

    private _buildApp(width: number, height: number): void
    {

        if(!this._app)
        {

            this._app = new PixiApplicationProxy({
                width: width,
                height: height,
                backgroundColor: 0x2b2b2b,
                antialias: true,
                autoDensity: true,
                resolution: 1
            });


            this._tileMap = new CompositeRectTileLayer();
            this._tileMap.interactive = true;

            this._ngZone.runOutsideAngular(() => this.floorPlanService.detectPoints());

            this._app.stage.addChild(this._tileMap);

            this.floorplanElement.nativeElement.appendChild(this._app.view);

            let pos = { top: 0, left: 0, x: 0, y: 0 };

            const ele = this.floorplanElement.nativeElement;

            const mouseDownHandler = function(e: MouseEvent)
            {
                if(e.button !== 2) return;

                ele.style.cursor = 'grabbing';
                ele.style.userSelect = 'none';

                pos = {
                    left: ele.scrollLeft,
                    top: ele.scrollTop,
                    // Get the current mouse position
                    x: e.clientX,
                    y: e.clientY,
                };

                ele.addEventListener('mousemove', mouseMoveHandler);
                ele.addEventListener('mouseup', mouseUpHandler);
            };

            const mouseMoveHandler = function(e)
            {
                // How far the mouse has been moved
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;

                // Scroll the element
                ele.scrollTop = pos.top - dy;
                ele.scrollLeft = pos.left - dx;
            };

            const mouseUpHandler = function()
            {

                ele.style.cursor = 'default';
                ele.removeEventListener('mousemove', mouseMoveHandler);
                ele.removeEventListener('mouseup', mouseUpHandler);
            };


            ele.addEventListener('mousedown', mouseDownHandler);

            ele.oncontextmenu = function()
            {
                return false;
            };


            this.setPreviewerEvents();

            this.floorplanElement.nativeElement.scrollTo(width / 3, 0);
        }
    }

    private setPreviewerEvents()
    {
        if(!this.showPreviewer || this._previewerEventsSet) return;

        const previewerElement = this.floorplanPreviewer.nativeElement;
        let previewPosition = { top: 0, left: 0, x: 0, y: 0 };

        const mouseDownHandlerPreviewer = function (e: MouseEvent)
        {
            previewerElement.style.cursor = 'grabbing';
            previewerElement.style.userSelect = 'none';

            previewPosition = {
                left: previewerElement.scrollLeft,
                top: previewerElement.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            previewerElement.addEventListener('mousemove', mouseMoveHandlerPreview);
            previewerElement.addEventListener('mouseup', mouseUpHandlerPreview);
        };

        const mouseMoveHandlerPreview = function (e)
        {
            // How far the mouse has been moved
            const dx = e.clientX - previewPosition.x;
            const dy = e.clientY - previewPosition.y;

            // Scroll the element
            previewerElement.scrollTop = previewPosition.top - dy;
            previewerElement.scrollLeft = previewPosition.left - dx;
        };

        const mouseUpHandlerPreview = function ()
        {

            previewerElement.style.cursor = 'default';
            previewerElement.removeEventListener('mousemove', mouseMoveHandlerPreview);
            previewerElement.removeEventListener('mouseup', mouseUpHandlerPreview);
        };


        previewerElement.addEventListener('mousedown', mouseDownHandlerPreviewer);

        previewerElement.oncontextmenu = function ()
        {
            return false;
        };


        previewerElement.scrollTo(250, 250);
        this._previewerEventsSet = true;
    }

    public changeAction(action: string): void
    {
        this.floorPlanService.currentAction = action;
    }

    public selectHeight(heightIndex: string): void
    {
        this.floorPlanService.currentHeight = heightIndex;
        this.changeAction('set');
    }

    public getColor(hex: string): string
    {
        return hex.replace('0x', '#');
    }

    public save(): void
    {
        this.floorPlanService.floorMapSettings.heightMapString = this.floorPlanService.generateTileMapString();

        this.floorPlanService.save(this.floorPlanService.floorMapSettings);
    }

    public decrementHeight(): void
    {
        this.floorPlanService.decrementHeight();
    }

    public incrementHeight(): void
    {
        this.floorPlanService.incrementHeight();
    }

    public decrementDoorDirection(): void
    {
        this.floorPlanService.decrementDoorDirection();
    }

    public incrementDoorDirection(): void
    {
        this.floorPlanService.incrementDoorDirection();
    }

    public decrementWallheight(): void
    {
        this.floorPlanService.decrementWallheight();
    }

    public incrementWallheight(): void
    {
        this.floorPlanService.incrementWallheight();
    }

    public openImportExport(): void
    {
        this.floorPlanService.showImportExport = true;
    }

    public revertChanges(): void
    {
        this.floorPlanService.revertChanges();
    }

    public toggleEditor(): void
    {
        this.minimize = !this.minimize;
    }

    public togglePreviewer(): void
    {
        this.showPreviewer = !this.showPreviewer;
        if(!this.showPreviewer)
        {
            this._previewerEventsSet = false;
        }
        setTimeout(() =>
        {
            this.setPreviewerEvents();
        }, 200);
    }

    public get colorMap(): object
    {
        return Object.keys(this.floorPlanService.colorMap)
            .filter(key => key !== 'x')
            .reduce((obj, key) =>
            {
                obj[key] = this.floorPlanService.colorMap[key];
                return obj;
            }, {});
    }

    public get currentAction(): string
    {
        return this.floorPlanService.currentAction;
    }

    public get currentHeight(): string
    {
        return this.floorPlanService.currentHeight;
    }

    public get coloredTilesCount(): number
    {
        return this.floorPlanService.coloredTilesCount;
    }

    public get maxTilesCount(): number
    {
        return this.floorPlanService.maxTilesCount;
    }

    public get roomPreviewer(): RoomPreviewer
    {
        return this._roomPreviewer;
    }

    public get currentModel(): string
    {
        return this.floorPlanService.floorMapSettings.heightMapString;
    }

    public get doorDirection(): number
    {
        return this.floorPlanService.floorMapSettings.doorDirection;
    }

    public get wallHeight(): number
    {
        if(this.floorPlanService.wallHeight == 0) this.floorPlanService.wallHeight = 1;

        return this.floorPlanService.wallHeight;
    }

    public get thicknessWall(): number
    {
        return this.floorPlanService.floorMapSettings.thicknessWall;
    }

    public set thicknessWall(thickness: number)
    {
        this.floorPlanService.floorMapSettings.thicknessWall = thickness;
    }

    public get thicknessFloor(): number
    {
        return this.floorPlanService.floorMapSettings.thicknessFloor;
    }

    public set thicknessFloor(tickness: number)
    {
        this.floorPlanService.floorMapSettings.thicknessFloor = tickness;
    }

    public get ableToRevertChanges(): boolean
    {
        return this.floorPlanService.changesMade;
    }

    public get tileMap(): CompositeRectTileLayer
    {
        return this._tileMap;
    }

    public get showImportExport(): boolean
    {
        return this.floorPlanService.showImportExport;
    }

    public get togglePreviewButton(): string
    {
        const key = this.showPreviewer ? 'nitro.floorplan.previewer.hide' : 'nitro.floorplan.previewer.show';
        const fallback = this.showPreviewer ? 'Hide Preview' : 'Show Preview';

        const value = Nitro.instance.localization.getValue(key);

        if(value === value) return fallback;

        return value;
    }

    public get currentAvatarFigure(): string
    {
        return this._sessionService.figure;
    }

    public get heightMap(): string
    {
        return this.floorPlanService.floorMapSettings.heightMapString;
    }
}
