/**
 * 判断润年
 * @param {string} year 年份
 * @return {Boolean}
 */

export const isLeap = function (year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
/**
 * 获取星期
 * @param {string} date 日期
 * @return {string} 星期
 */
export const getWeek = function (date) {
  let Stamp = new Date(date);
  let weeks = ["日", "一", "二", "三", "四", "五", "六"];
  return weeks[Stamp.getDay()];
};
/**
 * 获取月份天数
 * @param {string} year  年份
 * @param {string} month 月份
 * @return {number} 月份天数
 */
export const getMonthDays = function (year, month) {
  month = parseInt(month) - 1;
  if (month < 0 || month > 11) return "";
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isLeap(year)) {
    months[1] = 29;
  }
  return months[month];
};
/**
 * 数字补零
 * @param {string} str
 * @return {string}
 */
export const zero = function (str) {
  str = parseInt(str);
  return str > 9 ? str : "0" + str;
};
/**
 * 获取今天日期
 * @param {string} str  日期格式
 * @return {string} 格式化日期
 */
export const getToday = function (str = "yyyy-mm-dd") {
  const date = new Date();
  const year = date.getFullYear(),
    month = zero(date.getMonth() + 1),
    day = zero(date.getDate()),
    hour = zero(date.getHours()),
    minute = zero(date.getMinutes()),
    second = zero(date.getSeconds());
  str = str.replace("yyyy", year);
  str = str.replace("mm", month);
  str = str.replace("dd", day);
  str = str.replace("hh", hour);
  str = str.replace("MM", minute);
  str = str.replace("ss", second);
  return str;
};
/**
 * 将时间按照所传入的时间格式进行转换
 * @param {string} value  日期
 * @param {string} formatStr  日期格式
 * @return {string} 格式化日期
 */
export const dateFormat = function (value, formatStr = "yyyy-mm-dd") {
  const date = new Date(value);
  const year = date.getFullYear(),
    month = zero(date.getMonth() + 1),
    day = zero(date.getDate()),
    hour = zero(date.getHours()),
    minute = zero(date.getMinutes()),
    second = zero(date.getSeconds());
  str.replace("yyyy", year);
  str.replace("mm", month);
  str.replace("dd", day);
  str.replace("hh", hour);
  str.replace("MM", minute);
  str.replace("ss", second);
  return str;
};
/**
 * 获取前n天日期
 * @param {string} n  当前日期
 * @return {string} 前n天日期
 */
export const beforeDay = function (inputDate, nDays) {
  // 转换成Date类型
  const date = new Date(inputDate);
  // 减去n天的毫秒数
  date.setTime(date.getTime() - nDays * 24 * 60 * 60 * 1000);

  // 格式化日期
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};
/**
 * 获取后n天日期
 * @param {string} n  当前日期
 * @return {string} 后n天日期
 */
export const afterDay = function (inputDate, nDays) {
  // 将给定的日期字符串转换为 Date 对象
  const date = new Date(inputDate);
  // 向 Date 对象添加 nDays 天
  date.setDate(date.getDate() + nDays);

  // 格式化日期
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // padStart 保证了月份为两位数
  let day = date.getDate().toString().padStart(2, "0"); // padStart 保证了日期为两位数

  return `${year}-${month}-${day}`;
};

/**
 * 获取上一天日期
 * @param {string} str  当前日期
 * @return {string} 上一天日期
 */
export const getYesterday = function (str) {
  let date = str.split("-");
  let year = parseInt(date[0]),
    month = parseInt(date[1]),
    day = parseInt(date[2]);
  if (month > 12 || month < 1 || day > getMonthDays(year, month))
    return "日期不合法";
  day -= 1;
  if (day > 0) {
    return year + "-" + zero(month) + "-" + zero(day);
  }
  month -= 1;
  if (month > 0) {
    return year + "-" + zero(month) + "-" + getMonthDays(year, month);
  }
  year -= 1;
  return year + "-" + 12 + "-" + getMonthDays(year, 12);
};
/**
 * 获取下一天日期
 * @param {string} str  当前日期
 * @return {string} 下一天日期
 */
export const getTomorrow = function (str) {
  let date = str.split("-");
  let year = parseInt(date[0]),
    month = parseInt(date[1]),
    day = parseInt(date[2]);
  if (month > 12 || month < 1 || day > getMonthDays(year, month))
    return "日期不合法";
  day += 1;
  if (day <= getMonthDays(year, month)) {
    return year + "-" + zero(month) + "-" + zero(day);
  }
  month += 1;
  if (month < 13) {
    return year + "-" + zero(month) + "-" + "01";
  }
  year += 1;
  return year + "-" + "01" + "-" + "01";
};
