const Regex = {
  alphanumeric: {
    exp: /^[a-zA-Z0-9_-]+$/,
    msg: "must contain only alphanumeric characters, dashes, or underscores",
  },
};

export const { alphanumeric } = Regex;
