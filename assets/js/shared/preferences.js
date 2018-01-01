define("preferences", ["json2"], function() {  
    
    return {
     
        data: {},
     
        save: function (expires, path) {
            var d = expires || new Date(2020, 02, 02);
            var p = path || '/';
            var json = JSON.stringify(this.data);
            document.cookie = "USER=" + 
                              + escape(json)
                              + ';path=' + p
                              + ';expires=' + d.toUTCString();
        }
     
    };
});