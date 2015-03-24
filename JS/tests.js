QUnit.test( "Test HelloWorldObservable", function( assert ) {
    var test_observer = Rx.Observer.create(
        function(x) { assert.ok( x === 'hello world'); }
    );

    HelloWorldObservable.subscribe(test_observer);
});

QUnit.test( "Test HelloWorldObservableUppercase", function( assert ) {
    HelloWorldUppercaseObservable.subscribe(
        function(x) { assert.ok( x === 'HELLO WORLD')}
    );
});

QUnit.test( "Test createIntergerSequenceObservable", function( assert ) {
    var observable = createIntergerSequenceObservable(5);

    var result = observable.reduce(function(acc, x) {
        acc.push(x);
    }, []);

    alert(result);

    assert.ok(true);
});
