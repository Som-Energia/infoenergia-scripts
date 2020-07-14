const fs = require('fs')
const https = require('follow-redirects').https

const contracts = require('./contracts.json')

const DEST_FOLDER = './contracts/'
const API_URL = 'https://api.beedataanalytics.com'
const USERNAME = 'test@test'
const PASSWORD = 'test1234'

console.log('Som Energia - InfoEnergia scripts')
console.log('InfoEnergia Results Chart Downloader')

console.log(`Contracts found: ${contracts.length}`)

const { Curl } = require('node-libcurl')
const curl = new (require('curl-request'))()
const axios = require('axios')

curl.default.verbose = false
curl.setOpt(Curl.option.SSL_VERIFYPEER, false)

const login = async () => {
  console.log('*** Login to Beedata API ... ***')
  return await curl
    .setHeaders([
      'Content-type: application/json'
    ])
    .setBody(
      JSON.stringify({
        "username": USERNAME,
        "password": PASSWORD
      })
    )
    .post(`${API_URL}/authn/login`)
}

const downloadContract = async (contract, tokenCookie) => {

  const URL = `${API_URL}/v1/results_chart/?where="contractId"=="${contract}"`
  console.log(`*** downloading contract ${contract} ... ***`)

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: fs.readFileSync('./cert.crt'),
    key: fs.readFileSync('./cert.key')
  })

  let config = {
    method: 'get',
    httpsAgent,
    url: URL,
    headers: {
      'X-CompanyId': '3108188543',
      'Cookie': `ioAMRealm=L2JlZWRhdGEvdGVzdC8=; iPlanetDirectoryPro=${tokenCookie}`
    }
  }

  return axios(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.log(error)
    })
}

const saveContract = (contract, data) => {
  const destination = `${DEST_FOLDER}${contract}.json`
  console.log(`*** saved contract ${contract}! ***`)
  fs.writeFileSync(destination, JSON.stringify(data), function (error) {
    if (error) return console.log(error)
  })
}

const main = async () => {
  const { body } = await login()
  const tokenCookie = `${body.token}`
  contracts.map( async (contract) => {
    const data = await downloadContract(contract, tokenCookie)
    saveContract(contract, data)
  })
  return process.exit(0)
}

process.on('exit', function(code) {
  return console.log(`About to exit with code ${code}`);
})

main()
