import moment from "moment";

function durationTime(time){
    /* 判断时间类型 s/m/h/d/w/M/y */
    let array = Array.from(time);
    let num = array.slice(0, -1).join('');
    let lastCharacter = array[array.length - 1].toString();
    /* 关键字非空 */
    if ("smhdwMy".indexOf(lastCharacter) === -1) {
        return null
    }
    let uint = null;
    switch (lastCharacter) {
        case "s":
            uint = "seconds";
            break;
        case "m":
            uint = "minutes";
            break;
        case "h":
            uint = "hours";
            break;
        case "d":
            uint = "days";
            break;
        case "w":
            uint = "weeks";
            break;
        case "M":
            uint = "months";
            break;
        case "y":
            uint = "years";
            break;
    }
    if (uint !== null) {
        return moment.duration(num, uint);
    }
}


export function toSeconds(time) {
    return durationTime(time).asSeconds()
}

export function toMilliSeconds(time) {
    return durationTime(time).asMilliseconds()
}