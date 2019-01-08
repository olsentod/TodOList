import Reminder from './reminder';
import Note from './note';

/**
 * ReminderList Class (SINGLETON)
 */
export default class ReminderList {
  /**
     * Creates a new ReminderList
     */
  constructor() {
    this.reminders = [];
  }
  /**
 * Get instance of ReminderList Class
 * @return {ReminderList} The instance of ReminderList
 */
  static getInstance() {
    if (this.instance == null) this.instance = new ReminderList();
    return this.instance;
  }

  /**
   * Onload for ReminderList
   */
  onload() {
    this.pullFromStorage();
    this.showAll();
  }

  /**
   * Add a reminder to ReminderList
   * @param {Reminder} reminder Reminder to add
   */
  addReminder(reminder) {
    const newReminder = new Reminder({
      id: new Date() * 13,
      title: reminder.title,
      content: reminder.content,
      dueDate: reminder.dueDate,

    });
    this.reminders.push(newReminder);
    this.reminders.sort(this.sortByDate);
    this.showAll();
    this.saveToStorage();

    // Change mobile view
    Note.getInstance().updateMobileView();
    Note.getInstance().updateNote({
      type: 'blank',
    });
  }

  /**
   * Dismiss selected Reminders
   */
  dismissReminders() {
    for (const reminder in this.reminders) {
      if (this.reminders[reminder].selected) {
        console.log(this.reminders[reminder]);
        this.reminders[reminder].dismiss();
      }
    }

    this.saveToStorage();
    this.showAll();
  }
  /**
 * Enable selected Reminders
 */
  enableReminders() {
    for (const reminder in this.reminders) {
      if (this.reminders[reminder].selected) {
        this.reminders[reminder].enable();
      }
    }

    this.saveToStorage();
    this.showAll();
  }

  /**
   * Delete selected Reminders
   */
  deleteReminders() {
    for (let reminder = this.reminders.length-1; reminder >= 0; reminder--) {
      if (this.reminders[reminder].selected) {
        this.reminders[reminder].delete();
        this.reminders.splice(reminder, 1);
      }
    }

    this.saveToStorage();
    this.showAll();

    Note.getInstance().updateNote({
      type: 'blank',
    });
  }

  /**
   * Update Reminder
   * @param {Reminder} reminder Reminder Object
   */
  updateReminder(reminder) {
    this.fetchReminder(reminder.id).save(reminder);

    this.saveToStorage();

    this.showAll();

    Note.getInstance().updateNote({
      type: 'display',
      id: reminder.id,
    });
  }

  /**
   * Get Reminder by Id
   * @param {Number} id Reminder Id
   * @return {Reminder} Reminder Object
   */
  fetchReminder(id) {
    for (const reminder in this.reminders) {
      if (id == this.reminders[reminder].id) return this.reminders[reminder];
    }
  }

  /**
   * Save ReminderList to local storage
   */
  saveToStorage() {
    localStorage.setItem('Reminders', JSON.stringify(this.reminders));
  }

  /**
   * Loads from local storage and generates view.
   */
  pullFromStorage() {
    if (localStorage.getItem('Reminders')) {
      const tempReminders = JSON.parse(localStorage.getItem('Reminders'));
      for (let temp of tempReminders) {
        temp = new Reminder(temp);
        this.reminders.push(temp);
      }
    }
  }

  /**
 * Show all Reminders in
 */
  showAll() {
    document.getElementById('reminderList').innerHTML = '';
    for (const reminder of this.reminders) {
      reminder.init();
    }
  }

  /**
 * Update all the reminders and shows them
 */
  updateAllSettings() {
    for (const reminder of this.reminders) {
      reminder.updateSettings();
    }
    this.saveToStorage();
  }
  /**
 * Check all Reminders
 * @param {String} type The type of reminder
 */
  checkAll(type) {
    if (type == 'active') {
      for (const reminder of this.reminders) {
        if (!reminder.dismissed && !reminder.selected) reminder.check();
      }
    } else if (type == 'dismissed') {
      for (const reminder of this.reminders) {
        if (reminder.dismissed && !reminder.selected) reminder.check();
      }
    } else {
      return;
    }
  }

  /**
 * Un-Check all Reminders
 * @param {String} type The type of reminder
 */
  uncheckAll(type) {
    if (type == 'active') {
      for (const reminder of this.reminders) {
        if (!reminder.dismissed && reminder.selected) reminder.check();
      }
    } else if (type == 'dismissed') {
      for (const reminder of this.reminders) {
        if (reminder.dismissed && reminder.selected) reminder.check();
      }
    } else {
      return;
    }
  }
  /**
 * Unchecks the Active or Dismiss checkbox
 */
  uncheckFilterCheckbox() {
    const checkboxActive = document.getElementById('checkboxActive');
    if (checkboxActive.classList.contains('active')) checkboxActive.classList.toggle('active');

    const checkboxDismiss = document.getElementById('checkboxDismiss');
    if (checkboxDismiss.classList.contains('active')) checkboxDismiss.classList.toggle('active');
  }
  /**
 * Sorts the reminderlist by due dates
 * @param {Reminder} a The first Reminder
 * @param {Reminder} b The second Reminder
 * @return {Boolean} Direction of the sort
 */
  sortByDate(a, b) {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    if (a.dueDate > b.dueDate) return 1;
    if (a.dueDate < b.dueDate) return -1;
    return 0;
  }

  /**
 * Sorts the reminderlist by titles
 * @param {Reminder} a The first Reminder
 * @param {Reminder} b The second Reminder
 * @return {Boolean} Direction of the sort
 */
  sortByTitle(a, b) {
    if (a.title > b.title) return 1;
    if (a.title < b.title) return -1;
    return 0;
  }
}
