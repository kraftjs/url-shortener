import {RECORD_TTL} from "../interfaces/Record";

// function courtesy of stackoverflow user 'stopsopa'
// https://stackoverflow.com/a/50098261
function countdown(s: number) {
    if (s <= 0) {
        return '0s';
    }

    const d = Math.floor(s / (3600 * 24));
    s  -= d * 3600 * 24;

    const h = Math.floor(s / 3600);
    s  -= h * 3600;

    const m = Math.floor(s / 60);
    s  -= m * 60;

    s = Math.floor(s);

    const tmp = [];
    (d) && tmp.push(d + 'd');
    (d || h) && tmp.push(h + 'h');
    (d || h || m) && tmp.push(m + 'm');
    tmp.push(s + 's');

    return tmp.join(' ');
}

export function timeToLive(updated_at: Date) {
    const secondsSinceActivity = (Date.now() - updated_at.getTime()) / 1000;
    const secondsRemaining = RECORD_TTL * 60 * 60 - secondsSinceActivity;
    return countdown(secondsRemaining);
}