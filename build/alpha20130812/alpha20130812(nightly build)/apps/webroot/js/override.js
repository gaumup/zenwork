TimeSpan.prototype.getDiffDays = function () {
    return this.days + (this.hours >= 12 ? 1 : (this.hours == 0 ? 0 : 0.5));
}