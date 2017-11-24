$.fn.displayName = function(options) {
    
    var settings = $.extend({
        profileLinkText: "Welcome back, {displayName}",
        containers: {
            authenticated: ".authenticated",
            unauthenticated: ".unauthenticated"
        }
    }, options);

    var authenticatedContainer = $(settings.containers.authenticated);
    var unauthenticatedContainer = $(settings.containers.unauthenticated);

    $(document).on("user-authenticated", function(event, user) {
        update(true, user);
    }).on("user-unauthenticated", function() {
        update(false);
    });

    authenticatedContainer.find(".logout").click(function(e) {
        e.preventDefault();
        $(document).trigger("user-logout");
    })

    var update = function(isAuthenticated, user) {
        if (isAuthenticated) {
            
            console.log("USER", user);
            
            authenticatedContainer
                .find(".profile")
                .text(settings.profileLinkText.format(user));

            unauthenticatedContainer.hide();
            authenticatedContainer.show();
        }
        else {
            authenticatedContainer.hide();
            unauthenticatedContainer.show();
        }
    };

    update();

    String.prototype.format = function(o) {
        return this.replace(/{([^{}]*)}/g, function(a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    };
};
