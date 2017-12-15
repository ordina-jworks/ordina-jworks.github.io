---
layout: post
authors: [kevin_van_den_abeele]
title: 'Building a Meeseeks box!'
image: /img/meeseeks/wallpaper.jpg
tags: [NodeJS, Node, V8, JavaScript, Prototyping, 3D print, 3D printing, Raspberry Pi, Raspberry, Pi, Johnny-Five, Smart, Internet of Things, Meeseeks, Rick & Morty, Ricky and Morty, Wubba lubba dub dub, spring cloud, spring cloud streams, streams]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

> Ooh, I'm Mr Meeseeks, look at me!

## A Meeseeks box?
For those of you who are already familiar with the show Rick and Morty, the meeseeks box should be a well known object!
For those who do not know Rick and Morty, go watch it now, I'll wait!
In short the meeseeks box is a techonogical/magic box crafted by Rick. 
When the on top is pressed a meeseeks is spawned.
The meeseeks can be given an assignment (like a wish) and will try to fullfill said request.
The meeseeks will only disappear when the task has been completed.
One caveat, the meeseeks does not want to live, it wants to die, the longer it lives the worse it gets!

Our colleague Dieter Hubau made a fully operation Rick and Morty themed example to demonstrate Spring Cloud streams. 
You can read all about it <a href="https://ordina-jworks.github.io/spring/2017/10/04/Spring-Cloud-Stream-Rick-And-Morty-Adventure.html">on our tech blog.</a>
Be sure to check it out, it's a good read!
This blog post will go into detail on building your own meeseeks box, which we integrated to work with the above Spring Cloud streams demo.

<img alt="The meeseeks box" src="{{ '/img/meeseeks/concept.jpg' | prepend: site.baseurl }}" class="image fit">


## What should it do?
The meeseeks box is intented to complement the Spring Cloud stream demo mentioned above.
If the button on top is pressed, like in the series, a meeseeks is spawned (a fully new instance, see the Spring Cloud streams blog post) in the demo application.
The meeseeks will then search for the szechuan sause until it is found.
For the demo a maximum of three meeseekses can be spawned, as to not overwhelm the people with meeseekses, because they tend to get annoying if they live for too long.


## The hardware setup
TODO


## The code behind it
The code behind the meeseeks box is a simple NodeJS application.
As it is run on a raspberry pi we need to make use of raspi-io to make use of the GPIO on the board.
We also use Johnny-Five as an abstraction layer. More information about Johnny-Five can be found <a href="http://johnny-five.io">on their extensive website.</a>

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
            //Enable this to disbale the LED when the button is released!
            //ctx.digitalWrite(0, 0);
        } else if(value == 0 && prevValue == 1) {
            ctx.digitalWrite(0, 1);
            doCall('POST');
        }

        prevValue = value;
    });
});
```
The above code is very simple, it makes a new `Board` instance which we pass a new `Raspi` instance telling the Johnny-Five library that we are actually running on a raspberry pi and that it does not need to search for any other connected boards (like Arduinos).

What you also might notice, for those who have used Johnny-Five in the past, is that we do not make use of the full power of Johnny-Five. 
We are not using the `LED` of `Button` classes and instead are doing a more lower level approach of controlling the IO pins directly.
This has a very good reason.
The Node application is run at startup, when the Raspberry Pi boots, as a linux service.
Starting it automatically breaks the REPL functionality of Johnny-Five which results in the application exiting after a good second, making it unusable.
This is why the `Board` config has the `repl` parameter set to false, this prevents the REPL from starting and makes it so the application does not exit unexpectedly.
This unfortunately also prevents us from using the full abstraction power of the Johnny-Five framework.

The actual code is very simple. 
We wire up a pin as input for the button and another pin as output for the LED.
We put the input pin to high, prevent the input from flickering between high and low (essentially a pullup to vcc).
Than we bind a function to the `digitalRead` which gets executed every time the state of the input pin changes (high to low -or- low to high).
Since we do a pullup to vcc our button will actually be connected to the GND which will result in the signal of the input pin going to low when the button is pressed and back to high when it is released.
Please also be sure to wire up the LED with a correct resistor to prevent it from drawing too much current, as that might damage the IO pin it is connected to!

Calculating such a resistor is an easy feat. 
If the LED needs 3 volts to function and uses 20 milliamps doing so:  
R = U / I = 5V (pin out) - 3V (LED) /  0,02A = 2V / 0,02A = 100Ohm  
This means that a 100Ohm resistor needs to be put in series with the LED to prevent it from causing any damage to the IO pin/circuitry.

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
When the URL is called via the POST method a meeseeks is created.
When the URL is called via the DELETE method the currently active meeseekses are destroyed (for testing).

<br/>
A video showing the meeseeks demo in action:
<video class="image-fit" width="100%" controls>
  <source src="/img/meeseeks/video.mp4" type="video/mp4">
</video>

<br/><br/>
## Meeseeks at Devoxx
The entire purpose of the meeseeks box was to be part of our booth at the well known Devoxx conference in Belgium.
Our booth drew quite the crowd this year, mostly because of the nachos and the totally real szechaun sauce to with them. 
Have a look at a couple pictures below:  

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/meeseeks/booth-empty.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Ordina booth at Devoxx 2017">
        <img alt="Ordina booth at Devoxx 2017" src="{{ '/img/meeseeks/booth-empty.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 55.45%; display: inline-block;">
    </a>
    <a href="{{ '/img/meeseeks/meeseeks-in-action.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="The meeseeks box in action at the Ordina booth">
        <img alt="The meeseeks box in action at the Ordina booth" src="{{ '/img/meeseeks/meeseeks-in-action.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 41.55%; display: inline-block;">
    </a>
</div>


## Conclusion
This was a fun side project to work on, even though the 'deadline' was a bit tight and I would have liked to have done some things differently, all in all everything turned out really well.

A few lessons learned though:
- TODO
- TODO