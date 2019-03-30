class Week {
    private date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    getFirst() {
        return this.withDate(
            this.getFirstDate()
        );
    }

    getLast() {
        return this.withDate(
            this.getLastDate()
        );
    }

    includes(other: Date) {
        return (
            other >= this.getFirst() &&
            other <= this.getLast()
        );
    }

    private getFirstDate() {
        const {date} = this;
        return clamp(
                date.getDate() - date.getDay() + 1,
                1,
                lastDayOfMonth(date)
        );
    }

    private getLastDate() {
        return Math.min(
            this.getFirstDate() + 7,
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
    const a = new Date(date);

    a.setMonth(a.getMonth() + 1);
    a.setDate(0);

    return a.getDate();
}

function clamp(value: number, min: number, max: number) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}
