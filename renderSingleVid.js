const videoListElm = document.getElementById("listOfRequests");
import { applyVoteStyle } from "./applyVoteStyle.js";
import dataService from "./dataService.js";

function getAdminView(id, status) {
  return `
  <div class="card-header d-flex justify-content-between">
          <select id="admin_change_status_${id}">
            <option value="new">new</option>
            <option value="planned">planned</option>
            <option value="done">done</option>
          </select>
          <div class="input-group ml-2 mr-5 ${
            status !== "done" ? "d-none" : ""
          }" id="admin_video_res_container_${id}">
            <input type="text" class="form-control"
              id="admin_video_res_${id}" 
              placeholder="paste here youtube video id">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" 
                id="admin_save_video_res_${id}"
                type="button">Save</button>
            </div>
          </div>
          <button id="admin_delete_video_req_${id}" class='btn btn-danger'>delete</button>
        </div>
         `;
}

function initAdminControls(id, status, videoRef) {
  const adminChangeStatusElm = document.getElementById(
    `admin_change_status_${id}`
  );
  const adminVideoResElm = document.getElementById(`admin_video_res_${id}`);
  const adminVideoResContainer = document.getElementById(
    `admin_video_res_container_${id}`
  );
  const adminSaveVideoResElm = document.getElementById(
    `admin_save_video_res_${id}`
  );
  const adminDeleteVideoReqElm = document.getElementById(
    `admin_delete_video_req_${id}`
  );

  adminChangeStatusElm.value = status;
  adminVideoResElm.value = videoRef.link;

  adminChangeStatusElm.addEventListener("change", (e) => {
    if (e.target.value === "done") {
      adminVideoResContainer.classList.remove("d-none");
    } else {
      dataService.updateVideoStatus(id, e.target.value);
    }
  });

  adminSaveVideoResElm.addEventListener("click", (e) => {
    e.preventDefault();
    if (adminVideoResElm.value) {
      dataService.updateVideoStatus(id, "done", adminVideoResElm.value);
    } else {
      adminVideoResElm.classList.add("is-invalid");
      adminVideoResElm.addEventListener("input", () =>
        adminVideoResElm.classList.remove("is-invalid")
      );
      return;
    }
  });

  adminDeleteVideoReqElm.addEventListener("click", (e) => {
    dataService.deleteVideoReq(id);
  });
}

function initVoteControls(id, status, state) {
  const votesElms = document.querySelectorAll(`[id^="vote-"][id$="-${id}"]`);
  votesElms.forEach((item) => {
    if (state.isSuperUser || item.status == "done") {
      return;
    }
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const [, vote_type, id] = e.target.getAttribute("id").split("-");
      dataService.updateVotes(vote_type, id, status, state);
    });
  });
}
export function renderSingleVidReq(videoInfo, state, isPrepend = false) {
  const videoReqContainer = document.createElement("div");
  const {
    _id: id,
    votes,
    status,
    topic_details: details,
    author_name: author,
    topic_title: title,
    expected_result: expected,
    video_ref: videoRef,
    submit_date: date,
    target_level: level,
  } = videoInfo;

  const voteScore = votes?.ups.length - votes?.downs.length;
  const isVideoDone = status === "done";
  videoReqContainer.innerHTML = `
        <div class="card mb-3">
        ${state.isSuperUser ? getAdminView(id, status) : ""}
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3>${title}</h3>
              <p class="text-muted mb-2">${details}</p>

              ${
                expected &&
                `
                <p class="mb-0 text-muted">
                <strong>Expected results:</strong> ${expected}
                </p>`
              }
            </div>
            ${
              status === "done"
                ? `<div class="ml-auto mr-3">
              <iframe width="240" height="135"
                src="https://www.youtube.com/embed/${videoRef.link}"
                frameborder="0" allowfullscreen></iframe>
            </div>`
                : ""
            }
            <div class="d-flex flex-column text-center">
              <a class="btn btn-link" id="vote-ups-${id}">🔺</a>
              <h3  id="score-${id}">${voteScore}</h3>
              <a class="btn btn-link"  id="vote-downs-${id}">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${status?.toUpperCase()}</span>
              &bullet; added by <strong>${author}</strong> on
              <strong>${new Date(date).toLocaleDateString()}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${level?.toUpperCase()}
              </div>
            </div>
          </div>
        </div>`;

  if (isPrepend) {
    videoListElm.prepend(videoReqContainer);
  } else {
    videoListElm.append(videoReqContainer);
  }

  initAdminControls(id, status, videoRef);
  applyVoteStyle(id, votes, isVideoDone, state);
  initVoteControls(id, status, state);
  return videoListElm;
}
