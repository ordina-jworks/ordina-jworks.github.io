---
layout: post
authors: [kevin_van_den_abeele]
title: 'Intro to Johnny-Five with TypeScript'
image: /img/johnny-five/johnny-five.jpg
tags: [NodeJS, Node, V8, TypeScript, Robotics, Arduino, Raspberry Pi, Raspberry, Pi, Johnny-Five, Smart, Internet of Things]
category: IoT
comments: true
---
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/css/lightbox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.9.0/js/lightbox.min.js"></script>

> TODO text TODO text

## What is Johnny-Five
TODO text TODO text

<img alt="buildings" src="{{ '/img/stairwaytohealth/buildings.jpg' | prepend: site.baseurl }}" class="image fit">

TODO text TODO text

<img alt="details" src="{{ '/img/stairwaytohealth/details.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto;">

## What does it do?
TODO text TODO text

In summary: 
TODO text TODO text

## CODE EXAMPLES
TODO text TODO text CODE EXAMPLE
*timespan.controller.ts*
```typescript
public getTimespanList(req: Request, res: Response, next: NextFunction) {
    return this.timespanModel.find({}, [], {sort: {start: 1}})
    .then((result) => {
        res.json(result).status(200);
    }, (err)=>{
        res.statusCode = 500;
        res.statusMessage = err;
        res.send();
    });
}
```

## TODO
TODO text TODO text

<div style="text-align: center; margin: 0px auto;">
    <a href="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Large screen @ Proximus towers">
        <img alt="result1" src="{{ '/img/stairwaytohealth/result1.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 61.45%; display: inline-block;">
    </a>
    <a href="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" data-lightbox="results" data-title="Informing the employees">
        <img alt="result2" src="{{ '/img/stairwaytohealth/result2.jpg' | prepend: site.baseurl }}" class="image fit" style="width: 34.55%; display: inline-block;">
    </a>
</div>


## Conclusion
TODO text TODO text
