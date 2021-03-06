let tasks;
if (localStorage.taskList === undefined) {
  tasks = new TaskManager();
} else {
  tasks = new TaskManager(
    JSON.parse(localStorage.getItem("taskList")),
    parseInt(localStorage.getItem("currentId"))
  );
}

const form = document.querySelector("#form-validate");
const taskName = document.querySelector("#task-name");
const assignedTo = document.querySelector("#assigned");
const status = document.querySelector("select");
const dueDate = document.querySelector("#date");
const description = document.querySelector("#exampleFormControlTextarea1");
const cardContainer = document.querySelector("#card-container");
const formBtn = document.querySelector(".plus-icon");
const formContainer = document.querySelector(".task-form");
const statusFilter = document.querySelector("#status-filter");
const dueDateFilter = document.querySelector("#due-date-filter");

const validateForm = () => {
  // Name Validation
  if (taskName.value.length < 1) {
    taskName.classList.add("is-invalid");
    taskName.classList.remove("is-valid");
  } else {
    taskName.classList.add("is-valid");
    taskName.classList.remove("is-invalid");
  }

  // AssignedTo Validation
  if (assignedTo.value.length < 1) {
    assignedTo.classList.add("is-invalid");
    assignedTo.classList.remove("is-valid");
  } else {
    assignedTo.classList.add("is-valid");
    assignedTo.classList.remove("is-invalid");
  }

  // Status Validation
  if (status.value === "Choose Status") {
    status.classList.add("is-invalid");
    status.classList.remove("is-valid");
  } else {
    status.classList.add("is-valid");
    status.classList.remove("is-invalid");
  }

  // Date Validation

  // Split date input value and make into Date object form
  // (https://stackoverflow.com/questions/23641525/javascript-date-object-from-input-type-date)

  const dateSplit = dueDate.value.split(/\D/);
  const dateValue = new Date(dateSplit[0], --dateSplit[1], ++dateSplit[2]);
  // get current date
  const dateNow = Date.now();
  // compare current date with input date
  if (dateValue >= dateNow) {
    dueDate.classList.add("is-valid");
    dueDate.classList.remove("is-invalid");
  } else {
    dueDate.classList.add("is-invalid");
    dueDate.classList.remove("is-valid");
  }

  // Description Validation
  if (description.value.length < 1) {
    description.classList.add("is-invalid");
    description.classList.remove("is-valid");
  } else {
    description.classList.add("is-valid");
    description.classList.remove("is-invalid");
  }
};

const validate = (event) => {
  //prevent default form submission
  event.preventDefault();

  // run form validation
  validateForm();

  // Check form validation was succesful (all classes are is-valid)
  if (
    description.classList.contains("is-valid") &&
    taskName.classList.contains("is-valid") &&
    status.classList.contains("is-valid") &&
    assignedTo.classList.contains("is-valid") &&
    dueDate.classList.contains("is-valid")
  ) {
    // Add task from form to class
    tasks.addTask(
      taskName.value,
      description.value,
      assignedTo.value,
      dueDate.value,
      status.value
    );

    // Render task
    tasks.createTaskHtml(
      taskName.value,
      description.value,
      assignedTo.value,
      dueDate.value,
      status.value,
      tasks.currentId
    );

    // Save task to local storage
    tasks.save();

    //return form to default
    taskName.classList.remove("is-valid");
    assignedTo.classList.remove("is-valid");
    status.classList.remove("is-valid");
    dueDate.classList.remove("is-valid");
    description.classList.remove("is-valid");

    taskName.value = "";
    assignedTo.value = "";
    status.value = "Choose Status";
    dueDate.value = "";
    description.value = "";

    // close form when submitted
    formBtn.classList.toggle("plus-icon-rotate-open");
    form.classList.toggle("display-none");
    formContainer.classList.toggle("pb-4");
  }

  //check due dates everytime new task is added
  tasks.checkDueDate();
};

// Submit Form Event
form.addEventListener("submit", validate);

// Clear Form Event
form.addEventListener("reset", (event) => {
  taskName.classList.remove("is-valid");
  taskName.classList.remove("is-invalid");
  assignedTo.classList.remove("is-valid");
  assignedTo.classList.remove("is-invalid");
  status.classList.remove("is-valid");
  status.classList.remove("is-invalid");
  dueDate.classList.remove("is-valid");
  dueDate.classList.remove("is-invalid");
  description.classList.remove("is-valid");
  description.classList.remove("is-invalid");
});

// Delete Task Event
cardContainer.addEventListener("click", (event) => {
  tasks.deleteTaskHtml(event);
  tasks.deleteTaskObject(event);
});

// toggle form open and close event
formBtn.addEventListener("click", () => {
  formBtn.classList.toggle("plus-icon-rotate-open");
  form.classList.toggle("display-none");
  formContainer.classList.toggle("pb-4");
});

// Load tasks from storage on DOM load
document.addEventListener("DOMContentLoaded", () => {
  tasks.taskList.forEach((task) => {
    tasks.createTaskHtml(
      task.taskName,
      task.description,
      task.assignedTo,
      task.dueDate,
      task.status,
      task.id
    );
  });
  tasks.checkDueDate();
});

// Change status with slider event
cardContainer.addEventListener("mouseup", (event) => {
  tasks.changeStatusHTML(event);
  tasks.changeStatusObject(event);
});

//Filter tasks events
statusFilter.addEventListener("change", () => {
  tasks.filter();
});
dueDateFilter.addEventListener("change", () => {
  tasks.filter();
});
