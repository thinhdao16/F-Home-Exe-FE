import React from "react";

export const DataContext = React.createContext({
    selectedPost: {},
    setSelectedPost: () => {},
    searchPosting: {},
    setSearchPosting: () => {},
    imgPostDraft: null,
    setImgPostDraft: () => {},
    updateImgPostDraft: () => {},
  });
  