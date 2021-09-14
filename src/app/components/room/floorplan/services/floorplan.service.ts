import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { CompositeRectTileLayer, IMessageEvent, Nitro, NitroPoint, PixiInteractionEventProxy, PixiLoaderProxy, POINT_STRUCT_SIZE_TWO, RectTileLayer, RoomBlockedTilesComposer, RoomBlockedTilesEvent, RoomControllerLevel, RoomDoorEvent, RoomDoorSettingsComposer, RoomEngineEvent, RoomModelEvent, RoomModelSaveComposer, RoomRightsEvent, RoomThicknessEvent } from '@nitrots/nitro-renderer';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SettingsService } from '../../../../core/settings/service';
import FloorMapSettings from '../common/FloorMapSettings';
import FloorMapTile from '../common/FloorMapTile';
import { FloorplanMainComponent } from '../components/main/main.component';



@Injectable()
export class FloorPlanService implements OnDestroy
{
    private _maxFloorLength: number = 64;
    private _tileSize: number = 32;
    private _colorMap: object = {
        'x': '0x101010',
        '0': '0x0065ff',
        '1': '0x0091ff',
        '2': '0x00bcff',
        '3': '0x00e8ff',
        '4': '0x00ffea',
        '5': '0x00ffbf',
        '6': '0x00ff93',
        '7': '0x00ff68',
        '8': '0x00ff3d',
        '9': '0x19ff00',
        'a': '0x44ff00',
        'b': '0x70ff00',
        'c': '0x9bff00',
        'd': '0xf2ff00',
        'e': '0xffe000',
        'f': '0xffb500',
        'g': '0xff8900',
        'h': '0xff5e00',
        'i': '0xff3200',
        'j': '0xff0700',
        'k': '0xff0023',
        'l': '0xff007a',
        'm': '0xff00a5',
        'n': '0xff00d1',
        'o': '0xff00fc',
        'p': '0xd600ff',
        'q': '0xaa00ff'
    };
    private _heightScheme: string = 'x0123456789abcdefghijklmnopq';

    private static readonly TILE_BLOCKED = 'r_blocked';
    private static readonly TILE_DOOR = 'r_door';

    public component: FloorplanMainComponent;

    private _messages: IMessageEvent[];
    private _updates: number = 0;

    private _model: string;
    private _doorX: number;
    private _doorY: number;
    private _doorDirection: number;
    private _blockedTilesMap: boolean[][];
    private _thicknessWall: number;
    private _thicknessFloor: number;
    private _coloredTilesCount: number;

    private _doorSettingsReceived: boolean;
    private _blockedTilesMapReceived: boolean;
    private _RoomThicknessReceived: boolean;

    private _floorMapSettings: FloorMapSettings;
    private __originalFloorMapSettings: FloorMapSettings;

    private _highestX: number;
    private _highestY: number;
    private _isHolding: boolean;
    private _currentAction: string;
    private _currentHeight: string;

    private _showImportExport: boolean = false;


    private _changesMade: boolean;
    private _wallHeight: number;
    private _lastUsedTile: LastUsedTile = {
        x: -1,
        y: -1
    };
    private readonly loader: PixiLoaderProxy;

    private preveiwerUpdate = new Subject<string>();

