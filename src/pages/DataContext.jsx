import React from "react";

export const DataContext = React.createContext({
  selectedPost: {},
  setSelectedPost: () => { },
  searchPosting: {},
  setSearchPosting: () => { },
  imgPostDraft: null,
  setImgPostDraft: () => { },
  updateImgPostDraft: () => { },
  isPendingUpdated: null, // Thêm giá trị mặc định cho setIsPendingUpdated
  setIsPendingUpdated: () => { }, // Định nghĩa setIsPendingUpdated
});
