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

async function fetchGraphQL(operationsDoc: any, operationName: any, variables: any) {
  const result = await fetch(
    "https://green-feather-500032.ap-south-1.aws.cloud.dgraph.io/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzL3Byb3h5IiwiZHVpZCI6IjB4M2NhMmI5YyIsImV4cCI6MTY1ODA1MDYwNiwiaXNzIjoicy9hcGkifQ.8zgxEzFduQmyw3C2hI9Te3gId3Ki5HybfmmzzXQqSdo"
      },
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName
      })
    }
  );

  return await result.json();
}



export const useUserGenerator = () => {
  const [userinfo, setUserinfo] = useState<UserProps | null>(null)
  const profile_image_hash = faker.random.alphaNumeric(8)
  let operationsDoc = ""
  const generate = () => {
    const user: UserProps = {
      // HACK gen uid from frontend (Pat)
      // NOTE We will gen this on the backend and will not follow this format
      // for optimization purposes (Pat)
      id: `user${cuid()}`,
      // TODO sanitize username (Pat)
      // NOTE ASSUMTION: derived username password sanitization constraint
      // from faker-js lib (Pat)
      // username : https://github.com/faker-js/faker/blob/3c108b4bcfab73c3eaee856758271fd09da4a988/src/modules/internet/index.ts#L129
      // password : https://github.com/faker-js/faker/blob/3c108b4bcfab73c3eaee856758271fd09da4a988/src/modules/random/index.ts#L320
      username: faker.internet.userName(),
      // COMBAK secret management
      password: faker.random.alphaNumeric(10),
      // NOTE ASSUMTION fixed domain and path e.g. static path up to
      // here "https://api.lorem.space/image/face" for sanitization this should
      // be store in the DB for dynamism (Pat)
      // TODO Store only hash in the DB
      // HACK This data should not be from frontend (Pat)
      profile_image: `https://api.lorem.space/image/face?w=150&h=150&hash=${profile_image_hash}`,
      // HACK gen date from frontend (Pat)
      // NOTE new Date(1546275600000) // Date Tue Jan 01 2019 00:00:00 GMT+0700 (Indochina Time)
      // temp0.valueOf() // 1546275600000 store as posix
      // NOTE We will gen this on the backend (Pat)
      joined_date: randomDate(new Date(2019, 0, 1), new Date()),

    }
    // HACK joined_date require by dgraph generated graphql just add any date
    // to fulfilled schemas required fields, the backend will generate the
    // correct date eventually.
    operationsDoc = `
      mutation CustomMutation {
        newUser(username: "${user.username}", profile_image_hash: "${profile_image_hash}", password: "${user.password}")
      }
      query MyQuery {
        queryUser(first: 10) {
          id
          username
        }
      }
    `;

    function fetchMyQuery() {
      return fetchGraphQL(
        operationsDoc,
        "MyQuery",
        {}
      );
    }

    async function startFetchMyQuery() {
      const { errors, data } = await fetchMyQuery();

      if (errors) {
        // handle those errors like a pro
        console.error(JSON.stringify(errors));
      }

      // do something great with this precious data
      console.log(data);
    }


    function executeCustomMutation() {
      return fetchGraphQL(
        operationsDoc,
        "CustomMutation",
        {}
      );
    }

    async function startExecuteCustomMutation() {
      // TODO: try catch
      const { errors, data } = await executeCustomMutation();

      if (errors) {
        // handle those errors like a pro
        console.error(errors);
      }

      // do something great with this precious data
      console.log(data);
    }

    startExecuteCustomMutation();

    startFetchMyQuery();

    setUserinfo(user)
  }

  return {
    generate,
    userinfo,
  }
}