    constructor(
        private _ngZone: NgZone,
        private _settingsService: SettingsService)
    {
        this.component = null;
        this._messages = [];

        this._model = null;
        this._doorX = 0;
        this._doorY = 0;
        this._doorDirection = 0;
        this._blockedTilesMap = [];
        this._thicknessWall = 0;
        this._thicknessFloor = 0;

        this._doorSettingsReceived = false;
        this._blockedTilesMapReceived = false;
        this._RoomThicknessReceived = false;
        this._changesMade = false;

        this.registerMessages();

        this.loader = new PixiLoaderProxy();
        this.loader.add('atlas', 'assets/images/floorplaneditor/tiles.json');
        this.loader.load();

        this.preveiwerUpdate.pipe(
            debounceTime(500),
            distinctUntilChanged())
            .subscribe(value =>
            {
                this._updatePreviewer();
            });

        // this.onRoomEngineDisposedEvent = this.onRoomEngineDisposedEvent.bind(this);
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this.unregisterMessages();

            // Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineDisposedEvent);

            this._messages = [
                new RoomModelEvent(this.onRoomModelEvent.bind(this)),
                new RoomDoorEvent(this.onRoomDoorEvent.bind(this)),
                new RoomBlockedTilesEvent(this.onRoomBlockedTilesEvent.bind(this)),
                new RoomThicknessEvent(this.onRoomThicknessEvent.bind(this)),
                new RoomRightsEvent(this.onRoomRightsEvent.bind(this))
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            //  Nitro.instance.roomEngine.events.removeEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineDisposedEvent);

            if(this._messages && this._messages.length)
            {
                for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

                this._messages = [];
            }
        });
    }

    private onRoomRightsEvent(event: RoomRightsEvent): void
    {
        if(!this._settingsService.floorPlanVisible) return;

        if(!(event instanceof RoomRightsEvent)) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._settingsService.floorPlanVisible = parser.controllerLevel >= RoomControllerLevel.ROOM_OWNER;
        });
    }

    private onRoomModelEvent(event: RoomModelEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._model = parser.model;
        this._wallHeight = parser.wallHeight + 1;
        Nitro.instance.communication.connection.send(new RoomDoorSettingsComposer());
        Nitro.instance.communication.connection.send(new RoomBlockedTilesComposer());
        this.tryEmit();
    }

    private onRoomDoorEvent(event: RoomDoorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._doorX = parser.x;
        this._doorY = parser.y;
        this._doorDirection = parser.direction;
        this._doorSettingsReceived = true;

        this.tryEmit();
    }

    private onRoomBlockedTilesEvent(event: RoomBlockedTilesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._blockedTilesMap = parser.blockedTilesMap;
        this._blockedTilesMapReceived = true;

        this.tryEmit();
    }

    private onRoomThicknessEvent(event: RoomThicknessEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;


        this._thicknessFloor = this.convertSettingnToNumber(parser.thicknessFloor);
        this._thicknessWall = this.convertSettingnToNumber(parser.thicknessWall);
        this._RoomThicknessReceived = true;

        this.tryEmit();
    }

    private onRoomEngineDisposedEvent(event: RoomEngineEvent): void
    {
        if(!event) return;

        if(!this.component) return;

        this.component.close();
    }

    private reset(): void
    {
        this._model = null;
        this._doorSettingsReceived = false;
        this._blockedTilesMapReceived = false;
    }


    private tryEmit(): void
    {
        if(this.component && this.component.visible && this._model && this._doorSettingsReceived && this._blockedTilesMapReceived)
        {
            this._ngZone.run(() => this.component.init(this._model, this._blockedTilesMap, this._doorX, this._doorY, this._doorDirection, this._thicknessWall, this._thicknessFloor));
        }
    }

    public render(): void
    {
        this.tryEmit();
    }

    public save(settings: FloorMapSettings)
    {
        Nitro.instance.communication.connection.send(new RoomModelSaveComposer(
            settings.heightMapString,
            settings.doorX,
            settings.doorY,
            settings.doorDirection,
            this.convertNumbersForSaving(settings.thicknessWall),
            this.convertNumbersForSaving(settings.thicknessFloor),
            (this._wallHeight - 1)
        ));

        this.reset();
    }


    private convertNumbersForSaving(value: number): number
    {
        value = parseInt(value.toString());
        switch(value)
        {
            case 0:
                return -2;
            case 1:
                return -1;
            case 3:
                return 1;
            default:
                return 0;

        }
    }

    public clear(): void
    {
        this._floorMapSettings = new FloorMapSettings();
        this.__originalFloorMapSettings = new FloorMapSettings();

        this._highestX = 0;
        this._highestY = 0;
        this._coloredTilesCount = 0;

        this._isHolding = false;
        this._blockedTilesMap = [];
        this._changesMade = false;

        this._currentAction = 'set';
        this._currentHeight = this._heightScheme[1];
    }

    public generateTileMapString(): string
    {

        const highestTile = this.floorMapSettings.heightMap[this._highestY][this._highestX];

        if(highestTile.height === 'x')
        {
            this._highestX = -1;
            this._highestY = -1;

            for(let y = this._maxFloorLength - 1; y >= 0; y--)
            {
                if(!this.floorMapSettings.heightMap[y]) continue;

                for(let x = this._maxFloorLength - 1; x >= 0; x--)
                {
                    if(!this.floorMapSettings.heightMap[y][x]) continue;

                    const tile = this.floorMapSettings.heightMap[y][x];

                    if(tile.height !== 'x')
                    {
                        if(x > this._highestX)
                            this._highestX = x;

                        if(y > this._highestY)
                            this._highestY = y;
                    }
                }
            }
        }


        const rows = [];

        for(let y = 0; y <= this._highestY; y++)
        {
            const row = [];

            for(let x = 0; x <= this._highestX; x++)
            {
                const tile = this.floorMapSettings.heightMap[y][x];

                row[x] = tile.height;
            }

            rows[y] = row.join('');
        }

        return rows.join('\r');
    }


    public readTileMapString(tileMapString: string): any[]
    {
        let roomMapStringSplit = tileMapString.split('\r');
        const roomMap = [];

        let y = 0, x = 0;
        while(y < roomMapStringSplit.length)
        {
            if(roomMapStringSplit[y].length === 0)
            {
                y--;
                roomMapStringSplit = roomMapStringSplit.splice(y, 1);
                continue;
            }

            const originalRow = roomMapStringSplit[y].split('');
            roomMap[y] = [];

            x = 0;
            while(x < originalRow.length)
            {
                const blocked = this._blockedTilesMap[y] && this._blockedTilesMap[y][x];
                if(blocked)
                {
                    //  debugger;
                }
                roomMap[y][x] = new FloorMapTile(originalRow[x], blocked);
                x++;
            }

            while(x < this._maxFloorLength)
            {
                roomMap[y][x] = new FloorMapTile('x', false);
                x++;
            }

            y++;
        }

        while(y < this._maxFloorLength)
        {
            roomMap[y] = [];

            x = 0;
            while(x < this._maxFloorLength)
            {
                roomMap[y][x] = new FloorMapTile('x', false);
                x++;
            }

            y++;
        }

        this._highestY = roomMapStringSplit.length - 1;
        this._highestX = roomMapStringSplit[this._highestY].length - 1;

        return roomMap;
    }


    public convertSettingnToNumber(value: number): number
    {
        switch(value)
        {
            case 0.25:
                return 0;
            case 0.5:
                return 1;
            case 2:
                return 3;
            default:
                return 2;
        }
    }


    public renderTileMap(): void
    {
        this.component.tileMap.clear();

        let amountOfTilesUsed = 0;
        for(let y = 0; y < this.floorMapSettings.heightMap.length; y++)
        {
            for(let x = 0; x < this.floorMapSettings.heightMap[y].length; x++)
            {
                const tile = this.floorMapSettings.heightMap[y][x];

                let isDoor = false;

                if(x === this.floorMapSettings.doorX && y === this.floorMapSettings.doorY) isDoor = true;

                let tileAsset = tile.height;

                if(tile.blocked)
                {
                    tileAsset = FloorPlanService.TILE_BLOCKED;
                }

                if(isDoor)
                {
                    tileAsset = FloorPlanService.TILE_DOOR;
                }

                if(tileAsset !== 'x')
                {
                    amountOfTilesUsed++;
                }

                const positionX = x * this._tileSize / 2 - y * this._tileSize / 2;
                const positionY = x * this._tileSize / 4 + y * this._tileSize / 4;

                this._ngZone.runOutsideAngular(() =>
                {
                    this.component.tileMap.addFrame(tileAsset + '.png', positionX+ 1024, positionY, null, null, null, null, 1, y, x);
                });
            }
        }

        this._ngZone.run(() => this._coloredTilesCount = amountOfTilesUsed);

        this._updates++;
        this.preveiwerUpdate.next(this._updates.toString());
    }


    private _updatePreviewer(): void
    {
        this._ngZone.run(() => this.floorMapSettings.heightMapString = this.generateTileMapString());
    }



    private _handleTileClick(x: number, y: number): void
    {

        const tile = this.floorMapSettings.heightMap[y][x];
        const heightIndex = this._heightScheme.indexOf(tile.height);

        let futureHeightIndex = 0;

        switch(this._currentAction)
        {
            case 'door':

                if(tile.height != 'x')
                {
                    this.floorMapSettings.doorX = x;
                    this.floorMapSettings.doorY = y;
                    this._changesMade = true;

                    this.renderTileMap();
                }
                return;
            case 'up':
                futureHeightIndex = heightIndex + 1;
                break;
            case 'down':
                futureHeightIndex = heightIndex - 1;
                break;
            case 'set':
                futureHeightIndex = this._heightScheme.indexOf(this._currentHeight);
                break;
            case 'unset':
                futureHeightIndex = 0;
                break;
        }

        if(futureHeightIndex === -1) return;

        if(heightIndex === futureHeightIndex) return;

        if(futureHeightIndex > 0)
        {
            if(x > this.highestX) this.highestX = x;

            if(y > this.highestY) this.highestY = y;
        }

        const newHeight = this._heightScheme[futureHeightIndex];

        if(!newHeight) return;

        if(tile.blocked) return;

        this.floorMapSettings.heightMap[y][x].height = newHeight;

        this._changesMade = true;

        this.renderTileMap();

    }


    public revertChanges(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._floorMapSettings = JSON.parse(JSON.stringify(this.__originalFloorMapSettings));
            this.renderTileMap();

        });
        this._changesMade = false;
    }



    public set floorMapSettings(settings: FloorMapSettings)
    {
        this._floorMapSettings = settings;
    }

    public get floorMapSettings(): FloorMapSettings
    {
        return this._floorMapSettings;
    }

    public set originalMapSettings(settings: FloorMapSettings)
    {
        this.__originalFloorMapSettings = JSON.parse(JSON.stringify(settings));
    }

    public get originalMapSettings(): FloorMapSettings
    {
        return this.__originalFloorMapSettings;
    }

    public get highestY(): number
    {
        return this._highestY;
    }

    public set highestY(y: number)
    {
        this._highestY = y;
    }

    public get highestX(): number
    {
        return this._highestX;
    }

    public set highestX(x: number)
    {
        this._highestX = x;
    }

    public get maxTilesCount(): number
    {
        return this._maxFloorLength * this._maxFloorLength;
    }


    public decrementDoorDirection(): void
    {
        if(this.floorMapSettings.doorDirection === 0)
            this.floorMapSettings.doorDirection = 7;
        else
            this.floorMapSettings.doorDirection--;
    }

    public incrementDoorDirection(): void
    {
        if(this.floorMapSettings.doorDirection === 7)
            this.floorMapSettings.doorDirection = 0;
        else
            this.floorMapSettings.doorDirection++;
    }

    public decrementWallheight(): void
    {
        if(this.wallHeight === 1)
            this.wallHeight = 16;
        else
            this.wallHeight--;
    }

    public incrementWallheight(): void
    {
        if(this.wallHeight === 16)
            this.wallHeight = 1;
        else
            this.wallHeight++;
    }


    public get coloredTilesCount(): number
    {
        return this._coloredTilesCount;
    }

    public get tileSize(): number
    {
        return this._tileSize;
    }

    public get currentAction(): string
    {
        return this._currentAction;
    }

    public set currentAction(action: string)
    {
        this._currentAction = action;
    }

    public get currentHeight(): string
    {
        return this._currentHeight;
    }

    public set currentHeight(height: string)
    {
        this._currentHeight = height;
    }

    public get colorMap(): object
    {
        return this._colorMap;
    }

    public get blockedTilesMap(): boolean[][]
    {
        return this._blockedTilesMap;
    }

    public set blockedTilesMap(tiles: boolean[][])
    {
        this._blockedTilesMap = tiles;
    }

    public decrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this.currentHeight);

        if(colorIndex === 1) return;

        this.selectHeight(this._heightScheme[colorIndex - 1]);
    }


    public selectHeight(heightIndex: string): void
    {
        this.currentHeight = heightIndex;
        this.currentAction = 'set';
    }

    public incrementHeight(): void
    {
        const colorIndex = this._heightScheme.indexOf(this.currentHeight);

        if(colorIndex === this._heightScheme.length - 1) return;

        this.selectHeight(this._heightScheme[colorIndex + 1]);
    }

    public get changesMade(): boolean
    {
        return this._changesMade;
    }

    public get wallHeight(): number
    {
        return this._wallHeight;
    }

    public set wallHeight(height: number)
    {
        this._wallHeight = height;
    }

    public detectPoints(): void
    {
        const tileMap = this.component.tileMap;
        const tempPoint = new NitroPoint();
        // @ts-ignore
        tileMap.containsPoint = (position) =>
        {
            tileMap.worldTransform.applyInverse(position, tempPoint);
            return this.tileHitDettection(tileMap, tempPoint, false);
        };

        tileMap.on('pointerup', () =>
        {
            this._isHolding = false;
        });

        tileMap.on('pointerout', () =>
        {
            this._isHolding = false;
        });

        tileMap.on('pointerdown', (event: PixiInteractionEventProxy) =>
        {
            if(!(event.data.originalEvent instanceof PointerEvent)) return;

            const pointerEvent = <PointerEvent>event.data.originalEvent;
            if(pointerEvent.button === 2) return;


            const location = event.data.global;
            this.tileHitDettection(tileMap, location, true);
        });

        tileMap.on('click', (event: PixiInteractionEventProxy) =>
        {
            if(!(event.data.originalEvent instanceof PointerEvent)) return;

            const pointerEvent = <PointerEvent>event.data.originalEvent;
            if(pointerEvent.button === 2) return;


            const location = event.data.global;
            this.tileHitDettection(tileMap, location, true, true);
        });
    }

    private tileHitDettection(tileMap: CompositeRectTileLayer, tempPoint: NitroPoint, setHolding: boolean, isClick: boolean = false): boolean
    {
        const buffer = (tileMap.children[0] as RectTileLayer).pointsBuf;
        const bufSize = POINT_STRUCT_SIZE_TWO;

        const len = buffer.length;

        if(setHolding)
        {
            this._isHolding = true;
        }

        for(let j = 0; j < len; j += bufSize)
        {
            const bufIndex = j + bufSize;
            const data = buffer.slice(j, bufIndex);

            const width = data[4];
            const height = data[5];


            const mousePositionX = Math.floor(tempPoint.x);
            const mousePositionY = Math.floor(tempPoint.y);

            const tileStartX = data[2];
            const tileStartY = data[3];


            const centreX = tileStartX + (width / 2);
            const centreY = tileStartY + (height / 2);

            const dx = Math.abs(mousePositionX - centreX - 2);
            const dy = Math.abs(mousePositionY - centreY - 2);

            const solution = (dx / (width * 0.5) + dy / (height * 0.5) <= 1);
            if(solution)
            {
                if(this._isHolding)
                {
                    const realY = data[13];
                    const realX = data[14];

                    if(isClick)
                    {
                        this._handleTileClick(realX, realY);
                    }
                    else if(this._lastUsedTile.x != realX || this._lastUsedTile.y != realY)
                    {
                        this._lastUsedTile = {
                            'x': realX,
                            'y': realY
                        };

                        this._handleTileClick(realX, realY);
                    }
                }
                return true;
            }

        }
        return false;
    }

    public get showImportExport(): boolean
    {
        return this._showImportExport;
    }

    public set showImportExport(show: boolean)
    {
        this._showImportExport = show;
    }
}

interface LastUsedTile
{
    x: number;
    y: number;
}
