---
layout: post
authors: [orjan_de_smet]
title: "Creating a custom form control in Angular"
image: /img/2020-08-15-angular-custom-control/qyt3dcd64l.png
tags: [Angular]
category: Architecture
comments: true
---

A part of good application architecture is using the correct tools for the job.
With forms in Angular, this means knowing when to use Template Driven Forms vs. Reactive Forms.
In short, this depends mostly on the size of your form.
A simple login screen may use Template Driven Forms, whereas a more advanced web form should use Reactive Forms.
These forms consist of FormGroups and FormControls, keeping the form value organised.

By default, Angular already allows to bind a HTMLInputElement or HTMLSelectElement to a control using the FormControl and FormControlName (in combination with FormGroup) directives.
This is enough for most forms, but sometimes there is a need for something more specialised, for example a date picker or a slider.
There are numerous packages on npm providing these and most component libraries also include the most common controls for your development pleasure.
But sometimes you can't find the correct package to match your needs.
I still see many developers use a default text input field, and parsing the value after the form is submitted.
Obviously there is a better way and I'll describe it below.

## Case study

As a case study, I've chosen to create a color picker.
This picker should not have any traditional input control, but instead display the selected color in a rounded circle.
Clicking on the control should open a color picker and allow the user to edit the value.
The control should be part of a FormGroup, so that Validators can be added.

