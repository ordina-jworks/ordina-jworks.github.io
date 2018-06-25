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

resize image if needed: image looks weird on post overview

TODO: improve writing quality
TODO: check for typos
TODO: follow it as a tutorial from start to finish
TODO: Components: link to the documentation of the component

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

### Components
The main building blocks of a ViroReact app are the components.

#### The most important component is a Scene
{% highlight javascript %}
<ViroScene>
<ViroARScene>
{% endhighlight %}

The scene is the digital environment the user interacts with.
All other components live in this scene.
{% comment %} TODO: make better {% endcomment %}

Just like many other components, the Scene comes in 2 variations: ViroScene and ViroARScene.
As the name suggests ViroARScene is used for Augmented Reality applications
while the ViroScene is meant for Virtual Reality.

A ViroSceneNavigator is used to navigate between these scenes.
{% highlight javascript %}
<ViroSceneNavigator>
<ViroARSceneNavigator>
{% endhighlight %}
// TODO

#### These scenes can be populated with all kinds of components
For example a ViroText.
TODO: add image of text in scene
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

Or perhaps a ViroBox, ViroQuad or ViroSphere.
// TODO: add image of boxes, quads, spheres  
// TODO: add code that renders above image  
These components can be modified by their properties.
One of the most important properties is the position.
It takes an array of 3 numbers (TODO just integers or float also?) as the x, y and z coordinates. 

#### There are also more specialised components
// should these be #### headers? like in scrum-vs-kanban post
Like a Viro3DObject which lets you include custom made 3D objects in your scene.

{% highlight javascript %}
<Viro3DObject
	source={require("./res/spaceship.obj")} type="OBJ"
	resources={[require('./res/spaceship.mtl'),
		require('./res/texture1.jpg')]}
	position={[1, 3, -5]} scale={[2, 2, 2]}
	rotation={[45, 0, 0]}
	transformBehaviors={["billboard"]}/>
{% endhighlight %}
// todo 3d object stuff
The billboard transform behaviour is an interesting feature to let the object always face the user.

A Viro360Image can be set as the background of a scene.
 
A ViroPortal lets the user take a peek into a different scene.
It basically is a window to another world.
The Viro3DObject included in it acts like the window frame.
//TODO should I remove the 2 lines above to keep it brief and make a more coherent story?

A ViroARImageMarker reacts when one of the ViroARTrackingTargets are scanned.
It will show all the components inside the ViroARImageMarker tag.
We have used this in our little app, more on that [below](LINK). //TODO link to below

{% highlight javascript %}
{% raw %}
<ViroARImageMarker target={"targetOne"}>
    <ViroBox position={[0, .25, 0]} scale={[.5, .5, .5]} />
</ViroARImageMarker>
{% endraw %}
{% endhighlight %}
//TODO fix highlighting

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
The Camera component is our eyes.
{% highlight javascript %}
<ViroCamera position={[0, 0, 0]} rotation={[45, 0, 0]) active={true} />
{% endhighlight %}
A default camera is provided at the origin `position={[0, 0, 0]}`.
The camera always looks in the negative Z direction.
So if you want an object to be visible as soon as the scene loads up, 
make sure to set it's position with a negative Z value `position={[0, 0, -5]}`. 
If the object would have a positive Z value it would be placed behind you when you load up the scene.
There is also a ViroOrbitCamera where the camera orbits around a certain position, always keeping it in view.

Lights are very important components in a scene.
Without any light the user wouldn't see anything.
Luckily a default light is provided when none is defined.
We didn't need lights in our setup but if you want a more realistic or visually stunning experience, 
I highly recommend you to look into the different lights in the [documentation](https://docs.viromedia.com/v2.6.1/docs/3d-scene-lighting).  
There are 4 lighting models: Phong, Blinn, Lambert and Constant.  
These are the algorithms that calculate how your objects will look like when influenced by light.
By default, elements use the Constant lighting model, which means lights will be ignored and the object will show its full color.  
Viroreact supports 4 types of light.

The ViroAmbientLight is the simplest light.
{% highlight javascript %}
<ViroAmbientLight color="#ffffff"/>
{% endhighlight %}
It lights up all the objects in the scene equally from every direction.
Only the color needs to be set.

A ViroOmniLight is comparable to a lightbulb.
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

A ViroSpotLight is comparable to a flashlight.
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

The last type of light is the ViroDirectionalLight.
{% highlight javascript %}
<ViroDirectionalLight
    color="#ffffff"
    direction={[0, -1, 0]}
 />
{% endhighlight %}
The sun would be the prime example of a ViroDirectionalLight.
It shines over the whole scene in a specific direction.

#### To make these objects look good we need Materials
Materials are used to place texture images on 3d objects.
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

## How we made our app
 
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