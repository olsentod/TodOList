import ReminderList from './reminder-list';

/**
 * Settings Class (SINGLETON)
 */
export default class Settings {
  /**
     * Creates a new Settings
     */
  constructor() {
    this.elem = document.createElement('div');
    // Default colors

    this.settings = {
      colors: {
        safe: 'blue',
        caution: 'yellow',
        warning: 'red',
      },
      alerts: {
        safeDays: 30,
        warningDays: 5,
      },
    };

    // If in local storage update new values
    if (localStorage.getItem('Settings')) {
      this.pullFromStorage();
    }

    // Build from current settings
    this.savetoStorage();
    this.init();
  }

  /**
     * Get instance of Settings Class
     * @return {Settings} The instance of Settings
     */
  static getInstance() {
    if (this.instance == null) this.instance = new Settings();
    return this.instance;
  }

  /**
 * Init to Win it!
 */
  init() {

  }

  /**
 * Onload settings
 */
  onload() {
    this.pullFromStorage();
  }

  /**
 * Update the current settings
 */
  update() {

  }

  /**
   * Build the settings area and populate with content
   */
  start() {
    this.elem.innerHTML = `
    <div id="settings">
    <div class="colors">
    <h3>Colors</h3>
    </div>
    <div class="alerts">
    <h3>Alerts</h3>
    <label for="safeDays">Days before caution</label>
    <input type="number" id="safeDays" placeholder="` + this.settings.alerts.safeDays + `">
    <label for="warningDays">Days before warning</label>
    <input type="number" id="warningDays" placeholder="` + this.settings.alerts.warningDays + `">
    </div>
    <div id="cancelSettings"><i class="fal fa-times"></i></div>
    <div id="saveSettings">Save</div>
    </div>`;
    document.body.appendChild(this.elem);
    this.elem.id = 'settingsContainer';

    document.getElementById('saveSettings').addEventListener('click', () => {
      // Update element
      // this.settings.alerts.safeDays = document.getElementById('safeDays').value;

      const safeDays = document.getElementById('safeDays');
      const warningDays = document.getElementById('warningDays');

      this.settings = {
        alerts: {
          safeDays: safeDays.value ? safeDays.value : this.settings.alerts.safeDays,
          warningDays: warningDays.value ? warningDays.value : this.settings.alerts.warningDays,
        },
        colors: {

        },

      };
      // Finalize
      this.savetoStorage();
      this.exit();
    });

    document.getElementById('cancelSettings').addEventListener('click', () => {
      this.exit();
    });
  }

  /**
   * Exit the settings view and go back to main view
   */
  exit() {
    this.elem.remove();
    ReminderList.getInstance().updateAllSettings();
    ReminderList.getInstance().showAll();
  }

  /**
 * Save the settings into local storage
 */
  savetoStorage() {
    localStorage.setItem('Settings', JSON.stringify(this.settings));
  }

  /**
   * Pull settings from local storage
   */
  pullFromStorage() {
    if (localStorage.getItem('Settings')) {
      const tempSettings = JSON.parse(localStorage.getItem('Settings'));
      this.settings = tempSettings;
    }
  }

  /**
   * Check Validity.
   * 1. Warning days must be less than or equal to safe days.
   * 2.
   */
}
