---
layout: post
authors: [michael_vandendriessche, kevin_van_den_abeele]
title: 'An introduction into the world of virtual and alternate reality'
image: /img/virtualreality/virtual-reality.jpg
tags: [Internet of Things, IoT, Virtual reality, Alternate reality, Mixed reality, Merged reality, Oculus rift, Oculus, HTC vive, vive, steamVR, steam, unreal engine, unity, hololens, microsoft, google glass, google]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

> A look into the wonderful and exciting world of virtual, alternate and mixed reality.

## Intro
TODO

<img alt="TODO image" src="{{ '/img/virtualreality/todo.jpg' | prepend: site.baseurl }}" class="image fit">

VR is not new! <br>
It is infact pretty old compared to other technologies. //TODO
AR isn't that new either. 
Perhaps MR is? I'll leave that up to you to decide.

Ever since we are able to create visual representations of our world or an alternate world, 
mankind has been fascinated by inhabiting this other world or virtual world.


## History

// TODO can i use the wikipedia picture of the sensorama? what about copyright and stuff. apparently it is free to use but needs proper attribution... didn't read further

//TODO insert Sensorama picture here
in 1962 some crazy person built what is generally believed to be the first virtual reality experience.
This machine pictured above is called the Sensorama. 
The user of the Sensorama sits on a tilting chair and watches a short film with stereoscopic 3D images in wide-angle view with stereo sound 
and even wind and aroma. 
A little bit reminiscent of those 4D films shown in themeparks.

Ofcourse this is nothing like the VR experiences we have today.
// should I use XR instead of VR here? any better term to describe all kinds of realities? "other realities"?

//maybe expand a bit more on the history. might be important parts I missed
In the 70's and 80's virtual reality really started blossoming in certain specialized areas.
In 1968 Dr Ivan Sutherland created the Sword of Damocles at MIT.
This head mounted display (or HMD) was so heavy it needed to be suspended from the ceiling.
It was able to track head movements and show rudimentary 3D images.
// TODO insert sword of damocles picture
In the military flight simulators and combat simulators started showing up,
simulators for doctors and surgeons.
Different ways of interacting with this virtual world also started appearing.
Head tracking, touch screens, gloves... //TODO add more
This is also when videogame companies tried to capitalise on this exciting new technology and bring it to a wider public.
But the technology was still rough and did not catch on in big numbers.

//TODO intro new VR with oculus in 2012



## Different types of realities // or should I use the "all kinds of realities" title here?

Alright, so we have been talking about virtual reality for a while.
But what exactly is virtual reality (VR), augmented reality (AR), mixed reality (MR) and all that goodness?

//TODO insert picture reality - virtuality continuum. the one from wikipedia is good, same as in the slides.
Above you see the reality - virtuality continuum.

Let's start on the left side.
The left side depicts Reality or the Real World. 
With the Real World we mean the world where you, as the reader of this article, most likely, are sitting in a chair looking at your computer screen or holding your smartphone.
For the sake of this article we assume that is the real world and there are no matrix-like shenanigans going on.
Simply put, the world as you know it outside of any screens.

On the other end of the spectrum we see the Virtual Environment.
Everything in the virtual environment is virtual, so 'not real'.
It is the imaginary world that you see on a screen.
The user is locked out of the real world.

Augmented Reality (AR) and Augmented Virtuality (AV) lie a bit in the middle then.
As their names suggest, AR is more closely aligned to the real world
while AV is closer to the virtual world.
In other words AR consists of mostly real world with a few virtual elements augmenting the experience.
AV exists mostly in the virtual world with a few elements of our real world visible.
 // TODO describe this later ==> In practice this usually means an overlay 

Mixed reality or Merged reality (MR) is a term used to describe anything between reality and virtuality.
This means it contains both elements of the real world and a virtual world.
It can go all the way from mostly real world with a bit of virtual world sprinkled on top
to mostly virtual world with a few traces of the real world visible.
With MR, as opposed to AR and AV, the real world and virtual world are aware and can interact with eachother!

