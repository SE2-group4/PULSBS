class Schedule {
    constructor(scheduleId, code, AAyear, semester, roomId, seats, dayOfWeek, startingTime, endingTime) {
        this.scheduleId = scheduleId;
        this.code = code;
        this.AAyear = AAyear;
        this.semester = semester;
        this.roomId = roomId;
        this.seats = seats;
        this.dayOfWeek = dayOfWeek;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
    }

    /**
     * create a new schedule from a generic object
     * @param {Object} obj
     * @returns {Schedule} new schedule
     */
    static from(obj) {
        return Object.assign(new Schedule(), obj);
    }
}

export default Schedule;