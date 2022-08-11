// Copyright (C) 2022 MCSManager <mcsmanager-dev@outlook.com>

import { $t } from "../../../i18n";

export function commandStringToArray(cmd: string) {
  const QUOTES_KEY = "{quotes}";
  let start = 0;
  let len = cmd.length;
  const cmdArray: string[] = [];
  function _analyze() {
    for (let index = start; index < len; index++) {
      const ch = cmd[index];
      if (ch === " ") {
        findSpace(index);
        start++;
        continue;
      }
      if (ch === '"') {
        index = findQuotes(index);
      }
      if (index + 1 >= len) {
        findEnd();
        break;
      }
    }
  }

  function findEnd() {
    return cmdArray.push(cmd.slice(start));
  }

  function findSpace(endPoint: number) {
    if (endPoint != start) {
      const elem = cmd.slice(start, endPoint);
      start = endPoint;
      return cmdArray.push(elem);
    }
  }

  function findQuotes(p: number) {
    for (let index = p + 1; index < len; index++) {
      const ch = cmd[index];
      if (ch === '"') return index;
    }
    throw new Error($t("command.quotes"));
  }

  _analyze();

  if (cmdArray.length == 0) {
    throw new Error($t("command.errLen"));
  }

  for (const index in cmdArray) {
    const element = cmdArray[index];
    // 去掉最外层的双引号
    if (element[0] === '"' && element[element.length - 1] === '"') cmdArray[index] = element.slice(1, element.length - 1);
    // 分号替换回来
    while (cmdArray[index].indexOf(QUOTES_KEY) != -1) cmdArray[index] = cmdArray[index].replace(QUOTES_KEY, '"');
  }

  return cmdArray;
}
