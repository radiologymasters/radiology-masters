define("preferences", ["json2"], function() {  
    
    return {
     
        data: {},
     
        load: function () {
            var the_cookie = document.cookie.split(';');
            if (the_cookie[0]) {
                var unescapedJson = unescape(the_cookie[0]);
                this.data = JSON.parse(unescapedJson);
            }
            return this.data;
        },
     
        save: function (expires, path) {
            var d = expires || new Date(2020, 02, 02);
            var p = path || '/';
            var json = JSON.stringify(this.data);
            document.cookie = escape(json)
                              + ';path=' + p
                              + ';expires=' + d.toUTCString();
        }
     
    };
});