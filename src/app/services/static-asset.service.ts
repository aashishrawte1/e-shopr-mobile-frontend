import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StaticAssetService {
  greenDayLogoPNG =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/greenday-logo.png';
  defaultAvatarIcon =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/add-avatar.svg';
  greenDayWordSVG =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/greenday-text-green.svg';
  placeholderImage =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/default-article-image.jpg';
  emptyCartIcon =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/shopping-cart.svg';
  paymentSuccessfulPopup =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/order-success-popup.jpg';
  inAppAnnouncementPopup =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/in-app-announcement.svg';
  greenGemsIcon =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/green-gems.png';
  pencilIcon =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/pen.svg';

  merchantShopIcon =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/webshop.svg';
  youtubeIcon =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/youtube.svg';

  addProductIconBarteringType1 =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/bartering_icons/addition-button-no-fill-type1.svg';

  addProductIconBarteringType2 =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/bartering_icons/addition-button-no-fill-type2.png';
  likeIconBarteringType1 =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/bartering_icons/like-red-type1.svg';

  rightArrowBarteringType1 =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/bartering_icons/right-arrow-type1.svg';
  notFoundBarteringMatchProduct =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/bartering/bartering-product-not-found.png';

  tabIcons = {
    homeOutline:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/home-outline.svg',
    homeFilled:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/home-filled.svg',
    marketplaceOutline:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/marketplace-outline.svg',
    marketplaceFilled:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/marketplace-filled.svg',
    barterOutline:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/bartering-outline.svg',
    barterFilled:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/bartering-filled.svg',
    communityOutline:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/community-outline.svg',
    communityFilled:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/community-filled.svg',
    shoppingCartOutline:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/shopping-cart-outline.svg',
    shoppingCartFilled:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/shopping-cart-filled.svg',
    chatIconOutline:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/chat-icon-outline.svg',
    chatIconFilled:
      'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/tab-icons/chat-icon-filled.svg',
  };

  init() {}
}
