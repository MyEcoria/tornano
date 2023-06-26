function showForm() {
    var select = document.getElementById("selectType");
    var instantForm = document.getElementById("instantForm");
    var cycleForm = document.getElementById("cycleForm");

    if (select.value === "instant") {
      instantForm.style.display = "block";
      cycleForm.style.display = "none";
    } else if (select.value === "cycle") {
      instantForm.style.display = "none";
      cycleForm.style.display = "block";
    } else if (select.value === "select") {
      instantForm.style.display = "none";
      cycleForm.style.display = "none";
    }
}