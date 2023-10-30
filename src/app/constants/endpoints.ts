export const endpoints = {
  // User
  getUserProfile: 'get/user',
  createNewUser: 'post/create-new-user',
  addProfilePicture: 'post/profile-picture',
  addFullName: 'post/name',
  addEmail: 'post/email',
  addPhone: 'post/phone',
  addUserCountry: 'post/update-user-country',
  addLastLogin: 'post/update-last-login',
  saveNotificationToken: 'post/save-notification-token',
  getLoginProviderApi: 'post/login-provider',
  postUserQueryToAdminThroughGreenConcierge: 'post/user-query-green-concierge',
  postRegistrationWelcomeQuizResponse:
    'post/registration-welcome-quiz-response',
  getUserRegistrationQuizResponseStatus:
    'get/user-registration-quiz-response-status',

  // PRODUCT REQUESTS
  getPopularProducts: 'get/popular-products',
  getJustForYouProducts: 'get/just-for-you',
  getProductBySearchTerm: 'get/products-filtered-by-search',
  getProductsWithFilters: 'get/products',
  getProductDetail: 'get/product',
  getProductsByOwner: 'get/products-by-owner',

  // ARTICLE REQUEST
  getArticles: 'get/articles',
  getArticleDetail: 'get/article-detail',

  // Miscellaneous
  sendMessageToGreenDay: 'post/contact-us',
  getMerchantList: 'get/merchant-list',

  // Payment related
  makePayment: 'post/payment-v2',
  saveOrder: 'post/save-order',
  getShippingAddress: 'get/shipping',
  updateShippingAddress: 'post/shipping',

  // Order Related
  getOrderListForUser: 'get/my-orders',

  // CART
  getCartItems: 'get/cart-items',
  updateCartItems: 'post/cart-items',

  // MISCELLANEOUS
  getPopularTagsList: 'get/tags',
  getMixedData: 'get/data-filter-by-tags',
  checkCoupon: 'get/coupon-code',
  updateCoupon: 'post/coupon',

  // Notification
  updateNotificationStatus: 'post/update-notification-status',
  getNotificationData: 'get/notification-data',
  sendNotification: 'https://fcm.googleapis.com/fcm/send',
  logNotification: 'post/user-add-notification',
  rewardReferrer: 'post/reward-the-referrer',

  // Coin Activity
  getUserCoins: 'get/user-coins',
  getCoinActionList: 'get/coin-action-list',
  addCoinActivity: 'post/user-coin-activity-list',

  // Analytics
  addActivity: 'post/user-analytics-list',

  // Referral
  getUserReferralCode: 'get/user-referral-code',
  checkReferralCodeValidity: 'get/check-referral-code-validity',

  // file-requester
  getFileApi: 'get/file',

  getForageItems: 'get/forage-items',
  getRelatedProducts: 'get/related-products',

  // Likes
  saveLikeStatus: 'post/save-user-like-products',
  getLikedProductList: 'get/my-like-product-list',

  setProductLikeStatus: 'post/set-user-like',
  getTurtlePicks: 'get/turtle-picks',

  // Share
  saveShareProduct: 'post/save-share-products',

  // site-deployments
  getLatestSiteDeploymentTime: 'get/latest-site-deployment-info',

  // Bartering
  barteringModifyProduct: 'post/bartering-modify-product',
  barteringDeleteProduct: 'delete/bartering-delete-product',
  barteringLikeProduct: 'post/bartering-like-product',
  barteringIgnoreProduct: 'post/bartering-ignore-product',
  barteringGetAllProductsAddedByCurrentUser:
    'get/bartering-get-all-products-added-by-current-user',
  barteringGetRelevantProducts: 'get/bartering-get-relevant-products',
  barteringGetMatches: 'get/bartering-get-matches',
  barteringGetProductDetailWithRelevance:
    'get/bartering-get-product-detail-with-relevance',
  barteringGetProductDetail: 'get/bartering-get-product-detail',
  // pa-wave 2020
  getUserStatForPAWave2020: 'get/user-stat-pa-wave-2020',
  postBarteringChatMessage: 'post/bartering-chat-message',

  //kk Event 2021
  getUserStatForKKEvent2021: 'get/user-stat-kk-event-2021',
  getUserStatForPWAEvent2021: 'get/user-stat-pwa-event-2021',
  getTeamStatForPWAEvent2021: 'get/team-stat-pwa-event-2021',
  getTop10TeamStatForPWAEvent20: 'get/top10team-stat-pwa-event-2021',
};

export const endpointsWithAuth = [endpoints.getShippingAddress];
