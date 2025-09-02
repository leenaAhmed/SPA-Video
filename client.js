import { debounce } from "./debounce.js"
import { changeUserLayout } from "./changeUserLayout.js";
import API from './api.js';
import {validateForm} from "./validation.js"

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
  // const searchParams = new URLSearchParams(paramsString);

  changeUserLayout(state);

  sortElms.forEach((items) => {
    items.addEventListener("click", function (e) {
      e.preventDefault();
      state.sortBy = this.querySelector("input").value;
      console.log(state.sortBy)
      API.loadAllVidReqs(state);
      this.classList.add("active");
      if (state.sortBy == "topVotedFirst") {
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
      API.loadAllVidReqs(state);
    });
  });

  searchBy.addEventListener(
    "input",
    debounce((e) => {
      state.searchTerm = e.target.value;
      API.loadAllVidReqs(state);
    }, 1500)
  );

  videoRequestElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(videoRequestElm);
    formData.append("author_id", state.userId);

    // check validation
    const isValid = validateForm(formData);
    if (!isValid) return;
    API.addNewVideo(formData)
   
  });

  const loginUserElm = document.getElementById("loginUser");

  loginUserElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(loginUserElm);
    API.login(formData , state)
  });
});
