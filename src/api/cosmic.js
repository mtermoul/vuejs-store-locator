import Cosmic from 'cosmicjs'
import Config from './config'

export default Cosmic().bucket(Config.bucket)