For those interested, the full code of this article is available at [StackBlitz](https://stackblitz.com/edit/custom-control-color-picker){:target="_blank" rel="noopener noreferrer"}.

## The color picker

Let's start with creating a color picker.
Because developers shouldn't do everything themselves, I opted to reuse an existing color-picker dependency.

<img alt="Search results for 'npm i want a color picker'" src="{{ '/img/2020-08-15-angular-custom-control/1ra016d24o.png' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 450px;">
<div style="text-align: center; margin-bottom: 3em; font-style: italic;">I just took the first one I came across.</div>

To challenge myself, I tried to look for a control picker with as little helping functions as possible.
The only thing I wanted from it, is to show it on demand, hide it on demand and get/set the value.
Luckily my first pick was just that.
No TypeScript, no open/close status, nothing fancy.

This is what it can do:

```javascript
AColorPicker.from(selector)
  .on(eventName, callback)
  .off(eventName, callback);
```

The possible events are "change", "coloradd" and "colorremove".
The last two are supposed to help with a color palette, but that's out of scope, which leaves the only event being "change".

## Creating a color picker component

As a rule of thumb, a component that will be used as a control should be a dumb component.
I mostly set the template and style inline for dumb components to keep them from growing too big.

This is the eventual code of the component.

```typescript
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as AColorPicker from 'a-color-picker';

@Component({
  selector: 'my-color-picker',
  template: `
    <div class="picker-icon" [class.disabled]="isDisabled" style="background: {% raw %}{{ color }}{% endraw %}" (click)="openPicker()"></div>
    <div #pickerElement class="picker" acp-show-rgb="no"
     acp-show-hsl="no"
     acp-show-hex="no">
      <button *ngIf="open" type="button" (click)="closePicker()">close</button>
    </div>
  `,
  styles: [`
    .picker {
      display: flex;
      flex-direction: column-reverse;
      position: absolute;
    }

    .picker-icon {
      width: 1em;
      height: 1em;
      margin: 2px 0;
      border: 2px solid white;
      box-sizing: border-box;
      box-shadow: 0 0 1px 1px gray;
      border-radius: 50%;
    }

    .picker-icon.disabled {
      opacity: 0.5;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements AfterViewInit, OnDestroy {

  open = false;
  color = '#fff000';
  isDisabled = false;
  private _picker = null;
  private get picker() {
    return this._picker ? this._picker[0] : null;
  }
  @ViewChild('pickerElement') pickerElement: ElementRef;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.initializePicker();
    this.addChangeListener();
  }
  
  ngOnDestroy() {
    this.removeChangeListener();
  }

  openPicker() {
    if (!this.open && !this.isDisabled) {
      this.picker.show();
      this.open = true;
    }
  }

  closePicker() {
    if (this.open) {
      this.picker.hide();
      this.open = false;
    }
  }

  private initializePicker() {
    if (this.pickerElement) {
      this._picker = AColorPicker.from(this.pickerElement.nativeElement);
      this.picker.hide();
      this.picker.color = this.color;
    } else {
      throw Error('Picker could not be initialized');
    }
  }

  private addChangeListener() {
    this._picker.on('change', event => {
      this.color = event.color;
      this.changeDetectorRef.markForCheck();
    });
  }

  private removeChangeListener() {
    this._picker.off('change');
  }

}
```

This component can now display the color picker, by clicking the icon.
It can also be closed by clicking the close button that's added to the picker.
I like to keep `ChangeDetection.OnPush` on dumb components, but that means that I need to inject the `ChangeDetectorRef` to update the color while the picker is being used.
Without the `markForCheck`, the color would only be updated when the picker is closed.

<img alt="A demonstration of the picker." src="{{ '/img/2020-08-15-angular-custom-control/9wh3d54f1b.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 450px;">
<div style="text-align: center; margin-bottom: 3em; font-style: italic;">It's working! It's working!</div>

## Making a control out of it

Now comes the interesting part.
I want to be able to use `my-color-picker` with the `formControl` and `formControlName` directives.
If you'd just use these directives, you'd get the error "No value accessor for form control with name: &lt;the name of your control&gt;".
Simply put, this means that the control does not know what to bind to.
So we start by implementing the `ControlValueAccessor` interface from `@angular/forms` into the component.
This interface has three functions that need to be implemented and one optional function.

- writeValue(obj: any): void
- registerOnChange(fn: any): void
- registerOnTouched(fn: any): void
- setDisabledState?(isDisabled: boolean): void

The function `setDisabledState` is optional, but also the easiest to understand.
It's triggered by the `formControl.enable()` and `formControl.disable()` functions.
The other functions may be a bit more difficult to understand.

```typescript
setDisabledState(isDisabled: boolean): void {
  this.isDisabled = isDisabled;
  if (this.isDisabled) {
    this.closePicker();
  }
  this.changeDetectorRef.markForCheck();
}
```

The function `writeValue` is called every time `formControl.setValue(obj)` or `formControl.patchValue(obj)` is called.
The type of obj is by default `any`, because ReactiveForms are still not strongly typed.
You can for example call `numberControl.setValue('not a number')` and your application will build correctly.
Even at runtime you'd probably not get an error, but that doesn't mean this is a valid value.
That's why there are validators.
It's best to parse this value to something understandable for your component.
In this case, the color will be a string containing either the hexadecimal value like `#ff0000` or a word like `red`.
The `a-color-picker`-package luckily allows all string values and will convert to a hexadecimal value that matches.
A downside of this package is that it has to be bound after view init.
However `writeValue` will be called before `ngAfterViewInit`, so the initial form value might not be set correctly.
That is why the value is also stored in `color`, which is used to set the initial value when the picker is initialized.

```typescript
writeValue(obj: any): void {
  if (this.picker) {
    this.picker.setColor(`${obj}`);
  } else {
    this.color = `${obj}`;
  }
}
```

The functions `registerOnChange` and `registerTouched` are used to set a callback function when the control's value changes or when it's being touched without a change.
These callbacks can be called whenever you want in your component and they are usually the `setValue` and `markAsTouched` properties.
They are usually implemented like this:

```typescript
private _onChange: (color: string) => void;
private _onTouched: () => void;

registerOnChange(fn: (color: string) => void): void {
  this._onChange = fn;
}
registerOnTouched(fn: () => void): void {
  this._onTouched = fn;
}
```

We'll be using them in our change event, like this:

```typescript
closePicker() {
  if (this.open) {
    this.picker.hide();
    this.open = false;
    this._onTouched();
  }
}

private addChangeListener() {
  this._picker.on('change', event => {
    this.color = event.color;
    this.changeDetectorRef.markForCheck();
    this._onChange(this.color);
  });
}
```

If we test the control now, we'll still get the error "No value accessor for form control with name: &lt;the name of your control&gt;".
The reason is that, even though we implemented our component as a ControlValueAccessor, we still didn't specify that the control should bind to it.
There are two ways to do this.
The easiest way is to provide the component as a value accessor, by adding the following to the component's decorator:

```typescript
providers: [     
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColorPickerComponent),
    multi: true
  }
]
```

The injection token `NG_VALUE_ACCESSOR` can be imported from `@angular/forms` and `forwardRef` can be imported from `@angular/core`.
Simply put, the function `forwardRef` allows the dependency injector to refer to a reference that hasn't been defined yet.

Now we have a fully functioning color picker control.

## Validating the control value

Validating a control with a custom ControlValueAccessor works exactly the same as validating any other FormControl.
You can have synchronous and asynchronous validators.

An evident example is the `required` validator.
Something more specific might be a validator to have at least 50% blue in the color:

```typescript
myForm = this.formBuilder.group({
  bgColor: [null, [Validators.required, ValidateMinimumBlue]],
  fgColor: [null, Validators.required]
});

const ValidateMinimumBlue = (control: FormControl) => {
  if (!control.value) {
    return null;
  }
  const { b } = parseColor(control.value);
  return b >= 128 ? null : { minimumBlue: true };
}
```

```html
<div class="error" *ngIf="myForm.get('fgColor').hasError('minimumBlue')">Not blue enough</div>
```

<img alt="A demonstration of the picker validation." src="{{ '/img/2020-08-15-angular-custom-control/warqsmdbk7.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 450px;">
<div style="text-align: center; margin-bottom: 3em; font-style: italic;">I like the color blue, ok.</div>

Another example is a contrast validator on the form group itself:

```typescript
myForm = this.formBuilder.group({
  bgColor: [null, [Validators.required, ValidateMinimumBlue]],
  fgColor: [null, Validators.required]
}, {validators: ValidateContrast('fgColor', 'bgColor')});

const ValidateContrast = (leftControlName: string, rightControlName: string) => (formGroup: FormGroup) => {
  const leftControl = formGroup.get(leftControlName);
  const rightControl = formGroup.get(rightControlName);

  ...
  return contrast > WCAG_2_0_AA ? null : { contrast: { value: contrast, expected: WCAG_2_0_AA } };
}
```

## Styling invalid and touched controls

Most of the time you want a visual indication that a control is valid or invalid.
You can do this using css in your component like this:

```css
:host.ng-touched .picker-icon {
  position: relative;
}
:host.ng-touched .picker-icon:after {
  position: absolute;
  transform: translate(100%, -50%);
  top: 50%;
} 

:host.ng-touched.ng-invalid .picker-icon {
  box-shadow: 0 0 1px 1px darkred;
}
:host.ng-touched.ng-invalid .picker-icon:after {
  content: '❌';
}   

:host.ng-touched.ng-valid .picker-icon {
  box-shadow: 0 0 1px 1px green;
}
:host.ng-touched.ng-valid .picker-icon:after {
  content: '✅';
}
```

<img alt="A demonstration of the indication that the control is valid." src="{{ '/img/2020-08-15-angular-custom-control/xnk6yxgsdr.gif' | prepend: site.baseurl }}" class="image fit" style="margin:0px auto; max-width: 450px;">

## Reacting on more behavior

If you want to your code to react on more control behaviour, like `statusChanges`, you cannot do this out of the box with `NG_VALUE_ACCESSOR`.
However, you can inject `NgControl` from `@angular/forms` instead.
Angular uses this instance to represent the control within the object graph that has been created for the form.

To use this, you have to remove the provider for `NG_VALUE_ACCESSOR` and instead add this in your constructor:

```typescript
constructor(ngControl: NgControl) {
  if (!!ngControl) {
    ngControl.valueAccessor = this;
  }
}
```

Then you can do things like this in `ngAfterViewInit`:

```typescript
this.ngControl.statusChanges.pipe(
  takeUntil(this._destroyed$)
).subscribe(status => {
  console.log('The current status of the control is', status);
});
```

Or if you really want to hook onto specific methods, you can do this:

```typescript
if (this.ngControl.control) {
  const markAsDirty = this.ngControl.control.markAsDirty;
  this.ngControl.control.markAsDirty = (options) => {
    markAsDirty.bind(this.ngControl.control)(options);
    console.log('Mark as dirty has been called');
  }
}
```

I would not recommend these kind of hooks, but if you do need them, be extra careful for infinite loops and other bugs.

