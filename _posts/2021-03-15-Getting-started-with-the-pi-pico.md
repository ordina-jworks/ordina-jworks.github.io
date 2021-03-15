---
layout: post
authors: [kevin_van_den_abeele]
title: "Getting started with the Pi Pico"
image: /img/2021-03-15-getting-started-with-the-pi-pico/banner.jpg
tags: [Internet of Things, Smart Tech, microcontrollers, c, c++, python, micropython, tinkering]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/bootstrap.css" />

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap-grid-only@1.0.0/index.min.js"></script>

## Table of Contents

1. [Introduction](#introduction)
2. [Differences with the Raspberry Pi](#differences-with-the-raspberry-pi)
3. [Getting to know the board](#getting-to-know-the-board)
4. [Development options](#development-options)
5. [C++ development](#c++-development)
6. [MicroPython development](#micropython-development)
7. [CircuitPython development](#micropython-development)
8. [Conclusion](#conclusion)
9. [Resources](#resources)

## Introduction

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/2021-03-15-getting-started-with-the-pi-pico/logo.jpg' | prepend: site.baseurl }}" data-lightbox="ui" data-title="Logo">
        <img alt="Pi Pico Blueprint" src="{{ '/img/2021-03-15-getting-started-with-the-pi-pico/logo.jpg' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; width: 100%; display: inline-block;">
    </a>
</div>

By now everybody likely has heard about the Raspberry Pi single board computers.
And even more than probable some, if not most of you, have one or more of these.

Recently the Raspberry Pi Foundation has released a new type of Raspberry Pi, the Raspberry Pi Pico.
Contrary to the regular Raspberry Pi, the Pico is not a single board computer which runs Linux.
The Pico is a microcontroller, like the Arduino or Teensy.
It's cheap, it's powerful, and in this blog post we'll be exploring what it has to offer.

## Differences with the Raspberry Pi

Like I said in the introduction, the regular Raspberry Pi is a single board computer, as in an actual computer which can run a fully fledged operating system.
It also has interfacing options like a display and camera port, along side ethernet and USB ports as well as the 40 GPIO pins.

TODO: PI vs PICO picture

As you can see in the pictures, the Raspberry Pi looks like a tiny computer and the Pico looks like a much simpler board, because it also is.
Both devices serve different purposes but do have some overlap.
The Raspberry Pi is used for more computationally intensive tasks and can be used to run very complex software.
The Pi Pico is used for far simpler tasks were power usage and device footprint are more important, it is a much more low level device.
While they both have GPIO pins the ones on the Pi Pico are much more capable than those on the Raspberry Pi.

## Getting to know the board

TODO: PICO pinout picture

The main technical specifications of the Pi Pico are:

- RP2040: Dual-core Arm Cortex-M0+ processor, flexible clock running up to 133 MHz
- 264KB on-chip SRAM
- 2MB on-board QSPI Flash
- 26 multifunction GPIO pins, including 3 analogue inputs
- 2 × UART, 2 × SPI controllers, 2 × I2C controllers, 16 × PWM channels
- 1 × USB 1.1 controller and PHY, with host and device support
- 8 × Programmable I/O (PIO) state machines for custom peripheral support

These specs are in line with some of the more popular microcontrollers like teensy and ESP32 devices.
The small footprint of microcontrollers like the Pico allows it to be integrated into DIY projects easily.

The Pi Pico is built around the RP2040, the actual microcontroller that powers it.
There are other boards with varying pinouts and functions available with this microcontroller.
In this blog post we will be focussing on the Pi Pico implementation of the RP2040.

The dual core chip give a lot of flexibility to create project which require a bit more processing power, as do the PIO state machines.
With 26 GPIO boards there are loads of options to connect sensors, screens, inputs and outputs.

## Development options

One of the nice features is that the Pico supports drag and drop programming/flashing.
This is accomplished by utilizing UF2 files.
The process of doing this is very simple, simply press the `BOOTSEL` button when connecting the Pico to your computer.
It will show up as a storage device, drag the UF2 file onto it and the device will reboot and the flashing is completed.

The Pico has several development options available.
Three different main options are available to program it:

- C/C++ SDK: Oldschool hardcore mode microcontroller programming
- MicroPython: More beginner friendly with lots of options
- CircuitPython: Adafruit backed variation on MicroPython, made even simpler

## C++ Development

### Development setup

Setting up for development:

- [General C/C++ SDK documentation](https://datasheets.raspberrypi.org/pico/raspberry-pi-pico-c-sdk.pdf){:target="_blank" rel="noopener noreferrer"}
- [Linux](https://raw.githubusercontent.com/raspberrypi/pico-setup/master/pico_setup.sh){:target="_blank" rel="noopener noreferrer"}: Simply run the script
- [Mac](https://smittytone.wordpress.com/2021/02/02/program-raspberry-pi-pico-c-mac/){:target="_blank" rel="noopener noreferrer"}: Follow the instructions
- [Windows](https://github.com/ndabas/pico-setup-windows){:target="_blank" rel="noopener noreferrer"}: Follow the instructions

One bright point is that Arduino will also be releasing a board based on the RP2040 so there is hope that the Arduino IDE will support it later down the line and enable hassle free C++ development for the Pi Pico and other RP2040 based microcontrollers.

### Code example

Programming microcontrollers has long been done in C and C++ and the Pi Pico forms no exception to this.
The basic code for a LED blink example is listed below.

```c++
/**
 * Copyright (c) 2020 Raspberry Pi (Trading) Ltd.
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

#include "pico/stdlib.h"

int main() {
#ifndef PICO_DEFAULT_LED_PIN
#warning blink example requires a board with a regular LED
#else
    const uint LED_PIN = PICO_DEFAULT_LED_PIN;
    gpio_init(LED_PIN);
    gpio_set_dir(LED_PIN, GPIO_OUT);
    while (true) {
        gpio_put(LED_PIN, 1);
        sleep_ms(500);
        gpio_put(LED_PIN, 0);
        sleep_ms(500);
    }
#endif
}
```

This code will include the stdlib.h header file from the Pi Pico C++ SDK and will blink the build in LED every 500ms.
The trick is to compile this code and build the required UF2 file.

While the code looks and feels very similar to what you would write for lets say an Arduino board, compiling it and to run on the Pico is a different case.
The contrast with Arduino development could not be bigger, where you simply download the Arduino IDE, write your code, click upload and you're running your code on the device!
With the Pico it's not that simple it requires a few dependencies which cannot be one click installed and the instructions are different based on the OS you're running.
It's do-able but it's not exactly hassle free and convenient.

## MicroPython development

Contrary to the C++ development, using MicroPython is like a breath of fresh air.
I'm not the biggest fan of regular Python but using MicroPython for simple microcontroller programming, has in my opinion, made it a lot easier.

### Preparing the board

First of all we need to prepare the Pico to accept and run MicroPython files:

- Download the latest (stable) version of MicroPython for the pico, this is a UF2 file and can be found [here](https://www.raspberrypi.org/documentation/rp2040/getting-started/#getting-started-with-micropython){:target="_blank" rel="noopener noreferrer"}
- Plug in your Pico while holding the `BOOTSEL` button
- Drag the downloaded UF2 file onto the mass storage device that has just appeared in your file explorer
- The board will reboot by itself and 'install' the UF2 file

### Development setup

TODO : Dev environment options

### Code example

The basic code for a LED blink example is listed below.

```python
print('TODO BLINK program')
```

## CircuitPython development

CircuitPython is a variation on MicroPython created by Adafruit industries.
It is targeted at beginners and students and is even simpler than the regular MicroPython.

### Preparing the board

First of all we need to prepare the Pico to accept and run CircuitPython files:

- Download the latest (stable) version of CircuitPython for the pico, this is a UF2 file and can be found [here](https://circuitpython.org/board/raspberry_pi_pico/){:target="_blank" rel="noopener noreferrer"}
- Plug in your Pico while holding the `BOOTSEL` button
- Drag the downloaded UF2 file onto the mass storage device that has just appeared in your file explorer
- The board will reboot by itself and 'install' the UF2 file

### Development setup

TODO : Dev environment options

### Code example

The basic code for a LED blink example is listed below.

```python
import board
import digitalio
import time

led = digitalio.DigitalInOut(board.GP25)
led.direction = digitalio.Direction.OUTPUT

while True:
    led.value = True
    time.sleep(0.5)
    led.value = False
    time.sleep(0.5)

```

## Conclusion

TODO

## Resources

[Pi Pico Getting started](https://www.raspberrypi.org/documentation/rp2040/getting-started/#getting-started-with-micropython){:target="_blank" rel="noopener noreferrer"}
