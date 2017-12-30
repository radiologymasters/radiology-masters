define("settings", function() {  
    return {
        authCookieExpirationInDays: 30,
        authCookieName: "AUTH_TICKET",
        homeUrl: "/index.html",
        loginUrl: "/account",
        signupOAuthUrl: "/account/oauth-signup.html"
    };
});