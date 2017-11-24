requirejs.config({
    shim: {
        bootstrap:['jquery'],  
        validate:['jquery']
    },
    paths: {
        // VENDOR
        jquery: "/assets/js/vendor/jquery.min",
        bootstrap: "/assets/js/vendor/bootstrap.min",
        validate: "/assets/js/vendor/jquery.validate.min",
        // INTERNAL
        settings: '/assets/js/shared/settings',
        utils: '/assets/js/shared/utils',
        UserModel: "/assets/js/shared/user.model",
        SignupView: "/assets/js/account/signup",
        LoginView: "/assets/js/account/signin"
    }
});

require(["jquery", "validate", "settings", "utils", "SignupView", "LoginView"], function($, validate, settings, utils) {
    
    $('ul.tabs li').click(function() {
        var tab_id = $(this).attr('data-tab');

        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });
    
    if(utils.getQueryStringParamValue("type") == "signup") {
        $("#signup-tab").click();
    } else {
        $("#signin-tab").click();
    }
    
    var firebaseUIConfig = {
        signInSuccessUrl: settings.signupOAuthUrl,
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };
    
    var firebaseUI = new firebaseui.auth.AuthUI(firebase.auth());
    firebaseUI.start('#firebaseui-auth-container', firebaseUIConfig);
});