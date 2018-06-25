---
layout: post
authors: [ryan_de_gruyter, michael_vandendriessche]
title: "TODO viroreact title"
image: /img/2018-05-24-viroreact/viroreact.jpg
tags: [React, React Native, ViroReact, Virtual reality, VR, Augmented reality, AR, Mixed reality, MR]
category: IoT
comments: true
---
{% comment %}

TODO: proper title

resize image if needed

 do we need table of contents? (see lagom kubernetes post)



## Table of Contents

1. [Introduction](#introduction)
2. [Intro viroreact](#bla)
3. [Demo app](#bla)
4. [Lessons learned and conclusion](#bla)
5. [Extra resources](#bla)

{% endcomment %} 

## Introduction
intro
intro
intro 

## Intro viroreact

## Demo application
For our demo application, we decided to use meeting rooms as a use case.
Since ViroReact is advertised as a framework for rapidly building AR / VR applications, we wanted to put this statement to the test and try to create an application in 1 day with no knowledge of the framework at all.

### Use Case: Meeting room status viewer

[Screenshot / Video application]

Sometimes people want to have a quick meeting or Skype call. 
They might be standing or passing by a meeting room, 
and have the ability to immediately check if the meeting room is available for the next 30 minutes. 

We created an application where the user can view the status of a meeting room in Augmented Reality by scanning the room name/picture.

We used [Image Recognition in ViroReact](https://docs.viromedia.com/docs/ar-image-recognition) to achieves this:

[video]

Aside from the Image Recognition, we were also curious how ViroReact handles
- HTTP requests
- UI Updates
- User interaction

Eventually I created three applications:
- A backend application for holding meeting room state (NestJS)
- A client application for changing the state of a meeting room (Ionic PWA)
- A client application for viewing the state of a meeting room (ViroReact)

### The backend application


### The AR Meeting room viewer (ViroReact)

[screenshot/video]

ViroReact is built on top of React, so a basic knowledge of React is necessary. 
To get started, you can follow this great free beginner guide by Kent C. Dodds at egghead.io 
[The beginner's guide to React](https://egghead.io/courses/the-beginner-s-guide-to-react.)


#### Step 1
We began by following the Official Quick Start guide by ViroMedia,
https://docs.viromedia.com/v2.7.3/docs/quick-start

and generating a ViroSample project using the [react-viro CLI](https://www.npmjs.com/package/react-viro).
```
react-viro init ARMeetingRoomViewer
``` 

#### Step 2
Create an AR scene for viewing the status of a meeting room.

To be able to scan the meeting room we needed a picture of the meeting room nameplate, 
this will act as the marker to scan the meeting room information.

I placed the marker image inside of the **/js/res** folder.

Because the file extension was in capital letters (.JPG), 
I had to configure this extension in the rn-cli.config.js file inside of the root folder.

```
  getAssetExts() {
    return ["obj", "mtl", "JPG", "vrx", "hdr"];
  },
```

Next to I created the actual scene inside the **/js/** folder.
I created a file **markerscene.js**

To be able to scan the image marker, we need 2 important API's:
- [ViroARTrackingTargets](https://docs.viromedia.com/v2.7.3/docs/viroartrackingtargets)
- [ViroARImageMarker](https://docs.viromedia.com/v2.7.3/docs/viroarimagemarker)

When the scene initialises we need to setup the Tracking Target(our image marker)
MR7 refers to a meeting room name.
We call this method inside of the constructor.

```
    setMarker() {
        ViroARTrackingTargets.createTargets({
            "mr7": {
                source: require('./res/mr7.JPG'),
                orientation: "Up",
                physicalWidth: 1
            },
        });
    }
```

Next we need to add the 


## Lessons learned and conclusion

## Extra resources
- [Documentation](https://docs.viromedia.com/docs/viro-platform-overview){:target="_blank" rel="noopener noreferrer"}
- code for app
- presentation?