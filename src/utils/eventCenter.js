import EventEmitter from 'eventemitter3'

export const EVENT_ADD_FOLDER = 'ADD_FOLDER'
export const EVENT_ADD_IMAGE = 'ADD_IMAGE'

export const EVENT_CMD = 'EVENT_CMD'

export const EVENT_LOGIN = 'LOGIN'

export const EVENT_LOCAL_FILE_LOAD = 'LOCAL_FILE_LOAD'

export const eventEmitter = new EventEmitter()
