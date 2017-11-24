# MarkComplete Plugin

The mark complete plugin is jQuery plugin that allows users to manually mark a case as completed, this is useful if the user has already watched the video but an error occurred while registering completion.

The button should be hidden until the user is authenticated and their profile information has been loaded.

### Setup <a name="setup"></a>

Example:
```
$("#someElementId").markComplete({
	caseId: "9371c428-7960-43de-a2f4-3a0e2bed3c52",
    completeText: "Done",
    incompleteText: "Mark As Done",
    completeClass: "complete",
    incompleteClass: "incomplete"
});
```

----------

### Properties: <a name="properties"></a>

These are the properties that the mark complete plugin supports when initializing the plugin:

#### caseId

This is the id of the case that is currently being viewed, this is typically a string GUID value i.e "9371c428-7960-43de-a2f4-3a0e2bed3c52"

#### completeText

This is the text of the button when it is in the complete state i.e. "Complete"

#### incompleteText

This is the text of the button when it is in the incomplete state i.e. "Mark as complete"

#### completeClass

This is the CSS class that will be added to the button when it is in the complete state i.e. "incomplete"

**Note**: when transitioning from the incomplete state to the complete state the incomplete class value will be removed.

#### incompleteClass

This is the CSS class that will be added to the button when it is in the incomplete state i.e. "incomplete"

----------

### Events <a name="events"></a>
These are the events that the mark complete plugin will listen for.

#### User Authenticated
**Name**: user-authenticated
**Direction**: The plugin *listens* for this event being fired.
#####**Params**:
	user: The authenticated user's info object.
	i.e. 
	{ 
		displayName: "Jamie Mckniff",
		completedCases: [
			"9371c428-7960-43de-a2f4-3a0e2bed3c52"
		] 
	}
		
When the authenticated i.e. signs in, the plugin will check the authenticated user's completed cases, if the user has already completed the case and then the button's state will be set to complete, otherwise it will be set to incomplete.

#### User Authenticated
**Direction**: The plugin *listens* for this event being fired.
**Name**: user-unauthenticated
#####**Params**: none.

When the user becomes unauthenticated i.e. signs out, the state of the internal plugin will be deleted and the button will be hidden.

#### Case Complete
**Direction**: The plugin *listens* for this event being fired.
**Name**: case-complete
#####**Params**: none.

When the case completed event fires the plugin will attempt to mark the case as complete for the user by updating the user's "completedCases" array with the current case's id in the database.

The button will then be disabled so that user cannot mark them-self complete again.

**Note:** This is the same behavior that happens when the user manually marks the case as complete.