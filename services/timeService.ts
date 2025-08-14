
import type { GameTime, Season } from '../types/character';
import { DAYS_PER_MONTH, MONTHS_PER_YEAR } from '../constants';

const getSeason = (month: number): Season => {
    if (month >= 1 && month <= 3) return 'Xuân';
    if (month >= 4 && month <= 6) return 'Hạ';
    if (month >= 7 && month <= 9) return 'Thu';
    return 'Đông'; // Month 10, 11, 12
};

export const advanceTime = (currentTime: GameTime, minutesToAdd: number): GameTime => {
    if (minutesToAdd <= 0) return currentTime;

    let { year, month, day, hour, minute } = currentTime;

    minute += minutesToAdd;

    hour += Math.floor(minute / 60);
    minute %= 60;

    day += Math.floor(hour / 24);
    hour %= 24;

    while (day > DAYS_PER_MONTH) {
        day -= DAYS_PER_MONTH;
        month += 1;
        if (month > MONTHS_PER_YEAR) {
            month = 1;
            year += 1;
        }
    }
    
    const season = getSeason(month);
    
    return { year, season, month, day, hour, minute };
};

export const gameTimeToMinutes = (time: GameTime): number => {
    const totalDays = ((time.year - 1) * MONTHS_PER_YEAR + (time.month - 1)) * DAYS_PER_MONTH + (time.day - 1);
    const totalHours = totalDays * 24 + time.hour;
    const totalMinutes = totalHours * 60 + time.minute;
    return totalMinutes;
};
