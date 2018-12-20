const { generateKeyPair, createHash } = require('crypto')
const { promisify } = require('util')
const { serialize } = require('../lib/jwks')

describe('jwks', () => {
  let keys
  beforeEach(async () => {
    const generate = async (use, kid) => {
      const { publicKey, privateKey } = await promisify(generateKeyPair)('rsa', {
        modulusLength: 1024,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
      })
      return { publicKey, privateKey, use, kid }
    }
    keys = [
      await generate('sig', 'key1'),
      await generate('enc', 'key2'),
      await generate('enc', 'key3')
    ]
  })
  describe('#serialize', () => {
    it('returns a correctly serialized object', () => {
      expect(serialize(keys)).toEqual({
        keys: [
          {
            kid: 'key1',
            use: 'sig',
            alg: 'RS256',
            kty: 'RSA',
            n: expect.any(String),
            e: 'AQAB'
          },
          {
            kid: 'key2',
            use: 'enc',
            alg: 'RS256',
            kty: 'RSA',
            n: expect.any(String),
            e: 'AQAB'
          },
          {
            kid: 'key3',
            use: 'enc',
            alg: 'RS256',
            kty: 'RSA',
            n: expect.any(String),
            e: 'AQAB'
          }
        ]
      })
    })
    it('assigns a kid if none is supplied', () => {
      keys[1].kid = undefined
      const generatedKid = createHash('SHA256').update(keys[1].publicKey).digest('base64')
      expect(serialize(keys)).toEqual({
        keys: [
          {
            kid: 'key1',
            use: 'sig',
            alg: 'RS256',
            kty: 'RSA',
            n: expect.any(String),
            e: 'AQAB'
          },
          {
            kid: generatedKid,
            use: 'enc',
            alg: 'RS256',
            kty: 'RSA',
            n: expect.any(String),
            e: 'AQAB'
          },
          {
            kid: 'key3',
            use: 'enc',
            alg: 'RS256',
            kty: 'RSA',
            n: expect.any(String),
            e: 'AQAB'
          }
        ]
      })
    })
  })
})
