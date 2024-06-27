import React from "react";

const loadReducer = (state, action) => {
  switch (action.type) {
    case "setLoad":
      return { ...state, load: false };
  }
};

export default loadReducer;
