const nameScreen = document.getElementById("nameScreen");
const appScreen = document.getElementById("appScreen");
const nameInput = document.getElementById("nameInput");
const startButton = document.getElementById("startButton");
const changeNameButton = document.getElementById("changeNameButton");
const welcomeText = document.getElementById("welcomeText");
const displayName = document.getElementById("displayName");
const nameError = document.getElementById("nameError");

const periodDate = document.getElementById("periodDate");
const cycleLength = document.getElementById("cycleLength");
const saveButton = document.getElementById("saveButton");
const saveMessage = document.getElementById("saveMessage");
const displayDate = document.getElementById("displayDate");
const nextPeriod = document.getElementById("nextPeriod");

const NAME_KEY = "periodCareName";
const DATA_KEY = "periodCareData";

function showApp(name) {
  nameScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  welcomeText.textContent = `สวัสดี, ${name}`;
  displayName.textContent = name;
}

function showNameScreen() {
  appScreen.classList.add("hidden");
  nameScreen.classList.remove("hidden");
  nameInput.focus();
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function calculateNextPeriod(dateString, cycle) {
  if (!dateString || !cycle) return "-";

  const date = new Date(dateString + "T00:00:00");
  date.setDate(date.getDate() + Number(cycle));

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function loadData() {
  const savedData = localStorage.getItem(DATA_KEY);

  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);

    periodDate.value = data.periodDate || "";
    cycleLength.value = data.cycleLength || 28;

    displayDate.textContent = formatDate(data.periodDate);
    nextPeriod.textContent = calculateNextPeriod(
      data.periodDate,
      data.cycleLength
    );
  } catch (error) {
    console.error("ไม่สามารถอ่านข้อมูลได้", error);
  }
}

startButton.addEventListener("click", () => {
  const name = nameInput.value.trim();

  if (!name) {
    nameError.textContent = "กรุณาใส่ชื่อก่อนเริ่มใช้งาน";
    return;
  }

  localStorage.setItem(NAME_KEY, name);
  nameError.textContent = "";
  showApp(name);
  loadData();
});

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    startButton.click();
  }
});

changeNameButton.addEventListener("click", () => {
  const currentName = localStorage.getItem(NAME_KEY) || "";
  nameInput.value = currentName;
  showNameScreen();
});

saveButton.addEventListener("click", () => {
  const date = periodDate.value;
  const cycle = Number(cycleLength.value);

  if (!date) {
    saveMessage.textContent = "กรุณาเลือกวันแรกของประจำเดือน";
    return;
  }

  if (!cycle || cycle < 1 || cycle > 60) {
    saveMessage.textContent = "กรุณาใส่ความยาวรอบประจำเดือน 1–60 วัน";
    return;
  }

  const data = {
    periodDate: date,
    cycleLength: cycle
  };

  localStorage.setItem(DATA_KEY, JSON.stringify(data));

  displayDate.textContent = formatDate(date);
  nextPeriod.textContent = calculateNextPeriod(date, cycle);
  saveMessage.textContent = "บันทึกข้อมูลเรียบร้อยแล้ว";
});

window.addEventListener("DOMContentLoaded", () => {
  const savedName = localStorage.getItem(NAME_KEY);

  if (savedName) {
    showApp(savedName);
    loadData();
  } else {
    showNameScreen();
  }
});
