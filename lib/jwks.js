const NodeRSA = require('node-rsa')
const { createHash } = require('crypto')

function serializeKey ({ kid, use, publicKey }) {
  if (!kid) {
    kid = createHash('SHA256').update(publicKey).digest('base64')
  }

  const { keyPair: { e, n } } = new NodeRSA(publicKey)
  const bufE = Buffer.alloc(4)
  bufE.writeInt32BE(e)
  const strE = bufE.slice(1).toString('base64')
  const strN = n.toBuffer().toString('base64')

  const serialized = {
    kid,
    use,
    alg: 'RS256',
    kty: 'RSA',
    n: strN,
    e: strE
  }
  return serialized
}

function serialize (keys) {
  return {
    keys: keys.map(key => serializeKey(key))
  }
}

module.exports = { serialize }
