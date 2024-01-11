import {hashString} from "@common/misc/threads";

export const HelperService = {
  makeTask: (op: any, ...args: any[]): any => {
    return {op, args}
  },

  dispatcher: (obj: Record<string, any>) => {
    // @ts-ignore
    return async ({op, args}) => {
      return await obj[op](...args)
    }
  },

  hashString: (string: string): Promise<string> => {
    return hashString(string)
  }
}