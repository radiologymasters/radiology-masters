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

    var caseId = "607f56b6-68d8-4518-b23f-b91a77ed9b4e";
    var speciality = "Musculoskeletal";

    $("#case-video-done").markComplete({ 
        "caseId": caseId
    });
    
    $(".related-cases").relatedCases({ 
        "caseId": caseId,
        "speciality": speciality
    });
    
    $(".related-cases").updateStats({ 
        "caseId": caseId
    });
});