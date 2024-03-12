/* eslint-env mocha, browser */
import assert from 'assert'
import { DBClient } from '../index.js'

import { createUser, createUserAuthKey, createUpload, token } from './utils.js'

describe('pin-sync-request', () => {
  /** @type {DBClient} */
  const client = new DBClient({
    endpoint: 'http://127.0.0.1:3000',
    token,
    postgres: true
  })

  const cids = [
    'bafybeiczsscdsbs7aaqz55asqdf3smv6klcw3gofszvwlyarci47bgf350',
    'bafybeiczsscdsbs7aaqz55asqdf3smv6klcw3gofszvwlyarci47bgf351',
    'bafybeiczsscdsbs7aaqz55asqdf3smv6klcw3gofszvwlyarci47bgf352'
  ]
  let user
  let authKey
  const uploads = []

  // Setup testing user
  beforeEach(async () => {
    user = await createUser(client)
    authKey = await createUserAuthKey(client, user._id)
  })

  // Guarantee no pin sync requests exist
  beforeEach(async () => {
    const to = new Date().toISOString()
    const { data: pinSyncReqs } = await client.getPinSyncRequests({ to })

    await client.deletePinSyncRequests(pinSyncReqs.map(psr => psr._id))
  })

  // Setup two default uploads
  beforeEach(async () => {
    const upload0 = await createUpload(client, user._id, authKey, cids[0])
    const upload1 = await createUpload(client, user._id, authKey, cids[1])

    uploads.push(upload0)
    uploads.push(upload1)
  })

  it('can update multiple pin status', async () => {
    const to = new Date().toISOString()
    const { data: pinSyncReqs } = await client.getPinSyncRequests({ to })
    // Assert Previous pin state
    pinSyncReqs.forEach(psr => {
      assert.strictEqual(psr.pin.status, 'Pinning', 'pin sync requests have Pinning state')
    })

    // Update all Pins to Pinned
    await client.upsertPins(pinSyncReqs.map(psr => ({
      id: psr.pin._id,
      status: 'Pinned',
      contentCid: psr.pin.contentCid,
      location: {
        ...psr.pin.location
      }
    })))

    const { data: pinSyncReqsAfterUpdate } = await client.getPinSyncRequests({ to })

    // Assert After pin state
    pinSyncReqsAfterUpdate.forEach(psr => {
      assert.strictEqual(psr.pin.status, 'Pinned', 'pin sync requests have Pinned state')
    })
  })

  it('can delete pin sync requests', async () => {
    const to = new Date().toISOString()
    const { data: pinSyncReqs } = await client.getPinSyncRequests({ to })

    await client.deletePinSyncRequests(pinSyncReqs.map(psr => psr._id))

    const { data: pinSyncReqsAfterUpdate } = await client.getPinSyncRequests({ to })
    assert(pinSyncReqsAfterUpdate, 'could get pin sync requests')
    assert.strictEqual(pinSyncReqsAfterUpdate.length, 0, 'all pin sync requests were deleted')
  })

  it('can create pin sync requests', async () => {
    // Get pins
    const pins0 = await client.getPins(cids[0])
    const pins1 = await client.getPins(cids[1])
    const pinIds = [
      ...pins0.map(p => p._id),
      ...pins1.map(p => p._id)
    ]

    // Create pin sync requests
    await client.createPinSyncRequests(pinIds)
    const { data: pinSyncReqsAfterUpdate } = await client.getPinSyncRequests({ to: new Date().toISOString() })

    assert(pinSyncReqsAfterUpdate, 'could get pin sync requests')
    assert.strictEqual(pinSyncReqsAfterUpdate.length, pinIds.length, 'all pin sync requests were created')
  })
})
