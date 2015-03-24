### `Rx.Observable.prototype.debounceWithSelector(durationSelector)` ###
### `Rx.Observable.prototype.throttleWithSelector(durationSelector)` **DEPRECATED** ###
[&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/debouncewithselector.js "View in source")

Ignores values from an observable sequence which are followed by another value within a computed debounced duration.

#### Arguments
1. `durationSelector` *(`Function`)*: Selector function to retrieve a sequence indicating the throttle duration for each given element.

#### Returns
*(`Observable`)*: The throttled sequence.

#### Example
```js
var array = [
    800,
    700,
    600,
    500
];

var source = Rx.Observable.for(
    array,
    function (x) {
        return Rx.Observable.timer(x)
    })
    .map(function(x, i) { return i; })
    .debounceWithSelector(function (x) {
        return Rx.Observable.timer(700);
    });

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

// => Next: 0
// => Next: 3
// => Completed
```

### Location

File:
- [`/src/core/linq/observable/debouncewithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/debouncewithselector.js)

Dist:
- [`rx.all.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.js)
- [`rx.all.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.all.compat.js)
- [`rx.time.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.time.js)
- [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js)
- [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

Prerequisites:
- [`rx.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.js) | [`rx.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.compat.js) | [`rx.lite.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.js) | [`rx.lite.compat.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/dist/rx.lite.compat.js)

NPM Packages:
- [`rx`](https://www.npmjs.org/package/rx)

NuGet Packages:
- [`RxJS-All`](http://www.nuget.org/packages/RxJS-All/)
- [`RxJS-Lite`](http://www.nuget.org/packages/RxJS-Lite/)
- [`RxJS-Time`](http://www.nuget.org/packages/RxJS-Time/)

Unit Tests:
- [`/tests/observable/debouncewithselector.js`](https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/debouncewithselector.js)
