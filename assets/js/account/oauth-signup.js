requirejs.config({
    paths: {
        // VENDOR
        jquery: "/assets/js/vendor/jquery.min",
        // INTERNAL
        settings: '/assets/js/shared/settings',
        utils: '/assets/js/shared/utils',
        preferences: '/assets/js/shared/preferences',
        UserModel: "/assets/js/shared/user.model",
        SignupOAuthView: "/assets/js/account/signup.oauth"
    }
});

require(["jquery", "settings", "SignupOAuthView"], function($, settings) {
    console.log("OAuth signup view loaded");
});