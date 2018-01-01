$.fn.updateStats = function(options) {
    
    var _self = this;
    var _user = null;
    var _case = null;
    var _settings = $.extend({
        caseId: ""
    }, options);
    
    $(document).on("user-loaded", handleUserLoaded);
    $(document).on("user-unauthenticated", handleUserUnautheticated);
    $(document).on("case-completed", handleCaseCompleted);
    
    function handleUserLoaded(e, user) {
        _user = user;

        _case = new Case();
        _case.caseId = _settings.caseId;
        _case
            .loadStats()
            .then(markCaseAsViewed);
    }
    
    function handleUserUnautheticated() {
        _settings.caseId = null;
        _user = null;
        _case = null;
    }    
    
    function handleCaseCompleted(e) {
        console.log("Marking case " + _case.caseId + " as completed.");
        _case.stats.completed += 1;
        _case.updateStats();
    }

    function markCaseAsViewed() {
        console.log(_case);
        console.log("Marking case " + _case.caseId + " as viewed.");
        _case.stats.views += 1;
        _case.updateStats();
    }
    
    
};

function Case() {

    this.caseId = null;
    this.stats = {
        views: 0,
        completed: 0
    };

    var self = this;
    
    this.loadStats = function () {
        var promise = new Promise(function(resolve, reject) {
            
            if (!self.caseId) {
                throw new Error("The case id must not be null");
            }
            
            firebase
                .database()
                .ref('/cases/' + self.caseId + "/stats")
                .once('value')
                .then(function(caseStats) {
                    
                    console.log("Case " + self.caseId + " stats", caseStats.val());
                    
                    self.stats = caseStats.val();
                
                    resolve();
                });
        });
        
        return promise;
    };
    
    this.updateStats = function() {

        var promise = new Promise(function(resolve, reject) {

            if (!self.caseId) {
                throw new Error("The case id must not be null");
            }

            firebase
                .database()
                .ref("cases/" + self.caseId + "/stats")
                .set(self.stats)
                .then(function() {
                    
                    console.log("Case " + self.caseId + " stats have been updated.");
                    
                    resolve();
                })
                .catch(function(error) {
                    reject(error);
                });
        });

        return promise;
    };
}