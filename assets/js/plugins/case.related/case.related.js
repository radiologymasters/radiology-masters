$.fn.relatedCases = function(options) {
    
    var _self = this;
    var _user = null;
    var _settings = $.extend({
        caseId: "",
        speciality: "",
        listSelector: "ul"
    }, options);

    $(document).on("user-authenticated", handleUserAuthenticated);
    $(document).on("user-unauthenticated", handleUserUnautheticated);

    var _list = this.find(_settings.listSelector);
    
    function handleUserAuthenticated(e, user) {
        _user = user;
        
        console.log("LOADING RELATED CASES...", _settings.speciality);
        
        loadRelatedCases()
            .then(filterCases)
            .then(displayRelatedCases)
            .catch(handleError);
    }
    
    function handleUserUnautheticated() {
        _user = null;
        _self.hide();
    }
    
    function isCaseSameSpeciality(caseInfo, speciality) {
        
        if (!caseInfo.speciality || caseInfo.speciality.length == 0) {
            return false;
        }
        
        var isSameSpeciality = caseInfo.speciality.indexOf(speciality) > -1;
        
        console.log("CASE '" + caseInfo.caseId + "' IS SAME SPECIALITY: " + isSameSpeciality, caseInfo);
        
        return isSameSpeciality;
    }
    
    function hasUserCompletedCase(caseId, user) {
        if (!user.completedCases || user.completedCases.length == 0) {
            return false;
        }
        
        var hasCompletedCase = false;
        
        for(var i = 0; i < user.completedCases.length; i++) {
            var completedCaseId = user.completedCases[i];
            
            hasCompletedCase = completedCaseId == caseId;
        }
        
        console.log("USER HAS COMPLETED CASE '" + caseId + "': " + hasCompletedCase, user);
        
        return hasCompletedCase;
    }
    
    function loadRelatedCases(speciality, user) {
        var promise = new Promise(function(resolve, reject) {

            if (!_settings.caseId) {
                throw new Error("The case id must not be null");
            }

            firebase
                .database()
                .ref("/cases/")
                .once("value")
                .then(function(caseRecords) {
                    var cases = caseRecords.val();
                    resolve(cases);
                });
        });
        
        return promise;
    }
    
    function filterCases(cases) {
        
        var promise = new Promise(function(resolve, reject) {

            var filteredCases = [];
            
            console.log("ALL CASES", cases);
            
            for (var caseKey in cases) {
                var caseInfo = cases[caseKey];
                
                var isSameSpeciality = isCaseSameSpeciality(caseInfo, _settings.speciality);
                var hasCompleted = hasUserCompletedCase(caseInfo.caseId, _user);
                
                if (isSameSpeciality && !hasCompleted) {
                    filteredCases.push(caseInfo);
                }
            }
            
            resolve(filteredCases);
        });
        
        return promise;
    }
    
    function displayRelatedCases(cases) {
        
        var promise = new Promise(function(resolve, reject) {
            console.log("RELATED CASES", cases);
            
            for(var i = 0; i < cases.length; i++) {
                var caseInfo = cases[i];
                var li = $("<li/>", { "class": "case" });
                var h4 = $("<h4/>", { text: caseInfo.title });
                var img = $("<img/>", { src: "http://apeg.com/apeg-dev/wp-content/themes/apeg-new/images/default_video_thumb.png" });
                
                li.append(img, h4);
                _list.append(li);
            }
            
            resolve(cases);
        });
        
        return promise;
    }
    
    function handleError(error) {
        console.error(error);
    }
    
};
