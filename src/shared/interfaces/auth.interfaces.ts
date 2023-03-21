export enum GRANT_TYPE {
  authorization_code = 'authorization_code',
  implicit = 'implicit',
  password = 'password',
  client_credentials = 'client_credentials',
}

export enum CLIENT_TYPE {
  public = 'public',
  confidential = 'confidential',
}

export enum RESPONSE_TYPE {
  code = 'code',
  token = 'token',
}

export enum SCOPE {
  email = 'email',
}
