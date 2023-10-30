import { YOUTUBE_VIDEO_ID_MATCHER_REGEX } from '../constants';
export const getYouTubeVideoId = (url: string) => {
  const ytRegex = YOUTUBE_VIDEO_ID_MATCHER_REGEX;

  const matchSet = url.match(ytRegex);
  if (matchSet && matchSet.length === 2) {
    return matchSet[1];
  }
};
