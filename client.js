import { debounce } from "./debounce.js"
import { changeUserLayout } from "./changeUserLayout.js";
import {validateForm} from "./validation.js"
import dataService from './dataService.js';

const state = {
  sortBy: "newFirst",
  searchTerm: "",
  filterBy: "all",
  userId: "",
  isSuperUser: false
};



// once document loaded and before styling load
document.addEventListener("DOMContentLoaded", () => {
  const videoRequestElm = document.getElementById("sendVideoRequested");
  const sortElms = document.querySelectorAll("[id*=sort_by_]");
  const searchBy = document.getElementById("video_search");
  const filterByElms = document.querySelectorAll("[id*=filter_by_]");

  changeUserLayout(state);

  sortElms.forEach((items) => {
    items.addEventListener("click", function (e) {
      e.preventDefault();
      state.sortBy = this.querySelector("input").value;
      dataService.loadAllVidReqs(state);
      this.classList.add("active");
      if (state.sortBy === "topVotedFirst") {
        document.getElementById("sort_by_new").classList.remove("active");
      } else {
        document.getElementById("sort_by_top").classList.remove("active");
      }
    });
  });


  filterByElms.forEach((items) => {
    items.addEventListener("click", function (e) {
      e.preventDefault();
      items.classList.remove("active")
      this.classList.add("active");
      state.filterBy = this.querySelector("input").value; 
      dataService.loadAllVidReqs(state);
    });
  });

  searchBy.addEventListener(
    "input",
    debounce((e) => {
      state.searchTerm = e.target.value;
      dataService.loadAllVidReqs(state);
    }, 1500)
  );

  videoRequestElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestElm);
    formData.append("author_id", state.userId);

    // check validation
    const isValid = validateForm(formData);
    if (!isValid) return;
    dataService.addNewVideo(formData , state)
  });

  const loginUserElm = document.getElementById("loginUser");

  loginUserElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(loginUserElm);
    dataService.login(formData, state);
  });
});