These terms are pretty vague and some have even changed meaning over the years.
No need to think too much about these terms.

### Virtual Reality

We call something Virtual Reality when the user is emerged in a virtual world and completely blocked out from the real world.
This can be as simple as a 360 video.
(In practice you can still see through the cracks of cheaper headsets)
The user interacts, through various modes of control, with the virtual world.

//TODO FIXME
Some use cases of virtual reality are
* Games, both recreational and educational
* Photo content: photo spheres
* Video content: video spheres, 360 videos
* Creative applications like 3D painting or sculpting or dj application //TODO: just say "Creative applications" or already include the examples?

Currently the most popular application for VR is videogames. There are a lot of games out already.
Shooting games and simulators seem to be an especially well fit for the platform.
A VR headset is also often used for viewing 360 pictures and videos.
Thanks to the headtracking, the view of the picture or video can be changed really intuitively.
Though you have the additional setup to deal with compared to a phone where you can just drag the viewport or use your phone's motion sensors.

//TODO some more. check presentation. controls etc

### Augmented Reality

//TODO !!

// insert picture of pokemon go
Everyone knows this right?
Last year, the world exploded with people young and old crowding the streets in search for Pokémon.

Pokémon Go is a fine example of an AR application.
It is Augmented Reality because the application is still grounded mostly in the real world.
The virtual elements are layered on top of the real world.

There are 4 types of Augmented Reality applications.
* Marker
* Inverse Marker
* Markerless 
* Projection

//TODO, add following line?
(There are other types of classification systems but we have gone with this one)

// TODO include collage picture with 4 types or 4 separate pictures
Marker based AR apps use image recognition to recognize a specific pattern or marker.
On the location of this pattern an image is then shown on the screen. //TODO rewrite
These types of applications are often very simple for example for showing a character from a movie dancing on the table.
Inverse marker based AR is very similar to regular marker based AR.
These applications are used in conjunction with large screens with cameras where the user only has to control the marker.
There are also applications that do not use a marker.
These markerless applications use positional tracking and gps to determine where to show things.
The popular Pokémon Go and Ikea apps are perfect examples of this.
Projection based AR projects images rather than showing them on the screen.
This requires hardware capable of projecting so is not as widespread.
It is used more in manufacturing.

The great thing about AR is that any smartphone is capable running AR applications.
Many AR apps only need a camera to work.
While specialized depth sensing sensors exist, they are not as widespread.


### Mixed Reality

//TODO !!

## Creating realities

Since these kind of applications are often so visual in nature, we can make use of tools used in game development.
These are some of the most popular and free tools.
* Unity
* Unreal Engine
* CryEngine

Think of these as sort of photoshop for software.
We can leverage the editors to see what we're working on and make changes immediately.
These tools are ideal for Virtual Reality.
Both Unity and Unreal Engine have plugins available for Augmented Reality.

Apple's ARKit and Google's ARCore are the respective Augmented reality APIs for their IOS and Android platforms.
Since the inception of these two APIs the amount of AR apps has greatly increased.
There are many other SDKs available.
Many of which even have their own Unity plugin.
Vuforia and ARToolkit seem to be the most popular ones.


## Business cases & Examples
//TODO: Examples of AR/VR/MR 
// ar and mr seem to have more business value

So, as software developers, what can we do with all this fancy tech?

Our Dutch colleagues already made a cool VR application!
<iframe width="560" height="315" src="https://www.youtube.com/embed/wnC-jvtwJtY" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>


// ordina boat
// training and simulation (flying/ aerospace)
// medical
// houses/ikea
// kids
// patients
// manufactoring, factory


## platforms
//TODO 

Google is discontinuing it's Tango project in favor of ARCore.

## Conclusion
TODO

For us at Ordina, most potential lies in AR and MR.



