
const videoListElm = document.getElementById("listOfRequests");
import { applyVoteStyle } from "./applyVoteStyle.js"
import API from './api.js';
const baseURL = "http://localhost:7777/video-request";

export function renderSingleVidReq(videoInfo, state, isPrepend = false) {
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
     API.updateVideoStatus(_id, e.target.value)
    }
  });

  adminSaveVideoResElm.addEventListener("click", (e) => {
    e.preventDefault();
    if (adminVideoResElm.value) {
      API.updateVideoStatus(_id, 'done' ,adminVideoResElm.value)
    } else {
      adminVideoResElm.classList.add("is-invalid");
      adminVideoResElm.addEventListener("input", () =>
        adminVideoResElm.classList.remove("is-invalid")
      );
      return;
    }
  });

  adminDeleteVideoReqElm.addEventListener('click', (e) => {
    API.deleteVideoReq(videoInfo._id)
  })


  const votesElms = document.querySelectorAll(
    `[id^="vote-"][id$="-${videoInfo._id}"]`
  );


  if (!state.isSuperUser) {
      document.querySelectorAll(".card-header").forEach(item => {
        item.classList.remove('d-flex');
        item.classList.add("d-none")
    })
 }
    
  applyVoteStyle(_id, votes, status == "done", state);
 
  
  votesElms.forEach((item) => {
    if (state.isSuperUser || item.status == "done") {
      return
    }
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const [, vote_type, id] = e.target.getAttribute("id").split("-");
      API.updateVideoVotes(vote_type,id, status,state)
    });
  });
  
  return videoListElm;
}