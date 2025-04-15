import { DateTime } from 'luxon';

/**
 * Возвращает текущую дату и время в часовом поясе Москвы
 */
export const getMoscowDate = (): Date => {
  return DateTime.now().setZone('Europe/Moscow').toJSDate();
};

/**
 * Преобразует любую дату в Московскую зону
 */
export const toMoscowDate = (date: Date): Date => {
  return DateTime.fromJSDate(date).setZone('Europe/Moscow').toJSDate();
};

export const convertToMoscowDate = (localInput: string) => {
  // Интерпретируем строку как локальное время и устанавливаем его в Москве
  const dt = DateTime.fromISO(localInput, { zone: 'Europe/Moscow' });

  if (!dt.isValid) {
    throw new Error(`Невалидная дата: ${localInput}`);
  }

  return dt.toJSDate(); // сохраняем как обычный JS Date
};
