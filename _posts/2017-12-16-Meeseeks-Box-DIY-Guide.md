---
layout: post
authors: [kevin_van_den_abeele]
title: 'Building a Meeseeks Box!'
image: /img/meeseeks/wallpaper.jpg
tags: [Node.js, V8, JavaScript, Prototyping, 3D printing, Raspberry Pi, Raspberry, Pi, Smart tech, Internet of Things, Spring Cloud, Spring Cloud Stream, Streaming]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

> Ooh, I'm mister Meeseeks, look at me!

## A Meeseeks Box?
For those of you who are already familiar with the show Rick and Morty, the Meeseeks Box should be a well-known object!
For those who do not know Rick and Morty, go watch it now, I'll wait!  

In short: The Meeseeks Box is a technological/magic box crafted by Rick. 
When the button on top is pressed, a Meeseeks is spawned.
The Meeseeks can be given one assignment (like a wish) and he will try to fulfil said request.
The Meeseeks will only disappear when the task has been completed.
One caveat, existence is painful for the Meeseeks, the longer it lives, the more sanity it loses.

Our colleague Dieter Hubau made a fully operational Rick and Morty themed example to demonstrate Spring Cloud Stream. 
You can read this excellent story about it [on our tech blog](https://ordina-jworks.github.io/spring/2017/10/04/Spring-Cloud-Stream-Rick-And-Morty-Adventure.html){:target="_blank"}
Be sure to check it out, it's a good read!
This blog post will go into detail on building your own Meeseeks Box, which I integrated to work with the above Spring Cloud Stream demo.

<img alt="The Meeseeks Box" src="{{ '/img/meeseeks/concept.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">


## What should it do?
The Meeseeks Box is intended to complement the Spring Cloud Stream demo mentioned above.
If the button on top is pressed, like in the series, a Meeseeks is spawned in the demo application. (A new instance, see the Spring Cloud Stream blog post)
The Meeseeks will then search for the Szechuan sauce until it is found.
For the demo a maximum of three Meeseekses can be spawned, as to not overwhelm the people with Meeseekses, because they tend to get annoying if they live for too long.


## The hardware setup
The setup for the box is as follows:
- A box (container)
- Raspberry Pi 3 with GPIO connected to a button with an LED
- Internal battery pack to power the box

Since the Raspberry Pi 3 has built in WiFi and Bluetooth it is possible to make the box fully wireless.
The Pi has Node installed on it (the latest version) and is connected to the WiFi.
The WiFi can be easily configured by placing the SD card in your computer and placing a file name `wpa_supplicant.conf` file in the root of the boot volume.
This file contains the configuration for the WiFi network the Pi should connect to.

*wpa_supplicant.conf*
```
country=BE
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev 
update_config=1

network={ 
    ssid="SSID-goes-here" 
    psk="key-goes-here" 
    key_mgmt=WPA-PSK
}
```
Make sure you do not omit any of the first lines or your Pi's WiFi will cease to function until a corrected version of the file is used!

<img alt="The hardware setup" src="{{ '/img/meeseeks/raspberry-pi-button.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 400px;">


## The build!
The original idea was to make the box itself from wood or thick cardboard. 
But since I wanted to try something new that would entail less manual work with getting all the insets correct on the sides of the box, I decided to go for a 3D printed version.

The box:
<iframe id="vs_iframe" src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/meeseeks/box.stl" style="border:0;margin:0;width:100%;height:100%;"></iframe>
You can download the file <a href="/img/meeseeks/box.stl">here.</a>

The lid:
<iframe id="vs_iframe" src="https://www.viewstl.com/?embedded&url=https://ordina-jworks.github.io/img/meeseeks/lid.stl" style="border:0;margin:0;width:100%;height:100%;"></iframe>
You can download the file <a href="/img/meeseeks/lid.stl">here.</a>

These two 3D models were originally obtained from the [Thingiverse](https://www.thingiverse.com/thing:476252){:target="_blank"} but I've adapted and scaled them properly.

I ordered the 3D prints via [3D Hubs](https://www.3dhubs.com){:target="_blank"} and was surprised it was finished in one day.
When I went to get the printed versions I was a bit concerned that they might not have turned out as I had hoped.
And was I right:

<img alt="A failure" src="{{ '/img/meeseeks/small-box.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">

A rookie mistake, I didn't check the model dimensions once I uploaded them into the online tool for processing. 
As that seemed to have converted up the measurements I used and set them to millimeters instead of centimeters.
An easy fix and the second printed version was in the correct size, but printed by a colleague to keep costs down.

<img alt="That's more like it!" src="{{ '/img/meeseeks/printed-painted-orange.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">

Next came the task of painting the thing. 
As time was short and I only had cheap non-spray water based paint available, I decided to proceed anyway.
I did apply a spray can based primer first, to make the box white again as the orange color was far from perfect to apply other colours.
Many layers and hours later the box was painted.
Nowhere near perfect but good enough for a first try at painting 3D printed models. 
The big issue with these paints and 3D printed models is that the paints tends to get in between the printed 'lines' and thus requiring a lot more paint without actually getting a nice result.

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/meeseeks/partially-painted.jpg' | prepend: site.baseurl }}" data-lightbox="painting" data-title="Partially painted Meeseeks Box">
        <img alt="Partially painted Meeseeks Box" src="{{ '/img/meeseeks/partially-painted.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 48%; display: inline-block;">
    </a>
    <a href="{{ '/img/meeseeks/fully-painted.jpg' | prepend: site.baseurl }}" data-lightbox="painting" data-title="Fully painted Meeseeks Box">
        <img alt="Fully painted Meeseeks Box" src="{{ '/img/meeseeks/fully-painted.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 48%; display: inline-block;">
    </a>
</div>

The button on top was attached by very carefully drilling a hole in the top lid and pushing the base of the button through.
The gap was tight enough for the button to stay firmly in place by friction alone, allowing it to be removed later on.
The Raspberry Pi was attached to the underside of the lid with some standoffs and super glue.
The lid fits on the box and is held in place by magnets.
This prevents any moving parts that might fail due to material fatigue or attaching hinges, since attaching these to the box and lid would be cumbersome, as screws can't easily take hold in the 3D printed material.
A future, more elaborate version of the box could include cutouts for the lid in the box.

<img alt="Raspberry Pi attached to the lid" src="{{ '/img/meeseeks/underside-lid.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 600px;">


## The code behind it
The code behind the Meeseeks Box is a simple NodeJS application.
As it is run on a Raspberry Pi we need to make use of `raspi-io` to make use of the GPIO on the board.
I also use Johnny-Five as an abstraction layer. More information about Johnny-Five can be found [on their extensive website.](http://johnny-five.io){:target="_blank"}

*main.js*
```javascript
var Raspi = require('raspi-io');
var five = require('johnny-five');
var http = require('https');

var board = new five.Board({
    io: new Raspi(),
    repl: false
});

board.on('ready', function() {
    var ctx = this;
    var prevValue = 1;

    this.pinMode(0, five.Pin.OUTPUT);
    this.pinMode(7, five.Pin.INPUT);
    this.digitalWrite(7, 1);

    this.digitalRead(7, function(value) {
        //console.log(value);
        if(value == 1) {
            //Enable this to disable the LED when the button is released!
            //ctx.digitalWrite(0, 0);
        } else if(value == 0 && prevValue == 1) {
            ctx.digitalWrite(0, 1);
            doCall('POST');
        }

        prevValue = value;
    });
});
```
The above code is very simple, it makes a new `Board` instance which we pass a new `Raspi` instance telling the Johnny-Five library that we are actually running on a Raspberry Pi and that it does not need to search for any other connected boards (like Arduinos).

What you also might notice, for those who have used Johnny-Five in the past, is that we do not make use of the full power of Johnny-Five. 
We are not using the `LED` or `Button` classes and instead are taking a more lower level approach by controlling the IO pins directly.
This has a very good reason.
The Node application is run at startup, when the Raspberry Pi boots, as a Linux service.
Starting it automatically breaks the REPL functionality of Johnny-Five which results in the application exiting after a good second, making it unusable.
This is why the `Board` config has the `repl` parameter set to `false`, this prevents the REPL from starting and makes it so the application does not exit unexpectedly.
This unfortunately also prevents us from using the full abstraction power of the Johnny-Five framework.

The actual code is very simple. 
We wire up a pin as input for the button and another pin as output for the LED.
We put the input pin to high, this prevent the input from flickering between high and low (essentially a pull-up to vcc).
We then bind a function to the `digitalRead` which gets executed every time the state of the input pin changes (high to low -or- low to high).
Since we do a pull-up to vcc our button will actually be connected to the GND which will result in the signal of the input pin going to low when the button is pressed and back to high when it is released.
Please also be sure to wire up the LED with a correct resistor to prevent it from drawing too much current, as that might damage the IO pin it is connected to!

Calculating such a resistor is an easy feat. 
If the LED needs 3 volts to function and uses 20 milliamps doing so:   
`R = U / I = 5V (pin out) - 3V (LED) /  0,02A = 2V / 0,02A = 100Ω`  
This means that a 100Ω resistor needs to be put in series with the LED to prevent it from causing any damage to the IO pin/circuitry.

*main.js*
```javascript
function doCall(method) {
    var request = http.request({
        host: 'rnm-meeseeks-box.cfapps.io',
        port: 443,
        path: '/',
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': 0
        }
    });

    request.write('');
    request.end();
}
```
The code above is a simple snippet used to make a call with no contents to the remote server.
When the URL is called via the POST method, a Meeseeks is created.
When the URL is called via the DELETE method the currently active Meeseekses are destroyed (for testing).
You can edit this to perform any action you like.

<br/>
A video showing a fully operational Meeseeks Box:
<video class="image-fit" width="100%" controls>
  <source src="/img/meeseeks/video.mp4" type="video/mp4">
</video>
<br/><br/>


### Running Node as a systemd service on Linux
As the Meeseeks Box needs to be simple to use, the application should automatically start when the Pi does.
The best option was to make a systemd service and run it on system startup.

First we need to create the systemd service file:  
```
sudo nano /lib/systemd/system/meeseeks.service
```
This will create a new file (if one does not exist yet).
Place the contents below in this file and save it.

```
[Unit]
Description=Meeseeks Box service
After=network.target

[Service]
Type=simple
User=your-user-here
ExecStart=/usr/bin/node /home/meeseeks/main.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
This file tells systemd what the service is and does, with what executable and which user.
The `After=network.target` tells the service daemon that this service should only start if the network stack has already loaded!

To test the service, first execute: `sudo systemctl daemon-reload`
This reloads the daemon so it knows of the newly created service.
Now we can manually start/stop/reload the service by using: `sudo systemctl start meeseeks` where you swap out `start` with the action you want to perform.

To make the service run at startup use: `sudo systemtl enable meeseeks` and to disable it again, use the same command but swap out `enable` for `disable`.

A far more detailed explanation about this matter can be found [here.](http://nodesource.com/blog/running-your-node-js-app-with-systemd-part-1/){:target="_blank"}


## Meeseeks at Devoxx
The entire purpose of the Meeseeks Box was to be part of our booth at the well-known Devoxx conference in Belgium.
Our booth drew quite the crowd this year, mostly because of the nachos and the totally real Szechaun sauce to go with them. 
Have a look at a couple pictures below:  

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/meeseeks/booth-empty.jpg' | prepend: site.baseurl }}" data-lightbox="booth" data-title="Ordina booth at Devoxx 2017">
        <img alt="Ordina booth at Devoxx 2017" src="{{ '/img/meeseeks/booth-empty.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 55.45%; display: inline-block;">
    </a>
    <a href="{{ '/img/meeseeks/meeseeks-in-action.jpg' | prepend: site.baseurl }}" data-lightbox="booth" data-title="The Meeseeks Box in action at the Ordina booth">
        <img alt="The Meeseeks Box in action at the Ordina booth" src="{{ '/img/meeseeks/meeseeks-in-action.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 41.55%; display: inline-block;">
    </a>
</div>


## Conclusion
This was a fun side project to work on, even though the 'deadline' was a bit tight and I would have liked to have done some things differently, all in all everything turned out really well.

A few lessons learned though:
- Check measurements before ordering a 3D print
- Non-spray water based paints are not the best match for painted 3D printed models
- If you mess up the WiFi on the Pi it can be a real pain to debug it!
- When starting Node as a service on Linux the Johnny-Five REPL does not work
- Super glue is not always so super ;) 