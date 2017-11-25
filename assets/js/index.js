$(function () {
    $("#user-meta").displayName({
  	    profileLinkText: "{displayName}"
    });
    
    var iframe = $("iframe");
    if(iframe) {
        var player = new Vimeo.Player(iframe);
    
        player.on('play', function() {
            console.log('Video playing...');
        });
        
        player.on('ended', function() {
            console.log('Video ended.');
            $(document).trigger("case-completed");
        });
    }

    var caseId = window.caseId;
    var speciality = "Musculoskeletal";

    $("#case-video-done").markComplete({ 
        "caseId": caseId
    });
    
    $(".related-cases").relatedCases({ 
        "caseId": caseId,
        "speciality": speciality,
        "maxRelatedCases": 4
    });
    
    $(".related-cases").updateStats({ 
        "caseId": caseId
    });
});