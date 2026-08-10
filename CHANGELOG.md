# Changelog

## [1.1.1](https://github.com/Yendric/uploads/compare/v1.1.0...v1.1.1) (2026-08-10)


### Bug Fixes

* login requiring two presses with autofilled credentials ([39c3cab](https://github.com/Yendric/uploads/commit/39c3cabbfcb63e121b3dc0df53e4e5ffb65555ab))

## [1.1.0](https://github.com/Yendric/uploads/compare/v1.0.1...v1.1.0) (2026-08-10)


### Features

* rework sidebar layout and show app version ([46db458](https://github.com/Yendric/uploads/commit/46db4582841e0d1fdcb72bbe9f433988031a6119))


### Bug Fixes

* file page overflowing viewport height ([dc47dd5](https://github.com/Yendric/uploads/commit/dc47dd5a01110195df2e1a6cf2f333cc7d49a183))
* login with autofilled credentials ([83f6a21](https://github.com/Yendric/uploads/commit/83f6a2118b74878f7b05d398710be67b2a828688))
* store correct content type on uploaded s3 objects ([60718d4](https://github.com/Yendric/uploads/commit/60718d4f86b6218530f750f69c8907c922614624))
* use stored file size for text preview limit ([272dade](https://github.com/Yendric/uploads/commit/272dade94e623306a388ed02d399e0c036b5c617))
* useless int cast flagged by phpstan ([6a56bbb](https://github.com/Yendric/uploads/commit/6a56bbbfd07be62eaa91ab2923eb6071e2b1ee6b))


### Performance Improvements

* stream s3 reads instead of buffering whole objects ([20711fc](https://github.com/Yendric/uploads/commit/20711fc26f64092f4f8c1a79f089b451cb1d400c))

## [1.0.1](https://github.com/Yendric/uploads/compare/v1.0.0...v1.0.1) (2026-08-10)


### Bug Fixes

* dark mode by moving dark class to html element ([4c0346d](https://github.com/Yendric/uploads/commit/4c0346d9c8ecc9b03b6018240e5b1153c118a543))
* text preview size limit and content-based mime detection ([0b5bfdc](https://github.com/Yendric/uploads/commit/0b5bfdc00c0ec7d6f740a51bf974fab10565fb43))

## 1.0.0 (2026-08-10)


### ⚠ BREAKING CHANGES

* upgrade to laravel 13, react 19, inertia 3, tailwind 4

### Features

* add deployment logic ([04ef76c](https://github.com/Yendric/uploads/commit/04ef76ca5b0f187749bb2198234f00914bb79a3d))
* add sentry for monitoring ([38f3235](https://github.com/Yendric/uploads/commit/38f323521b659128253e6579541f42b6f61e298d))
* add titles ([4900660](https://github.com/Yendric/uploads/commit/4900660cf2cbf558afddfbda99939de68e704dce))
* deployment using swoole ([4cc0558](https://github.com/Yendric/uploads/commit/4cc0558fd06210695b37b49728aa75f510d45a3d))
* don't use signed urls as they currently serve no purpose ([f9e3156](https://github.com/Yendric/uploads/commit/f9e31566870d8cb893b6dc8c8ea292baca77994d))
* enable jit ([9ae9dc3](https://github.com/Yendric/uploads/commit/9ae9dc373308dbd9193e3b2943568f6360e79eae))
* faster deploy (attempt 1) ([3062656](https://github.com/Yendric/uploads/commit/30626564a343219e08e96de81051f11fbe4151ad))
* install octane ([7c76dea](https://github.com/Yendric/uploads/commit/7c76deaf9cddcc9aedb63cf27903583ba88bc2fc))
* more minimal docker image ([67d9c17](https://github.com/Yendric/uploads/commit/67d9c172e86a0858b4f93456a0dceaa117531d49))
* more mobile responsive ([89c3594](https://github.com/Yendric/uploads/commit/89c359444e21cb1ed33fa60d40c8bc0c50d317c2))
* more pleasant sidebar experience on ios ([0ae355a](https://github.com/Yendric/uploads/commit/0ae355a98531c6b5241a2a1efafb27b12a6d51fa))
* swipeable sidebar for mobile ([72afd71](https://github.com/Yendric/uploads/commit/72afd717945ccfe7978b3052b649bb75ab5a6e8e))
* upgrade to laravel 13, react 19, inertia 3, tailwind 4 ([7bab47a](https://github.com/Yendric/uploads/commit/7bab47a2d2737e2aa126df339a9af444cefa4e74))
* upload directly to s3, with progress bar ([8e2511e](https://github.com/Yendric/uploads/commit/8e2511e6359bf265f6799eccaa7fbcba1809288d))
* use image with php extensions pre built ([ed37bce](https://github.com/Yendric/uploads/commit/ed37bcead6ff9ff7c7c327ed6b0487c9aef54c14))


### Bug Fixes

* deploy 1 ([e8d6591](https://github.com/Yendric/uploads/commit/e8d65914025e2ae225fcb7dd3974f6d3156db6b3))
* ETA ([b968417](https://github.com/Yendric/uploads/commit/b968417e6201735535ee71b619200267eed8472c))
* file scope leak, upload validation and storage cleanup ([b2b087f](https://github.com/Yendric/uploads/commit/b2b087fd952fd5faa500025c43103983766652e2))
* remove unnecessary github auth from dockerfile ([9117f5e](https://github.com/Yendric/uploads/commit/9117f5ede9cf25b058b55ad6a890bc92ce9cd8b5))
* some more ios safari subtleties ([d7f652f](https://github.com/Yendric/uploads/commit/d7f652f534852361e2132029f3ae9c52b05e8874))
* text detection not strict enough ([9c223c1](https://github.com/Yendric/uploads/commit/9c223c1608f1d8425f5c723f7846cb0b237e50b8))
* text wrapping on ios ([64fa073](https://github.com/Yendric/uploads/commit/64fa073c4c535809007fbb4882a347f25ac49fc5))
* title text wrapping on mobile ([dc4da26](https://github.com/Yendric/uploads/commit/dc4da26f0a1db0284536ab25ecab5708e13ab543))
* trustproxies ([dbff16e](https://github.com/Yendric/uploads/commit/dbff16e356b62844b084eacc09cd8b471ffd80b0))
* unknown mime type ([3751549](https://github.com/Yendric/uploads/commit/375154946b85cbc85aac48796a4f5d1928f55e64))
* upload modal error handling, text preview cap and share link ([84b3f79](https://github.com/Yendric/uploads/commit/84b3f79a5305164f17d795ee0889626542ac306e))
* zip OOM ([8e2511e](https://github.com/Yendric/uploads/commit/8e2511e6359bf265f6799eccaa7fbcba1809288d))
