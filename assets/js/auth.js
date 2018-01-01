$(function () {

    function loadPreferences () {
        var the_cookie = document.cookie.split(';');
        if (the_cookie[0]) {
            var unescapedJson = unescape(the_cookie[0]);
            this.data = JSON.parse(unescapedJson);
        }
        return this.data;
    }
    
    var preferences = loadPreferences();
    
    var user = new User();
    user.userId = preferences.userId;
    
    console.log("PREFS", preferences);
    
    $(document).trigger("user-authenticated", user);

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
    });
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