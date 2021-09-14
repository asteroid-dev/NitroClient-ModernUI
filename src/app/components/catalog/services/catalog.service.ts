import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AdvancedMap, CatalogClubEvent, CatalogClubGiftsEvent, CatalogClubOfferData, CatalogGiftConfigurationEvent, CatalogGiftUsernameUnavailableEvent, CatalogGroupsComposer, CatalogGroupsEvent, CatalogModeComposer, CatalogModeEvent, CatalogPageComposer, CatalogPageData, CatalogPageEvent, CatalogPageOfferData, CatalogPageParser, CatalogPagesEvent, CatalogProductOfferData, CatalogPurchaseComposer, CatalogPurchaseEvent, CatalogPurchaseFailedEvent, CatalogPurchaseGiftComposer, CatalogPurchaseUnavailableEvent, CatalogRedeemVoucherComposer, CatalogRedeemVoucherErrorEvent, CatalogRedeemVoucherOkEvent, CatalogRequestGiftConfigurationComposer, CatalogRequestVipGiftsComposer, CatalogRequestVipOffersComposer, CatalogSearchComposer, CatalogSearchData, CatalogSearchEvent, CatalogSoldOutEvent, CatalogUpdatedEvent, ClubGiftInfoParser, FurnitureType, ICatalogPageData, ICatalogPageParser, IFurnitureData, IMessageEvent, IProductData, Nitro, UserSubscriptionEvent, UserSubscriptionParser } from '@nitrots/nitro-renderer';
import { SettingsService } from '../../../core/settings/service';
import { SoundConstants } from '../../../shared/commons/SoundConstants';
import { SoundService } from '../../../shared/services/sound.service';
import { NotificationService } from '../../notification/services/notification.service';
import { CatalogCustomizeGiftComponent } from '../components/customize-gift/customize-gift.component';
import { CatalogLayoutGuildCustomFurniComponent } from '../components/layouts/guild-custom-furni/guild-custom-furni.component';
import { SearchResultsPage } from '../components/layouts/search-results/SearchResultsPage';
import { CatalogLayoutVipBuyComponent } from '../components/layouts/vip-buy/vip-buy.component';
import { CatalogMainComponent } from '../components/main/main.component';
import { GiftWrappingConfiguration } from '../gifts/gift-wrapping-configuration';
import { Purse } from '../purse/purse';

@Injectable()
export class CatalogService implements OnDestroy
{
    public static MODE_NORMAL: string = 'NORMAL';

    private _messages: IMessageEvent[] = [];
    private _component: CatalogMainComponent = null;
    private _giftConfiguratorComponent: CatalogCustomizeGiftComponent = null;
    private _catalogMode: number = -1;
    private _catalogRoot: CatalogPageData = null;
    private _activePage: ICatalogPageParser = null;
    private _clubGiftsParser: ClubGiftInfoParser = null;
    private _activePageData: ICatalogPageData = null;
    private _manuallyCollapsed: ICatalogPageData[] = [];
    private _isLoading: boolean = false;
    private _purse: Purse = new Purse();
    private _clubOffers: CatalogClubOfferData[] = [];
    private _vipTemplate: CatalogLayoutVipBuyComponent = null;
    private _groupFurniTemplate: CatalogLayoutGuildCustomFurniComponent = null;
    private _loaded: boolean = false;

    private _giftWrappingConfiguration: GiftWrappingConfiguration = null;

    private _offersToRoots: AdvancedMap<number, CatalogPageData[]> = null;
    private _searchResultsPages: CatalogSearchData;

