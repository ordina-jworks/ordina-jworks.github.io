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

For this blogpost I will only discuss how we created the ViroReact application.

### The AR Meeting room viewer (ViroReact)

[screenshot/video]

ViroReact is built on top of React, so a basic knowledge of React is necessary. 
To get started, you can follow this great free beginner guide by Kent C. Dodds at egghead.io 
[The beginner's guide to React](https://egghead.io/courses/the-beginner-s-guide-to-react.)


#### Step 1
We began by following the Official [Quick Start guide from ViroMedia](https://docs.viromedia.com/v2.7.3/docs/quick-start).

Using the [react-viro CLI](https://www.npmjs.com/package/react-viro), we generated a ViroSample project.

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

Next we need to define what to render. 

The root component will be an AR Scene:

```
 <ViroARScene onAnchorFound={this._getInfo}
              onClick={this._getInfo}>
  ...
 </ViroARSCene>
```

We bind to 2 events, onAnchorFound and onClick. 
Everytime one of these events occur, we want to fetch the latest meeting room state.

```
getInfo() {
        fetch('https://rooms.meeting/rm7')
            .then((response) => response.json())
            .then((res) => {
                const isTrueSet = (res.isAvailable === 'true');
                this.setState({
                    isAvailable: isTrueSet,
                    nextMeeting: isTrueSet ? `Next meeting: ${res.nextMeeting}h` : `Free @ ${res.nextMeeting}h`,
                    text: isTrueSet ? `Available` : 'Not Available'
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }
```
Inside the scene we want to display the meeting room data when the Image Marker is scanned.
We need to use the ViroReact ImageMarker component for this.
```
                <ViroARImageMarker target={"mr7"}>
                    <ViroFlexView style={this.state.isAvailable ? styles.containerAvail : styles.containerNotAvail}
                                  width={3}
                                  height={3}
                                  position={[0, 0, 1.25]}
                                  rotation={[-100, 0, 0]}>
                        <ViroText text={this.state.text}
                                  width={2}
                                  height={2}
                                  style={styles.text}/>
                        <ViroText text={this.state.nextMeeting}
                                  position={[0, -1, 0]}
                                  width={2.5}
                                  height={2}
                                  style={styles.nextMeeting}/>
                    </ViroFlexView>
                </ViroARImageMarker>
```
The ***ViroARImageMarker*** component has a target "mr7" assigned.
This refers to the ***ViroARTrackingTarget*** we defined in the **setMarker()** method above.

When the target is succesfully scanned, all the content between the ViroARImageMarker component will be rendered.
In our case 2 TextViews positioned with a FlexView.

We bind the data we fetched from in our getInfo() method to the ViroText and ViroFlexView components.

And these are the styles we defined for the ViroText and ViroFlexView.

```
var styles = StyleSheet.create({
    text: {
        fontFamily: 'Arial',
        fontSize: 32,
        flex: .5,
        color: '#FFFFFF'
    },
    nextMeeting: {
        fontFamily: 'Arial',
        fontSize: 32,
        flex: .5,
        color: '#FFFFFF'
    },
    containerAvail: {
        flexDirection: 'column',
        backgroundColor: "#E98300",
        padding: .2,
    },
    containerNotAvail: {
        flexDirection: 'column',
        backgroundColor: "#e91530",
        padding: .2,
    }
});
```

Our final scene

```
'use strict';

import React, {Component} from 'react';

import {StyleSheet} from 'react-native';

import {
    ViroARScene,
    ViroText,
    ViroConstants,
    ViroARTrackingTargets,
    ViroARImageMarker,
    ViroFlexView
} from 'react-viro';

export default class MarkerScene extends Component {

    constructor() {
        super();

        // Set initial state here
        this.state = {
            text: "Initializing AR...",
            nextMeeting: "",
            isAvailable: true
        };

        this.setMarker();
        this._getInfo = this._getInfo.bind(this);
    }

    setMarker() {
        ViroARTrackingTargets.createTargets({
            "mr7": {
                source: require('./res/mr7.JPG'),
                orientation: "Up",
                physicalWidth: 1
            },
        });
    }

    render() {
        return (
            <ViroARScene onAnchorFound={this._getInfo}
                         onClick={this._getInfo}>
                <ViroARImageMarker target={"mr7"}>
                    <ViroFlexView style={this.state.isAvailable ? styles.containerAvail : styles.containerNotAvail}
                                  width={3}
                                  height={3}
                                  position={[0, 0, 1.25]}
                                  rotation={[-100, 0, 0]}>
                        <ViroText text={this.state.text}
                                  width={2}
                                  height={2}
                                  style={styles.text}/>
                        <ViroText text={this.state.nextMeeting}
                                  position={[0, -1, 0]}
                                  width={2.5}
                                  height={2}
                                  style={styles.nextMeeting}/>
                    </ViroFlexView>
                </ViroARImageMarker>
            </ViroARScene>
        );
    }

    _getInfo() {
        fetch('https://rooms.meeting/rm7')
            .then((response) => response.json())
            .then((res) => {
                const isTrueSet = (res.isAvailable === 'true');
                this.setState({
                    isAvailable: isTrueSet,
                    nextMeeting: isTrueSet ? `Next meeting: ${res.nextMeeting}h` : `Free @ ${res.nextMeeting}h`,
                    text: isTrueSet ? `Available` : 'Not Available'
                })
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

var styles = StyleSheet.create({
    text: {
        fontFamily: 'Arial',
        fontSize: 32,
        flex: .5,
        color: '#FFFFFF'
    },
    nextMeeting: {
        fontFamily: 'Arial',
        fontSize: 32,
        flex: .5,
        color: '#FFFFFF'
    },
    containerAvail: {
        flexDirection: 'column',
        backgroundColor: "#E98300",
        padding: .2,
    },
    containerNotAvail: {
        flexDirection: 'column',
        backgroundColor: "#e91530",
        padding: .2,
    }
});

module.exports = MarkerScene;
```

Now that we have our scene, we can load it on startu-up


## Lessons learned and conclusion
Without prior knowledge it was a bit challenging to get our development environment setup correctly.
We had a lot of issues with debugging and cached builds. It was also hard to tell if the problem was with React Native or ViroReact.

Debugging was a challenge for us and the react native develop tools don't seem to work well with ViroReact.

But aside from that, we were still 

## Extra resources
- [Documentation](https://docs.viromedia.com/docs/viro-platform-overview){:target="_blank" rel="noopener noreferrer"}
- code for app
- presentation?