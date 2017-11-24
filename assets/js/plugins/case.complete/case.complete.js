$.fn.markComplete = function(options) {
    
    var _self = this;
    var _hasCompletedCase = false;
    var _user = null;
    var _settings = $.extend({
        caseId: "",
        completeText: "Done",
        incompleteText: "Mark As Done",
        completeClass: "complete",
        incompleteClass: "incomplete",
    }, options);

    $(document).on("user-authenticated", handleUserAuthenticated);
    $(document).on("user-unauthenticated", handleUserUnautheticated);
    $(document).on("case-state-toggle", handleCaseCompleted);
    
    function handleUserAuthenticated(e, user) {
        _user = user;
        
        _self.on("click", handleMarkAsCompleteClicked);
        
        _hasCompletedCase = user.hasCompletedCase(_settings.caseId);
    
        if (_hasCompletedCase) {
            caseComplete();
        }
        else {
            caseUncomplete();
        }
        
        _self.fadeIn();
    }
    
    function handleUserUnautheticated() {
        _hasCompletedCase = false;
        _user = null;
        _self
            .off("click")
            .hide();
    }
    
    function caseComplete() {
        
        _hasCompletedCase = true;
        
        _self
            .removeClass(_settings.incompleteClass)
            .addClass(_settings.completeClass)
            .text(_settings.completeText);
            
        $(document).trigger("case-state-changed");
    }
    
    function caseUncomplete() {
        
        _hasCompletedCase = false;
        
        _self
            .addClass(_settings.incompleteClass)
            .text(_settings.incompleteText);
            
        $(document).trigger("case-state-changed");
    }
    
    function handleCaseCompleted(e, data) {
        
        if (data.caseId != _settings.caseId) {
            return;
        }
        
        if (!_hasCompletedCase) {
            
            console.log("Marking case " + data.caseId + " as complete.");
            _user
                .markCaseAsComplete(firebase, data.caseId)
                .then(caseComplete);
                
        } else {
            
            console.log("Marking case " + data.caseId + " as uncomplete.");
            _user
                .markCaseAsUncomplete(firebase, data.caseId)
                .then(caseUncomplete);
        }
    }
    
    function handleMarkAsCompleteClicked(e) {
        e.preventDefault();
        
        if (!_user) {
            return;
        }
        
        $(document).trigger("case-state-toggle", { caseId: _settings.caseId });
    }
};
