import cuid from 'cuid'
import { useState } from 'react'
import { randomDate } from '../utils/randomDate'
import { faker } from '@faker-js/faker'

interface UserProps {
  id: string
  username: string
  password: string
  profile_image: string
  joined_date: Date
}

export const useUserGenerator = () => {
  const [userinfo, setUserinfo] = useState<UserProps | null>(null)

  const generate = () => {
    const user: UserProps = {
      // HACK gen uid from frontend (Pat)
      id: `user${cuid()}`,
      // TODO sanitize username (Pat)
      // NOTE ASSUMTION: derived username password sanitization constraint
      // from faker-js lib (Pat)
      // username : https://github.com/faker-js/faker/blob/3c108b4bcfab73c3eaee856758271fd09da4a988/src/modules/internet/index.ts#L129
      // password :
      username: faker.internet.userName(),
      // COMBAK secret management
      password: faker.random.alphaNumeric(10),
      // NOTE ASSUMTION fixed domain and path e.g. static path up to
      // here "https://api.lorem.space/image/face" for sanitization this should
      // be store in the DB for dynamism (Pat)
      // TODO Store only hash in the DB
      profile_image: `https://api.lorem.space/image/face?w=150&h=150&hash=${faker.random.alphaNumeric(
        8
      )}`,
      // HACK gen date from frontend (Pat)
      joined_date: randomDate(new Date(2019, 0, 1), new Date()),
    }

    setUserinfo(user)
  }

  return {
    generate,
    userinfo,
  }
}
