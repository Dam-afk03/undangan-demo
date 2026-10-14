// Smart Calendar utility for Google Calendar, Apple Calendar, Outlook, and iCal (.ics)

export function generateGoogleCalendarUrl(
  title: string,
  details: string,
  location: string,
  startTimeIso: string,
  endTimeIso: string
): string {
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const datesParam = `${formatTime(startTimeIso)}/${formatTime(endTimeIso)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(
  title: string,
  details: string,
  location: string,
  startTimeIso: string,
  endTimeIso: string,
  filename = 'undangan-pernikahan-arya-anindya.ics'
) {
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Arya and Anindya Wedding//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${Date.now()}@arya-anindya.wedding`,
    `DTSTAMP:${formatTime(new Date().toISOString())}`,
    `DTSTART:${formatTime(startTimeIso)}`,
    `DTEND:${formatTime(endTimeIso)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Pengingat Pernikahan Arya & Anindya Besok!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
