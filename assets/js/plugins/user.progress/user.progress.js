$.fn.displayProgress = function(options) {
    
    var _self = this;
    var _user = null;
    var _settings = $.extend({
        speciality: null
    }, options);

    $(document).on("user-authenticated", handleUserAuthenticated);
    $(document).on("user-unauthenticated", handleUserUnautheticated);
    $(document).on("case-state-changed", calculateProgress);

    function handleUserAuthenticated(e, user) {
        _user = user;
        calculateProgress();
    }
    
    function calculateProgress() {
        loadAllCases()
            .then(filterCasesBySpeciality)
            .then(displayOverallProgress)
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
        
        return isSameSpeciality;
    }
    
    function hasUserCompletedCase(caseId, user) {
        if (!user.completedCases || user.completedCases.length == 0) {
            return false;
        }
        
        var hasCompletedCase = false;
        
        for(var i = 0; i < user.completedCases.length; i++) {
            var completedCaseId = user.completedCases[i];
            
            if (completedCaseId == caseId) {
                hasCompletedCase = true;
                break;
            }
        }
        
        return hasCompletedCase;
    }
    
    function loadAllCases(speciality, user) {
        
        var promise = new Promise(function(resolve, reject) {

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
    
    function filterCasesBySpeciality(cases) {
        
        console.log("CASES", cases);
        
        var promise = new Promise(function(resolve, reject) {
            
            if (!_settings.speciality) {
                resolve(cases);
                return;
            }
            
            var filteredCases = [];
            
            for(var key in cases) {
                var caseInfo = cases[key];
                
                if (isCaseSameSpeciality(caseInfo, _settings.speciality)) {
                    
                    filteredCases.push(caseInfo);
                }
            }
            
            resolve(filteredCases);
        });
        
        return promise;
    }
    
    function displayOverallProgress(cases) {
        
        var promise = new Promise(function(resolve, reject) {
            
            var total = 0;
            var completed = 0;
            
             for(var key in cases) {
                var caseInfo = cases[key];
            
                var hasCompleted = hasUserCompletedCase(caseInfo.caseId, _user);
                
                total++;
                
                if (hasCompleted) {
                    completed++;
                }
            }
            
            if (total > 0) {
                var progress = ((completed / total) * 100);
                _self.html(progress);
            } else {
                _self.html("0");
            }
            
            resolve(cases);
        });
        
        return promise;
    }
    
    function handleError(error) {
        console.error(error);
    }
    
};
