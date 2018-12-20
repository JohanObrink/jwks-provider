# jwks-provider

Serializer of keys for jwks route

## Use

```bash
npm install jwks-provider
```

```javascript
// Example mounting a jwks route in express
const express = require('express')
const { getKeyList } = require('./someKeyProvider.js')
const { serialize } = require('jwks-provider')

const app = express()
app.get('/jwks', async (req, res) => {

  /*
    Returns an Array of
    {
      use: 'enc|sig',
      kid: [some-key-id]|undefined,
      publicKey: [pem formatted RSA key]
    }
  */
  const keys = await getKeyList()
  
  res.send(serialize(keys))
})
```

## Test

Requires Node version >= `10.12.0` since it uses `crypto.generateKeyPair()` to
generate keys for the tests.

```bash
npm run lint && npm test
```
