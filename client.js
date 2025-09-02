import { debounce } from "./debounce.js"
import { renderSingleVidReq } from './renderSingleVid.js';
import API from './api.js';
import {validateForm} from "./validation.js"

const baseURL = "http://localhost:7777/video-request";
const supperUserId = "68b46395b7852d09e8b035a7";
const state = {
  sortBy: "newFirst",
  searchTerm: "",
  filterBy: "all",
  userId: "",
  isSuperUser: false
};

function changeUserLayout() {
  const videoRequestContentElm = document.querySelector(".app-content");
  const userFormLoginElm = document.querySelector(".form-login");
  const mainUserContentElm = document.querySelector(".normal-user-content");
  state.userId = localStorage.getItem("current-user");
    
  if (state.userId) {
    API.loadAllVidReqs(state);
    videoRequestContentElm.classList.remove("d-none");
    userFormLoginElm.classList.add("d-none");
    if (state.userId == supperUserId) {
      state.isSuperUser = true;
      mainUserContentElm.classList.add("d-none");
    }
  }
}

// once document loaded and before styling load
document.addEventListener("DOMContentLoaded", () => {
  const videoRequestElm = document.getElementById("sendVideoRequested");
  const sortElms = document.querySelectorAll("[id*=sort_by_]");
  const searchBy = document.getElementById("video_search");
  const filterByElms = document.querySelectorAll("[id*=filter_by_]");
  // const searchParams = new URLSearchParams(paramsString);

  changeUserLayout();

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

    fetch(baseURL, {
      method: "POST",
      body: formData
    })
      .then((blob) => blob.json())
      .then((data) => {
        renderSingleVidReq(data, state,true);
      });
  });

  const loginUserElm = document.getElementById("loginUser");

  loginUserElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(loginUserElm);

    fetch("http://localhost:7777/users/login", {
      method: "POST",
      body: formData
    })
      .then((blob) => blob.json())
      .then((data) => {
        state.userId = data._id;
        localStorage.setItem("current-user", data._id);
        changeUserLayout();
      });
  });
});