    constructor(
        private _settingsService: SettingsService,
        private _notificationService: NotificationService,
        private _soundService: SoundService,
        private _ngZone: NgZone)
    {
        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();

        this._vipTemplate = null;
        this._groupFurniTemplate = null;
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            this._messages = [
                new CatalogClubEvent(this.onCatalogClubEvent.bind(this)),
                new CatalogModeEvent(this.onCatalogModeEvent.bind(this)),
                new CatalogPageEvent(this.onCatalogPageEvent.bind(this)),
                new CatalogPagesEvent(this.onCatalogPagesEvent.bind(this)),
                new CatalogPurchaseEvent(this.onCatalogPurchaseEvent.bind(this)),
                new CatalogPurchaseFailedEvent(this.onCatalogPurchaseFailedEvent.bind(this)),
                new CatalogPurchaseUnavailableEvent(this.onCatalogPurchaseUnavailableEvent.bind(this)),
                new CatalogSearchEvent(this.onCatalogSearchEvent.bind(this)),
                new CatalogSoldOutEvent(this.onCatalogSoldOutEvent.bind(this)),
                new CatalogUpdatedEvent(this.onCatalogUpdatedEvent.bind(this)),
                new CatalogGroupsEvent(this.onCatalogGroupsEvent.bind(this)),
                new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this)),
                new UserSubscriptionEvent(this.onUserSubscriptionEvent.bind(this)),
                new CatalogGiftConfigurationEvent(this.onGiftConfigurationEvent.bind(this)),
                new CatalogGiftUsernameUnavailableEvent(this.onGiftUsernameUnavailableEvent.bind(this)),
                new CatalogClubGiftsEvent(this.onCatalogClubGiftsEvent.bind(this)),
                new CatalogRedeemVoucherErrorEvent(this.onCatalogRedeemVoucherError.bind(this)),
                new CatalogRedeemVoucherOkEvent(this.onCatalogRedeemVoucherOk.bind(this)),
            ];

            for(const message of this._messages) Nitro.instance.communication.registerMessageEvent(message);

            Nitro.instance.communication.connection.send(new CatalogRequestGiftConfigurationComposer());
        });
    }

    public unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            for(const message of this._messages) Nitro.instance.communication.removeMessageEvent(message);

            this._messages = [];
        });
    }

    private onCatalogClubEvent(event: CatalogClubEvent): void
    {
        if(!event || !event.getParser() || !this._vipTemplate) return;

        const offerFromEvent = event.getParser().offers;
        this._clubOffers = offerFromEvent;
        this._vipTemplate.setOffers(offerFromEvent);
    }

    private onCatalogClubGiftsEvent(event: CatalogClubGiftsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._clubGiftsParser = parser;
    }

    public registerVipBuyTemplate(template: CatalogLayoutVipBuyComponent)
    {
        this._vipTemplate = template;
    }

    public registerGroupFurniTemplate(template: CatalogLayoutGuildCustomFurniComponent)
    {
        this._groupFurniTemplate = template;
    }

    private onGiftConfigurationEvent(event: CatalogGiftConfigurationEvent): void
    {
        this._giftWrappingConfiguration = new GiftWrappingConfiguration(event);
    }

    private onGiftUsernameUnavailableEvent(event: CatalogGiftUsernameUnavailableEvent): void
    {
        this._giftConfiguratorComponent && this._giftConfiguratorComponent.showUsernameNotFoundDialog();
    }

    private onCatalogModeEvent(event: CatalogModeEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._catalogMode = parser.mode));
    }

    private onCatalogPageEvent(event: CatalogPageEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._activePage = parser;

            if(this._component) this._component.setupLayout();

            this._isLoading = false;
        });
    }

    private onCatalogPagesEvent(event: CatalogPagesEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._catalogRoot = parser.root;

            this.setOffersToNodes(this._catalogRoot);

            this._isLoading = false;

            (this._component && this._component.selectFirstTab());
        });
    }

    private onCatalogPurchaseEvent(event: CatalogPurchaseEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() => (this._component && this._component.hidePurchaseConfirmation()));
        this._soundService.playInternalSample(SoundConstants.CATALOG_PURCHASE);
    }

    private onCatalogPurchaseFailedEvent(event: CatalogPurchaseFailedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._notificationService.alert('${catalog.alert.purchaseerror.description.' + parser.code + '}', '${catalog.alert.purchaseerror.title}');

            (this._component && this._component.hidePurchaseConfirmation());
        });
    }

    private onCatalogPurchaseUnavailableEvent(event: CatalogPurchaseUnavailableEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;
    }

    private onCatalogSearchEvent(event: CatalogSearchEvent): void
    {
        if(!(this._activePage instanceof SearchResultsPage)) return;

        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(!parser.offer) return;

        this._ngZone.run(() => (this._component && this._component.selectOffer(parser.offer)));
    }

    private onCatalogSoldOutEvent(event: CatalogSoldOutEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._notificationService.alert('${catalog.alert.limited_edition_sold_out.message}', '${catalog.alert.limited_edition_sold_out.title}');

            (this._component && this._component.hidePurchaseConfirmation());
        });
    }

    private onCatalogGroupsEvent(event: CatalogGroupsEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._groupFurniTemplate.groups = parser.groups;
        });
    }

    private onUserSubscriptionEvent(event: UserSubscriptionEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        // TODO: Is this even right? 1 day too less?
        this._purse.clubDays = Math.max(0, parser.daysToPeriodEnd);
        this._purse.clubPeriods = Math.max(0, parser.memberPeriods);
        this._purse.isVip = parser.isVip;
        this._purse.pastClubDays = parser.pastClubDays;
        this._purse.Str_14389 = parser.responseType == UserSubscriptionParser.RESPONSE_TYPE_LOGIN;
        this._purse.minutesUntilExpiration = parser.minutesUntilExpiration;
    }

    private onCatalogUpdatedEvent(event: CatalogUpdatedEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._ngZone.run(() =>
        {
            this._isLoading         = false;
            this._catalogMode       = -1;
            this._catalogRoot       = null;
            this._activePage        = null;
            this._activePageData    = null;

            if(this._component) this._component.reset();

            if(this._settingsService.catalogVisible)
            {
                this._component.hide();

                this._notificationService.alert('${catalog.alert.published.description}', '${catalog.alert.published.title}');
            }
        });
    }

    private onCatalogRedeemVoucherError(event: CatalogRedeemVoucherErrorEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._settingsService.catalogVisible)
            this._notificationService.alert('${catalog.alert.voucherredeem.error.description.' + parser.errorCode + '}', '${catalog.alert.voucherredeem.error.title}');
    }

    private onCatalogRedeemVoucherOk(event: CatalogRedeemVoucherOkEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        if(this._settingsService.catalogVisible)
        {
            const description = '${catalog.alert.voucherredeem.ok.description}';
            if(parser.productName !== '')
            {
                //TODO: Don't have any use (emulator-side is always empty, but leave this code to use in the future)
                /*description = 'catalog.alert.voucherredeem.ok.description.furni';

                Nitro.instance.localization.registerParameter(description, 'productName', parser.productName);

                description = '${' + description + '}';*/
            }

            this._notificationService.alert(description, '${catalog.alert.voucherredeem.ok.title}');
        }
    }

    public setupCatalog(mode: string): void
    {
        if(!mode) return;

        this._isLoading         = true;
        this._catalogRoot       = null;
        this._activePage        = null;
        this._activePageData    = null;

        (this._component && this._component.reset());

        Nitro.instance.communication.connection.send(new CatalogModeComposer(mode));
    }

    public requestGroups(): void
    {
        Nitro.instance.communication.connection.send(new CatalogGroupsComposer());
    }

    public requestPage(page: ICatalogPageData): void
    {
        if(!page || !this.canSelectPage(page)) return;

        this._activePageData = page;

        if(page.pageId === -1) return;

        this._isLoading = true;

        this.requestPageData(page.pageId, -1, CatalogService.MODE_NORMAL);
    }

    private requestPageData(pageId: number, offerId: number, catalogType: string): void
    {
        Nitro.instance.communication.connection.send(new CatalogPageComposer(pageId, offerId, catalogType));
    }

    public isDescendant(page: ICatalogPageData, descendant: ICatalogPageData): boolean
    {
        if(!page || !descendant) return false;

        if(page === descendant) return true;

        if(page.children.length)
        {
            for(const child of page.children)
            {
                if(!child) continue;

                if(child === descendant) return true;

                const flag = this.isDescendant(child, descendant);

                if(flag) return true;
            }
        }

        return false;
    }

    public getFurnitureDataForProductOffer(offer: CatalogProductOfferData): IFurnitureData
    {
        if(!offer) return null;

        let furniData: IFurnitureData = null;

        switch((offer.productType.toUpperCase()))
        {
            case FurnitureType.FLOOR:
                furniData = Nitro.instance.sessionDataManager.getFloorItemData(offer.furniClassId);
                break;
            case FurnitureType.WALL:
                furniData = Nitro.instance.sessionDataManager.getWallItemData(offer.furniClassId);
                break;
        }

        return furniData;
    }

    public getProductDataForLocalization(localizationId: string): IProductData
    {
        if(!localizationId) return null;

        return Nitro.instance.sessionDataManager.getProductData(localizationId);
    }

    public getFurnitureDataIconUrl(furniData: IFurnitureData): string
    {
        if(!furniData) return null;

        const assetUrl = Nitro.instance.roomEngine.roomContentLoader.getAssetUrls(furniData.className, (furniData.colorIndex.toString()), true);

        return ((assetUrl && assetUrl[0]) || null);
    }

    public purchase(page: CatalogPageParser, offer: CatalogPageOfferData, quantity: number, extra: string = null): void
    {
        if(!page || !offer || !quantity) return;

        this.purchaseById(page.pageId, offer.offerId, quantity, extra);
    }

    public purchaseGiftOffer(activePage: ICatalogPageParser, activeOffer: CatalogPageOfferData, extraData:string,  receiverName: string, giftMessage: string, spriteId: number, color: number, ribbonId: number, anonymousGift: boolean): void
    {
        Nitro.instance.communication.connection.send(new CatalogPurchaseGiftComposer(activePage.pageId, activeOffer.offerId, extraData, receiverName, giftMessage, spriteId, color, ribbonId, anonymousGift ));
    }

    public purchaseById(pageId: number, offerId: number, quantity: number, extra: string = null)
    {
        if(!pageId || !offerId || !quantity) return;
        Nitro.instance.communication.connection.send(new CatalogPurchaseComposer(pageId, offerId, extra, quantity));
    }

    public requestOffers(i: number): void
    {
        Nitro.instance.communication.connection.send(new CatalogRequestVipOffersComposer(i));
    }

    public requestClubGifts(): void
    {
        Nitro.instance.communication.connection.send(new CatalogRequestVipGiftsComposer());
    }

    public redeemVoucher(voucherCode: string)
    {
        if(!voucherCode || voucherCode.trim().length === 0) return;

        Nitro.instance.communication.connection.send(new CatalogRedeemVoucherComposer(voucherCode));
    }

    public manuallyCollapsePage(page: ICatalogPageData): void
    {
        const index = this._manuallyCollapsed.indexOf(page);

        if(index === -1) this._manuallyCollapsed.push(page);
        else this._manuallyCollapsed.splice(index, 1);
    }

    private canSelectPage(page: ICatalogPageData): boolean
    {
        if(!page || !page.visible) return false;

        return true;
    }

    public get component(): CatalogMainComponent
    {
        return this._component;
    }

    public set component(component: CatalogMainComponent)
    {
        this._component = component;
    }

    public set giftConfiguratorComponent(component: CatalogCustomizeGiftComponent)
    {
        this._giftConfiguratorComponent = component;
    }

    public get catalogMode(): number
    {
        return this._catalogMode;
    }

    public get catalogRoot(): CatalogPageData
    {
        return this._catalogRoot;
    }

    public get activePage(): ICatalogPageParser
    {
        return this._activePage;
    }

    public get activePageData(): ICatalogPageData
    {
        return this._activePageData;
    }

    public get manuallyCollapsed(): ICatalogPageData[]
    {
        return this._manuallyCollapsed;
    }

    public get purse(): Purse
    {
        return this._purse;
    }

    public get vipOffers(): CatalogClubOfferData[]
    {
        return this._clubOffers;
    }

    public get giftWrapperConfiguration(): GiftWrappingConfiguration
    {
        return this._giftWrappingConfiguration;
    }

    public getOfferPages(offerId: number): CatalogPageData[]
    {
        if(!this._catalogRoot || !this._offersToRoots) return null;

        const pages = this._offersToRoots.getValue(offerId);

        if(!pages || !pages.length) return null;

        const allowedPages: CatalogPageData[] = [];

        for(const page of pages)
        {
            if(!page || !page.visible) continue;

            allowedPages.push(page);
        }

        if(!allowedPages.length) return null;

        return allowedPages;
    }

    private setOffersToNodes(pageData: CatalogPageData): void
    {
        if(!pageData) return;

        if(!this._offersToRoots) this._offersToRoots = new AdvancedMap<number, CatalogPageData[]>();

        if(pageData.offerIds && pageData.offerIds.length)
        {
            for(const offerId of pageData.offerIds)
            {
                let existing = this._offersToRoots.getValue(offerId);

                if(!existing)
                {
                    existing = [];

                    this._offersToRoots.add(offerId, existing);
                }

                if(existing.indexOf(pageData) >= 0) continue;

                existing.push(pageData);
            }
        }

        if(pageData.children && pageData.children.length)
        {
            for(const child of pageData.children) (child && this.setOffersToNodes(child));
        }
    }

    public setSearchPage(furni: IFurnitureData[]): void
    {
        const pages = new AdvancedMap<number, CatalogPageData>();

        for(const furniItem of furni)
        {
            const hasOffer      = this.getOfferPages(furniItem.purchaseOfferId);
            const hasRentOffer  = this.getOfferPages(furniItem.rentOfferId);

            const combinedOfferPages = [hasOffer, hasRentOffer];

            for(const offerSection of combinedOfferPages)
            {
                if(offerSection && offerSection.length > 0)
                {
                    for(const page of offerSection)
                    {
                        if(pages.hasKey(page.pageId)) continue;

                        pages.add(page.pageId, page);
                    }
                }
            }
        }

        this._searchResultsPages = new CatalogSearchData(pages.getValues());
        this._activePage = new SearchResultsPage(furni);
    }

    public requestOfferData(purchaseOfferId: number)
    {
        Nitro.instance.communication.connection.send(new CatalogSearchComposer(purchaseOfferId));
    }

    public get clubGiftsParser(): ClubGiftInfoParser
    {
        return this._clubGiftsParser;
    }

    public hasClubDays(): boolean
    {
        if(!this._purse) return false;

        return this._purse.clubDays > 0;
    }

    public get searchResults(): ICatalogPageData
    {
        return this._searchResultsPages;
    }

    public  clearSearchResults(): void
    {
        this._searchResultsPages = null;
        this.component && this.component.reselectCurrentTab();
    }
}
