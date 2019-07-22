export const AUTH_TOKEN = 'auth-token'
export const LINKS_PER_PAGE = 5

// ROUTER PATH
export const PATH_INDEX = '/'
export const PATH_LOGIN = '/login'
export const PATH_PAGE = '/page'
export const PATH_ARTICLE = '/article/:id'
export const PATH_ARTICLE_PRE = '/article'
export const PATH_REMEMBER = '/remember/:id'
export const PATH_REMEMBER_PRE = '/remember'

export const PATH_USER_CENTER = '/usercenter'
export const PATH_USER_CENTER_WRITER = `${PATH_USER_CENTER}/writer`
export const PATH_USER_CENTER_WRITER_NEW = `${PATH_USER_CENTER_WRITER}/new`
export const PATH_USER_CENTER_WRITER_ID = `${PATH_USER_CENTER_WRITER}/:id`
export const PATH_USER_CENTER_ARTICLE = `${PATH_USER_CENTER}/article`
export const PATH_USER_CENTER_DRAFT = `${PATH_USER_CENTER}/draft`
export const PATH_USER_CENTER_IMAGE = `${PATH_USER_CENTER}/imagecenter`
export const PATH_USER_CENTER_BOOKMARK = `${PATH_USER_CENTER}/bookmark`
export const PATH_USER_CENTER_MESSAGE = `${PATH_USER_CENTER}/message`
export const PATH_USER_CENTER_FOCUS = `${PATH_USER_CENTER}/focus`
export const PATH_USER_CENTER_PLAN = `${PATH_USER_CENTER}/plan`

export const ARTICLE_ASIDE_TYPE = {
  MARK: 'MARK',
  THUMBSUP: 'THUMBSUP',
}

export const COMMENT_TYPE = {
  TO_ARTICLE: 'TO_ARTICLE',
  TO_COMMENT: 'TO_COMMENT',
  TO_ARTICLE_SET: 'TO_ARTICLE_SET',
}
