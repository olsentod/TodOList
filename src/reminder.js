import Note from './note';
import ReminderList from './reminder-list';
import Settings from './settings';

/**
 * The Reminder Class
 */
export default class Reminder {
  /**
     * Constructor for Reminder Class
     * @param {*} config Config Options
     */
  constructor(config) {
    this.id = config.id;
    this.title = config.title;
    this.content = config.content;
    config.selected ? this.selected = config.selected : this.selected = false;
    config.dateCreated ? this.dateCreated = new Date(config.dateCreated) : this.dateCreated = new Date();
    config.lastUpdated ? this.lastUpdated = new Date(config.lastUpdated) : this.lastUpdated = new Date();
    config.dueDate ? this.dueDate = new Date(config.dueDate) : this.dueDate = '';
    config.dismissed ? this.dismissed = config.dismissed : this.dismissed = false;

    this.settings = Settings.getInstance().settings;

    this.init();
  }

  /**
 * Init to Win It
 */
  init() {
    this.elem = document.createElement('div');
    this.elem.classList.add('reminder');
    if (this.dismissed) this.elem.classList.add('dismissed');

    // Checks if the Due date is soon or not
    const daysLeft = this.daysLeft();
    let timeFrame;
    if (daysLeft == '&#8734;') {
      timeFrame = 'safe';
    } else if (daysLeft > this.settings.alerts.safeDays) {
      timeFrame = 'safe';
    } else if (daysLeft > this.settings.alerts.warningDays && daysLeft <= this.settings.alerts.safeDays) {
      timeFrame = 'caution';
    } else {
      timeFrame = 'warning';
    }

    this.elem.innerHTML = `
    <div class="desc">
        <h3>` + this.title + `</h3>
        <p class="` + timeFrame + `">` + this.getDueDate() + `</p></div>
    <div class="checkbox">
        <span><i class="fal fa-check"></i></span>
    </div>`;

    // Click for display note
    document.getElementById('reminderList').appendChild(this.elem);
    this.elem.querySelector('.desc').addEventListener('click', ()=> {
      Note.getInstance().updateNote({
        type: 'display',
        id: this.id,
      });
    });

    // Check box stuff
    if (this.selected === true) {
      this.elem.querySelector('.checkbox').classList.toggle('active');
    }

    this.elem.querySelector('.checkbox').addEventListener('click', () => {
      this.check();
    });
  }
  /**
 * Dismiss Reminder
 */
  dismiss() {
    this.selected = false;
    this.dismissed = true;
  }

  /**
   * Enable Reminder
   */
  enable() {
    this.selected = false;
    this.dismissed = false;
  }
  /**
 * Delete Reminder
 */
  delete() {
    this.selected = false;
  }

  /**
   * Save Reminder
   * @param {Reminder} reminder Reminder Object
   */
  save(reminder) {
    this.title = reminder.title;
    this.content = reminder.content;
    this.dismissed = reminder.dismissed;
    reminder.dueDate == '' ? this.dueDate = '' : this.dueDate = new Date(reminder.dueDate);
    this.lastUpdated = new Date();
  }

  /**
   * Changes the current settings of the reminder
   */
  updateSettings() {
    this.settings = Settings.getInstance().settings;
  }

  /**
 * Check Reminder
 */
  check() {
    this.selected == true ? this.selected = false : this.selected = true;
    this.elem.querySelector('.checkbox').classList.toggle('active');
    ReminderList.getInstance().saveToStorage();
  }

  /**
 * Returns the due date in a nice string
 * @param {Object} options Options for Local Date String
 * @return {String} The date in string version
 */
  getDueDate(options) {
    if (this.dueDate != '') {
      if (arguments.length == 1) {
        return this.dueDate.toLocaleDateString('en-US', options);
      } else {
        return this.dueDate.toLocaleDateString();
      }
    } else {
      return '';
    }
  }

  /**
 * Gets the number of days left to finish the reminder
 * @return {Number} Days left to finish item
 */
  daysLeft() {
    if (this.dueDate != '') {
      const dueTime = this.dueDate.getTime();
      const currentTime = new Date().getTime();

      let daysLeft = dueTime - currentTime;
      daysLeft = Math.ceil(daysLeft / (1000*60*60*24));

      return daysLeft;
    }

    return '&#8734;';
  }
}
