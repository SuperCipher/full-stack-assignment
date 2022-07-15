## Role play assumption
We are an early stage crypto startup company consisting of 10 people.
Our strategy is not to out source our development for deeper quality control.
We have a strong emphasis on Agile, Safety and Factorial growth

## Repo goal
Backend service for user signup.
Scalable both vertically and horizontally since we want Factorial growth.
We will trade optimization for maximum flexibility since our startup is still young and we don't know how many pivot waiting for us in the future.
We want to scale our company as quickly as possible so the repo have to be at the state of art ready to change and deploy fearlessly by anyone we just onboard.
Since this service might effect the integrity of our financial system we want to be as secure as possible.

## Non goal
Authentication
Cross cloud provider migratable
Locally dev
Formal specification
Centralize secret management integration

## Get Started

### Installation:

```
yarn
```

### To Start Server:

#### Development

```
yarn dev
```

### TODO
- [ ] https
- [ ] paginate multi read?
- [x] secret management service for password ()
- [ ] add .node-version
- [ ] If not serverless then dockerize maybe?
- [ ] Maybe Gitpod?
- [ ] open API
- [ ] more readme
- [ ] Diagram
- [ ] Schema
- [ ] Cache
- [ ] API gateway config?
- [ ] GitOp (IaC CI/CD)
- [ ] CI/CD
- [ ] Linter?
- [ ] Commit hook check
  - [ ] Branch Name
  - [ ] Commit Convention
- [ ] Test
- [ ] Deploy

### Dgraph GraphQL Schema

type User @secret(field: "password") {
  id: ID!
  username: String! @id @search(by: [hash])
  profile_image_hash: String! @id @search(by: [hash])
  joined_date: DateTime! @search
	# TODO @hasInverse https://dgraph.io/docs/graphql/schema/graph-links  
  thirdParty: ImageObjectStorage!
}

type ImageObjectStorage {
	# can't use list here Dgraph don't support ordered list
  domain: String! @search(by: [fulltext])
  path: String! @search(by: [fulltext])
}

To Visit App: `http://localhost:3000`
