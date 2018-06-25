---
layout: post
authors: [ryan_de_gruyter, michael_vandendriessche]
title: "ViroReact: Build cross platform AR / VR application for Android and iOS using React"
image: /img/2018-06-26-viroreact/viroreact.jpg
tags: [React, React Native, ViroReact, Virtual reality, VR, Augmented reality, AR, Mixed reality, MR]
category: IoT
comments: true
---
## Table of Contents

1. [Introduction](#introduction)
2. [Basics of ViroReact](#basics-of-viroreact)
3. [Demo app](#demo-application)
4. [Lessons learned and conclusion](#lessons-learned-and-conclusion)
5. [Extra resources](#extra-resources)

## Introduction
Augmented Reality is a very interesting space so naturally we wanted to do something with it.
There are many frameworks available for building cross platform AR/VR applications.
We came across ViroReact which uses React and React Native to create immersive VR and AR applications using a single codebase for Android and iOS.
This persuaded us to give it a try.
In one day, with some tweaking afterwards, we were able to create a simple app to show the status of a meeting room. 

## Basics of ViroReact

### Components
The main building blocks of a ViroReact app are the components.

#### The most important component is a Scene
The [scene](https://docs.viromedia.com/docs/scenes) is the digital environment the user interacts with.
All other components live in this scene.
{% highlight javascript %}
<ViroScene>
<ViroARScene>
{% endhighlight %}

Just like many other components, the Scene comes in 2 variations: ViroScene and ViroARScene.
As the name suggests ViroARScene is used for Augmented Reality applications
while the ViroScene is meant for Virtual Reality.

A [ViroSceneNavigator](https://docs.viromedia.com/docs/scene-navigation) is used to navigate between these scenes.
{% highlight javascript %}
<ViroSceneNavigator>
<ViroARSceneNavigator>
{% endhighlight %}
The SceneNavigator holds a stack of scenes to enable simple transitions from one scene to the next or previous scene.

#### These scenes can be populated with all kinds of components
For example a [ViroText](https://docs.viromedia.com/docs/virotext2).
{% highlight javascript %}
{% raw %}
<ViroText
	text="Hello World"
	position={[0,0,-5]}
	color="#ff0000"
	width={2} height={2}
	style={{fontFamily:"Arial", fontSize:20}}/>
{% endraw %}
{% endhighlight %}

Or perhaps a [ViroBox](https://docs.viromedia.com/docs/virobox), a [ViroQuad](https://docs.viromedia.com/docs/viroquad) or a [ViroSphere](https://docs.viromedia.com/docs/virosphere).  
These components can be modified by setting their properties.
One of the most important properties is the position.
It takes an array of 3 numbers as the x, y and z coordinates. 

#### There are also more specialised components
Like a [Viro3DObject](https://docs.viromedia.com/docs/viro3dobject) which lets you include custom made 3D objects in your scene.

{% highlight javascript %}
<Viro3DObject
	source={require("./res/spaceship.obj")} type="OBJ"
	resources={[require('./res/spaceship.mtl'),
		require('./res/texture1.jpg')]}
	position={[1, 3, -5]} scale={[2, 2, 2]}
	rotation={[45, 0, 0]}
	transformBehaviors={["billboard"]}/>
{% endhighlight %}
These 3D objects can be created in your favourite 3D modelling tools.
ViroReact supports OBJ or VRX (converted from FBX) formats.
The billboard transform behaviour is an interesting feature to make sure the object is always facing the user.

A [Viro360Image](https://docs.viromedia.com/docs/viro360image) can be set as the background of a scene.
 
A [ViroPortal](https://docs.viromedia.com/docs/viroportal) lets the user take a peek into a different scene.
It basically is a window to another world.
The Viro3DObject included in it acts like the window frame.

A [ViroARImageMarker](https://docs.viromedia.com/docs/viroarimagemarker) reacts when one of the ViroARTrackingTargets is scanned.
It will show all the components inside the ViroARImageMarker tag.
We have used this in our little app, more on that [below](#demo-application).

{% highlight javascript %}
{% raw %}
<ViroARImageMarker target={"targetOne"}>
    <ViroBox position={[0, 0.25, 0]} scale={[0.5, 0.5, 0.5]} />
</ViroARImageMarker>
{% endraw %}
{% endhighlight %}

{% highlight javascript %}
ViroARTrackingTargets.createTargets({
  "targetOne" : {
	source : require('./res/targetOne.jpg'),
	orientation : "Up",
	physicalWidth : 0.1 // real world width in meters
  },
});
{% endhighlight %}

#### We wouldn't see anything without eyes and light
The [Camera](https://docs.viromedia.com/docs/camera) component is our eyes.
{% highlight javascript %}
<ViroCamera position={[0, 0, 0]} rotation={[45, 0, 0]) active={true} />
{% endhighlight %}
A default camera is provided at the origin `position={[0, 0, 0]}`.
The camera always looks in the negative Z direction.
So if you want an object to be visible as soon as the scene loads up, 
make sure to set its position with a negative Z value `position={[0, 0, -5]}`. 
If the object would have a positive Z value it would be placed behind you when you load up the scene.
There is also a ViroOrbitCamera where the camera orbits around a certain position, always keeping it in view.

[Lights](https://docs.viromedia.com/docs/3d-scene-lighting) are very important components in a scene.
Without any light the user wouldn't see anything.
Luckily a default light is provided when none is defined.
We didn't need lights in our setup but if you want a more realistic or visually stunning experience, 
I highly recommend you to look into the different lights in the [documentation](https://docs.viromedia.com/v2.6.1/docs/3d-scene-lighting).  
There are 4 lighting models: Phong, Blinn, Lambert and Constant.  
These are the algorithms that calculate what your objects will look like when influenced by light.
By default, elements use the Constant lighting model, which means lights will be ignored and the object will show its full color.  
ViroReact supports 4 types of light.

The [ViroAmbientLight](https://docs.viromedia.com/docs/viroambientlight) is the simplest light.
{% highlight javascript %}
<ViroAmbientLight color="#ffffff"/>
{% endhighlight %}
It lights up all the objects in the scene equally from every direction.
Only the color needs to be set.

A [ViroOmniLight](https://docs.viromedia.com/docs/viroomnilight) is comparable to a light bulb.
{% highlight javascript %}
<ViroOmniLight
    color="#ffffff"
    attenuationStartDistance={2}
    attenuationEndDistance={6}
    position={[0,-5,5]}
 />
{% endhighlight %}
The light originates from a specified position and moves in all directions.
The light slowly fades out if the distance is between 2 and 6, set in the attenuation properties.

A [ViroSpotLight](https://docs.viromedia.com/docs/virospotlight1) is comparable to a flashlight.
{% highlight javascript %}
<ViroSpotLight
    color="#ffffff"
    attenuationStartDistance={2}
    attenuationEndDistance={6}
    position={[0, -5, 5]}
    direction={[0 -1, 0]}
    innerAngle={0}
    outerAngle={45}
 />
{% endhighlight %}
The light originates from a single point and shines in a cone.
The direction and angle of the cone can be set as well as the attenuation start and end distances.
Some other properties are available to create the shadows you want.

The last type of light is the [ViroDirectionalLight](https://docs.viromedia.com/docs/virodirectionallight-1).
{% highlight javascript %}
<ViroDirectionalLight
    color="#ffffff"
    direction={[0, -1, 0]}
 />
{% endhighlight %}
The sun would be the prime example of a ViroDirectionalLight.
It shines over the whole scene in a specific direction.

#### To make these objects look good we need Materials
[Materials](http://viro.readme.io/docs/3d-scene-lighting) are used to place texture images on 3d objects.
They can make a long box look like a brick wall or a sphere look like our planet.
{% highlight javascript %}
ViroMaterials.createMaterials({
  earth: {
	shininess: 2.0,
	lightingModel: "Lambert",
	diffuseTexture: require('./res/earth_texture.jpg'),
  }
});
{% endhighlight %}
There are many properties available for materials.
Discussing all of these is outside the scope of this article.
The diffuseColor and diffuseTexture are the main color and texture of the material.
These can be placed on basic 3D objects like ViroBox, ViroQuad and ViroSphere.
Complex Viro3DObjects can have multiple materials.

#### Move them around with Animations 
Our scenes are still lacking motion.
That's where [animations](https://docs.viromedia.com/docs/animation) come in handy. 

{% highlight javascript %}
ViroAnimations.registerAnimations({
	animateImage:{properties:{scaleX:1.0, scaleY:0.6},
				  easing:"Bounce", duration: 5000}});
{% endhighlight %}
{% highlight javascript %}
<ViroImage source={require('./res/myimage.jpg')}
		   position={[0, -1, -2]}
		   animation={{name:'animateImage', run:true}}/>
{% endhighlight %}
Animations change the numerical value of properties over time.
Typically this is used for the position and scale properties but it can just as well be used for color values or other numerical values.
There are 5 easing types: Linear, EaseIn, EaseOut, EaseInEaseOut and Bounce.
These represent how the values change over time.

#### Control the scene with a ViroController 
With all of the above we can create an awesome scene but we can't interact with it yet. 
The [ViroController](https://docs.viromedia.com/docs/virocontroller) provides us the ability to interact with our scene. 
{% highlight javascript %} 
<ViroController 
reticleVisibility={true} 
controllerVisibility={true} 
onClick={this._onClickListenerForAllEvents} /> 
{% endhighlight %} 
With the reticle (the blue circle in the middle of the view) the user can select and point to objects and call the function in the onClick property.
It's also possible to use other events like onHover, onTouch, onSwipe, onPinch, onScroll, etc...
These events are very useful for UI.

#### There are many more fun components
Apart from the ones we mentioned here, there are many more fun components to include [video](http://viro.readme.io/docs/video), [sound](http://viro.readme.io/docs/audio) and [particles](http://viro.readme.io/docs/particle-effects) in your scene.
They follow the same principles but each have their own properties.
This being built on React Native we can also declare our own components of course!

{% highlight javascript %}
{% raw %}
export default class CustomComponent extends Component {
	static propTypes = {customProperty: PropTypes.number}

    constructor() {super() ;}

	render() {return (
		<ViroText text={this.props.customProperty}> );}
	}

{% endraw %}
{% endhighlight %}

{% highlight javascript %}
<CustomComponent customProperty={42}>
{% endhighlight %}
Just extend from Component, define your properties in propTypes and use it in your scenes.
In our demo application we used this to create our scene but you can create small reusable components too of course!

## Demo application
Before you can build a ViroReact application you need to [request an API key from ViroMedia](https://viromedia.com/signup).
This should not take more than a few minutes.

For our demo application, we decided to use meeting rooms as a use case.
Since ViroReact is advertised as a framework for rapidly building AR / VR applications, we wanted to put this statement to the test and try to create an application in one day with no knowledge of the framework at all.

### Use Case: Meeting room status viewer

[Screenshot / Video application]

Sometimes people want to have a quick meeting or Skype call. 
They might be standing or passing by a meeting room, 
and have the ability to immediately check if the meeting room is available for the next 30 minutes. 

We created an application where the user can view the status of a meeting room in Augmented Reality by scanning the room name/picture.

We used [Image Recognition in ViroReact](https://docs.viromedia.com/docs/ar-image-recognition) to achieve this.

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

ViroReact is built on top of React, so basic knowledge of React is necessary. 
To get started, you can follow this great free beginner guide by Kent C. Dodds at egghead.io 
[The beginner's guide to React](https://egghead.io/courses/the-beginner-s-guide-to-react.)


#### Step 1: Project setup
We began by following the Official [Quick Start guide from ViroMedia](https://docs.viromedia.com/v2.7.3/docs/quick-start).

Using the [react-viro CLI](https://www.npmjs.com/package/react-viro), we generated a ViroSample project.

```
react-viro init ARMeetingRoomViewer
``` 

#### Step 2: Create an AR scene for viewing the status of a meeting room.

To be able to scan the meeting room we needed a picture of the meeting room nameplate, 
this will act as the marker to scan the meeting room information.

I placed the marker image inside of the `**/js/res**` folder.

Because the file extension was in capital letters (.JPG), 
I had to configure this extension in the `rn-cli.config.js` file inside of the root folder.

{% highlight javascript %}
  getAssetExts() {
    return ["obj", "mtl", "JPG", "vrx", "hdr"];
  },
{% endhighlight %}

Next, I created the actual scene in a file called **markerscene.js** in the **/js/** folder.

To be able to scan the image marker, we need 2 important APIs:
- [ViroARTrackingTargets](https://docs.viromedia.com/v2.7.3/docs/viroartrackingtargets)
- [ViroARImageMarker](https://docs.viromedia.com/v2.7.3/docs/viroarimagemarker) component

When the scene initialises we need to setup the Tracking Target(our image marker)
**mr7** refers to a meeting room name.

We call this method inside of the constructor.

{% highlight javascript %}
    setMarker() {
        ViroARTrackingTargets.createTargets({
            "mr7": {
                source: require('./res/mr7.JPG'),
                orientation: "Up",
                physicalWidth: 1
            },
        });
    }
{% endhighlight %}

Then we need to define what to render. 
The root component will be an AR Scene:

{% highlight javascript %}
 <ViroARScene onAnchorFound={this._getInfo}
              onClick={this._getInfo}>
  ...
 </ViroARScene>
{% endhighlight %}

We bind 2 events on the ViroARScene component, onAnchorFound and onClick. 
Everytime one of these events occur, we want to fetch the latest meeting room state.

onAnchorFound gets called when the Image Marker has been detected.

{% highlight javascript %}
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
{% endhighlight %}

Inside the scene we want to display the meeting room data when the Image Marker is scanned.
We need to use the ViroReact ImageMarker component for this.

{% highlight javascript %}
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
{% endhighlight %}

The **ViroARImageMarker** component has a target "mr7" assigned.
This refers to the **ViroARTrackingTarget** we defined in the **setMarker()** method above.

When the target is successfully scanned, all the content of the ViroARImageMarker component will be rendered.
In our case 2 TextViews positioned with a FlexView.

We bind the data we fetched from in our `getInfo()` method to the ViroText and ViroFlexView components.

And these are the styles we defined for the ViroText and ViroFlexView.

{% highlight javascript %}
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
{% endhighlight %}

Our final scene

{% highlight javascript %}
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
{% endhighlight %}

#### Step 3: Load your marker scene on application startup

Now that we have our scene, we can load it on start-up.
In the root folder you can find the app.js file. 
Here we can define which scene to load when starting up the application.

Assign your API key from ViroMedia.

{% highlight javascript %}
const sharedProps = {
    apiKey: "6E2805CC-xxxx-4Ex0-8xx0-02xxxxxxx",
};
{% endhighlight %}

Import your marker scene.

{% highlight javascript %}
const MarkerScene = require('./js/MarkerScene');
{% endhighlight %}

Render your AR Scene.

Final result:

{% highlight javascript %}
{% raw %}
import React, {Component} from 'react';
import {ViroARSceneNavigator} from 'react-viro';

const sharedProps = {
    apiKey: "6E2805CC-xxxx-4Ex0-8xx0-02xxxxxxx",
};

const MarkerScene = require('./js/MarkerScene');

export default class ViroSample extends Component {
    constructor() {
        super();

        this.state = {
            sharedProps: sharedProps
        };

        this._getARNavigator = this._getARNavigator.bind(this);
    }

    render() {
        return this._getARNavigator();
    }

    _getARNavigator() {
        return (
            <ViroARSceneNavigator {...this.state.sharedProps}
                                  initialScene={{scene: MarkerScene}}/>
        );
    }
}

module.exports = ViroSample;
{% endraw %}
{% endhighlight %}


## Lessons learned and conclusion
Without prior knowledge it was a bit challenging for us to get our development environment setup correctly.
We had a lot of issues with debugging and cached builds. 
When we had issues, it was hard to tell if the problem was with React Native or ViroReact.

Debugging was a big challenge for us and the react native development tools don't seem to work well with ViroReact.
The documentation is quite expansive but it was not always up-to-date.

But aside from that, once we were aware of which parts of the dev tools that worked and which ones that didn't work, we were able to quickly build an AR application.

## Extra resources
- [An introduction to virtual and alternate reality](https://ordina-jworks.github.io/iot/2017/12/20/Virtual-Reality.html)
- [Documentation](https://docs.viromedia.com/docs/viro-platform-overview){:target="_blank" rel="noopener noreferrer"}
- [Sample applications](https://github.com/viromedia/viro)
- [Beginner's guide to React](https://egghead.io/courses/the-beginner-s-guide-to-react)