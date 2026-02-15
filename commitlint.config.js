const Configuration = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^(?:(?<emoji>\p{Emoji_Presentation}|\p{Extended_Pictographic})\s)?(?<type>init|feat|fix|docs|refactor|test|chore|style|perf|wip)(?:\((?<scope>[^)]+)\))?:\s(?<subject>.+)$/u,
      headerCorrespondence: ["emoji", "type", "scope", "subject"],
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "init",
        "feat",
        "fix",
        "docs",
        "refactor",
        "test",
        "chore",
        "style",
        "perf",
        "wip",
      ],
    ],
  },
  "subject-case": [0],
  "body-empty": [0],
};

export default Configuration;
