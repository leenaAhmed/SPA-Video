export function applyVoteStyle(videoId, videoList, isDisapled, state, voteType) {
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