import Cosmic from 'cosmicjs'
import Config from './config'


const bucket = Cosmic().bucket(Config.bucket)

// TODO: finish the api to fetch these data from cosmic bucket
const availableLocations = {}

const stores = {}
