import { app } from './app'

// export = produces module.exports = app (direct CJS function export)
// @vercel/node requires the default export to be a callable function
export = app
