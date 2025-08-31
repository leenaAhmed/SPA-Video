const baseURL = "http://localhost:7777/video-request";
const videoListElm = document.getElementById("listOfRequests");
const supperUserId = "68b46395b7852d09e8b035a7";
const state = {
  sortBy: "newFirst",
  searchTerm: "",
  filterBy: "all",
  userId: "",
  isSuperUser: false
};

function applyVoteStyle(videoId, videoList,isDisapled, voteType) {
  if (!voteType) {
    if (videoList.ups.includes(state.userId)) {
      voteType = "ups";
    } else if (videoList.downs.includes(state.userId)) {
      voteType = "downs";
    } else {
      return;
    }
  }

  const voteUpsElm = document.getElementById(`vote-ups-${videoId}`);
  const voteDownElm = document.getElementById(`vote-downs-${videoId}`);

  if (isDisapled) {
    voteUpsElm.style.opacity = 0.5;
    voteUpsElm.style.cursor = "not-allowed";
    voteDownElm.style.opacity = 0.5;
    voteDownElm.style.cursor = "not-allowed";
    return
  }

  const voteUpsDirElm = voteType === "ups" ? voteUpsElm : voteDownElm;
  const voteDownsDirElm = voteType === "ups" ? voteDownElm : voteUpsElm;

  if (videoList[voteType].includes(state.userId)) {
    voteUpsDirElm.style.opacity = 1;
    voteDownsDirElm.style.opacity = 0.5;
  } else {
    voteDownsDirElm.style.opacity = 1;
  }
}

function updateVideoStatus(id, status, resVideo) {
  fetch(baseURL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, resVideo })
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.reload()
    });
}

