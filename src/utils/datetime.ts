export function FormatDate(date: Date, locale: string = 'en-us') {
    const format: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric'
    }
    
    return date?.toLocaleDateString?.(locale, format);
  };
  
  export function FormatTime(date: Date) {
    let hours: number = date.getHours();
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const minutes: number = date.getMinutes();
    const minutesString: string = (minutes < 10 ? '0' : '') + minutes;

    const amOrPm: string = hours >= 12 ? 'pm' : 'am';
    return `${hours}:${minutesString} ${amOrPm}`;
  };

export function FormatDateShortMonthDate(date: Date, locale: string = 'en-us') {
  const format: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric'
  }
  
  return date?.toLocaleDateString?.(locale, format);
}