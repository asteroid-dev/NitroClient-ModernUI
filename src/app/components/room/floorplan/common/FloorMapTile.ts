export default class FloorMapTile
{
    public height: string;
    public blocked: boolean;

    constructor(height: string, blocked: boolean)
    {
        this.height = height;
        this.blocked = blocked;
    }


}
