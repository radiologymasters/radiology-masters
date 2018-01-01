$(function () {

    function loadPreferences () {
        var data = null;
        var cookies = document.cookie.split(';');
        
        if (cookies[0]) {
            var unescapedJson = unescape(cookies[0]);
            data = JSON.parse(unescapedJson);
        }
        
        return data;
    }
    
    var preferences = loadPreferences();
    
    var user = new User();
    user.userId = preferences.userId;
    user.displayName = preferences.fullname;
    
    console.log("PREFS", preferences);
    
    $(document).trigger("user-authenticated", user);

    user.load(firebase).then(function () {
        $(document).trigger("user-loaded", user);
    });

    // firebase.auth().onAuthStateChanged(function(firebaseUser) {
        
    //     if (firebaseUser) {
            
    //         var user = new User();
            
    //         // user.userId = firebaseUser.uid;
            
    //         // user.load(firebase).then(function () {
    //         //     $(document).trigger("user-authenticated", user)
    //         // });
            
    //     } else {
    //         $(document).trigger("user-unauthenticated");
    //     }
    // });
    
    $(document).on("user-logout", function () {
        firebase.auth().signOut();
        $.cookie("USER", null, { path: '/' });
        $(document).trigger("user-unauthenticated");
    });
    
    function deleteCookie(name, path, domain) {
      if(deleteCookie(name)) {
        document.cookie = name + "=" +
          ((path) ? ";path="+path:"")+
          ((domain)?";domain="+domain:"") +
          ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
      }
    }
});

function User() {
    this.userId = "";
    this.firstName = "";
    this.lastName = "";
    this.displayName = "";
    this.email = "";
    this.signupDate;
    this.isEnabled = false;
    this.completedCases = [];
    
    var self = this;
    
    this.load = function(firebase) {
    
        var promise = new Promise(function(resolve, reject) {
            
            firebase
                .database()
                .ref('/users/' + self.userId)
                .once('value')
                .then(function(userInfo) {
                    
                    self.firstName = userInfo.val().firstName;
                    self.lastName = userInfo.val().lastName;
                    self.displayName = toTitleCase(self.firstName + " " + self.lastName);
                    self.email = userInfo.val().email;
                    self.isAdmin = userInfo.val().isAdmin;
                    self.isEnabled = userInfo.val().isEnabled;
                    self.signupTimestamp = new Date(userInfo.val().signupTimestamp);
                    self.completedCases = userInfo.val().completedCases || [];
                    
                    resolve();
                });
        });
        
        return promise;
    };
    
    this.hasCompletedCase = function (caseId) {
        if (!self.completedCases) {
            return false;
        }

        return self.completedCases.indexOf(caseId) > -1;
    };
    
    this.markCaseAsComplete = function (firebase, caseId) {
        
        var promise = new Promise(function(resolve, reject) {
            if (self.completedCases.indexOf(caseId) > -1) {
                resolve();
                return;
            }
            
            self.completedCases.push(caseId);
            
            firebase.database()
                .ref("users/" + self.userId + "/completedCases")
                .set(self.completedCases)
                .then(resolve)
                .catch(reject);
        });
        
        return promise;
    };
    
    this.markCaseAsUncomplete = function (firebase, caseId) {
        
        var promise = new Promise(function(resolve, reject) {
            var caseIndex = self.completedCases.indexOf(caseId);
                
                
            if (caseIndex == -1) {
                resolve();
                return;
            }
            
            self.completedCases.splice(caseIndex, 1);
            
            firebase.database()
                .ref("users/" + self.userId + "/completedCases")
                .set(self.completedCases)
                .then(resolve)
                .catch(reject);
        });
        
        return promise;
    };
    
    function toTitleCase(value)
    {
        return value.replace(/\w\S*/g, function(text){
            return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
        });
    }
}