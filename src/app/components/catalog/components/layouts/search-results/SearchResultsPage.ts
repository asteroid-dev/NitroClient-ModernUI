import { CatalogFrontPageItem, CatalogPageOfferData, CatalogSearchParser, ICatalogLocalizationData, ICatalogPageParser, IFurnitureData } from '@nitrots/nitro-renderer';
import { CatalogLayoutSearchResultsComponent } from './search-results.component';

export class SearchResultsPage implements ICatalogPageParser
{
    private _furni: IFurnitureData[] = null;
    private _offer: CatalogPageOfferData = null;

    constructor(furni: IFurnitureData[])
    {
        this._furni = furni;
    }


    public get searchOffer(): CatalogPageOfferData
    {
        return this._offer;
    }

    public selectSearchResult(data: IFurnitureData, parser: CatalogSearchParser): void
    {
        if(parser) this._offer = parser.offer;
    }

    public get acceptSeasonCurrencyAsCredits(): boolean
    {
        return false;
    }

    public get catalogType(): string
    {
        return CatalogLayoutSearchResultsComponent.CODE;
    }

    public get frontPageItems(): CatalogFrontPageItem[]
    {
        return [];
    }

    public get layoutCode(): string
    {
        return CatalogLayoutSearchResultsComponent.CODE;
    }

    public get localization(): ICatalogLocalizationData
    {
        return {
            images: [],
            texts: []
        };
    }

    public get offerId(): number
    {
        return null;
    }

    public get offers(): CatalogPageOfferData[]
    {
        return [];
    }

    public get furni(): IFurnitureData[]
    {
        return this._furni;
    }

    public get pageId(): number
    {
        return -1;
    }
}
