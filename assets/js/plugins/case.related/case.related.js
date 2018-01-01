$.fn.relatedCases = function(options) {
    
    var _self = this;
    var _user = null;
    var _settings = $.extend({
        caseId: "",
        speciality: "",
        maxRelatedCases: 4
    }, options);

    $(document).on("user-loaded", handleUserLoaded);
    $(document).on("user-unauthenticated", handleUserUnautheticated);

    var _container = $(this);
    
    function handleUserLoaded(e, user) {
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
                
                if (i == _settings.maxRelatedCases) {
                    break;
                }
                
                var caseInfo = cases[i];
                var li = $("<li/>", { "class": "case" });
                var h4 = $("<h4/>", { text: caseInfo.title });
                var img = $("<img/>", { src: "http://apeg.com/apeg-dev/wp-content/themes/apeg-new/images/default_video_thumb.png" });
                
                var article = $("<article/>", { "class": "fl w-100 w-50-m w-25-ns pa2-ns" });
                var a = $("<a/>", { href: "/cases/" + caseInfo.title, "class": "ph2 ph0-ns pb3 link db dim" });
                var d1 = $("<div/>", { "class": "z-0 aspect-ratio aspect-ratio--16x9 cover bg-center", style: "background-image:url(http://mrmrs.github.io/images/0006.jpg);" });
                var d2 = $("<div/>");
                
                var s1 = $("<span/>", { "class": "absolute left-1 top-1 f7 dib pa1 br1 w-auto white", text: caseInfo.complexity });
                var s2 = $("<span/>", { "class": "absolute right-1 top-1 f7 dib pa1 br1 w-auto bg-blue white", text: caseInfo.createdByUserFullName });
                
                var d3 = $("<div/>", { "class": "ph1" });
                var h3 = $("<h3/>", { "class": "f5 mb0 pa1 br1 black-80", text: caseInfo.title });
                
                d2.append(s1, s2);
                d1.append(d2);
                d3.append(h3);
                a.append(d1, d3);
                article.append(a);
                
                _container.append(article);
            }
            
            resolve(cases);
        });
        
        return promise;
    }
    
    function handleError(error) {
        console.error(error);
    }
    
};
