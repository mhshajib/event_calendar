var assert = require('assert');
describe('add', function() {
    it("add function must return 5", function () {
        assert.equal(add(1, 4), 5);
    })
});


function add(a, b) {
    return a+b;
}