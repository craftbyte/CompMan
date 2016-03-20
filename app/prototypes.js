module.exports = () => {
    String.prototype.toProperCase = function(lower) {
        return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
}