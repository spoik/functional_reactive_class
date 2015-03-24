var HelloWorldObservable = Rx.Observable.create(function(observer) {
    observer.onNext('hello world');

    observer.onCompleted();
});

var HelloWorldUppercaseObservable = HelloWorldObservable.map(function(x) { return x.toUpperCase(); });

function createIntergerSequenceObservable(n) {
    return Rx.Observable.create(function(observer) {
        observer.onNext(n);
        observer.onCompleted();
    });
}