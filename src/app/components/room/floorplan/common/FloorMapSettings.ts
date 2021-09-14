import FloorMapTile from './FloorMapTile';

export default class FloorMapSettings
{
    public heightMap: FloorMapTile[][];
    public heightMapString: string;
    public doorX: number;
    public doorY: number;
    public doorDirection: number;
    public thicknessWall: number;
    public thicknessFloor: number;

    constructor()
    {
        this.heightMap          = [];
        this.heightMapString    = null;
        this.doorX              = 0;
        this.doorY              = 0;
        this.doorDirection      = 0;
        this.thicknessWall      = 0;
        this.thicknessFloor     = 0;
    }
}
