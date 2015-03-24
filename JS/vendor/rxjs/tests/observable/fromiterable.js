QUnit.module('fromIterable');

function arePropertyDescriptorsSupported() {
  try {
    Object.defineProperty({}, 'x', {});
    return true;
  } catch (e) { /* this is IE 8. */
    return false;
  }
};

var supportsDescriptors = !!Object.defineProperty && arePropertyDescriptorsSupported();

function defineProperties(object, map) {
  Object.keys(map).forEach(function(name) {
    var method = map[name];
    if (name in object) return;
    if (supportsDescriptors) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: method
      });
    } else {
      object[name] = method;
    }
  });
};

// Shim in iterator support
var $iterator$ = (typeof Symbol === 'object' && Symbol.iterator) ||
  '_es6shim_iterator_';
// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
// So use that name if we detect it.
if (window.Set && typeof new window.Set()['@@iterator'] === 'function') {
  $iterator$ = '@@iterator';
}

var addIterator = function(prototype, impl) {
  if (!impl) { impl = function iterator() { return this; }; }
  var o = {};
  o[$iterator$] = impl;
  defineProperties(prototype, o);
};

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

function ArrayIterator(array) {
  this.array = array;
  this.index = 0;
}

ArrayIterator.prototype.next = function () {
  var a = this.array, i = this.index;
  if (a === undefined || i >= a.length) {
    this.array = undefined;
    return { done: true, value: undefined };
  }
  var item = a[i];
  this.index++;
  return { done: false, value: item };
};

function ArrayWrapper(array) {
  this.array = array;
}

ArrayWrapper.prototype[$iterator$] = function () {
  return new ArrayIterator(this.array);
};

addIterator(ArrayIterator.prototype);

test('fromIterable finite', function () {
  var enumerableFinite = new ArrayWrapper([1, 2, 3, 4, 5]);

  var scheduler = new TestScheduler();

  var results = scheduler.startWithCreate(function () {
    return Observable.fromIterable(enumerableFinite, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(204, 4),
    onNext(205, 5),
    onCompleted(206)
  );
});

test('fromIterable empty', function () {
  var enumerableFinite = new ArrayWrapper([]);

  var scheduler = new TestScheduler();

  var results = scheduler.startWithCreate(function () {
    return Observable.fromIterable(enumerableFinite, scheduler);
  });

  results.messages.assertEqual(
    onCompleted(201)
  );
});

function InfiniteIterable() { }
InfiniteIterable.prototype[$iterator$] = function () {
  return new InfiniteIterator();
};

function InfiniteIterator() {
  this.index = 0;
}

InfiniteIterator.prototype.next = function () {
  return { done: false, value: this.index++ };
};

addIterator(ThrowableIterator.prototype);

test('fromIterable infinite', function () {
  var iterable = new InfiniteIterable();

  var scheduler = new TestScheduler();

  var results = scheduler.startWithCreate(function () {
    return Observable.fromIterable(iterable, scheduler).take(5);
  });

  results.messages.assertEqual(
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(204, 4),
    onNext(205, 5),
    onCompleted(205)
  );
});

function ThrowableIterable(err) {
  this.err = err;
}

ThrowableIterable.prototype[$iterator$] = function () {
  throw this.err;
};

test('fromIterable iterator throws', function () {
  var err = new Error();
  var iterable = new ThrowableIterable(err);

  var scheduler = new TestScheduler();

  var results = scheduler.startWithCreate(function () {
    return Observable.fromIterable(iterable, scheduler);
  });

  results.messages.assertEqual(
    onError(200, err)
  );
});

function ThrowableIteratorHost(err) {
  this.err = err;
}

ThrowableIteratorHost.prototype[$iterator$] = function () {
  return new ThrowableIterator(this.err);
};

function ThrowableIterator(err) {
  this.err = err;
}

ThrowableIterator.prototype.next = function () {
  throw this.err;
};

addIterator(ThrowableIterator.prototype);

test('fromIterable next throws', function () {
  var err = new Error();
  var iterable = new ThrowableIteratorHost(err);

  var scheduler = new TestScheduler();

  var results = scheduler.startWithCreate(function () {
    return Observable.fromIterable(iterable, scheduler);
  });

  results.messages.assertEqual(
    onError(201, err)
  );
});
