import format from "date-fns/format";
import es from "date-fns/locale/es";

const formatWithLocale = (date, pattern) =>
  format(date, pattern, { locale: es });

const calendarFormats = {
  weekdayFormat: (date) => formatWithLocale(date, "EEEE"),
  dayHeaderFormat: (date) => formatWithLocale(date, "EEEE d 'de' MMMM"),
  monthHeaderFormat: (date) => formatWithLocale(date, "MMMM yyyy"),
  dayFormat: (date) => formatWithLocale(date, "dd EEEE"),
  agendaDateFormat: (date) => formatWithLocale(date, "EEEE d 'de' MMMM"),
  agendaTimeFormat: (date) => formatWithLocale(date, "HH:mm"),
  agendaHeaderFormat: ({ start, end }) =>
    `${formatWithLocale(start, "d 'de' MMMM")} – ${formatWithLocale(
      end,
      "d 'de' MMMM"
    )}`,
  rangeHeaderFormat: ({ start, end }) => {
    const sameMonth =
      formatWithLocale(start, "MMMM yyyy") ===
      formatWithLocale(end, "MMMM yyyy");
    return sameMonth
      ? `${formatWithLocale(start, "d")} – ${formatWithLocale(
          end,
          "d 'de' MMMM yyyy"
        )}`
      : `${formatWithLocale(start, "d 'de' MMMM")} – ${formatWithLocale(
          end,
          "d 'de' MMMM yyyy"
        )}`;
  },
  dayRangeHeaderFormat: ({ start, end }) =>
    `${formatWithLocale(start, "d 'de' MMMM")} – ${formatWithLocale(
      end,
      "d 'de' MMMM yyyy"
    )}`,
};
export default calendarFormats;
