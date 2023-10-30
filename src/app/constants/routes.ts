export class PageRoutes {
  static shortUrls = {
    landing: '/',
    // Auth
    login: 'login',
    register: 'register',

    // Tabs
    home: 'home',
    market: 'market',
    mixedContent: 'mixed-content',
    profile: 'profile',

    community: 'community',

    // SEARCH
    productSearch: 'product-search',

    // Community
    shoppingCart: 'cart',
    tabs: 'app/tabs',
    authRoot: 'app/auth',

    orders: 'order',
    likes: 'likes',
    // Individual
    checkout: 'checkout',
    // Detail
    productDetail: 'product-detail',
    articleDetail: 'article-detail',
    // Community

    error: 'error',

    // Info Page
    version: 'version',
    contactUs: 'contact-us',
    privacyPolicy: 'privacy-policy',
    help: 'help',
    chat: 'chat',
    pages: 'pages',

    // PLAYGROUND
    playground: 'playground',
    spinTheWheel: 'spin-the-wheel',
    searchResult: 'search-result',

    credits: 'credits',
    notification: 'notification',
    welcomeQuizScreen: 'welcome-quiz',
    welcomeQuizScreen1: 'welcome-quiz-screen-1',
    welcomeQuizScreen3: 'welcome-quiz-screen-3',
    welcomeQuizScreen4: 'welcome-quiz-screen-4',

    // AD HOC PAGES
    adHocHomePage: 'pages/ad-hoc-pages',
    passionWave: 'passion-wave-leader-board-pwoc',

    // Bartering
    barteringRoot: 'bartering',
    barteringHome: 'home',
    barteringAddEditProduct: 'add-product',
    barteringProductDetail: 'product-detail',
    barteringProductMatches: 'product-matches',
    barteringUserProducts: 'my-products',
    barteringChatList: 'chat-list',
    barteringChatRoom: 'chat-room-messages',
  };

  static fullUrls = {
    // Auth
    login: `${PageRoutes.shortUrls.authRoot}/${PageRoutes.shortUrls.login}`,
    register: `${PageRoutes.shortUrls.authRoot}/${PageRoutes.shortUrls.register}`,

    // Tabs
    home: `${PageRoutes.shortUrls.tabs}/${PageRoutes.shortUrls.home}`,
    market: `${PageRoutes.shortUrls.tabs}/${PageRoutes.shortUrls.market}`,
    community: `${PageRoutes.shortUrls.tabs}/${PageRoutes.shortUrls.community}`,
    shoppingCart: `${PageRoutes.shortUrls.tabs}/${PageRoutes.shortUrls.shoppingCart}`,

    productSearch: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.productSearch}`,

    mixedContent: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.mixedContent}`,

    orders: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.orders}`,
    likes: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.likes}`,

    checkout: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.checkout}`,
    productDetail: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.productDetail}`,
    articleDetail: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.articleDetail}`,

    error: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.error}`,
    version: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.version}`,
    contactUs: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.contactUs}`,
    profile: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.profile}`,
    privacyPolicy: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.privacyPolicy}`,
    help: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.help}`,
    chat: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.chat}`,

    spinTheWheel: `${PageRoutes.shortUrls.playground}/${PageRoutes.shortUrls.spinTheWheel}`,
    searchResult: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.searchResult}`,
    credits: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.credits}`,
    notification: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.notification}`,
    registrationWelcomeQuizScreenHome: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.welcomeQuizScreen}`,
    registrationWelcomeQuizScreen1: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.welcomeQuizScreen}/${PageRoutes.shortUrls.welcomeQuizScreen1}`,
    registrationWelcomeQuizScreen3: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.welcomeQuizScreen}/${PageRoutes.shortUrls.welcomeQuizScreen3}`,
    registrationWelcomeQuizScreen4: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.welcomeQuizScreen}/${PageRoutes.shortUrls.welcomeQuizScreen4}`,

    // AD HOC PAGES
    passionWave: `${PageRoutes.shortUrls.adHocHomePage}/${PageRoutes.shortUrls.passionWave}`,

    // Bartering
    barteringHome: `${PageRoutes.shortUrls.tabs}/${PageRoutes.shortUrls.barteringRoot}`,
    barteringAddEditProduct: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.barteringRoot}/${PageRoutes.shortUrls.barteringAddEditProduct}`,
    barteringProductDetail: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.barteringRoot}/${PageRoutes.shortUrls.barteringProductDetail}`,
    barteringMatches: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.barteringRoot}/${PageRoutes.shortUrls.barteringProductMatches}`,
    barteringUserProductList: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.barteringRoot}/${PageRoutes.shortUrls.barteringUserProducts}`,
    barteringChatList: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.barteringRoot}/${PageRoutes.shortUrls.barteringChatList}`,
    barteringChatroom: `${PageRoutes.shortUrls.pages}/${PageRoutes.shortUrls.barteringRoot}/${PageRoutes.shortUrls.barteringChatRoom}`,
  };
}
