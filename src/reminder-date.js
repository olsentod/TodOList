/**
 * The ReminderDate Class
 */
export default class ReminderDate {
  /**
     * Creates a ReminderDate object
     * @param {Date} date A Date object
     */
  constructor(date) {
    date == null || date == '' ? this.date = new Date() : this.date = new Date(date);

    this.init();
  }

  /**
 * Get instance of ReminderDate Class
 * @return {ReminderDate} The instance of ReminderDate
 */
  static getInstance() {
    if (this.instance == null) this.instance = new ReminderDate();
    return this.instance;
  }

  /**
   * Adds ReminderDate to DOM
   */
  init() {
    this.elem = document.getElementById('date');
    this.elem.outerHTML = `
    <div id="date" class="active">
    <input type="date" id="dateElem">
    </div>`;

    const dateElem = document.getElementById('dateElem');
    dateElem.setAttribute('value', this.date.toISOString().slice(0, 10));
    dateElem.setAttribute('min', new Date().toISOString().slice(0, 10));
    const maxYear = this.date.getFullYear() + 1;
    const maxDate = new Date(this.date.setFullYear(maxYear));
    dateElem.setAttribute('max', maxDate.toISOString().slice(0, 10));
  }
  /**
 * Get the current date from the Input
 * @return {Date} The the current date
 */
  getDate() {
    let newDate = new Date(document.getElementById('dateElem').value);
    newDate = new Date(newDate.setDate(newDate.getUTCDate()));
    newDate.setHours(0, 0, 0, 0);
    this.date = newDate;

    return this.date;
  }
}
