# DisplayName Plugin

The display name plugin is a jQuery plugin used to either:
Display either the sign-in and sign-up links to the user if they are unauthenticated 
Or display the profile and sign-out links if the user is authenticated.

### Setup <a name="setup"></a>

Example:
```
 $("#SomeContainerElementId").displayName({ 
	profileLinkText: "Welcome back, {displayName}",
	containers: {
		authenticated: ".authenticated",
		unauthenticated: ".unauthenticated"
	}
 });
```

----------

### Properties: <a name="properties"></a>

These are the properties that the display name plugin supports when initializing the plugin:

#### profileLinkText

This is the text which is formatted with data from the user object and then displayed to the user when authenticated.
i.e. 
Given the user object { displayName: "Jamie Mckniff" }
The profile link text will be "Welcome back, Jamie Mckniff"

#### containers

The containers property is an object which holds the jQuery selectors used to find the authenticated and unauthenticated elements that will be shown / hidden when the user is authenticated / unauthenticated.
