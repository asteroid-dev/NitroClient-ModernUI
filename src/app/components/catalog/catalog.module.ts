import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CatalogConfirmMarketplacePurchaseComponent } from './components/confirm-marketplace-purchase/confirm-marketplace-purchase.component';
import { CatalogConfirmPurchaseInsufficientFundsComponent } from './components/confirm-purchase-insufficient-funds/confirm-purchase-insufficient-funds.component';
import { CatalogConfirmPurchaseComponent } from './components/confirm-purchase/confirm-purchase.component';
import { CatalogConfirmVipSubscriptionComponent } from './components/confirm-vip-subscription/confirm-vip-subscription.component';
import { CatalogCustomizeGiftComponent } from './components/customize-gift/customize-gift.component';
import { CatalogLayoutBotsComponent } from './components/layouts/bots/bots.component';
import { CatalogLayoutDefaultComponent } from './components/layouts/default/default.component';
import { CatalogLayoutFrontPageFeaturedComponent } from './components/layouts/frontpage-featured/frontpage-featured.component';
import { CatalogLayoutFrontPage4Component } from './components/layouts/frontpage4/frontpage4.component';
import { CatalogLayoutGuildCustomFurniComponent } from './components/layouts/guild-custom-furni/guild-custom-furni.component';
import { CatalogLayoutGuildFrontPageComponent } from './components/layouts/guild-frontpage/guild-frontpage.component';
import { CatalogLayoutMarketplaceMarketplaceComponent } from './components/layouts/marketplace/marketplace/marketplace.component';
import { CatalogLayoutMarketplaceMarketplaceOfferComponent } from './components/layouts/marketplace/marketplace/offer/offer.component';
import { CatalogLayoutMarketplaceMarketplaceSubAdvancedComponent } from './components/layouts/marketplace/marketplace/sub/advanced.component';
import { CatalogLayoutMarketplaceMarketplaceSubActivityComponent } from './components/layouts/marketplace/marketplace/sub/by-activity.component';
import { CatalogLayoutMarketplaceOwnItemsComponent } from './components/layouts/marketplace/own-items/own-items.component';
import { CatalogLayoutPetsComponent } from './components/layouts/pets/pets.component';
import { CatalogLayoutPets2Component } from './components/layouts/pets2/pets2.component';
import { CatalogLayoutPets3Component } from './components/layouts/pets3/pets3.component';
import { CatalogLayoutSearchResultsComponent } from './components/layouts/search-results/search-results.component';
import { CatalogLayoutSpacesNewComponent } from './components/layouts/spaces-new/spaces-new.component';
import { CatalogLayoutTrophiesComponent } from './components/layouts/trophies/trophies.component';
import { CatalogLayoutUnsupportedComponent } from './components/layouts/unsupported/unsupported.component';
import { CatalogLayoutVipBuyComponent } from './components/layouts/vip-buy/vip-buy.component';
import { CatalogLayoutVipGiftsComponent } from './components/layouts/vip-gifts/vip-gifts.component';
import { CatalogMainComponent } from './components/main/main.component';
import { CatalogNavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { CatalogNavigationSetComponent } from './components/navigation-set/navigation-set.component';
import { CatalogNavigationComponent } from './components/navigation/navigation.component';
import { CatalogPurchaseComponent } from './components/purchase/purchase.component';
import { CatalogRedeemVoucherComponent } from './components/redeem-voucher/redeem-voucher.component';
import { CatalogService } from './services/catalog.service';
import { MarketplaceService } from './services/marketplace.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        CatalogConfirmPurchaseComponent,
        CatalogConfirmVipSubscriptionComponent,
        CatalogConfirmPurchaseInsufficientFundsComponent,
        CatalogLayoutDefaultComponent,
        CatalogLayoutFrontPageFeaturedComponent,
        CatalogLayoutFrontPage4Component,
        CatalogLayoutBotsComponent,
        CatalogLayoutPetsComponent,
        CatalogLayoutPets2Component,
        CatalogLayoutPets3Component,
        CatalogLayoutSpacesNewComponent,
        CatalogLayoutTrophiesComponent,
        CatalogLayoutUnsupportedComponent,
        CatalogLayoutVipBuyComponent,
        CatalogLayoutGuildFrontPageComponent,
        CatalogLayoutGuildCustomFurniComponent,
        CatalogMainComponent,
        CatalogNavigationComponent,
        CatalogNavigationItemComponent,
        CatalogNavigationSetComponent,
        CatalogPurchaseComponent,
        CatalogRedeemVoucherComponent,
        CatalogCustomizeGiftComponent,
        CatalogLayoutSearchResultsComponent,
        CatalogLayoutVipGiftsComponent,
        CatalogLayoutMarketplaceOwnItemsComponent,
        CatalogLayoutMarketplaceMarketplaceComponent,
        CatalogLayoutMarketplaceMarketplaceSubActivityComponent,
        CatalogLayoutMarketplaceMarketplaceSubAdvancedComponent,
        CatalogLayoutMarketplaceMarketplaceOfferComponent,
        CatalogConfirmMarketplacePurchaseComponent
    ],
    providers: [
        CatalogService,
        MarketplaceService
    ],
    declarations: [
        CatalogConfirmPurchaseComponent,
        CatalogConfirmVipSubscriptionComponent,
        CatalogConfirmPurchaseInsufficientFundsComponent,
        CatalogLayoutDefaultComponent,
        CatalogLayoutFrontPageFeaturedComponent,
        CatalogLayoutFrontPage4Component,
        CatalogLayoutBotsComponent,
        CatalogLayoutPetsComponent,
        CatalogLayoutPets2Component,
        CatalogLayoutPets3Component,
        CatalogLayoutSpacesNewComponent,
        CatalogLayoutTrophiesComponent,
        CatalogLayoutUnsupportedComponent,
        CatalogLayoutVipBuyComponent,
        CatalogLayoutGuildFrontPageComponent,
        CatalogLayoutGuildCustomFurniComponent,
        CatalogMainComponent,
        CatalogNavigationComponent,
        CatalogNavigationItemComponent,
        CatalogNavigationSetComponent,
        CatalogPurchaseComponent,
        CatalogRedeemVoucherComponent,
        CatalogCustomizeGiftComponent,
        CatalogLayoutSearchResultsComponent,
        CatalogLayoutVipGiftsComponent,
        CatalogLayoutMarketplaceOwnItemsComponent,
        CatalogLayoutMarketplaceMarketplaceComponent,
        CatalogLayoutMarketplaceMarketplaceSubActivityComponent,
        CatalogLayoutMarketplaceMarketplaceSubAdvancedComponent,
        CatalogLayoutMarketplaceMarketplaceOfferComponent,
        CatalogConfirmMarketplacePurchaseComponent
    ]
})
export class CatalogModule
{}
