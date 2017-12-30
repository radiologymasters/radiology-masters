define("utils", function() {  
    
    function _guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    function _getRouteParamValue(url) {
        var urlParts = url.split("/");
        var paramIndex = urlParts.length;
        return urlParts[paramIndex -1];
    }
    
    function _getQuerystringParamValue(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    
    function _createCookie(name, value, expirationInDays) {
        var date = new Date();
        date.setTime(date.getTime() + (expirationInDays * 24 * 60 * 60 * 1000));
        
        var expires = "expires=" + date.toUTCString();
        
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    
    function _getCookieValue(name) {
        var cookieName = name + "=";
        var cookieValue = document.cookie.split(';');
        
        for(var i = 0; i < cookieValue.length; i++) {
            var value = cookieValue[i];
            
            while (value.charAt(0) == ' ') {
                value = value.substring(1);
            }
            
            if (value.indexOf(cookieName) == 0) {
                return value.substring(cookieName.length, value.length);
            }
        }
        
        return "";
    }
    
    return {
        getRouteParamValue: _getRouteParamValue,
        getQueryStringParamValue: _getQuerystringParamValue,
        guid: _guid,
        createCookie: _createCookie,
        getCookieValue: _getCookieValue
    };
});

String.prototype.format = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};