function renderSingleVidReq(videoInfo, isPrepend = false) {
  const videoReqContainer = document.createElement("div");
  const { _id, votes, status } = videoInfo;
  videoReqContainer.innerHTML = `
        <div class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <select id="admin_change_status_${_id}">
            <option value="new">new</option>
            <option value="planned">planned</option>
            <option value="done">done</option>
          </select>
          <div class="input-group ml-2 mr-5 ${
            status !== "done" ? "d-none" : ""
          }" id="admin_video_res_container_${_id}">
            <input type="text" class="form-control"
              id="admin_video_res_${_id}" 
              placeholder="paste here youtube video id">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" 
                id="admin_save_video_res_${_id}"
                type="button">Save</button>
            </div>
          </div>
          <button id="admin_delete_video_req_${_id}" class='btn btn-danger'>delete</button>
        </div>
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${videoInfo.topic_title}</h3>
              <p class="text-muted mb-2">${videoInfo.topic_details}</p>

              ${
                videoInfo.expected_result &&
                `<p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${videoInfo.expected_result}
                </p>`
              }
            
            </div>
            ${
              status === 'done'
                ? `<div class="ml-auto mr-3">
              <iframe width="240" height="135"
                src="https://www.youtube.com/embed/${videoInfo.video_ref.link}"
                frameborder="0" allowfullscreen></iframe>
            </div>`
                : ''
            }
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link" id="vote-ups-${_id}">🔺</a>
              <h3  id="score-${_id}">${
    votes?.ups.length - votes?.downs.length
  }</h3>
              <a class="btn btn-link"  id="vote-downs-${_id}">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${videoInfo.status?.toUpperCase()}</span>
              &bullet; added by <strong>${videoInfo.author_name}</strong> on
              <strong>${new Date(
                videoInfo.submit_date
              ).toLocaleDateString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${videoInfo.target_level}
              </div>
            </div>
          </div>
        </div>`;

  if (isPrepend) {
    videoListElm.prepend(videoReqContainer);
  } else {
    videoListElm.append(videoReqContainer);
  }

  const adminChangeStatusElm = document.getElementById(
    `admin_change_status_${_id}`
  );
  const adminVideoResElm = document.getElementById(`admin_video_res_${_id}`);
  const adminVideoResContainer = document.getElementById(
    `admin_video_res_container_${_id}`
  );
  const adminSaveVideoResElm = document.getElementById(
    `admin_save_video_res_${_id}`
  );
  const adminDeleteVideoReqElm = document.getElementById(
    `admin_delete_video_req_${_id}`
  );

  adminChangeStatusElm.value = videoInfo.status;
  adminVideoResElm.value = videoInfo.video_ref.link;

  adminChangeStatusElm.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value === "done") {
      adminVideoResContainer.classList.remove("d-none");
    } else {
      updateVideoStatus(_id, e.target.value)
    }
  });

  adminSaveVideoResElm.addEventListener("click", (e) => {
    e.preventDefault();
    if (adminVideoResElm.value) {
      updateVideoStatus(_id, 'done' ,adminVideoResElm.value)
    } else {
      adminVideoResElm.classList.add("is-invalid");
      adminVideoResElm.addEventListener("input", () =>
        adminVideoResElm.classList.remove("is-invalid")
      );
      return;
    }
  });

  adminDeleteVideoReqElm.addEventListener('click', (e) => {
    fetch(baseURL, {
      method: "DELETE",
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ id: videoInfo._id }),
    }).then(()=> window.location.reload())
  })

  const voteScoreElm = document.getElementById(`score-${videoInfo._id}`);

  const votesElms = document.querySelectorAll(
    `[id^="vote-"][id$="-${videoInfo._id}"]`
  );


  if (!state.isSuperUser) {
      document.querySelectorAll(".card-header").forEach(item => {
        item.classList.remove('d-flex');
        item.classList.add("d-none")
    })
  }

  votesElms.forEach((item) => {
    if (state.isSuperUser || item.status == "done") {
      return
    }
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const [, vote_type, id] = e.target.getAttribute("id").split("-");
      fetch(`${baseURL}/vote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          vote_type: vote_type,
          user_id: state.userId
        })
      })
        .then((blob) => blob.json())
        .then((res) => {
          voteScoreElm.innerText = res.ups.length - res.downs.length;
          applyVoteStyle(id, res, item.status == "done" ,vote_type);
        });
    });
  });

  return videoListElm;
}

function loadAllVidReqs(
  sortBy = "newFirst",
  searchTerm = "",
  filterBy = "all"
) {
  fetch(
    `${baseURL}?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`
  )
    .then((res) => res.json())
    .then((videoReq) => {
      videoListElm.innerHTML = "";
      videoReq.forEach((videoItem) => {
        renderSingleVidReq(videoItem);
        applyVoteStyle(videoItem._id, videoItem.votes , videoItem.status == "done");
      });
    });
}

function debounce(func, time) {
  let timer;

  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), time);
  };
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm(formData) {
  const topicTitle = formData.get("topic_title").trim();
  const topicDetails = formData.get("topic_details").trim();

  if (!topicTitle || topicTitle.length > 20) {
    document.querySelector("[name=topic_title]").classList.add("is-invalid");
  }
  if (!topicDetails) {
    document.querySelector("[name=topic_details]").classList.add("is-invalid");
  }

  const formValidity = document
    .getElementById("sendVideoRequested")
    .querySelectorAll(".is-invalid");
  if (formValidity.length) {
    formValidity.forEach((elm) => {
      elm.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });
    return false;
  }
  return true;
}

function loginFormVaildation(formData) {
  const authorName = formData.get("author_name").trim();
  const authorEmail = formData.get("author_email").trim();

  if (!authorName) {
    document.querySelector("[name=author_name]").classList.add("is-invalid");
  }
  if (!authorEmail || !validateEmail(authorEmail)) {
    document.querySelector("[name=author_email]").classList.add("is-invalid");
  }

  const loginFormValidity = document
    .getElementById("loginUser")
    .querySelectorAll(".is-invalid");
  if (loginFormValidity.length) {
    loginFormValidity.forEach((elm) => {
      elm.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });
    return false;
  }
  return true;
}

function changeUserLayout() {
  const videoRequestContentElm = document.querySelector(".app-content");
  const userFormLoginElm = document.querySelector(".form-login");
  const mainUserContentElm = document.querySelector(".normal-user-content");
  state.userId = localStorage.getItem("current-user");
    
  if (state.userId) {
    loadAllVidReqs(state.sortBy, state.searchTerm, state.filterBy);
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
      loadAllVidReqs(state.sortBy, state.searchTerm , state.filterBy);
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
      loadAllVidReqs(state.sortBy, state.searchTerm , state.filterBy);
    });
  });

  searchBy.addEventListener(
    "input",
    debounce((e) => {
      state.searchTerm = e.target.value;
      loadAllVidReqs(state.sortBy, state.searchTerm , state.filterBy);
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
        renderSingleVidReq(data, true);
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
