import ReminderList from './reminder-list';
import ReminderDate from './reminder-date';

/**
 * Note Class (SINGLETON)
 */
export default class Note {
  /**
   * Creates a new note
   */
  constructor() {
    this.elem = document.createElement('div');
    this.alert = document.createElement('div');
    this.maxChars = 100;
    this.type = 'blank';
  }

  /**
   * Returns instance of Note
   * @return {Note} The instance
   */
  static getInstance() {
    if (this.instance == null) this.instance = new Note();
    return this.instance;
  }


  /**
   * The onload handler
   */
  onload() {
    document.getElementById('noteContainer').appendChild(this.elem);
    this.alert.setAttribute('id', 'alert');
    this.elem.parentElement.appendChild(this.alert);
  }

  /**
   * Updates the Note instance
   * @param {*} config The config options
   */
  updateNote(config) {
    // Toggle the active class if has ID
    if (config.id) {
      const reminderList = ReminderList.getInstance();
      for (const reminder of reminderList.reminders) {
        const reminderId = reminder.id;
        reminderList.fetchReminder(reminderId).elem.classList.remove('active');
      }

      reminderList.fetchReminder(config.id).elem.classList.add('active');
    }

    document.removeEventListener('keydown', this.updateCharactersLeft);

    this.elem.classList.remove(this.type);
    this.elem.classList.add(config.type);
    this.type = config.type;

    switch (this.type) {
      case 'new':
        this.newNote();
        break;

      case 'edit':
        this.editNote(config.id);
        break;

      case 'display':
        this.displayNote(config.id);
        break;

      case 'blank':
        this.blankNote();
        break;
      default:
        alert('Something went wrong');
    }
  }
  /**
   * Change Note to New Note View
   */
  newNote() {
    this.updateMobileView();
    this.elem.innerHTML = `
        <div class="title-container">
        <textarea id="title" type="text" placeholder="Title" maxlength="` + this.maxChars + `"></textarea>
        <div id="save"><i class="fal fa-save"></i></div>
        <div id="charactersLeft">` + this.maxChars + `</div>
        </div>
        <div id='date'><i class="fal fa-calendar-day"></i></div>
        <textarea id="content" type="text" placeholder="Content"></textarea>`;

    document.getElementById('save').addEventListener('click', () => {
      // Validation
      if (this.checkValidation()) {
        ReminderList.getInstance().addReminder({
          title: document.getElementById('title').value,
          content: document.getElementById('content').value,
          dueDate: this.reminderDate == null ? '' : this.reminderDate.getDate(),
        });

        this.reminderDate = null;
      }
    });

    document.addEventListener('keydown', this.updateCharactersLeft);

    document.getElementById('date').addEventListener('click', (e) => {
      this.reminderDate = new ReminderDate(null);
    });
  }

  /**
   * Change Note to Edit Note View
   * @param {Number} reminderId The reminder Id
   */
  editNote(reminderId) {
    const reminderList = ReminderList.getInstance();
    const reminderTitle = reminderList.fetchReminder(reminderId).title;
    const reminderContent = reminderList.fetchReminder(reminderId).content;
    const reminderDate = reminderList.fetchReminder(reminderId).dueDate;

    this.currentChars = this.maxChars - reminderTitle.length;

    this.elem.innerHTML = `
        <div class="title-container">
        <textarea id="title" type="text" maxlength="` + this.maxChars + `">` + reminderTitle + `</textarea>
        <div id="save"><i class="fal fa-save"></i></div>
        <div id="charactersLeft">` + this.currentChars + `</div>
        </div>
        <div id='date'><i class="fal fa-calendar-day"></i></div>
        <textarea id="content" type="text">` + reminderContent + `</textarea>`;

    if (reminderDate != '') {
      this.reminderDate = new ReminderDate(reminderDate);
    } else {
      document.getElementById('date').addEventListener('click', (e) => {
        this.reminderDate = new ReminderDate(null);
      });
    }

    document.addEventListener('keydown', this.updateCharactersLeft);

    document.getElementById('save').addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.checkValidation()) {
        const reminderDate = reminderList.fetchReminder(reminderId).dueDate;
        ReminderList.getInstance().updateReminder({
          id: reminderId,
          title: document.getElementById('title').value,
          content: document.getElementById('content').value,
          dueDate: this.reminderDate == null ? reminderDate : this.reminderDate.getDate(),
        });

        this.reminderDate = null;
      }
    });
  }
  /**
   * Change Note to Display Note View
   * @param {Number} reminderId The reminder Id
   */
  displayNote(reminderId) {
    // Change mobile view
    this.updateMobileView();
    const reminderList = ReminderList.getInstance();
    const currentReminder = reminderList.fetchReminder(reminderId);
    const reminderTitle = currentReminder.title;
    const reminderContent = currentReminder.content;
    const daysLeft = currentReminder.daysLeft();
    const dateOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    this.elem.innerHTML = `
        <div class="title-container">
        <textarea disabled id="title" type="text">` + reminderTitle + `</textarea>
        <div id="edit"><i class="fal fa-edit"></i></div>
        </div>
        <div id='displayDate'>` + currentReminder.getDueDate(dateOptions) +`
         &mdash; Days Left: ` + daysLeft + `</div>
        <textarea disabled id="content" type="text">` + reminderContent + `</textarea>`;

    document.getElementById('edit').addEventListener('click', () => {
      // Edit Note
      Note.getInstance().updateNote({
        type: 'edit',
        id: reminderId,
      });
    });
  }
  /**
   * Change Note to Blank Note View
   */
  blankNote() {
    this.elem.innerHTML = '';
  }
  /**
   * Checks if the fields are valid fields
   * @return {Boolean} True if valid; False if invalid
   */
  checkValidation() {
    const title = document.getElementById('title');

    if (title.value == '') {
      this.alert.innerHTML = 'Add title';
      this.alert.classList.add('warning');
      title.parentElement.classList.add('warning');

      this.checkClick();

      return false;
    }

    return true;
  }
  /**
 * Checks for a click
 */
  checkClick() {
    const documentClick = (e)=> {
      e.stopPropagation();
      if (e.target == document.getElementById('save') || e.target.closest('#save') != null) return;
      if (e.target == document.getElementById('edit') || e.target.closest('#save') != null) return;
      this.alert.classList.remove('warning');
      document.removeEventListener('click', documentClick);
    };
    if (this.alert.classList.contains('warning')) {
      setTimeout(()=> {
        document.addEventListener('click', documentClick);
      }, 200);
    }
  }
  /**
   * Mobile show flip views
   */
  updateMobileView() {
    document.getElementById('reminderListContainer').classList.toggle('focused');
    document.getElementById('backToList').classList.toggle('active');
    document.getElementById('noteContainer').classList.toggle('focused');
  }
  /**
 * Check the characters left in the text box and update view
 */
  updateCharactersLeft() {
    const titleChars = document.getElementById('title').value.length;
    const charactersLeftElem = document.getElementById('charactersLeft');
    const charsLeft = Note.getInstance().maxChars - titleChars;

    charactersLeftElem.innerHTML = charsLeft;
  }
}
