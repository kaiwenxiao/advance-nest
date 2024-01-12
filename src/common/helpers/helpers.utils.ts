import {hashString} from "@common/misc/threads";
import {User} from "@entities";
import {pick} from "helper-fns";
import {IAuthenticationPayload} from "@common/interfaces/authentication.interface";

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

  // build response for login
  buildPayloadResponse: (
    user: User,
    accessToken: string,
    refreshToken?: string
  ): IAuthenticationPayload => {
    return {
      user: {
        ...pick(user, ['id', 'idx'])
      },
      payload: {
        access_token: accessToken,
        ...(refreshToken ? {refresh_token: refreshToken} : {})
      }
    }
  },

  hashString: (string: string): Promise<string> => {
    return hashString(string)
  }
}