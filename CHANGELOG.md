## Unreleased ([3707718..a094090](https://github.com/AssiarDev/match-master/compare/3707718..a094090))
#### Documentation
- update readme - ([3f6594c](https://github.com/AssiarDev/match-master/commit/3f6594c628f3faffdb28055aa27999ddb94a5a9a)) - AssiarDev
- add swagger ui for match master api - ([5b72171](https://github.com/AssiarDev/match-master/commit/5b72171222390cf436312c5df7b804eccbdf1632)) - AssiarDev
- add openapi.yaml for match master api - ([64efe65](https://github.com/AssiarDev/match-master/commit/64efe65e466c4188bca29cf17e53ecb0c29968cd)) - AssiarDev
- add js doc on the services - ([42c53e7](https://github.com/AssiarDev/match-master/commit/42c53e76ca75eae1a4dfd8c75655bb50855d0ca2)) - AssiarDev
- add .env.example - ([e7626e5](https://github.com/AssiarDev/match-master/commit/e7626e514e5daf6d0bc4ae74e39108bbb89bb49d)) - AssiarDev
#### Features
- extend favorite controller with leagues - ([d60694e](https://github.com/AssiarDev/match-master/commit/d60694e36bde20ab73d3ebbd4b704bc41d6976cf)) - AssiarDev
- add leagueDBRepository to constructor - ([1d2aab8](https://github.com/AssiarDev/match-master/commit/1d2aab8eb4cdfe57808b98da11c4c8c8366eabaa)) - AssiarDev
- extend favoriteService to support league favorites - ([e8ffcbd](https://github.com/AssiarDev/match-master/commit/e8ffcbd79bd8a202d07fb2221a8aba6f485a6277)) - AssiarDev
- extend userFavoriteRepository to support league favorites - ([0241d49](https://github.com/AssiarDev/match-master/commit/0241d49eb0bd80c43601ecbbeceacda3c21c35e5)) - AssiarDev
- added constraint rules for password - ([88d7e04](https://github.com/AssiarDev/match-master/commit/88d7e045424a7ec84ef4945b8b523962b77b1cf2)) - AssiarDev
- add tests for all services - ([d37514e](https://github.com/AssiarDev/match-master/commit/d37514ef7e50e143ebc6a3509a92876759b60ef3)) - AssiarDev
- add template for PR - ([96434bd](https://github.com/AssiarDev/match-master/commit/96434bd7e47fc152399d3d6b7c4b5e74603e48e3)) - AssiarDev
- add ServiceResult types, type all function signatures, fix login bug - ([ab72214](https://github.com/AssiarDev/match-master/commit/ab722142a69cb40ec88d49dbaa872270360c8491)) - florent.cruble
- add typed interfaces and remove any casts - ([2ca1b43](https://github.com/AssiarDev/match-master/commit/2ca1b43ae144be046f3abd21d079c65fa1f2b747)) - florent.cruble
- migrate server codebase from JavaScript to TypeScript 6.0 - ([1a2d20a](https://github.com/AssiarDev/match-master/commit/1a2d20a2444f1cd2a9a826733d275719d75bc0cd)) - florent.cruble
- test CI detection - ([42d3414](https://github.com/AssiarDev/match-master/commit/42d34145c6f9d0c295886fbae6d21a3162d1abbd)) - AssiarDev
- add unit test for favorite service - ([9763496](https://github.com/AssiarDev/match-master/commit/9763496cde75a5f03335d810b0e924204b3a3513)) - AssiarDev
- install jest - ([40c1e0c](https://github.com/AssiarDev/match-master/commit/40c1e0c33f5b99ecf9566e637c4abf671e14a462)) - AssiarDev
- add repository pattern for scorers, standings - ([37a53b5](https://github.com/AssiarDev/match-master/commit/37a53b50e9c7521d1dc24d4df7271f5bb6193546)) - AssiarDev
- add repository architecture for league, season and teams - ([56b0f92](https://github.com/AssiarDev/match-master/commit/56b0f9257e3f3e2ace4182c1b5b7e55f4ec2c40e)) - AssiarDev
- define a new architecture for the favorites with repository pattern - ([9cedbad](https://github.com/AssiarDev/match-master/commit/9cedbad26d02ba6742d3a4a6e445a075e5fb7594)) - AssiarDev
- define a new architecture with repository pattern - ([c0942a4](https://github.com/AssiarDev/match-master/commit/c0942a4c1bc27621ba70d29d639e693d1a3066d1)) - AssiarDev
#### Bug Fixes
- resolve failed ci - ([f037f72](https://github.com/AssiarDev/match-master/commit/f037f72f2eb38d7728785f82a7b848d784846a28)) - AssiarDev
- add cascade delete on user favorite - ([1924020](https://github.com/AssiarDev/match-master/commit/192402053e89f2f5dae66e76e5353f3ac063a500)) - AssiarDev
- update package.json to deploy on render - ([b53bc52](https://github.com/AssiarDev/match-master/commit/b53bc522fefac9b465a5991ded5ced13507d21ae)) - AssiarDev
- create preview regex to access cors - ([573aa0d](https://github.com/AssiarDev/match-master/commit/573aa0db916bdcd43dc96c02be50bd2d381d1bbf)) - AssiarDev
- resolved import for argon2 - ([f22c2fc](https://github.com/AssiarDev/match-master/commit/f22c2fc8ae9a4c3e95be81a633cb5536a535d32d)) - AssiarDev
- correct the instantiate service in controllers - ([78c8ea0](https://github.com/AssiarDev/match-master/commit/78c8ea0a5b441c8e97c81ef07b687222029e85b9)) - AssiarDev
- add isNaN guards in matches controllers and explicit return type on teamByLeague - ([167e2f4](https://github.com/AssiarDev/match-master/commit/167e2f41763cb1e849e97de2e2caefa3a5ab7144)) - florent.cruble, Claude Opus 4.6 (1M context)
- filter undefined values from CORS allowedOrigins - ([4bb03b7](https://github.com/AssiarDev/match-master/commit/4bb03b7b7a4809d489d49d8ec080af4ec963589d)) - florent.cruble, Claude Opus 4.6 (1M context)
- use ServiceResult discriminant in deleteUser and updateUser controllers - ([c82e4f6](https://github.com/AssiarDev/match-master/commit/c82e4f6c4eaf4af4aab0478eeb7fb7ff39120ec4)) - florent.cruble, Claude Opus 4.6 (1M context)
- add null guard for league season in standing and scorers services - ([0fd7587](https://github.com/AssiarDev/match-master/commit/0fd7587b74fefe4096bd7bc69636e076b7889fa4)) - florent.cruble, Claude Opus 4.6 (1M context)
- return ServiceError instead of empty array in teamsForLeague - ([2f874a0](https://github.com/AssiarDev/match-master/commit/2f874a01094cfee99f7614f60f37eb8e57c136e7)) - florent.cruble, Claude Opus 4.6 (1M context)
- assert env vars in config.ts and type exports as string - ([8967c1c](https://github.com/AssiarDev/match-master/commit/8967c1c4374f4d9806028be61b217fb8b0bc6a6b)) - florent.cruble, Claude Opus 4.6 (1M context)
- add authentication and ownership check on deleteUser and updateUser - ([342de80](https://github.com/AssiarDev/match-master/commit/342de80853f201b0cb4df6ea58adca2add7952ab)) - florent.cruble, Claude Opus 4.6 (1M context)
- return structured response from register instead of raw boolean - ([fc9b700](https://github.com/AssiarDev/match-master/commit/fc9b700a973bf442dec3794c085cad44bf04e2ed)) - florent.cruble, Claude Opus 4.6 (1M context)
- filter out null teams in getFavorite instead of non-null assertion - ([12842ef](https://github.com/AssiarDev/match-master/commit/12842ef42627fc776b9b43f142b839dc83807e21)) - florent.cruble, Claude Opus 4.6 (1M context)
- use async bcrypt instead of sync to avoid blocking event loop - ([ca363ec](https://github.com/AssiarDev/match-master/commit/ca363ec1ed7a550b4ab5d4bebc3e3a6827d311f4)) - florent.cruble, Claude Opus 4.6 (1M context)
- add URL_API and API_TOKEN to required env vars validation - ([9f2b09a](https://github.com/AssiarDev/match-master/commit/9f2b09a0f818b4295ab9c3a6dfaafa0b74de17a5)) - florent.cruble, Claude Opus 4.6 (1M context)
- use isNaN guard for leagueId validation in standings controller - ([b4acbe3](https://github.com/AssiarDev/match-master/commit/b4acbe3e83ffdacc7ffcf6de29d9180eaa055898)) - florent.cruble, Claude Opus 4.6 (1M context)
- add null guard for league current season instead of non-null assertion - ([7854a67](https://github.com/AssiarDev/match-master/commit/7854a675f64afc6384f0bc27aec75d9f79b23c9c)) - florent.cruble, Claude Opus 4.6 (1M context)
- use import type for ApiResponse and ApiLeague in leagueApi repository - ([60345ac](https://github.com/AssiarDev/match-master/commit/60345acd4cf7d2b5edecd90ae821b22b4a498f1b)) - florent.cruble, Claude Opus 4.6 (1M context)
- use sameSite 'none' in clearCookie to match login cookie options - ([e32eb91](https://github.com/AssiarDev/match-master/commit/e32eb914e77005334330e718ace058e535102b66)) - florent.cruble, Claude Opus 4.6 (1M context)
- use authenticated user id instead of request body in addFavorite - ([aa03c36](https://github.com/AssiarDev/match-master/commit/aa03c361ac636cd4764fb029400813d5bc9b5be2)) - florent.cruble, Claude Opus 4.6 (1M context)
- validate required env vars at startup - ([08c58a2](https://github.com/AssiarDev/match-master/commit/08c58a2454bb9797ba5de02e4f18348406aa17d7)) - florent.cruble, Claude Opus 4.6 (1M context)
- add isNaN guard on clubId in removeFavorite - ([41a2f1d](https://github.com/AssiarDev/match-master/commit/41a2f1d58652552917de22a3f4503912b9fc85fe)) - florent.cruble, Claude Opus 4.6 (1M context)
- remove any[] cast in teamByLeague, use inferred Prisma types - ([7285f43](https://github.com/AssiarDev/match-master/commit/7285f43bfbdec54d67f4949c2742c764d5146273)) - florent.cruble, Claude Opus 4.6 (1M context)
- add username to SessionData and store it on login - ([a2286e4](https://github.com/AssiarDev/match-master/commit/a2286e4321b3d806816a6d9550a96afb5100efeb)) - florent.cruble, Claude Opus 4.6 (1M context)
- constrain ServiceSuccess<T> generic to object to prevent unknown collapse - ([96633cf](https://github.com/AssiarDev/match-master/commit/96633cfe729048d12d420d36f8bdc7783ebead15)) - florent.cruble, Claude Opus 4.6 (1M context)
- register static route /competitions/matches before parameterized /:id/matches - ([38eec16](https://github.com/AssiarDev/match-master/commit/38eec161cb9b9cf74596c09316e69ce8c1faf6ab)) - florent.cruble, Claude Opus 4.6 (1M context)
- remove duplicate express.json() and cookieParser() middleware - ([550161c](https://github.com/AssiarDev/match-master/commit/550161c7c6d6273b46d20d1b75ee33f92f234362)) - florent.cruble, Claude Opus 4.6 (1M context)
- restore Dockerfile COPY order for layer caching - ([e83b655](https://github.com/AssiarDev/match-master/commit/e83b655761878f607cf7490c21336dfbd034e2f3)) - florent.cruble, Claude Opus 4.6 (1M context)
- resolve merge conflicts and configure jest for TypeScript - ([74ac144](https://github.com/AssiarDev/match-master/commit/74ac1448221c447718fb96f89e41843ca58f7c2f)) - florent.cruble, Claude Opus 4.6 (1M context)
- signature typing correction for teamsByLeague - ([58128ea](https://github.com/AssiarDev/match-master/commit/58128ea1cb95a737b0450666035cc49ba187d72f)) - AssiarDev
- CI path - ([c4da058](https://github.com/AssiarDev/match-master/commit/c4da0582f8687496899faa8e6197f7d17bcba59a)) - AssiarDev
- retrieve the teams from the league - ([08687fe](https://github.com/AssiarDev/match-master/commit/08687fec4d7994a6a62ff1105b8cc4781685a6da)) - AssiarDev
- add return to the match by date - ([1a1e43d](https://github.com/AssiarDev/match-master/commit/1a1e43dd19e9daf7fd8f85fae234d9ce7769fcee)) - AssiarDev
- try to resolve cors issue - ([75ff543](https://github.com/AssiarDev/match-master/commit/75ff5431d3fd53da5d7919e55f60b9c8359e643c)) - AssiarDev
- cors option for backend - ([cedaeeb](https://github.com/AssiarDev/match-master/commit/cedaeebb9ce1618343bf37d4a292bfe1c319e2f7)) - AssiarDev
- cors issue for render - ([daa21e1](https://github.com/AssiarDev/match-master/commit/daa21e1ff29e9bec5537bc87c33bc6c33d553b31)) - AssiarDev
- script insert db - ([fe92d28](https://github.com/AssiarDev/match-master/commit/fe92d2822614df28a6ded39980a73de7306cbebb)) - AssiarDev
- display matches by league - ([b305002](https://github.com/AssiarDev/match-master/commit/b305002a6033ce320ebdd0d76335f26f1b3d969e)) - AssiarDev
#### Refactoring
- centralize dependency injection in lib/container.ts - ([78d7795](https://github.com/AssiarDev/match-master/commit/78d7795ecbd5fcd4523560795344da2da80f9d43)) - AssiarDev
- introduce PrismaClient singleton - ([c23c670](https://github.com/AssiarDev/match-master/commit/c23c670236c97f66c003e1e66837ddc90eae1526)) - AssiarDev
- migrate test file to TypeScript with typed mocks - ([8a16c0a](https://github.com/AssiarDev/match-master/commit/8a16c0a28032246f27fe5bc335f17897a833c54d)) - florent.cruble, Claude Opus 4.6 (1M context)
#### Chores
- remove duplicate variable validPassword - ([e7a2000](https://github.com/AssiarDev/match-master/commit/e7a200050a40d9488c552ae26f55b59cc6ca187e)) - AssiarDev
- improve login and update for user workflow - ([ef70c83](https://github.com/AssiarDev/match-master/commit/ef70c832ddb6a2431289102f0f115cc011a599d3)) - AssiarDev
- remove express session - ([b539249](https://github.com/AssiarDev/match-master/commit/b539249a467679c96a12b08edb4c53ea5982bebd)) - AssiarDev
- add createdAt in user payload interface - ([1c9a9f6](https://github.com/AssiarDev/match-master/commit/1c9a9f693401a0289db26dc1cdeeccd7f37f0940)) - AssiarDev
- update the message for delete a user account - ([66ff2c2](https://github.com/AssiarDev/match-master/commit/66ff2c2837ec8705008d28a6751aa212a757e435)) - AssiarDev
- the yml file has been removed because it requirement payments for claude review - ([d600bae](https://github.com/AssiarDev/match-master/commit/d600baea143ffaf6101f3a5ced3cdac25aedb671)) - AssiarDev
- fix yml fichier for use claude caude for review - ([40e8772](https://github.com/AssiarDev/match-master/commit/40e8772a2dfc16ce65b3af0ea5ef237e444812a6)) - AssiarDev
- review by claude for pr - ([20284fb](https://github.com/AssiarDev/match-master/commit/20284fbb0c3b3ecf1efbc4a1d9c0ac55d4d2b1c9)) - AssiarDev
- add Claude PR review workflow - ([72440d6](https://github.com/AssiarDev/match-master/commit/72440d60b72014890e47d68eb1f8909cdc169a3b)) - AssiarDev
- remove bcrypt for use argon2 - ([25c3c85](https://github.com/AssiarDev/match-master/commit/25c3c8522762bfe7be0836f8b7f6a1e45dc341f2)) - AssiarDev
- update node version for github action - ([085051a](https://github.com/AssiarDev/match-master/commit/085051aebc1ddf697e6e8166dbc62bd5d86eb839)) - AssiarDev
- added interfaces for class service and repository - ([3950f89](https://github.com/AssiarDev/match-master/commit/3950f89aca57b2447e2b581c9b8d262d70b2760d)) - AssiarDev
- resolution of test problem detection - ([56b69ad](https://github.com/AssiarDev/match-master/commit/56b69adb481fa38367c68649ce7c6259ff7fe63b)) - AssiarDev
- remove .idea/ from tracking and add to .gitignore - ([fd0378b](https://github.com/AssiarDev/match-master/commit/fd0378babd5ce08eed63d31632dce0178427fe49)) - florent.cruble, Claude Opus 4.6 (1M context)
- update dockerfile and package.json to use npx - ([2948388](https://github.com/AssiarDev/match-master/commit/2948388864a5aa3e68f67df4100a6906ed62788f)) - AssiarDev
- initialization service in th favorite controller - ([f93d32e](https://github.com/AssiarDev/match-master/commit/f93d32ecb8fcdd3e342d4fcac4b3b4145dfb1abe)) - AssiarDev
- remove unused dead code - ([1f29605](https://github.com/AssiarDev/match-master/commit/1f29605ed9192dff0975f6026269594a834810db)) - AssiarDev
- add repository architecture for teams - ([7f2c843](https://github.com/AssiarDev/match-master/commit/7f2c843946141af175207f583b4defe03bc830a3)) - AssiarDev
- remove unused files - ([f526477](https://github.com/AssiarDev/match-master/commit/f5264771e1f66dc7dd84f6ebc6e4e1fb33219f7c)) - AssiarDev
- resolve thread issue of the PR - ([709da5a](https://github.com/AssiarDev/match-master/commit/709da5af7d767b5d2b893a7d320e85a6e372e879)) - AssiarDev
- correcting the competitionId routes by retrieving them from the database - ([dbf1cbd](https://github.com/AssiarDev/match-master/commit/dbf1cbd96cf04fafde0b7fad70f8a17614d35a11)) - AssiarDev


- - -
## [0.2.4](https://github.com/AssiarDev/match-master/compare/3f162c68330b3fb97ec8684a5b25449c261593f8..0.2.4) - 2026-06-28
#### Bug Fixes
- **(sse)** disable proxy buffering and flush headers for real-time delivery - ([7d1f589](https://github.com/AssiarDev/match-master/commit/7d1f5896bf75b29522f6eb82047934734880b6e8)) - AssiarDev
#### Tests
- **(integration)** add integration tests for all routes with supertest - ([58a4be9](https://github.com/AssiarDev/match-master/commit/58a4be9d78a9138b83d3771af59ca5935dcc9dd9)) - AssiarDev
- **(unit)** add unit tests for service layer, utils, lib and middleware - ([3f162c6](https://github.com/AssiarDev/match-master/commit/3f162c68330b3fb97ec8684a5b25449c261593f8)) - AssiarDev

- - -

## [0.2.3](https://github.com/AssiarDev/match-master/compare/5522031cf0693fc59604baf255c00cc10edc7c04..0.2.3) - 2026-06-13
#### Bug Fixes
- **(league)** fallback to last completed season when current is upcoming - ([3d58249](https://github.com/AssiarDev/match-master/commit/3d58249a2df3b1dd40808fbbaae0298e315fbdda)) - AssiarDev
- **(league-api)** use correct query param include instead of includes - ([7e1e982](https://github.com/AssiarDev/match-master/commit/7e1e98238ba8a7f92ba389fdd48f1a0fcfed7059)) - AssiarDev
- **(matches)** return empty array when league has no current season - ([0fda450](https://github.com/AssiarDev/match-master/commit/0fda45050fa10929d199cd4fe471dfd714978aab)) - AssiarDev
#### Chores
- **(prisma)** add engineType binary for ARM64 windows support - ([07cad3d](https://github.com/AssiarDev/match-master/commit/07cad3daa6de430c9896cc597f72bcf1662870d4)) - AssiarDev
- add script to delete inactive Primeira Liga from db - ([f2f5353](https://github.com/AssiarDev/match-master/commit/f2f5353a7124a381448f32b19a75a03ad3527fad)) - AssiarDev
#### Continuous Integration
- extend pipeline to dev branches with typecheck format and typos jobs - ([5522031](https://github.com/AssiarDev/match-master/commit/5522031cf0693fc59604baf255c00cc10edc7c04)) - AssiarDev

- - -

## [0.2.2](https://github.com/AssiarDev/match-master/compare/9a96bfe99bde6b5759e59ea8405b8b868117ac79..0.2.2) - 2026-05-17
#### Bug Fixes
- **(auth)** use SameSite strict cookie via Netlify proxy - ([9a96bfe](https://github.com/AssiarDev/match-master/commit/9a96bfe99bde6b5759e59ea8405b8b868117ac79)) - AssiarDev

- - -

## [0.2.1](https://github.com/AssiarDev/match-master/compare/fd4f52697745950af2f6d7a8cfe61fca58eb0f00..0.2.1) - 2026-05-17
#### Bug Fixes
- **(live-matches)** add periods data to live scores endpoint - ([fd4f526](https://github.com/AssiarDev/match-master/commit/fd4f52697745950af2f6d7a8cfe61fca58eb0f00)) - AssiarDev

- - -

## [0.2.0](https://github.com/AssiarDev/match-master/compare/21db173d3cad9f01528765242f1619d9d1ad5bf1..0.2.0) - 2026-05-15
#### Bug Fixes
- **(ci)** manually push version bump commit and tags after cocogitto release - ([e52b057](https://github.com/AssiarDev/match-master/commit/e52b057108af6ee68109263b83cf6db5e87b7492)) - AssiarDev
#### Chores
- update ci with release check - ([19d9ce3](https://github.com/AssiarDev/match-master/commit/19d9ce3a70a0ec10d28cae4854ca9437e2b96432)) - AssiarDev
#### Documentation
- add CONTRIBUTING.md and simplify README setup section - ([4fdf5f3](https://github.com/AssiarDev/match-master/commit/4fdf5f37a8ad4e9a2d42d2ad2cdbdf55445e0022)) - AssiarDev
- update documentation for windows user for cocogitto - ([5946555](https://github.com/AssiarDev/match-master/commit/5946555910f354944733629d7bd790a2e2f47cf1)) - AssiarDev
- add cocogitto setup instructions - ([21db173](https://github.com/AssiarDev/match-master/commit/21db173d3cad9f01528765242f1619d9d1ad5bf1)) - AssiarDev
#### Features
- add live scores with SSE broadcaster - ([1c4954e](https://github.com/AssiarDev/match-master/commit/1c4954efd0abc6fbe2c922ae912f24e79cbd8124)) - AssiarDev

- - -

## [0.1.0](https://github.com/AssiarDev/match-master/compare/3707718fc3a503a793610018ae84ed4a22b5dac2..0.1.0) - 2026-05-09
#### Features
- extend favorite controller with leagues - ([d60694e](https://github.com/AssiarDev/match-master/commit/d60694e36bde20ab73d3ebbd4b704bc41d6976cf)) - AssiarDev
- add leagueDBRepository to constructor - ([1d2aab8](https://github.com/AssiarDev/match-master/commit/1d2aab8eb4cdfe57808b98da11c4c8c8366eabaa)) - AssiarDev
- extend favoriteService to support league favorites - ([e8ffcbd](https://github.com/AssiarDev/match-master/commit/e8ffcbd79bd8a202d07fb2221a8aba6f485a6277)) - AssiarDev
- extend userFavoriteRepository to support league favorites - ([0241d49](https://github.com/AssiarDev/match-master/commit/0241d49eb0bd80c43601ecbbeceacda3c21c35e5)) - AssiarDev
- added constraint rules for password - ([88d7e04](https://github.com/AssiarDev/match-master/commit/88d7e045424a7ec84ef4945b8b523962b77b1cf2)) - AssiarDev
- add tests for all services - ([d37514e](https://github.com/AssiarDev/match-master/commit/d37514ef7e50e143ebc6a3509a92876759b60ef3)) - AssiarDev
- add template for PR - ([96434bd](https://github.com/AssiarDev/match-master/commit/96434bd7e47fc152399d3d6b7c4b5e74603e48e3)) - AssiarDev
- add ServiceResult types, type all function signatures, fix login bug - ([ab72214](https://github.com/AssiarDev/match-master/commit/ab722142a69cb40ec88d49dbaa872270360c8491)) - florent.cruble
- add typed interfaces and remove any casts - ([2ca1b43](https://github.com/AssiarDev/match-master/commit/2ca1b43ae144be046f3abd21d079c65fa1f2b747)) - florent.cruble
- migrate server codebase from JavaScript to TypeScript 6.0 - ([1a2d20a](https://github.com/AssiarDev/match-master/commit/1a2d20a2444f1cd2a9a826733d275719d75bc0cd)) - florent.cruble
- test CI detection - ([42d3414](https://github.com/AssiarDev/match-master/commit/42d34145c6f9d0c295886fbae6d21a3162d1abbd)) - AssiarDev
- add unit test for favorite service - ([9763496](https://github.com/AssiarDev/match-master/commit/9763496cde75a5f03335d810b0e924204b3a3513)) - AssiarDev
- install jest - ([40c1e0c](https://github.com/AssiarDev/match-master/commit/40c1e0c33f5b99ecf9566e637c4abf671e14a462)) - AssiarDev
- add repository pattern for scorers, standings - ([37a53b5](https://github.com/AssiarDev/match-master/commit/37a53b50e9c7521d1dc24d4df7271f5bb6193546)) - AssiarDev
- add repository architecture for league, season and teams - ([56b0f92](https://github.com/AssiarDev/match-master/commit/56b0f9257e3f3e2ace4182c1b5b7e55f4ec2c40e)) - AssiarDev
- define a new architecture for the favorites with repository pattern - ([9cedbad](https://github.com/AssiarDev/match-master/commit/9cedbad26d02ba6742d3a4a6e445a075e5fb7594)) - AssiarDev
- define a new architecture with repository pattern - ([c0942a4](https://github.com/AssiarDev/match-master/commit/c0942a4c1bc27621ba70d29d639e693d1a3066d1)) - AssiarDev
#### Bug Fixes
- resolve failed ci - ([f037f72](https://github.com/AssiarDev/match-master/commit/f037f72f2eb38d7728785f82a7b848d784846a28)) - AssiarDev
- add cascade delete on user favorite - ([1924020](https://github.com/AssiarDev/match-master/commit/192402053e89f2f5dae66e76e5353f3ac063a500)) - AssiarDev
- update package.json to deploy on render - ([b53bc52](https://github.com/AssiarDev/match-master/commit/b53bc522fefac9b465a5991ded5ced13507d21ae)) - AssiarDev
- create preview regex to access cors - ([573aa0d](https://github.com/AssiarDev/match-master/commit/573aa0db916bdcd43dc96c02be50bd2d381d1bbf)) - AssiarDev
- resolved import for argon2 - ([f22c2fc](https://github.com/AssiarDev/match-master/commit/f22c2fc8ae9a4c3e95be81a633cb5536a535d32d)) - AssiarDev
- correct the instantiate service in controllers - ([78c8ea0](https://github.com/AssiarDev/match-master/commit/78c8ea0a5b441c8e97c81ef07b687222029e85b9)) - AssiarDev
- add isNaN guards in matches controllers and explicit return type on teamByLeague - ([167e2f4](https://github.com/AssiarDev/match-master/commit/167e2f41763cb1e849e97de2e2caefa3a5ab7144)) - florent.cruble, Claude Opus 4.6 (1M context)
- filter undefined values from CORS allowedOrigins - ([4bb03b7](https://github.com/AssiarDev/match-master/commit/4bb03b7b7a4809d489d49d8ec080af4ec963589d)) - florent.cruble, Claude Opus 4.6 (1M context)
- use ServiceResult discriminant in deleteUser and updateUser controllers - ([c82e4f6](https://github.com/AssiarDev/match-master/commit/c82e4f6c4eaf4af4aab0478eeb7fb7ff39120ec4)) - florent.cruble, Claude Opus 4.6 (1M context)
- add null guard for league season in standing and scorers services - ([0fd7587](https://github.com/AssiarDev/match-master/commit/0fd7587b74fefe4096bd7bc69636e076b7889fa4)) - florent.cruble, Claude Opus 4.6 (1M context)
- return ServiceError instead of empty array in teamsForLeague - ([2f874a0](https://github.com/AssiarDev/match-master/commit/2f874a01094cfee99f7614f60f37eb8e57c136e7)) - florent.cruble, Claude Opus 4.6 (1M context)
- assert env vars in config.ts and type exports as string - ([8967c1c](https://github.com/AssiarDev/match-master/commit/8967c1c4374f4d9806028be61b217fb8b0bc6a6b)) - florent.cruble, Claude Opus 4.6 (1M context)
- add authentication and ownership check on deleteUser and updateUser - ([342de80](https://github.com/AssiarDev/match-master/commit/342de80853f201b0cb4df6ea58adca2add7952ab)) - florent.cruble, Claude Opus 4.6 (1M context)
- return structured response from register instead of raw boolean - ([fc9b700](https://github.com/AssiarDev/match-master/commit/fc9b700a973bf442dec3794c085cad44bf04e2ed)) - florent.cruble, Claude Opus 4.6 (1M context)
- filter out null teams in getFavorite instead of non-null assertion - ([12842ef](https://github.com/AssiarDev/match-master/commit/12842ef42627fc776b9b43f142b839dc83807e21)) - florent.cruble, Claude Opus 4.6 (1M context)
- use async bcrypt instead of sync to avoid blocking event loop - ([ca363ec](https://github.com/AssiarDev/match-master/commit/ca363ec1ed7a550b4ab5d4bebc3e3a6827d311f4)) - florent.cruble, Claude Opus 4.6 (1M context)
- add URL_API and API_TOKEN to required env vars validation - ([9f2b09a](https://github.com/AssiarDev/match-master/commit/9f2b09a0f818b4295ab9c3a6dfaafa0b74de17a5)) - florent.cruble, Claude Opus 4.6 (1M context)
- use isNaN guard for leagueId validation in standings controller - ([b4acbe3](https://github.com/AssiarDev/match-master/commit/b4acbe3e83ffdacc7ffcf6de29d9180eaa055898)) - florent.cruble, Claude Opus 4.6 (1M context)
- add null guard for league current season instead of non-null assertion - ([7854a67](https://github.com/AssiarDev/match-master/commit/7854a675f64afc6384f0bc27aec75d9f79b23c9c)) - florent.cruble, Claude Opus 4.6 (1M context)
- use import type for ApiResponse and ApiLeague in leagueApi repository - ([60345ac](https://github.com/AssiarDev/match-master/commit/60345acd4cf7d2b5edecd90ae821b22b4a498f1b)) - florent.cruble, Claude Opus 4.6 (1M context)
- use sameSite 'none' in clearCookie to match login cookie options - ([e32eb91](https://github.com/AssiarDev/match-master/commit/e32eb914e77005334330e718ace058e535102b66)) - florent.cruble, Claude Opus 4.6 (1M context)
- use authenticated user id instead of request body in addFavorite - ([aa03c36](https://github.com/AssiarDev/match-master/commit/aa03c361ac636cd4764fb029400813d5bc9b5be2)) - florent.cruble, Claude Opus 4.6 (1M context)
- validate required env vars at startup - ([08c58a2](https://github.com/AssiarDev/match-master/commit/08c58a2454bb9797ba5de02e4f18348406aa17d7)) - florent.cruble, Claude Opus 4.6 (1M context)
- add isNaN guard on clubId in removeFavorite - ([41a2f1d](https://github.com/AssiarDev/match-master/commit/41a2f1d58652552917de22a3f4503912b9fc85fe)) - florent.cruble, Claude Opus 4.6 (1M context)
- remove any[] cast in teamByLeague, use inferred Prisma types - ([7285f43](https://github.com/AssiarDev/match-master/commit/7285f43bfbdec54d67f4949c2742c764d5146273)) - florent.cruble, Claude Opus 4.6 (1M context)
- add username to SessionData and store it on login - ([a2286e4](https://github.com/AssiarDev/match-master/commit/a2286e4321b3d806816a6d9550a96afb5100efeb)) - florent.cruble, Claude Opus 4.6 (1M context)
- constrain ServiceSuccess<T> generic to object to prevent unknown collapse - ([96633cf](https://github.com/AssiarDev/match-master/commit/96633cfe729048d12d420d36f8bdc7783ebead15)) - florent.cruble, Claude Opus 4.6 (1M context)
- register static route /competitions/matches before parameterized /:id/matches - ([38eec16](https://github.com/AssiarDev/match-master/commit/38eec161cb9b9cf74596c09316e69ce8c1faf6ab)) - florent.cruble, Claude Opus 4.6 (1M context)
- remove duplicate express.json() and cookieParser() middleware - ([550161c](https://github.com/AssiarDev/match-master/commit/550161c7c6d6273b46d20d1b75ee33f92f234362)) - florent.cruble, Claude Opus 4.6 (1M context)
- restore Dockerfile COPY order for layer caching - ([e83b655](https://github.com/AssiarDev/match-master/commit/e83b655761878f607cf7490c21336dfbd034e2f3)) - florent.cruble, Claude Opus 4.6 (1M context)
- resolve merge conflicts and configure jest for TypeScript - ([74ac144](https://github.com/AssiarDev/match-master/commit/74ac1448221c447718fb96f89e41843ca58f7c2f)) - florent.cruble, Claude Opus 4.6 (1M context)
- signature typing correction for teamsByLeague - ([58128ea](https://github.com/AssiarDev/match-master/commit/58128ea1cb95a737b0450666035cc49ba187d72f)) - AssiarDev
- CI path - ([c4da058](https://github.com/AssiarDev/match-master/commit/c4da0582f8687496899faa8e6197f7d17bcba59a)) - AssiarDev
- retrieve the teams from the league - ([08687fe](https://github.com/AssiarDev/match-master/commit/08687fec4d7994a6a62ff1105b8cc4781685a6da)) - AssiarDev
- add return to the match by date - ([1a1e43d](https://github.com/AssiarDev/match-master/commit/1a1e43dd19e9daf7fd8f85fae234d9ce7769fcee)) - AssiarDev
- try to resolve cors issue - ([75ff543](https://github.com/AssiarDev/match-master/commit/75ff5431d3fd53da5d7919e55f60b9c8359e643c)) - AssiarDev
- cors option for backend - ([cedaeeb](https://github.com/AssiarDev/match-master/commit/cedaeebb9ce1618343bf37d4a292bfe1c319e2f7)) - AssiarDev
- cors issue for render - ([daa21e1](https://github.com/AssiarDev/match-master/commit/daa21e1ff29e9bec5537bc87c33bc6c33d553b31)) - AssiarDev
- script insert db - ([fe92d28](https://github.com/AssiarDev/match-master/commit/fe92d2822614df28a6ded39980a73de7306cbebb)) - AssiarDev
- display matches by league - ([b305002](https://github.com/AssiarDev/match-master/commit/b305002a6033ce320ebdd0d76335f26f1b3d969e)) - AssiarDev
#### Documentation
- add initial changelog - ([fec0767](https://github.com/AssiarDev/match-master/commit/fec0767867363df00a799bda2075173bfc054f40)) - Raissa Haliba
- update readme - ([3f6594c](https://github.com/AssiarDev/match-master/commit/3f6594c628f3faffdb28055aa27999ddb94a5a9a)) - AssiarDev
- add swagger ui for match master api - ([5b72171](https://github.com/AssiarDev/match-master/commit/5b72171222390cf436312c5df7b804eccbdf1632)) - AssiarDev
- add openapi.yaml for match master api - ([64efe65](https://github.com/AssiarDev/match-master/commit/64efe65e466c4188bca29cf17e53ecb0c29968cd)) - AssiarDev
- add js doc on the services - ([42c53e7](https://github.com/AssiarDev/match-master/commit/42c53e76ca75eae1a4dfd8c75655bb50855d0ca2)) - AssiarDev
- add .env.example - ([e7626e5](https://github.com/AssiarDev/match-master/commit/e7626e514e5daf6d0bc4ae74e39108bbb89bb49d)) - AssiarDev
#### Refactoring
- centralize dependency injection in lib/container.ts - ([78d7795](https://github.com/AssiarDev/match-master/commit/78d7795ecbd5fcd4523560795344da2da80f9d43)) - AssiarDev
- introduce PrismaClient singleton - ([c23c670](https://github.com/AssiarDev/match-master/commit/c23c670236c97f66c003e1e66837ddc90eae1526)) - AssiarDev
- migrate test file to TypeScript with typed mocks - ([8a16c0a](https://github.com/AssiarDev/match-master/commit/8a16c0a28032246f27fe5bc335f17897a833c54d)) - florent.cruble, Claude Opus 4.6 (1M context)
#### Chores
- add cog separator and update ci triggers - ([866aa50](https://github.com/AssiarDev/match-master/commit/866aa50e2101aca9e841c5a1e2c3ae3f2952829f)) - Raissa Haliba
- switch to trunk-based flow with cog commit linting - ([dd9b9ed](https://github.com/AssiarDev/match-master/commit/dd9b9ed92531bf228c87930ae560037930b4d6c7)) - Raissa Haliba
- update cog config with from_latest_tag - ([ac58b4a](https://github.com/AssiarDev/match-master/commit/ac58b4a2dc1f0b76a610731fc37635aac333e124)) - Raissa Haliba
- add cocogitto config and initial changelog - ([71b0a1c](https://github.com/AssiarDev/match-master/commit/71b0a1cb49a4f44470fa71f16d2a67fcb6c6a924)) - Raissa Haliba
- remove duplicate variable validPassword - ([e7a2000](https://github.com/AssiarDev/match-master/commit/e7a200050a40d9488c552ae26f55b59cc6ca187e)) - AssiarDev
- improve login and update for user workflow - ([ef70c83](https://github.com/AssiarDev/match-master/commit/ef70c832ddb6a2431289102f0f115cc011a599d3)) - AssiarDev
- remove express session - ([b539249](https://github.com/AssiarDev/match-master/commit/b539249a467679c96a12b08edb4c53ea5982bebd)) - AssiarDev
- add createdAt in user payload interface - ([1c9a9f6](https://github.com/AssiarDev/match-master/commit/1c9a9f693401a0289db26dc1cdeeccd7f37f0940)) - AssiarDev
- update the message for delete a user account - ([66ff2c2](https://github.com/AssiarDev/match-master/commit/66ff2c2837ec8705008d28a6751aa212a757e435)) - AssiarDev
- the yml file has been removed because it requirement payments for claude review - ([d600bae](https://github.com/AssiarDev/match-master/commit/d600baea143ffaf6101f3a5ced3cdac25aedb671)) - AssiarDev
- fix yml fichier for use claude caude for review - ([40e8772](https://github.com/AssiarDev/match-master/commit/40e8772a2dfc16ce65b3af0ea5ef237e444812a6)) - AssiarDev
- review by claude for pr - ([20284fb](https://github.com/AssiarDev/match-master/commit/20284fbb0c3b3ecf1efbc4a1d9c0ac55d4d2b1c9)) - AssiarDev
- add Claude PR review workflow - ([72440d6](https://github.com/AssiarDev/match-master/commit/72440d60b72014890e47d68eb1f8909cdc169a3b)) - AssiarDev
- remove bcrypt for use argon2 - ([25c3c85](https://github.com/AssiarDev/match-master/commit/25c3c8522762bfe7be0836f8b7f6a1e45dc341f2)) - AssiarDev
- update node version for github action - ([085051a](https://github.com/AssiarDev/match-master/commit/085051aebc1ddf697e6e8166dbc62bd5d86eb839)) - AssiarDev
- added interfaces for class service and repository - ([3950f89](https://github.com/AssiarDev/match-master/commit/3950f89aca57b2447e2b581c9b8d262d70b2760d)) - AssiarDev
- resolution of test problem detection - ([56b69ad](https://github.com/AssiarDev/match-master/commit/56b69adb481fa38367c68649ce7c6259ff7fe63b)) - AssiarDev
- remove .idea/ from tracking and add to .gitignore - ([fd0378b](https://github.com/AssiarDev/match-master/commit/fd0378babd5ce08eed63d31632dce0178427fe49)) - florent.cruble, Claude Opus 4.6 (1M context)
- update dockerfile and package.json to use npx - ([2948388](https://github.com/AssiarDev/match-master/commit/2948388864a5aa3e68f67df4100a6906ed62788f)) - AssiarDev
- initialization service in th favorite controller - ([f93d32e](https://github.com/AssiarDev/match-master/commit/f93d32ecb8fcdd3e342d4fcac4b3b4145dfb1abe)) - AssiarDev
- remove unused dead code - ([1f29605](https://github.com/AssiarDev/match-master/commit/1f29605ed9192dff0975f6026269594a834810db)) - AssiarDev
- add repository architecture for teams - ([7f2c843](https://github.com/AssiarDev/match-master/commit/7f2c843946141af175207f583b4defe03bc830a3)) - AssiarDev
- remove unused files - ([f526477](https://github.com/AssiarDev/match-master/commit/f5264771e1f66dc7dd84f6ebc6e4e1fb33219f7c)) - AssiarDev
- resolve thread issue of the PR - ([709da5a](https://github.com/AssiarDev/match-master/commit/709da5af7d767b5d2b893a7d320e85a6e372e879)) - AssiarDev
- correcting the competitionId routes by retrieving them from the database - ([dbf1cbd](https://github.com/AssiarDev/match-master/commit/dbf1cbd96cf04fafde0b7fad70f8a17614d35a11)) - AssiarDev

- - -

