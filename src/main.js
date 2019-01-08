import ReminderList from './reminder-list';
import Note from './note';
import Settings from './settings';

// Main
document.addEventListener('DOMContentLoaded', function() {
  Settings.getInstance().onload();
  ReminderList.getInstance().onload();
  Note.getInstance().onload();


  // ---Settings Button
  document.getElementById('btn-settings').addEventListener('click', () => {
    Settings.getInstance().start();
  });

  // ---Add Button
  document.getElementById('btn-add').addEventListener('click', function() {
    Note.getInstance().updateNote({
      type: 'new',
    });
  });

  // ---Show Button
  document.getElementById('btn-show').addEventListener('click', function() {
    document.getElementById('btn-show').classList.toggle('showDismissed');
    document.getElementById('btn-dismiss').classList.toggle('active');
    document.getElementById('btn-enable').classList.toggle('active');
    document.getElementById('filterContainer').classList.toggle('showDismissed');
    document.getElementById('reminderList').classList.toggle('showDismissed');
  });

  // ---Dismiss Button
  document.getElementById('btn-dismiss').addEventListener('click', function() {
    ReminderList.getInstance().dismissReminders();
    ReminderList.getInstance().uncheckFilterCheckbox();
  });

  // ---Enable Button
  document.getElementById('btn-enable').addEventListener('click', ()=> {
    ReminderList.getInstance().enableReminders();
    ReminderList.getInstance().uncheckFilterCheckbox();
  });

  // ---Delete Button
  document.getElementById('btn-delete').addEventListener('click', function() {
    ReminderList.getInstance().deleteReminders();
    ReminderList.getInstance().uncheckFilterCheckbox();
  });

  // ---Filter Buttons
  document.getElementById('filterOptions').addEventListener('click', function(e) {
    // Show by Date/A-Z
    const reminders = ReminderList.getInstance().reminders;
    if (!document.getElementById('filterOptions').classList.contains('date')) {
      // Sort by date
      reminders.sort(ReminderList.getInstance().sortByDate);
      ReminderList.getInstance().showAll();
      document.getElementById('filterOptions').classList.toggle('date');
      return;
    } else {
      // Sort A-Z
      reminders.sort(ReminderList.getInstance().sortByTitle);
      ReminderList.getInstance().showAll();
      document.getElementById('filterOptions').classList.toggle('date');
    }
  });

  // ---Checkboxes
  document.getElementById('checkboxActive').addEventListener('click', function() {
    const checkbox = document.getElementById('checkboxActive');
    // Check all active reminders
    if (!checkbox.classList.contains('active')) {
      ReminderList.getInstance().checkAll('active');
      document.getElementById('checkboxActive').classList.toggle('active');
      return;
    }
    // Uncheck all active reminders
    if (checkbox.classList.contains('active')) {
      ReminderList.getInstance().uncheckAll('active');
      document.getElementById('checkboxActive').classList.toggle('active');
      return;
    }
  });

  document.getElementById('checkboxDismiss').addEventListener('click', function() {
    const checkbox = document.getElementById('checkboxDismiss');
    // Check all dismissed reminders
    if (!checkbox.classList.contains('active')) {
      ReminderList.getInstance().checkAll('dismissed');
      document.getElementById('checkboxDismiss').classList.toggle('active');
      return;
    }
    // Uncheck all dismissed reminders
    if (checkbox.classList.contains('active')) {
      ReminderList.getInstance().uncheckAll('dismissed');
      document.getElementById('checkboxDismiss').classList.toggle('active');
      return;
    }
  });

  // ---Mobile buttons
  document.getElementById('backToList').addEventListener('click', function() {
    Note.getInstance().updateMobileView();
  });
});
