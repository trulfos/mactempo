class Week {
    private date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    public getFirst() {
        return this.withDate(
            this.getFirstDate()
        );
    }

    public getLast() {
        return this.withDate(
            this.getLastDate()
        );
    }

    public getRange() {
        return {
            from: this.getFirst(),
            to: this.getLast()
        };
    }

    public includes(other: Date) {
        return (
            other >= this.getFirst() &&
            other <= this.getLast()
        );
    }

    private getFirstDate() {
        const {date} = this;
        return clamp(
                date.getDate() - (date.getDay() + 6) % 7,
                1,
                lastDayOfMonth(date)
        );
    }

    private getLastDate() {
        return Math.min(
            this.getFirstDate() + 6,
            lastDayOfMonth(this.date)
        );
    }

    private withDate(date: number): Date {
        const newDate = new Date(this.date);
        newDate.setDate(date);
        return newDate;
    }
}

export default Week;

function lastDayOfMonth(date: Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
}

function clamp(value: number, min: number, max: number) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}
